import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, admin);
    }

    if (event.type === "invoice.paid") {
      await handleInvoicePaid(event.data.object as Stripe.Invoice, admin);
    }

    if (event.type === "charge.refunded") {
      await handleChargeRefunded(event.data.object as Stripe.Charge, admin);
    }

    if (event.type === "customer.subscription.deleted") {
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, admin);
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
    // Still return 200 so Stripe doesn't retry — log to activities instead
    return NextResponse.json({ received: true, warning: String(err) });
  }

  return NextResponse.json({ received: true });
}

// ─── checkout.session.completed ─────────────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any
) {
  const { lead_id, pillar, package_id, package_name } = session.metadata ?? {};
  if (!lead_id) {
    console.warn("[stripe webhook] checkout.session.completed: no lead_id in metadata");
    return;
  }

  // Idempotency — check if we already processed this session
  const { data: existingActivity } = await admin
    .from("activities")
    .select("id")
    .eq("type", "stripe_payment_provisioned")
    .eq("subject", session.id)
    .maybeSingle();

  if (existingActivity) {
    console.log("[stripe webhook] already provisioned session", session.id);
    return;
  }

  // Load the lead
  const { data: lead, error: leadError } = await admin
    .from("leads")
    .select("id, first_name, last_name, email, company, pillar, notes")
    .eq("id", lead_id)
    .maybeSingle();

  if (leadError || !lead) {
    throw new Error(`Lead not found: ${lead_id}`);
  }

  const email = lead.email as string;
  const firstName = lead.first_name as string;
  const companyName = (lead.company as string) || `${firstName}'s Account`;
  const resolvedPillar = (pillar || lead.pillar || "LAUNCH") as string;

  // ── 1. Find or create auth user ──────────────────────────────────────────
  let profileId: string;
  let isNewUser = false;

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) {
    profileId = existingProfile.id;
  } else {
    // Create auth user via Admin API
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { role: "client", first_name: firstName, last_name: lead.last_name },
    });

    if (authError) throw new Error(`Failed to create auth user: ${authError.message}`);
    profileId = authData.user.id;
    isNewUser = true;

    // Ensure profile row exists
    await admin.from("profiles").upsert({
      id: profileId,
      email,
      role: "client",
      first_name: firstName,
      last_name: lead.last_name || null,
      company: companyName,
    });
  }

  // ── 2. Find or create account ─────────────────────────────────────────────
  let accountId: string;
  const stripeCustomerId = session.customer as string;

  const { data: existingMembership } = await admin
    .from("account_members")
    .select("account_id")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (existingMembership) {
    accountId = existingMembership.account_id;
    // Update stripe_customer_id if not set
    await admin
      .from("accounts")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", accountId)
      .is("stripe_customer_id", null);
  } else {
    const { data: newAccount, error: accountError } = await admin
      .from("accounts")
      .insert({
        name: companyName,
        stripe_customer_id: stripeCustomerId,
        currency: "GBP",
        country: "GB",
      })
      .select("id")
      .single();

    if (accountError) throw new Error(`Failed to create account: ${accountError.message}`);
    accountId = newAccount.id;

    await admin.from("account_members").insert({
      account_id: accountId,
      profile_id: profileId,
      is_primary: true,
    });
  }

  // ── 3. Create engagement ──────────────────────────────────────────────────
  const engTitle = package_name
    ? `${resolvedPillar} — ${package_name}`
    : `${resolvedPillar} Engagement`;

  const amountGbp = session.amount_total ? session.amount_total / 100 : 0;

  const { data: engagement, error: engError } = await admin
    .from("engagements")
    .insert({
      account_id: accountId,
      title: engTitle,
      pillar: resolvedPillar,
      status: "active",
      kickoff_date: new Date().toISOString().split("T")[0],
      monthly_value_gbp: resolvedPillar === "GROW" ? amountGbp : null,
      contract_value_gbp: resolvedPillar !== "GROW" ? amountGbp : null,
    })
    .select("id")
    .single();

  if (engError) throw new Error(`Failed to create engagement: ${engError.message}`);
  const engagementId = engagement.id;

  // ── 4. Create kickoff request ─────────────────────────────────────────────
  await admin.from("requests").insert({
    engagement_id: engagementId,
    title: "Kickoff Brief",
    description: `Welcome! This is your kickoff request for ${engTitle}. Please review the brief and add any additional notes below.\n\n${lead.notes || ""}`,
    status: "submitted",
  });

  // ── 5. Close the lead ─────────────────────────────────────────────────────
  await admin.from("leads").update({ stage: "closed_won" }).eq("id", lead_id);

  // ── 6. Handle subscription (GROW) ─────────────────────────────────────────
  if (session.mode === "subscription" && session.subscription) {
    await admin.from("engagements").update({
      stripe_subscription_id: session.subscription as string,
    }).eq("id", engagementId);
  }

  // ── 7. Commission trigger fires automatically via SQL trigger ─────────────
  // The create_commissions_on_deal_close() trigger handles it when deal.stage = closed_won.
  // We create a deal row here so the trigger can fire.
  await admin.from("deals").insert({
    account_id: accountId,
    title: engTitle,
    pillar: resolvedPillar,
    stage: "closed_won",
    value_gbp: amountGbp,
    closed_at: new Date().toISOString(),
    stripe_payment_id: session.payment_intent as string || session.id,
  }).select("id").maybeSingle();

  // ── 8. Log provisioning activity ─────────────────────────────────────────
  await admin.from("activities").insert({
    lead_id,
    type: "stripe_payment_provisioned",
    subject: session.id,
    body: JSON.stringify({
      engagement_id: engagementId,
      account_id: accountId,
      profile_id: profileId,
      pillar: resolvedPillar,
      is_new_user: isNewUser,
    }),
  });

  // ── 9. Send magic link email (new users) ──────────────────────────────────
  if (isNewUser) {
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${APP_URL}/auth/callback?next=/workspace?welcome=1`,
      },
    });
    // Note: In production, send via your email provider. Supabase auto-sends
    // the magic link email when generateLink is called with sendEmail=true.
    // This also works by calling signInWithOtp with the Admin API.
    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${APP_URL}/auth/callback?next=/workspace?welcome=1`,
    });
  }

  console.log(`[stripe webhook] provisioned: lead=${lead_id}, engagement=${engagementId}, profile=${profileId}, new=${isNewUser}`);
}

// ─── invoice.paid (BUILD milestones / GROW renewals) ─────────────────────────

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any
) {
  const customerId = invoice.customer as string;
  if (!customerId) return;

  // Update account billing record
  const { data: account } = await admin
    .from("accounts")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!account) return;

  // Upsert invoice record
  await admin.from("invoices").upsert({
    account_id: account.id,
    title: invoice.description || `Invoice ${invoice.number || invoice.id}`,
    amount_gbp: invoice.amount_paid / 100,
    currency: invoice.currency.toUpperCase(),
    status: "paid",
    paid_at: new Date(invoice.status_transitions?.paid_at! * 1000).toISOString(),
    stripe_invoice_id: invoice.id,
  }, { onConflict: "stripe_invoice_id" });
}

// ─── charge.refunded ──────────────────────────────────────────────────────────

async function handleChargeRefunded(
  charge: Stripe.Charge,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any
) {
  const paymentIntentId = charge.payment_intent as string;
  if (!paymentIntentId) return;

  // Find the deal that has this payment intent
  const { data: deal } = await admin
    .from("deals")
    .select("id, partner_id, referrer_id")
    .eq("stripe_payment_id", paymentIntentId)
    .maybeSingle();

  if (!deal) return;

  // Reverse any pending/approved commissions for this deal
  await admin
    .from("commissions")
    .update({ status: "reversed", reversed_at: new Date().toISOString() })
    .eq("deal_id", deal.id)
    .in("status", ["pending", "approved"]);

  await admin.from("activities").insert({
    type: "charge_refunded",
    subject: charge.id,
    body: JSON.stringify({ deal_id: deal.id, amount: charge.amount_refunded / 100 }),
  });
}

// ─── customer.subscription.deleted ───────────────────────────────────────────

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any
) {
  const { data: engagement } = await admin
    .from("engagements")
    .select("id, account_id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (!engagement) return;

  await admin
    .from("engagements")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", engagement.id);

  // Move related deal to churned
  await admin
    .from("deals")
    .update({ stage: "closed_lost" })
    .eq("account_id", engagement.account_id)
    .eq("stage", "closed_won");
}

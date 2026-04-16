import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      lead_id,
      mode = "payment", // "payment" | "subscription"
      pillar = "LAUNCH",
      package_id,
      package_name,
      package_price, // in GBP, integer (pence)
      email,
      name,
      stripe_price_id, // for subscription mode
    } = body;

    if (!lead_id || !email) {
      return NextResponse.json({ error: "lead_id and email required" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Find or create Stripe customer
    let customerId: string | undefined;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({ email, name });
      customerId = customer.id;
    }

    let session: Stripe.Checkout.Session;

    if (mode === "subscription" && stripe_price_id) {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: stripe_price_id, quantity: 1 }],
        metadata: { lead_id, pillar, package_id: package_id ?? "" },
        success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&pillar=${pillar}`,
        cancel_url: `${APP_URL}/services/${pillar.toLowerCase()}?cancelled=1`,
      });
    } else {
      // One-off payment — create a price on-the-fly
      const priceAmount = Math.round(Number(package_price) * 100); // pence
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer: customerId,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "gbp",
              unit_amount: priceAmount,
              product_data: {
                name: package_name ?? `${pillar} Package`,
                description: `Vazgro ${pillar} — ${package_name}`,
              },
            },
          },
        ],
        metadata: { lead_id, pillar, package_id: package_id ?? "", package_name: package_name ?? "" },
        success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&pillar=${pillar}`,
        cancel_url: `${APP_URL}/services/${pillar.toLowerCase()}?cancelled=1`,
        payment_intent_data: {
          metadata: { lead_id, pillar, package_id: package_id ?? "" },
        },
      });
    }

    // Save session ID to the lead so the webhook can look it up
    await admin
      .from("leads")
      .update({
        stage: "qualified",
        notes: `Stripe checkout session: ${session.id}`,
      })
      .eq("id", lead_id);

    // Store session ID in a metadata column — use notes as a fallback since
    // the leads table may not have a stripe_session_id column yet.
    // We also store it in a structured way so the webhook can parse it.
    await admin
      .from("leads")
      .update({
        stage: "qualified",
      })
      .eq("id", lead_id);

    // Store the stripe session id alongside the lead for webhook lookup
    // We use the activities table as a bridge until a column is added
    await admin.from("activities").insert({
      lead_id,
      type: "stripe_checkout_created",
      subject: session.id,
      body: JSON.stringify({ session_id: session.id, customer_id: customerId, mode }),
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("[api/checkout] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

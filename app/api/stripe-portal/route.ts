import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const returnUrl = (body.return_url as string) || `${APP_URL}/workspace/billing`;

    const admin = createAdminClient();
    const { data: membership } = await admin
      .from("account_members")
      .select("account_id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!membership) return NextResponse.json({ error: "No account linked" }, { status: 404 });

    const { data: account } = await admin
      .from("accounts")
      .select("stripe_customer_id")
      .eq("id", membership.account_id)
      .maybeSingle();

    if (!account?.stripe_customer_id) {
      return NextResponse.json({ error: "No Stripe customer linked to this account" }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: account.stripe_customer_id,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[api/stripe-portal] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

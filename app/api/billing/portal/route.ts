import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/session";
import { getPublicAppUrl, getStripe } from "../../../../lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in with Discord before managing billing." }, { status: 401 });
  if (!user.stripeCustomerId) return NextResponse.json({ error: "No billing customer exists yet. Choose a configured subscription plan first." }, { status: 409 });
  const origin = request.headers.get("origin");
  let appUrl: string;
  try { appUrl = getPublicAppUrl(); } catch { return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 }); }
  if (origin && new URL(origin).origin !== new URL(appUrl).origin) return NextResponse.json({ error: "Request origin did not match Spider Studio." }, { status: 403 });
  try {
    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: appUrl + "/dashboard/settings?tab=billing",
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("Stripe customer portal failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to open billing management. Confirm the Stripe customer portal is enabled." }, { status: 503 });
  }
}

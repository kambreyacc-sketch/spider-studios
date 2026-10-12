import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAuthenticatedUser } from "../../../../lib/session";
import { getPublicAppUrl, getStripe } from "../../../../lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in with Discord before adding a payment method." }, { status: 401 });
  let appUrl: string;
  try { appUrl = getPublicAppUrl(); } catch { return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 }); }
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).origin !== new URL(appUrl).origin) return NextResponse.json({ error: "Request origin did not match Spider Studio." }, { status: 403 });
  try {
    const stripe = getStripe();
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { spiderUserId: user.id, discordId: user.discordId },
        name: user.discordUsername,
      }, { idempotencyKey: `spider-customer-${user.id}` });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      customer: customerId,
      payment_method_types: ["card"],
      success_url: appUrl + "/dashboard/settings?tab=billing&payment_method=added",
      cancel_url: appUrl + "/dashboard/settings?tab=billing&payment_method=cancelled",
      client_reference_id: user.id,
      metadata: { spiderUserId: user.id, purpose: "save_payment_method" },
    });
    if (!session.url) return NextResponse.json({ error: "Stripe did not return a secure setup URL." }, { status: 502 });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe payment method setup failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to open secure card setup. Please try again later." }, { status: 503 });
  }
}

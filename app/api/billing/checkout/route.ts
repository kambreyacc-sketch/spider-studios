import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAuthenticatedUser } from "../../../../lib/session";
import { getConfiguredPrice, getPublicAppUrl, getStripe } from "../../../../lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in with Discord before managing billing." }, { status: 401 });
  const origin = request.headers.get("origin");
  let appUrl: string;
  try { appUrl = getPublicAppUrl(); } catch { return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 }); }
  if (origin && new URL(origin).origin !== new URL(appUrl).origin) return NextResponse.json({ error: "Request origin did not match Spider Studio." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const interval = body?.interval;
  if (interval !== "monthly" && interval !== "yearly") return NextResponse.json({ error: "Choose a configured monthly or yearly plan." }, { status: 400 });
  try {
    const stripe = getStripe();
    const priceId = getConfiguredPrice(interval);
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
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: appUrl + "/dashboard/settings?tab=billing&checkout=success",
      cancel_url: appUrl + "/dashboard/settings?tab=billing&checkout=cancelled",
      client_reference_id: user.id,
      metadata: { spiderUserId: user.id, discordId: user.discordId, interval },
      subscription_data: { metadata: { spiderUserId: user.id, discordId: user.discordId, interval } },
      allow_promotion_codes: true,
    }, { idempotencyKey: request.headers.get("idempotency-key") || undefined });
    if (!session.url) return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    const status = message.includes("not configured") || message.includes("missing") ? 503 : 500;
    console.error("Stripe checkout setup failed:", message);
    return NextResponse.json({ error: status === 503 ? message : "Unable to start checkout. Please try again later." }, { status });
  }
}

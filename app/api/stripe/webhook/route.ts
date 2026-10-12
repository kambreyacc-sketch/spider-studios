import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../../lib/prisma";
import { getStripe } from "../../../../lib/stripe";

export const runtime = "nodejs";

function toDate(unix: number | null | undefined) {
  return typeof unix === "number" && Number.isFinite(unix) ? new Date(unix * 1000) : null;
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId }, select: { id: true } });
  if (!user) {
    console.error("Stripe subscription event had no matching Spider user.", { subscriptionId: subscription.id, customerId });
    return;
  }
  const price = subscription.items.data[0]?.price;
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId: user.id, stripeSubscriptionId: subscription.id, stripePriceId: price?.id ?? null,
      planKey: price?.recurring?.interval ?? "configured", interval: price?.recurring?.interval ?? null,
      status: subscription.status, currentPeriodEnd: toDate(subscription.items.data[0]?.current_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      userId: user.id, stripePriceId: price?.id ?? null,
      planKey: price?.recurring?.interval ?? "configured", interval: price?.recurring?.interval ?? null,
      status: subscription.status, currentPeriodEnd: toDate(subscription.items.data[0]?.current_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook signing secret is not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  try {
    const alreadyProcessed = await prisma.processedStripeEvent.findUnique({ where: { id: event.id } });
    if (alreadyProcessed) return NextResponse.json({ received: true, duplicate: true });
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        const userId = session.metadata?.spiderUserId || session.client_reference_id;
        if (customerId && userId) {
          await prisma.user.updateMany({ where: { id: userId }, data: { stripeCustomerId: customerId } });
          if (session.subscription) {
            const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
            const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
            await syncSubscription(subscription);
          }
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          await prisma.subscription.updateMany({
            where: { user: { stripeCustomerId: customerId }, status: { in: ["active", "trialing"] } },
            data: { status: "past_due" },
          });
        }
        break;
      }
      default:
        break;
    }
    await prisma.processedStripeEvent.create({ data: { id: event.id, type: event.type } });
    return NextResponse.json({ received: true });
  } catch (error) {
    const safeMessage = (error instanceof Error ? error.message : "Unknown webhook processing error").slice(0, 500);
    console.error("Stripe webhook processing failed:", event.type, safeMessage);
    await prisma.billingIssue.create({ data: { stripeEventId: event.id, eventType: event.type, message: safeMessage } }).catch(() => undefined);
    return NextResponse.json({ error: "Webhook processing failed; Stripe should retry this event." }, { status: 500 });
  }
}

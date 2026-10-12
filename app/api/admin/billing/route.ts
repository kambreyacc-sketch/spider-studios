import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAuthenticatedUser } from "../../../../lib/session";
import { getStripe } from "../../../../lib/stripe";

export const runtime = "nodejs";

const ADMIN_DISCORD_ID = process.env.SPIDER_ADMIN_DISCORD_ID || "1337293227820322878";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in with the authorized Discord account." }, { status: 401 });
  if (user.discordId !== ADMIN_DISCORD_ID) return NextResponse.json({ error: "You are not authorized to view billing administration." }, { status: 403 });
  try {
    const [users, issues] = await Promise.all([
      prisma.user.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, discordId: true, discordUsername: true, stripeCustomerId: true, createdAt: true,
          subscriptions: { orderBy: { updatedAt: "desc" }, take: 3, select: {
            stripeSubscriptionId: true, stripePriceId: true, planKey: true, status: true,
            interval: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, updatedAt: true,
          } },
        },
      }),
      prisma.billingIssue.findMany({ orderBy: { createdAt: "desc" }, take: 50, select: { id: true, stripeEventId: true, eventType: true, message: true, createdAt: true } }),
    ]);
    let invoicesByCustomer: Record<string, { id: string; number: string | null; status: string | null; created: number; amountDue: number; amountPaid: number; currency: string }[]> = {};
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = getStripe();
      const customers = users.filter(u => u.stripeCustomerId).slice(0, 50);
      const invoiceLists = await Promise.allSettled(customers.map(u => stripe.invoices.list({ customer: u.stripeCustomerId!, limit: 5 })));
      for (let i = 0; i < customers.length; i++) {
        const result = invoiceLists[i];
        if (result.status === "fulfilled") {
          invoicesByCustomer[customers[i].id] = result.value.data.map(invoice => ({
            id: invoice.id, number: invoice.number, status: invoice.status, created: invoice.created,
            amountDue: invoice.amount_due, amountPaid: invoice.amount_paid, currency: invoice.currency,
          }));
        }
      }
    }
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      users: users.map(u => ({
        id: u.id, discordId: u.discordId, discordUsername: u.discordUsername, createdAt: u.createdAt,
        hasStripeCustomer: !!u.stripeCustomerId, subscriptions: u.subscriptions, invoices: invoicesByCustomer[u.id] || [],
      })),
      issues,
    });
  } catch (error) {
    console.error("Admin billing overview failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to load billing administration. Check database and Stripe configuration." }, { status: 503 });
  }
}

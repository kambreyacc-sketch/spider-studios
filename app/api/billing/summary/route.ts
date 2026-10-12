import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/session";
import { getStripe } from "../../../../lib/stripe";

export const runtime = "nodejs";\nexport const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in with Discord to view billing." }, { status: 401 });
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Stripe is not configured yet. Add the server-side Stripe secret in Vercel." }, { status: 503 });
  try {
    const stripe = getStripe();
    if (!user.stripeCustomerId) {
      return NextResponse.json({
        account: { discordUsername: user.discordUsername },
        subscription: null, paymentMethods: [], invoices: [],
        configuredPrices: { monthly: !!process.env.STRIPE_PRICE_MONTHLY, yearly: !!process.env.STRIPE_PRICE_YEARLY },
      });
    }
    const [customer, subscriptions, methods, invoices] = await Promise.all([
      stripe.customers.retrieve(user.stripeCustomerId),
      stripe.subscriptions.list({ customer: user.stripeCustomerId, status: "all", limit: 10 }),
      stripe.paymentMethods.list({ customer: user.stripeCustomerId, type: "card" }),
      stripe.invoices.list({ customer: user.stripeCustomerId, limit: 10 }),
    ]);
    if (customer.deleted) return NextResponse.json({ error: "The Stripe customer record is unavailable." }, { status: 409 });
    const defaultId = typeof customer.invoice_settings.default_payment_method === "string"
      ? customer.invoice_settings.default_payment_method
      : customer.invoice_settings.default_payment_method?.id;
    const priority = ["active", "trialing", "past_due", "unpaid", "incomplete", "paused"];
    const subscription = subscriptions.data.filter(s => priority.includes(s.status)).sort((a, b) => priority.indexOf(a.status) - priority.indexOf(b.status))[0] || null;
    return NextResponse.json({
      account: { discordUsername: user.discordUsername },
      subscription: subscription ? {
        id: subscription.id, status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: subscription.items.data[0]?.current_period_end ?? null,
        interval: subscription.items.data[0]?.price.recurring?.interval ?? null,
        currency: subscription.items.data[0]?.price.currency ?? null,
        amount: subscription.items.data[0]?.price.unit_amount ?? null,
      } : null,
      paymentMethods: methods.data.map(method => ({
        id: method.id, brand: method.card?.brand ?? "card", last4: method.card?.last4 ?? "••••",
        expMonth: method.card?.exp_month ?? null, expYear: method.card?.exp_year ?? null,
        isDefault: method.id === defaultId,
      })),
      invoices: invoices.data.map(invoice => ({
        id: invoice.id, number: invoice.number, status: invoice.status, currency: invoice.currency,
        amountPaid: invoice.amount_paid, amountDue: invoice.amount_due, created: invoice.created,
        hostedInvoiceUrl: invoice.hosted_invoice_url, invoicePdf: invoice.invoice_pdf,
        description: invoice.lines.data[0]?.description ?? "Spider Studio billing",
      })),
      configuredPrices: { monthly: !!process.env.STRIPE_PRICE_MONTHLY, yearly: !!process.env.STRIPE_PRICE_YEARLY },
    });
  } catch (error) {
    console.error("Billing summary failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to load billing information right now." }, { status: 502 });
  }
}

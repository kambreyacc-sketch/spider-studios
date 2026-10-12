import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured: STRIPE_SECRET_KEY is missing.");
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

export function getConfiguredPrice(interval: "monthly" | "yearly"): string {
  const priceId = interval === "monthly"
    ? process.env.STRIPE_PRICE_MONTHLY
    : process.env.STRIPE_PRICE_YEARLY;
  if (!priceId || !priceId.startsWith("price_")) {
    throw new Error(`The ${interval} subscription price is not configured. Add the Stripe Price ID in Vercel environment variables after approving your plan.`);
  }
  return priceId;
}

export function getPublicAppUrl(): string {
  const raw = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!raw) throw new Error("APP_URL is missing. Configure the canonical Spider Studio URL.");
  return raw.startsWith("http") ? raw.replace(/\/$/, "") : `https://${raw.replace(/\/$/, "")}`;
}

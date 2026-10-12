# Spider Studio billing setup

This branch introduces the billing foundation. **Do not enable live payments until the setup and test checklist below has passed.** No plan prices are defined in code.

## Current project discovery

- The repository is a Next.js App Router project.
- The inspected Vercel environment-variable list did not show a database URL, Stripe configuration, or Discord OAuth credentials.
- Existing admin login is separate from member sign-in. The new Discord OAuth session is for account billing; it does not silently replace the current admin login.
- Provisioning a PostgreSQL database and configuring environment variables is still required before billing can be used.

## Vercel environment variables

Set these in Vercel Project Settings → Environment Variables. Keep secret values server-side; never use a `NEXT_PUBLIC_` prefix for secrets.

- `DATABASE_URL`: PostgreSQL connection URL for the Spider Studio billing database.
- `DISCORD_CLIENT_ID`: Discord application's OAuth2 client ID.
- `DISCORD_CLIENT_SECRET`: Discord application's OAuth2 client secret.
- `DISCORD_SESSION_SECRET`: cryptographically random secret, at least 32 characters, for signed member sessions.
- `APP_URL`: canonical URL for the current environment, e.g. the exact Vercel preview URL for preview testing or production domain for production.
- `STRIPE_SECRET_KEY`: Stripe test secret key while testing; never expose to client code.
- `STRIPE_WEBHOOK_SECRET`: signing secret for the webhook endpoint configured below.
- `STRIPE_PRICE_MONTHLY`: Stripe Price ID for the monthly membership, only after the owner configures and approves its amount.
- `STRIPE_PRICE_YEARLY`: Stripe Price ID for the yearly membership, only after the owner configures and approves its amount.

Use different Discord OAuth callback URLs and Stripe keys/webhook secrets for preview and production. Preview environment variables should be scoped to Preview deployments. Do not copy production secrets into preview.

## Discord OAuth

Register this exact callback URL in the Discord Developer Portal for each deployment environment:

`APP_URL/api/auth/discord/callback`

The sign-in flow requests only the `identify` scope. The server validates OAuth state and fetches the authenticated profile directly from Discord.

## Stripe

Configure the following webhook endpoint in Stripe test mode:

`APP_URL/api/stripe/webhook`

Subscribe to at least these events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.paused`
- `customer.subscription.resumed`
- `invoice.payment_failed`

Enable Stripe's customer portal and allow customers to manage saved payment methods and subscriptions. The hosted setup flow uses Stripe Checkout in setup mode to save a card without charging it.

The app uses Stripe-hosted pages for card entry and customer management. It never stores raw card numbers or CVC values.

## Database migration

After setting `DATABASE_URL` locally or in the appropriate controlled environment, run:

```bash
npx prisma generate
npx prisma migrate deploy
```

Review and apply the migration in a non-production database first. Do not point a preview deployment at production billing data.

## Test checklist

- Discord OAuth state validation rejects missing or mismatched state.
- Anonymous requests cannot access billing summaries, checkout, or portal endpoints.
- Checkout rejects unconfigured plan IDs and never invents a price.
- Stripe checkout uses the signed-in user's Stripe customer.
- Card setup uses Stripe-hosted Checkout and stores only Stripe customer references.
- Customer portal cannot be opened for another account.
- Invalid webhook signatures are rejected.
- Replayed webhook events are idempotent.
- Subscription status changes are applied only from verified server-side events.
- Invoice links and safe card metadata are scoped to the signed-in account.
- Failed payments, cancellation, renewals, and plan changes are verified in Stripe test mode.

## Not yet ready for production

This branch has not been built or run against a configured PostgreSQL database or Stripe test account. Confirm the preview deployment, install/generate Prisma, apply the migration to a test database, and complete the checklist before merging. Developer-to-developer marketplace payments and Stripe Connect payouts are a separate follow-up phase.

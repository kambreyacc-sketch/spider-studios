# Spider Studios Platform Foundation

## Product goal

Extend the existing Next.js App Router site into a Roblox developer community and marketplace inspired by RoDevs and HiddenDevs, while preserving Spider Studios branding and the existing games/team pages.

Repository: `kambreyacc-sketch/spider-studios`
Current production source branch: `main`
Foundation work branch: `feature/spider-platform-foundation`

## Confirmed product decisions

- Aero and Aero+ can be purchased on the website or through Discord; membership and entitlements must synchronize across both channels.
- Discord VIP role grants VIP website access automatically. Staff can also grant/revoke manual VIP access.
- Leaker uploads enter a pending-review queue. Management approval is required before a resource becomes publicly downloadable.
- Website roles: Member, Leaker, VIP, Aero, Aero+, Management, Admin, Co Owner, Owner.
- Owner controls final permissions. Do not trust client-side role labels or hidden UI as authorization.

## Current repository baseline

- Next.js App Router with React and TypeScript.
- Existing homepage and routes for About, Team, Careers, Apply, Contact, Games, Sell Game, and Admin.
- Existing data files: `data/games.ts` and `data/team.ts`.
- Existing admin endpoints use environment-based authentication and GitHub-backed data persistence.
- `package.json` currently has only Next.js, React, and TypeScript dependencies. No database, Discord OAuth, billing, or object-storage integration is configured yet.

## Proposed information architecture

### Public
- `/` — Spider landing page: studio overview, owner introduction, staff cards, server links, featured games carousel, latest resources/news, membership CTA.
- `/games` and `/games/[slug]` — existing portfolio and game details.
- `/team` — staff and leadership, using editable staff data.
- `/shop` — products, resource listings, and Aero/Aero+ plans.
- `/pricing` — clear subscription comparison and billing FAQs.
- `/about`, `/careers`, `/contact` — preserve current pages.

### Signed-in member
- `/dashboard` — Discord profile, website roles, entitlements, subscription status, downloads, and account settings.
- `/resources` — searchable library with filters, file metadata, access gates, and download audit events.
- `/vip` — VIP-only resources and community benefits.
- `/aero` — AI scripting assistant and vibe-coding workspace; gated by active Aero entitlement.
- `/aero-plus` — Aero+ tools and exclusive resources.

### Staff and operations
- `/dashboard/uploads` — Leaker submissions and upload status.
- `/staff/review` — Management review queue with approve/reject notes and audit trail.
- `/admin` — user lookup, role grants, resource management, subscription/entitlement inspection, staff management, audit log, and site settings.

## Access and role model

Implement server-side permission checks in a single reusable authorization layer. Example permission groups:

- Member: public site, public resources, shop.
- Leaker: submit resource files and metadata; view own submissions.
- VIP: VIP resource access through Discord role or an explicit manual grant.
- Aero: AI scripting features and Aero resources while an active Aero entitlement exists.
- Aero+: Aero features plus Aero+ exclusive resources and higher configured limits.
- Management: moderate resources, review uploads, manage reports, and perform explicitly scoped member operations.
- Admin: broad operational permissions but no ability to override or remove Owner.
- Co Owner: broad management permissions defined by Owner.
- Owner: full access, role/permission configuration, billing settings, and audit access.

Use least privilege. A user's Discord roles must be fetched and validated server-side; do not accept a role name, Discord ID, plan, or entitlement supplied by the browser as proof of access. Record manual grants with grantor, reason, timestamp, and optional expiration.

## Subscription and entitlement synchronization

Use an internal entitlement ledger as the website's access decision source. Record the provider/source, provider customer/subscription ID, plan, status, start/end dates, and last synchronization time.

1. Website checkout creates a pending purchase through the selected billing provider.
2. Signed provider webhooks update the ledger; never grant paid access based only on a browser redirect.
3. Discord-native subscription events or a verified bot reconciliation job update the same entitlement ledger.
4. A Discord bot adds/removes the appropriate Discord role for eligible paid plans; website role checks also read the ledger so access remains correct if Discord role synchronization is delayed.
5. Cancellation, refund, failed payment, expiration, and role removal must revoke paid access according to the configured policy.
6. Add idempotency keys, webhook signature verification, retry handling, and an audit log.

Do not finalize prices, billing intervals, AI limits, refunds, or plan benefits until Owner confirms them.

## Upload and download lifecycle

1. Leaker signs in and submits a file with title, category, description, version, supported platform, changelog, access tier, and required attribution/licensing confirmation.
2. Validate file size/type, sanitize metadata, scan uploads where possible, and store files in private object storage. Do not put member uploads or secrets in the Git repository.
3. New submissions have `pending_review` status and cannot be downloaded by ordinary members.
4. Management can approve, reject with a reason, or request changes. Record every decision.
5. Approved resources are served through short-lived signed download URLs after a server-side entitlement check.
6. Log upload, moderation, and download events for abuse handling.

Only permit files the submitter has rights to distribute. Do not present stolen or unauthorized game assets as legitimate resources.

## Aero AI and Roblox Studio integration

- Build the web AI workspace first: authenticated chat, script/code output, copy controls, session history, rate limits, and clear plan usage.
- Keep AI provider keys server-side. Enforce per-plan limits on the server.
- Treat generated code as untrusted until reviewed. Do not automatically execute arbitrary code.
- Build a Roblox Studio plugin as a separate project/package that authenticates to the Spider service with a short-lived, scoped token and communicates over HTTPS.
- Keep the plugin's permissions narrow; show users what files/scripts are read or changed and require confirmation for destructive edits.
- Confirm the intended AI provider, Studio workflow, and deployment limits before wiring a real model.

## Suggested implementation sequence

### Phase 1 — Safe foundation
- Confirm the Vercel project connected to this repository and its production domain.
- Add environment-variable documentation and a clear separation between public configuration and secrets.
- Choose a persistent database/auth provider and private file storage.
- Implement Discord OAuth sign-in and server-side session handling.
- Implement the role/permission service and account dashboard shell.

### Phase 2 — Resource library
- Add resource database schema, private uploads, validation, pending review, Management approval, signed downloads, and audit events.
- Add VIP entitlement checks for automatic Discord-role access plus manual grants.

### Phase 3 — Aero subscriptions
- Choose and configure website billing.
- Add Discord subscription/bot integration and signed event handlers.
- Build the entitlement ledger, plan comparison, cancellation handling, and role synchronization.
- Do not launch paid access until webhook and revocation tests pass.

### Phase 4 — Aero AI
- Add the web assistant and server-side usage enforcement.
- Build and test the Studio plugin against a development environment before public release.

### Phase 5 — Polish and release
- Improve the landing page, flowing game cards, staff profiles, mobile navigation, accessibility, and loading/error states.
- Add tests for permissions, subscription changes, upload review, and private downloads.
- Verify Vercel preview deployment and production environment variables before release.

## Environment variables to plan for

Names will be finalized to match the selected providers. Never commit values:
- Discord OAuth client ID/secret, redirect URL, bot token, and target guild ID.
- Session/auth secret.
- Database URL and service credentials.
- Private object-storage credentials.
- Billing provider secret, webhook secret, and product/price IDs.
- AI provider key and usage-limit configuration.
- Site URL and allowed origins.

## First implementation milestone

Before adding paid or private features, inspect the existing admin/API authentication, confirm the actual Vercel project/domain, and select the persistent database/auth/storage services. Then implement Discord sign-in and the server-side authorization foundation before protected downloads or checkout.

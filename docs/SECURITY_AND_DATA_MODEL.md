# Spider Studios Security and Data Model

This document is the implementation blueprint for the platform foundation. It does not contain secrets and does not enable any paid/private feature by itself.

## Findings from the current code

- The current admin login creates a deterministic HMAC cookie from a shared password and secret. The cookie has a seven-day lifetime, and the login route does not implement rate limiting.
- The admin data endpoint writes `data/games.ts` and `data/team.ts` directly to the `main` branch through the GitHub API.
- Current applications are emailed by the API route rather than being stored in a durable review database.
- The project currently has no declared database, Discord OAuth, payment SDK, or object-storage dependency.

Before adding more powerful staff controls, replace the single shared admin session with individual Discord-authenticated accounts, server-side permissions, expiring/revocable sessions, rate limiting, and an audit trail. Keep the existing admin route working until a replacement is tested; do not expose GitHub tokens to browsers.

## Recommended initial data model

Use PostgreSQL with UUID primary keys and UTC timestamps. Apply migrations in a development project first.

### profiles
- id (UUID, primary key; auth provider user ID)
- discord_user_id (text, unique, indexed)
- discord_username (text)
- display_name (text)
- avatar_url (text)
- created_at, updated_at

### roles and permissions
- roles: id, key (unique), display_name
- permissions: id, key (unique), description
- role_permissions: role_id, permission_id
- profile_roles: profile_id, role_id, source (discord/manual/system), granted_by, reason, expires_at, created_at
- Audit all role changes. Protect Owner assignment with explicit safeguards. A Discord role mapping is configuration, not a role supplied by the client.

### entitlements
- id
- profile_id
- product_key (vip, aero, aero_plus)
- source (discord_subscription, website_payment, manual)
- provider_reference (unique per provider when available)
- status (pending, active, past_due, canceled, expired, revoked)
- starts_at, ends_at, last_synced_at
- metadata (JSONB with only non-secret provider metadata)
- created_at, updated_at

Define one server-side function to answer whether a profile currently has an entitlement. Use idempotent provider event processing and keep an audit trail of changes.

### resources
- id, slug, title, description, category, version
- access_tier (public, vip, aero, aero_plus)
- storage_key (private object-storage key; never a public bucket URL)
- original_filename, detected_mime_type, size_bytes, checksum
- submitted_by, status (pending_review, changes_requested, approved, rejected, archived)
- reviewed_by, review_note, reviewed_at
- license_attestation, attribution, changelog
- created_at, updated_at, published_at

### resource_events
- id, resource_id, actor_profile_id
- event_type (submitted, approved, rejected, downloaded, archived)
- metadata, created_at

### subscriptions and billing_events
- subscriptions: id, profile_id, provider, provider_subscription_id, product_key, status, current_period_start, current_period_end, cancel_at_period_end, updated_at
- billing_events: id, provider, provider_event_id (unique), event_type, received_at, processed_at, processing_status, safe_summary
- Never store raw payment-card data. Verify provider signatures before processing webhooks.

### ai_usage
- id, profile_id, product_key, request_id, model_key, input_units, output_units, status, created_at
- Enforce usage limits and model permissions server-side. Do not persist sensitive prompt content by default; make history opt-in with clear retention controls.

## Authorization rules

- All private API routes enforce authentication and permissions on the server.
- Client-side navigation and hidden buttons are presentation only.
- Re-check current roles/entitlements when issuing a signed download URL and use a short expiry.
- Discord role verification uses the configured bot/service credentials on the server. Never accept client-provided guild membership as proof.
- Manual VIP grants require an authorized staff actor, reason, timestamp, and optional expiration.
- Webhook handlers validate signatures, persist event IDs, and are idempotent.
- Keep service-role keys, Discord bot tokens, billing secrets, AI keys, and GitHub tokens only in server-side environment variables.
- Add CSRF/origin protections where applicable, rate limits, input validation, file size/type limits, malware scanning where feasible, and structured security logs without tokens or sensitive payloads.

## Billing synchronization model

1. Both website and Discord purchase/renewal sources update a single entitlement service.
2. Each provider event is signature-verified and idempotently recorded.
3. Entitlements update transactionally from verified provider state.
4. The Discord bot reconciles the appropriate role to match current entitlement; the website checks the entitlement ledger directly.
5. Failed payments, refunds, cancellation, expiry, and revoked subscriptions follow a documented grace-period policy.
6. A periodic reconciliation job compares provider state, internal entitlements, and Discord roles and reports mismatches.

## File upload rules

- Upload to a private quarantine location, not a public bucket.
- Allowlist formats and enforce size limits; treat filenames and metadata as untrusted.
- Record a checksum and detected content type.
- Scan for malware where available and reject executable formats that are not explicitly supported.
- Management approval is required before publishing.
- Only allow submissions the uploader is authorized to distribute; keep licensing/attribution attestations.
- Use short-lived signed downloads after server-side authorization, and log download events.

## Provider setup checklist

Before implementation is deployed, select and configure:
- Authentication and PostgreSQL provider.
- Private object-storage provider.
- Website payment processor and exact Aero/Aero+ products and prices.
- Discord bot application, OAuth redirect URI, target guild, and role IDs.
- AI provider, models, per-plan limits, and usage budget.
- Vercel preview and production environment variables separately.

No real provider credentials or payment configuration should be committed to the repository.

# Deliberry Customer Flow Security Audit

Date: 2026-04-08

Scope:
- Authentication and session handling
- Authorization boundaries and customer data access
- Order creation and payment integrity
- Supabase security, including RLS and backend/runtime data boundaries
- Secrets, environment variables, and proxy/runtime secret handling
- Operational security and exposure risks

Method:
- Source-only audit from actual files in this workspace
- No feature redesign
- No speculative runtime claims beyond what source proves

## Security Audit Result

Current posture: do not continue production-facing customer rollout without a security remediation pass first.

The biggest blockers are not cosmetic hardening issues. They are trust-boundary issues:
- customer order creation is client-authoritative for monetary fields
- database-enforced customer isolation is not present in source migrations
- at least one security-definer RPC trusts caller-supplied actor identity
- live operational secrets are present in local repo-adjacent env files

## Critical Before Real-User Rollout

### 1. Customer data isolation is not enforced in source migrations

Evidence:
- `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart` directly reads and writes `orders`, `actor_profiles`, `customer_reviews`, and `customer_addresses` with the client session: lines 61-77, 98-166, 184-189, 268-277, 922-956.
- Core tables are defined in `supabase/migrations/20260317150000_phase_1_runtime_foundation.sql` at lines 31-151.
- I searched `supabase/migrations` for `enable row level security`, `disable row level security`, and `create policy` and found no hits.

Risk:
- I could not find any repo-enforced RLS or policy baseline for customer-facing tables.
- Because the customer app talks to those tables directly through the authenticated client, customer isolation currently depends on undocumented database state outside source control.

Required remediation:
- Add explicit migrations that enable RLS on all customer-reachable tables.
- Add per-table policies for `orders`, `actor_profiles`, `customer_reviews`, `customer_addresses`, and any auxiliary customer-facing tables.
- Block rollout until those migrations exist in source and are reviewed.

### 2. Order creation trusts client-computed totals, fees, and line items

Evidence:
- `customer-app/lib/core/data/customer_runtime_controller.dart` builds `CustomerOrderCreateInput` from local runtime state, including `totalCentavos`, `subtotalCentavos`, `deliveryFeeCentavos`, and per-item `unitPriceCentavos`: lines 445-476.
- `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart` inserts those same client-supplied values directly into `public.orders` without server-side recomputation or verification: lines 922-956.

Risk:
- A modified client can tamper with totals, prices, quantities, fees, or item payloads before order creation.
- This breaks order integrity even before real payment is introduced.

Required remediation:
- Replace direct table insert with a server-side order-creation RPC or Edge Function.
- Recompute price, subtotal, delivery fee, and allowed items from authoritative store/menu data on the server.
- Persist both submitted payload and server-normalized payload for auditability.

### 3. Review write path can impersonate another actor and mutate store rating

Evidence:
- Client calls RPC `upsert_customer_review_with_store_projection` and sends `p_actor_id` from the client session: `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart` lines 268-277.
- The function is `security definer` and trusts `p_actor_id` as input: `supabase/migrations/20260330090000_customer_review_runtime.sql` lines 19-29.
- The function checks only that the order exists, then inserts or updates by `(order_id, customer_actor_id)` and recalculates store rating: lines 35-92.
- There is no check that `p_actor_id = auth.uid()` and no check that the order belongs to that actor.

Risk:
- Any caller who can execute this RPC can submit or overwrite reviews for someone else and influence public store ratings.

Required remediation:
- Remove caller-supplied actor identity from the function signature.
- Resolve actor identity inside the function with `auth.uid()`.
- Verify the referenced order belongs to that actor before allowing insert or update.
- Explicitly grant execute only to intended roles after policy review.

### 4. Live operational secrets are stored in plaintext under the repo workspace

Evidence:
- `public-website/.env.production.local` contains a live `VERCEL_OIDC_TOKEN` and `VIETNAM_ZALO_PROXY_SHARED_SECRET`: lines 23-27.
- `customer-app/.env.production` contains a live `SUPABASE_ANON_KEY` and `VERCEL_OIDC_TOKEN`: lines 6 and 25.
- `.gitignore` ignores `.env.local` and `.env*.local`, but not `.env.production`: `.gitignore` lines 15-16 and 34-35.
- `git status --short` shows `customer-app/.env.production` as untracked in the workspace.

Risk:
- Vercel access tokens and proxy secrets are recoverable from local files in the project workspace.
- `customer-app/.env.production` is currently at risk of accidental commit because it is not ignored.

Required remediation:
- Rotate the exposed Vercel OIDC token and proxy shared secret immediately.
- Remove plaintext secret files from the repo workspace or move them to a secrets manager workflow.
- Update `.gitignore` to cover `.env.production` and similar exported env files.

## High-Priority Findings Before Payment Rollout

### 5. Zalo callback allows arbitrary external `return_to` redirects

Evidence:
- `decodeWebReturnTo` accepts any `http` or `https` URL from the decoded `state` payload: `public-website/src/app/customer-zalo-auth-exchange/route.ts` lines 126-145.
- `GET` then copies provider query parameters onto that URL and redirects to it: lines 589-600.

Risk:
- Trusted callback traffic from `go.deli-berry.com` can be redirected to attacker-controlled destinations.
- This is a phishing and auth-flow abuse surface and should be constrained before broader rollout.

Required remediation:
- Only allow a strict return-to allowlist of Deliberry-owned origins.
- Reject callback `state` values that do not map to approved origins and paths.

### 6. Token-returning exchange route is cross-origin readable

Evidence:
- The route sets `Access-Control-Allow-Origin: *` and allows `GET, POST, OPTIONS`: `public-website/src/app/customer-zalo-auth-exchange/route.ts` lines 7-12.
- The `POST` response returns `access_token` and `refresh_token` in JSON: lines 534-542.

Risk:
- Any origin can read responses from this endpoint if it obtains a usable authorization code.
- This is too permissive for an endpoint that mints customer sessions.

Required remediation:
- Restrict CORS to the exact origins that must call this route.
- Prefer same-origin exchange or a non-browser exchange channel for session issuance.

### 7. Legacy Supabase function remains as a bypass/drift path for Zalo auth

Evidence:
- `supabase/functions/customer-zalo-auth-exchange/index.ts` still exists.
- It fetches Zalo profile directly from `graph.zalo.me` instead of the VN proxy: lines 115-133.
- It still uses deprecated env names `PROJECT_URL` and `SERVICE_ROLE_KEY`: lines 168-179.
- It still issues sessions using the same deterministic-password model: lines 204-210.

Risk:
- This creates a second auth exchange implementation with different network and secret assumptions.
- Even if unused today, keeping the legacy path in source increases accidental deployment and rollback confusion.

Required remediation:
- Remove or hard-disable the legacy function if the public-website route is canonical.
- If it must remain temporarily, add an explicit deprecation guard and documentation that it is not deployable.

### 8. Zalo customer identity is converted into a deterministic password derived from the service role secret

Evidence:
- `public-website/src/app/customer-zalo-auth-exchange/route.ts` derives a password from `serviceRoleKey` and Zalo user id: lines 172-180.
- The same route then issues a password grant using those derived credentials: lines 524-542.

Risk:
- Customer auth for this provider becomes coupled to one master secret.
- A service-role compromise becomes not only administrative compromise, but also deterministic reconstruction of every Zalo-backed customer credential in this flow.

Required remediation:
- Replace the derived-password bridge with a server-side trusted session issuance pattern that does not create reusable password material from the service role key.

## Medium / Later Hardening Findings

### 9. Session snapshot and OAuth attempt material are stored in `SharedPreferences`

Evidence:
- Session snapshot stores `status` and `phoneNumber`: `customer-app/lib/core/session/customer_session_store.dart` lines 23-83.
- OAuth attempt state stores `state` and `codeVerifier`: `customer-app/lib/core/session/customer_auth_attempt_store.dart` lines 19-84.

Risk:
- This is acceptable for prototype velocity, but it is weak storage for auth-adjacent values on shared devices and on web-backed storage.

Required remediation:
- Move auth-adjacent storage to platform-secure storage where supported.
- Minimize retention duration for PKCE/state material.

### 10. Runtime security observability is stubbed out

Evidence:
- `customer-app/lib/core/data/customer_runtime_observability_service.dart` defines `recordEvent(...)` as an empty method.

Risk:
- The code records access-denied and order-create failure events conceptually, but nothing is actually emitted.
- This weakens detection and incident response for auth or authorization failures.

Required remediation:
- Implement a real sink for auth/runtime security events with redaction.
- Ensure access-denied and integrity failures reach an operational log or audit table.

## Exact Files Read

Architecture and ops baseline:
- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`
- `/Users/andremacmini/Desktop/obsidian macmini/obsidian macmini/Deliberry/Operations/00-MASTER-PLAN.md`
- `/Users/andremacmini/Desktop/obsidian macmini/obsidian macmini/Deliberry/Operations/07-AUTH_RUNBOOK.md`
- `/Users/andremacmini/Desktop/obsidian macmini/obsidian macmini/Deliberry/Operations/03-ADR-006-VN-Proxy.md`
- `/Users/andremacmini/Desktop/obsidian macmini/obsidian macmini/Deliberry/Operations/08-CUSTOMER-ORDERING-CLOSURE-PLAN.md`

Customer app:
- `customer-app/lib/app/router/app_router.dart`
- `customer-app/lib/core/backend/runtime_backend_config.dart`
- `customer-app/lib/core/supabase/supabase_client.dart`
- `customer-app/lib/core/session/customer_auth_adapter.dart`
- `customer-app/lib/core/session/customer_multi_auth_adapter.dart`
- `customer-app/lib/core/session/customer_supabase_oauth_adapter.dart`
- `customer-app/lib/core/session/customer_zalo_auth_adapter.dart`
- `customer-app/lib/core/session/customer_session_controller.dart`
- `customer-app/lib/core/session/customer_session_store.dart`
- `customer-app/lib/core/session/customer_auth_attempt_store.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/core/data/customer_runtime_gateway.dart`
- `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart`
- `customer-app/lib/core/data/customer_runtime_observability_service.dart`
- `customer-app/lib/core/services/external_sales_service.dart`
- `customer-app/pubspec.yaml`
- `customer-app/vercel.json`
- `customer-app/.env.local`
- `customer-app/.env.production`

Public website:
- `public-website/src/app/customer-zalo-auth-exchange/route.ts`
- `public-website/package.json`
- `public-website/next.config.ts`
- `public-website/.env.example`
- `public-website/.env.production.local`

Shared:
- `shared/utils/sanitize.ts`

Supabase:
- `supabase/config.toml`
- `supabase/functions/customer-zalo-auth-exchange/index.ts`
- `supabase/migrations/20260317150000_phase_1_runtime_foundation.sql`
- `supabase/migrations/20260319123000_phase_p0_merchant_runtime_screen_backing.sql`
- `supabase/migrations/20260327170000_add_orders_payment_status.sql`
- `supabase/migrations/20260330090000_customer_review_runtime.sql`
- `supabase/migrations/_skip_20260318160000_phase_p2_atomic_address_defaulting.sql`
- `supabase/seed.sql`

Repo hygiene:
- `.gitignore`

## Exact Files Changed

- `docs/customer-flow-security-audit-2026-04-08.md`

## Recommended Remediation Plan In Execution Order

1. Rotate exposed secrets now.
   - Rotate Vercel OIDC credentials and the VN proxy shared secret.
   - Remove plaintext secrets from workspace env exports.
   - Extend ignore rules so exported production env files cannot be committed accidentally.

2. Freeze customer rollout on DB boundary work.
   - Add explicit RLS enablement and policies for every customer-reachable table.
   - Review table grants and function execute permissions as part of the same migration set.

3. Replace direct order inserts with a server-authoritative order-creation path.
   - Server recomputes menu prices, totals, fees, store acceptance, and allowed payment placeholder state.
   - Client becomes request-only, not source-of-truth for money fields.

4. Fix the review RPC authorization model.
   - Remove `p_actor_id`.
   - Bind actor identity to `auth.uid()`.
   - Verify order ownership before write.

5. Close auth callback exposure holes.
   - Add strict `return_to` allowlisting.
   - Restrict CORS on the exchange endpoint.
   - Remove or disable the legacy Supabase Zalo exchange implementation.

6. Replace the deterministic-password bridge.
   - Use a session issuance design that does not derive reusable credentials from the service role key.

7. Harden local/session storage and observability.
   - Move auth-adjacent storage to secure storage where possible.
   - Implement actual security event emission for auth and authorization failures.

8. After the above, run a second audit pass.
   - Verify migrations in source.
   - Re-audit auth, order creation, and Supabase RPC permissions before any payment-facing expansion.

# Phase 1 Contract And Mutation Inventory -- 2026-04-28

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, shared, supabase
Domains: data-contracts, mutations, RLS, audit, production-hardening
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document starts Phase 1 of the governed production roadmap. It inventories the current source-level contracts, tables, RPCs, Edge Functions, runtime repositories, and mutation paths before any new production schema migration is written.

This is a source-tree inventory. It does not claim that the live Supabase project has every migration applied.

## Source Of Truth

- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/phase-1-audit-gap-decisions-2026-04-28.md`
- `docs/operations/vnpay-sandbox-readiness.md`
- `shared/docs/contracts-inventory.md`
- `shared/docs/architecture-boundaries.md`
- `supabase/migrations/`
- `supabase/functions/`
- `customer-app/lib/core/data/`
- `merchant-console/src/shared/data/`
- `admin-console/src/shared/data/`

## Production Boundary For This Phase

Phase 1 may define and harden data contracts, RLS checks, audit requirements, indexes, and idempotency requirements.

Phase 1 must not implement live payment verification. Card, VNPAY, and alternate pay remain sandbox-only or future-ready placeholders until the payment guardrail is formally revised.

## Shared Contract Inventory

Current shared contract files:

- `shared/api/auth.contract.json`
- `shared/api/store.contract.json`
- `shared/api/menu.contract.json`
- `shared/api/order.contract.json`
- `shared/api/payment.contract.json`
- `shared/api/dispute.contract.json`
- `shared/api/review.contract.json`
- `shared/api/promotion.contract.json`
- `shared/api/settlement.contract.json`
- `shared/api/support.contract.json`
- `shared/constants/domain.constants.ts`
- `shared/types/domain.types.ts`
- `shared/models/domain.models.ts`
- `shared/validation/*.schema.json`

Observed contract state:

- `order` defines read-oriented requests and now records production-critical mutation contract entries for customer order creation and merchant order status update.
- `order` includes order statuses and placeholder-safe payment methods.
- `payment` now records placeholder-governed payment methods, payment statuses, sandbox scope, excluded live behaviors, and the future payment-event field set required before live payment can be considered.
- `promotion` exists as a contract, but current merchant persisted runtime reports promotions persistence as not part of the current cutover.
- `settlement` exists as a contract and runtime tables exist; current approved production scope is runtime visibility plus a narrow admin audited acknowledgment path for `calculated -> received`.
- `dispute` now records the limited governed production scope for admin audited status transitions.
- `support` exists as a contract; admin now has a limited audited status-transition path while broader support lifecycle mutations remain out of scope.

Contract hardening decisions recorded in Phase 1:

- promotion contract now records snapshot/read-only production scope
- support contract now records public contact plus limited admin audited status-transition scope
- dispute contract now records limited admin audited status-transition scope
- review contract now records merchant response as a governed audited RPC path
- merchant menu mutation is conditionally allowed as a transitional production candidate only with server-only scope, audit-row verification, and negative tests
- local menu mutation negative/audit E2E verifies own-store menu reads, unowned menu read/insert/update denial, audit-log direct read denial, and service-path audit rows for create and availability update

## Supabase Table Inventory

Core source tables observed in migrations:

- `actor_profiles`
- `merchant_profiles`
- `admin_profiles`
- `stores`
- `merchant_store_memberships`
- `merchant_memberships`
- `orders`
- `audit_logs`
- `customer_addresses`
- `customer_reviews`
- `store_menu_items`
- `disputes`
- `support_tickets`
- `order_mutation_idempotency`
- `delivery_settlements`
- `delivery_settlement_items`
- `external_sales`

Storage buckets and related policies observed:

- `menu-item-images` storage object policies for public read and merchant insert/update/delete.

Important table notes:

- `orders` owns customer order state, payment method, payment status, totals, line item summary, and status timestamps.
- `order_mutation_idempotency` already supports customer order creation and merchant order status update.
- `audit_logs` is RLS-protected and service-role owned for direct table access.
- `delivery_settlements`, `delivery_settlement_items`, and `external_sales` are settlement visibility/runtime tables, not payout automation approval.
- There is no approved live `payment_events` production table recorded in this inventory.

## RPC And Server Mutation Inventory

Customer-facing RPCs:

- `create_customer_order(p_store_id, p_payment_method, p_delivery_address, p_notes, p_line_items, p_promo_code, p_estimated_delivery_at, p_idempotency_key)`
- `set_customer_default_address(p_address_id)`
- `delete_customer_address_with_default_ensure(p_address_id)`
- `upsert_customer_review_with_store_projection(p_order_id, p_rating, p_review_text, p_tags_json)`

Merchant-facing RPCs:

- `assert_merchant_store_membership(p_store_id)`
- `get_merchant_dashboard_kpi_snapshot(p_store_id)`
- `update_order_status_with_audit(p_order_id, p_store_id, p_next_status, p_idempotency_key)`
- `update_store_settings_with_audit(p_store_id, p_settings)`
- `update_store_profile_with_audit(...)`
- `set_merchant_default_store(p_store_id)`

Edge Functions:

- `create-vnpay-sandbox-payment`: creates sandbox-only payment URLs for pending orders
- `vnpay-sandbox-return`: validates sandbox return checksum and displays result only
- `vnpay-sandbox-ipn`: validates sandbox IPN checksum and acknowledges callback only
- `customer-zalo-auth-exchange`: customer auth exchange path
- `generate-settlement`: gated settlement generation function
- `trigger-settlement`: gated settlement trigger function

Mutation hardening notes:

- Customer order creation and merchant order status update already include idempotency keys in source.
- Merchant menu item create/update/availability currently uses runtime service table mutation plus audit insert, not a dedicated audited RPC.
- Merchant review response now mutates through `respond_to_customer_review_with_audit`, which enforces store membership, writes `audit_logs`, and replays duplicate payloads without duplicate audit rows.
- Admin runtime repository is read-oriented for the inventoried production surfaces.

## Customer Runtime Inventory

Primary files:

- `customer-app/lib/core/data/customer_runtime_gateway.dart`
- `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/core/payments/vnpay_sandbox_payment_service.dart`

Observed persisted paths:

- customer addresses read from and write to `customer_addresses`
- profile/settings write to `actor_profiles`
- orders read from `orders`
- order reviews read from `customer_reviews`
- reviews mutate through `upsert_customer_review_with_store_projection`
- order creation mutates through `create_customer_order`
- VNPAY sandbox service calls `create-vnpay-sandbox-payment`

Production hardening implications:

- customer order creation path is the strongest current mutation path because it uses RPC, auth.uid ownership, audit logging, and idempotency
- address mutation paths require RLS and RPC verification in live Supabase before production claim
- review mutation requires audit/lifecycle review before production claim
- sandbox payment creation must remain pending-only and non-completing
- deployed browser verification now confirms that guest deep links into `/#/orders` preserve the route and fall back to auth instead of silently bouncing to home

## Merchant Runtime Inventory

Primary files:

- `merchant-console/src/shared/data/merchant-runtime-repository.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- `merchant-console/src/shared/data/merchant-menu-runtime-service.ts`
- `merchant-console/src/shared/data/merchant-store-runtime-service.ts`
- `merchant-console/src/shared/data/merchant-settings-runtime-service.ts`
- `merchant-console/src/shared/data/merchant-review-runtime-service.ts`
- `merchant-console/src/shared/data/merchant-promotions-runtime-service.ts`
- `merchant-console/src/shared/data/merchant-settlement-runtime-service.ts`

Observed persisted paths:

- dashboard and order queues read from `orders`, `stores`, `customer_reviews`, and KPI RPC
- order status update mutates through `update_order_status_with_audit`
- menu reads and menu writes use `store_menu_items`
- menu image paths use `menu-item-images`
- store/settings write paths use audited RPCs
- review response mutates `customer_reviews`
- settlement reads from `delivery_settlements`, `delivery_settlement_items`, and `external_sales`
- promotions persisted runtime is not currently cut over

Production hardening implications:

- order status update path is ready for Phase 1 verification focus because it uses RPC and idempotency
- menu mutations need a production decision: either wrap in audited RPCs or formally approve the current service mutation pattern
- review responses now have a governed audited mutation path and should be verified in remote evidence like other merchant-side production-candidate writes
- promotions require either persisted runtime implementation or honest production limitation
- settlement now has a narrow governed admin acknowledgment path for `calculated -> received`; broader finance and payout controls remain out of scope

## Admin Runtime Inventory

Primary files:

- `admin-console/src/shared/data/admin-runtime-repository.ts`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `admin-console/src/shared/data/admin-query-services.ts`

Observed persisted paths:

- dashboard reads `actor_profiles`, `merchant_profiles`, `orders`, `disputes`, and `stores`
- users read `actor_profiles` and order counts
- merchants read `merchant_profiles`, `stores`, and `orders`
- stores read `stores` and order counts
- orders read `orders` with store and merchant joins
- disputes read `disputes`
- customer service reads `support_tickets`
- settlements and finance read settlement runtime tables
- audit log entries read `audit_logs`

Production hardening implications:

- admin runtime is primarily read-oriented at this stage, with narrow governed mutation paths for disputes, support tickets, and settlement received acknowledgment
- admin mutation approvals must not be inferred from read screens
- support, dispute, settlement, finance, and governance-sensitive mutation workflows require explicit contract and audit design before production write access

## Payment Placeholder Inventory

Approved current behavior:

- `orders.payment_method` may show `cash`, `card`, or `digital_wallet`
- `orders.payment_status` may show placeholder-safe state such as `pending`
- VNPAY sandbox URL creation is allowed for test readiness
- sandbox return/IPN validation may be tested

Not present or not approved:

- no approved production live payment verification
- no approved production payment event table in this inventory
- no approved refund, reversal, installment, settlement automation, or chargeback lifecycle
- no Deliberry card data handling

Phase 1 required decision:

- define a production `payment_event` contract shape before Phase 4, but do not implement live payment state mutation until the payment guardrail is revised

## RLS And Audit Verification Targets

Required Phase 1 verification targets:

- customer can read only own `orders`, `customer_addresses`, and `customer_reviews`
- merchant can read only stores and orders attached to their store memberships
- merchant order status update must reject another store
- merchant store/settings updates must reject another store
- merchant menu writes must reject another store
- merchant review replies must reject another store
- admin service reads must be limited to server-side repository paths
- direct authenticated access to `audit_logs` remains blocked
- settlement visibility policies match merchant store membership and admin oversight boundaries

Required audit targets:

- customer order creation
- merchant order status update
- merchant store settings update
- merchant store profile update

## Browser Boundary Verification

Local browser E2E was run against local Supabase-backed surfaces on 2026-04-28 with Playwright:

- customer-app static Flutter web build served on port 4320
- merchant-console Next dev server on port 4321
- admin-console Next dev server on port 4322

Covered checks:

- anonymous merchant access to `/demo-store/orders` redirects to login
- demo merchant login lands in the selected `/demo-store` scope
- demo merchant direct access to `/phase1-unowned-store/orders` redirects away from the unowned store
- anonymous admin access to `/orders` redirects to login
- admin login lands on `/access-boundary`
- Support Admin role selection lands on `/dashboard`
- Support Admin direct access to `/finance` redirects to an allowed home route
- Support Admin navigation does not expose the Finance link
- customer-app Flutter web enables semantics, exposes guest entry, enters guest browsing, exposes the main Orders tab, and verifies that guest Orders access falls back to auth

Finding and fix:

- The admin route-boundary middleware was not executing from the effective `src/app` middleware location, allowing a Support Admin browser session to open `/finance`.
- The middleware was moved into `admin-console/src/middleware.ts`, with Edge-safe local cookie constants, so role-based route redirects now run before protected admin pages render.
- The admin platform layout remains responsible for session presence, role-aware navigation, active nav state, and avoiding data reads for hidden navigation groups; route authorization remains middleware-owned.
- Customer Flutter web did not expose visible text to Playwright until the Flutter semantics placeholder was activated. The E2E harness now enables semantics before interacting with the customer surface.
- The customer home floating cart CTA could intercept the bottom navigation Orders tab on small mobile browser viewports. The CTA was raised above the shell tabs so guest users can still reach the auth-guarded Orders route.

Verification artifacts:

- Script: `.playwright-cli/phase1-browser-boundary-e2e.mjs`
- Screenshots: `/Users/andremacmini/output/playwright/phase1-browser-boundary-2026-04-28T07-36-40-274Z`
- Result: merchant, admin, and customer route-boundary assertions passed locally.

Deployed browser E2E was also attempted on 2026-04-28 with Playwright:

- Script: `.playwright-cli/phase1-deployed-boundary-e2e.mjs`
- Runner: `scripts/run-phase1-deployed-boundary-e2e.sh`
- Environment preflight: `scripts/check-phase1-deployed-boundary-env.sh`
- Manual CI workflow: `.github/workflows/phase1-deployed-boundary-e2e.yml`
- Report: `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- Screenshots: `/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-28T07-50-43-926Z`

Covered deployed checks:

- public-website `/`, `/service`, `/merchant`, `/support`, `/download`, `/privacy`, `/terms`, and `/refund-policy` render substantive content and are not blocked by Vercel protection
- admin-console anonymous `/orders` access redirects to `/login`

Remaining deployed boundary:

- customer-app guest-flow browser E2E could not run because the deployed customer-app returned Vercel Authentication
- merchant-console anonymous protected-route browser E2E could not run because the deployed merchant-console returned Vercel Authentication
- the deployed E2E harness now supports Vercel automation bypass headers and a manual GitHub Actions runner
- the deployed E2E harness now enforces an explicit environment preflight before non-skip runs
- Vercel automation bypass secrets have now been configured directly on the four deployed Vercel projects and synchronized into the GitHub repository secret
- the remaining deployed customer boundary failure is guest Orders interaction coverage on the deployed Flutter surface, not deployment protection

## Supabase Verification Result

Execution date: 2026-04-28

Local command:

```bash
psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' -v ON_ERROR_STOP=1 -f docs/operations/phase-1-rls-verification-queries-2026-04-28.sql
```

Result:

- RLS is enabled for all 16 production-critical tables listed in the verification SQL.
- Audit log direct table access is service-role only.
- Idempotency table has no broad direct authenticated policy and is written through hardened RPCs.
- Settlement visibility policies are scoped to merchant membership or admin profile checks.
- Menu image storage policies are scoped by `menu-item-images` bucket and merchant membership folder ownership.
- Legacy unsafe RPC signatures with caller-supplied actor ids were not present.

Finding:

- The local database initially reported `anon_can_execute = true` for the idempotency-aware `create_customer_order` and `update_order_status_with_audit` signatures introduced after the earlier anon revoke migration.

Fix applied:

- Added and applied local migration `supabase/migrations/20260428100000_revoke_anon_execute_from_idempotent_order_rpcs.sql`.
- Rechecked both signatures. `anon_can_execute = false`, `authenticated_can_execute = true`, and `service_role_can_execute = true`.

Remaining verification boundary:

- Local verification confirmed direct SQL query results.
- Remote verification was performed through `supabase db push`, `supabase migration list`, and a remote schema dump because the current Supabase CLI does not expose a direct SQL query command.

Remote commands:

```bash
supabase db push
supabase migration list
supabase db dump --schema public,storage --file /tmp/deliberry-remote-schema-20260428.sql
```

Remote result:

- Remote migration history now matches local through `20260428100000_revoke_anon_execute_from_idempotent_order_rpcs.sql`.
- Remote schema dump confirms all 16 production-critical public tables have RLS enabled.
- Remote schema dump confirms `create_customer_order(..., p_idempotency_key text)` and `update_order_status_with_audit(..., p_idempotency_key text)` have grants for `authenticated` and `service_role`, with no direct `anon` function grant.
- Remote schema dump confirms `audit_logs`, `disputes`, and `support_tickets` direct table policies remain service-role only.
- Remote schema dump confirms merchant review read/reply policies, merchant store/menu read policies, and `menu-item-images` storage policies are present.
- Remote schema dump confirms `order_mutation_idempotency` exists with the actor/operation/idempotency unique index and RLS enabled.

Remaining production-readiness boundary:

- This confirms migration and schema policy posture, not end-to-end authenticated user behavior. Role-specific negative tests still need to exercise actual customer, merchant, and admin sessions before production launch.

## Role Boundary Negative Test Result

Execution date: 2026-04-28

Command:

```bash
psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' -v ON_ERROR_STOP=1 -f docs/operations/phase-1-role-boundary-negative-tests-2026-04-28.sql
```

Result:

- Customer one can read own order.
- Customer one cannot read customer two's order.
- Customer one cannot read customer two's review.
- Customer cannot directly read `audit_logs`, `support_tickets`, or `disputes`.
- Customer two can read own order.
- Customer two cannot read customer one's order or review.
- Merchant can read own store, own store orders, and own store reviews.
- Merchant cannot read a non-public unowned store or its menu items.
- Merchant cannot read customer actor profiles.
- Merchant cannot directly read `audit_logs`, `support_tickets`, or `disputes`.
- Merchant cannot mutate unowned store settings through `update_store_settings_with_audit`.
- Admin direct authenticated client can read its own admin profile.
- Admin direct authenticated client cannot read `orders` or `audit_logs` directly.
- Admin direct authenticated client can use the approved settlement read policy.

Interpretation:

- Local seeded role-boundary negative checks pass.
- The test intentionally uses a paused/non-public unowned store for merchant negative visibility. Open accepting stores remain visible through the public catalog policy, which is expected product behavior.
- These checks validate database RLS/RPC boundaries under role context. They do not replace browser UI QA or production user-session E2E tests.

## Supabase Auth API E2E Boundary Result

Execution date: 2026-04-28

Command:

```bash
node docs/operations/phase-1-auth-api-boundary-e2e-2026-04-28.mjs
```

Result:

- Local fixture setup for a non-public unowned merchant store completed.
- Signed in through local Supabase Auth as `customer.one@example.com`.
- Signed in through local Supabase Auth as `customer.two@example.com`.
- Signed in through local Supabase Auth as `demo@saborcriollo.com`.
- Signed in through local Supabase Auth as `admin@deliberry.local`.
- Customer one can read own order through REST.
- Customer one cannot read customer two's order or review through REST.
- Customer one cannot directly read `audit_logs`, `support_tickets`, or `disputes` through REST.
- Customer two can read own order through REST.
- Customer two cannot read customer one's order or review through REST.
- Merchant can read own store, own store orders, and own store reviews through REST.
- Merchant cannot read non-public unowned store or menu through REST.
- Merchant cannot read customer actor profiles or `audit_logs` through REST.
- Merchant cannot mutate unowned store settings through `update_store_settings_with_audit` RPC.
- Admin direct client can read own admin profile through REST.
- Admin direct client cannot read `orders` or `audit_logs` through REST.
- Admin direct client can use the approved settlement read policy through REST.

Interpretation:

- Local real-auth API E2E role-boundary checks pass.
- This is stronger than SQL role-context testing because it exercises Supabase Auth token issuance, PostgREST, RLS, and RPC behavior together.
- This still does not replace browser UI QA or production/staging user-session testing against deployed frontends.

## Phase 1 Gaps

P0 before production-readiness claim:

- deployed customer-app and merchant-console browser E2E tests remain blocked by Vercel Deployment Protection and require CI-safe staging access

P1 before production readiness:

- menu mutations need an audited production mutation decision
- merchant review response now has remote governed audit coverage recorded in `docs/operations/phase-1-merchant-review-response-audit-evidence-2026-05-04.md`
- promotion persistence is not cut over
- admin dispute status transitions now have remote governed audit coverage recorded in `docs/operations/phase-1-admin-dispute-audit-evidence-2026-05-04.md`
- admin support status transitions now have remote governed audit coverage recorded in `docs/operations/phase-1-admin-support-audit-evidence-2026-05-04.md`; broader support lifecycle ownership is still open for assignment, notes, replies, and refunds

P2 before launch polish:

- contract validation schemas should be reconciled with actual RPC payloads
- runtime observability event coverage should be checked against production incident severity definitions

## Next Actions

1. Completed: update shared contract documents for order mutation idempotency and payment placeholder/event boundaries.
2. Completed: create Phase 1 RLS verification SQL for customer, merchant, admin, settlement, and audit boundaries.
3. Completed locally: run local Supabase verification where environment allows.
4. Completed remotely: apply pending additive security/runtime migrations and verify remote schema posture.
5. Completed locally: run role-context customer, merchant, and admin negative tests against seeded users.
6. Completed locally: run API E2E tests with real local Supabase auth sessions.
7. Completed locally: run browser E2E for merchant store scoping, admin role scoping, and customer guest auth guard.
8. Completed: record Phase 1 audit-gap decisions for menu, review response, promotions, support, disputes, finance, and settlement.
9. Completed locally: run menu mutation negative/audit E2E against local Supabase.
10. Completed partially: run deployed browser E2E tests against currently deployed Vercel artifacts; public routes and admin anonymous guard pass, while customer-app and merchant-console are blocked by Vercel Deployment Protection.
11. Completed harness work: add Vercel automation bypass-header support, guarded runner script, and manual GitHub Actions workflow for deployed E2E.
12. Completed harness work: add deployed E2E environment preflight and secret checklist documentation.
13. Completed operations work: configure Vercel automation bypass directly on deployed projects and synchronize the GitHub repository secret.
14. Next: stabilize the deployed customer guest Orders interaction check and rerun the full non-skip deployed browser suite.
15. Completed: design and verify audited RPCs for the approved admin support and settlement acknowledgment slices; any broader finance-sensitive lifecycle write still requires a new contract/evidence pass.

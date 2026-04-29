# Production Roadmap — 2026-04-28

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: production-readiness, release-planning, payment-governance, operations
Last updated: 2026-04-29

## Purpose

This document defines the roadmap from the current showable product stage to a governed production release. The current product is suitable for stakeholder walkthroughs and late-beta evaluation. Production readiness requires stronger data contracts, payment governance, role boundaries, operational observability, rollback readiness, and real device/browser validation.

This document does not authorize implementation by itself. It defines the execution sequence and gates that future implementation work must satisfy.

## Source of Truth

- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`
- `docs/operations/showable-product-closure-plan-2026-04-28.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/vnpay-sandbox-readiness.md`

## Current Position

Current stage: advanced demo / late beta.

Estimated full-production readiness:

- customer-app: 80-88%
- merchant-console: 65-75%
- admin-console: 60-70%
- public-website: 75-85%
- cross-surface product: 58-68%

The largest remaining gap is not visual polish. The largest gap is production operations: real payment state transitions, production auth/session hardening, RLS and audit guarantees, merchant/admin mutation workflows, observability, incident recovery, and release governance.

## Non-Negotiable Boundaries

- Customer, merchant, admin, public, and shared remain separate surfaces.
- Repo-level `shared` remains contracts, models, enums, constants, types, validation schemas, and pure utilities only.
- Merchant remains store-scoped.
- Admin remains platform-scoped.
- Public website remains acquisition, support, legal, and download only.
- Return URL must not update payment state.
- VNPAY payment completion can only be introduced after binding payment guardrails are revised.
- Map API address autocomplete, QR generation library, QR scanner camera integration, and real-time order tracking remain excluded unless the guardrails are revised first.

## Recommended Path

Use the governed production release path.

Rationale:

- Minimal hardening would keep the product safer but would not produce a live payment production service.
- A full market launch program is too broad before payment, auth, and operational guarantees are closed.
- The governed path moves through production gates in an order that leaves live money movement until the system can safely audit, retry, and roll back operationally.

## System Shape

```text
Public Website
   |
   v
Customer App -> Supabase DB/RPC -> Merchant Console
   |              |     |              |
   |              |     v              v
   |              |  Edge Functions -> Admin Console
   |              |     |
   v              v     v
VNPAY <------ Payment/IPN/Audit ------ Finance/Ops
```

## Phase 0 — Production Definition Freeze

Target duration: 3-5 days.
Execution artifact: `docs/operations/production-definition-freeze-2026-04-28.md`.
Current status: complete for the current guardrail position.

Goal:

Define exactly what production means before implementation resumes.

Work:

- Review `docs/06-guardrails.md` and decide whether VNPAY verification is being reintroduced.
- Create a payment go-live decision record before changing payment behavior.
- Define release gates for customer-app, merchant-console, admin-console, public-website, shared, Supabase, Edge Functions, legal, finance, and operations.
- Define rollback policy for UI-only changes, additive schema changes, Edge Function changes, and payment-state changes.
- Define production severity levels and incident ownership.

Exit criteria:

- Production scope is documented.
- Payment verification is either still excluded or formally moved into approved production scope.
- Rollback policy is documented.
- Release gate checklist exists.

Current result:

- Payment verification remains excluded.
- Card, VNPAY, and alternate pay methods remain sandbox-only or future-ready placeholders.
- Return URL remains display-only.
- Production release gates, rollback policy, and incident severity ownership are defined in the Phase 0 artifact.

Blocked by:

- None. This phase can start immediately.

## Phase 1 — Data Contract And Schema Hardening

Target duration: 1-2 weeks.
Initial inventory artifact: `docs/operations/phase-1-contract-mutation-inventory-2026-04-28.md`.
Current status: started.

Goal:

Make core runtime data safe enough for production traffic and production audits.

Work:

- Finalize order, payment, payment event, settlement, dispute, support ticket, merchant store, menu, review, promotion, and actor profile contracts.
- Add idempotency keys to production-critical mutations.
- Ensure every production mutation records actor, actor type, timestamp, target entity, result, and failure reason where applicable.
- Verify customer, merchant, admin, and service-role RLS policies.
- Add indexes for order list, merchant order queue, admin order oversight, payment event lookup, and settlement review queries.
- Keep schema changes additive unless a separate destructive migration plan is approved.

Exit criteria:

- Additive migrations are reviewed.
- RLS verification queries pass.
- Production-critical mutations have audit coverage.
- No surface bypasses its ownership boundary.

Blocked by:

- Phase 0 release gate definitions.

Current result:

- Phase 1 contract and mutation inventory has been created from the source tree.
- Customer order creation and merchant order status update already have source-level idempotency paths.
- Shared order/payment contracts and RLS verification SQL have been added.
- Local Supabase RLS verification was run.
- An idempotent order RPC anon execute gap was found and fixed with `supabase/migrations/20260428100000_revoke_anon_execute_from_idempotent_order_rpcs.sql`.
- Remote Supabase migration history now matches local through the new anon execute revoke migration.
- Remote schema dump confirms the core RLS, merchant review/menu policies, storage policies, and idempotent order RPC grants.
- Local role-context negative tests pass for customer, merchant, and admin seeded users.
- Local Supabase Auth API E2E checks pass for customer, merchant, and admin seeded sessions.
- Local browser boundary E2E now passes for merchant store scoping, admin role scoping, and customer guest auth guards.
- The browser pass found and fixed an admin middleware placement issue that allowed a Support Admin session to open `/finance`; admin role route redirects now execute from `admin-console/src/middleware.ts`.
- The browser pass also enabled Flutter web semantics and fixed a customer home cart CTA overlap that could block the bottom Orders tab on small mobile browser viewports.
- Phase 1 audit-gap decisions are recorded in `docs/operations/phase-1-audit-gap-decisions-2026-04-28.md`; promotion, support, and review contracts now explicitly avoid overstating current mutation support.
- Local menu mutation negative/audit E2E now verifies merchant own-store access, unowned menu mutation denial, audit-log direct read denial, and service-path audit rows for menu create and availability update.
- Deployed frontend browser E2E harness is now recorded in `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`.
- Deployed public-website browser smoke passes for landing, service, merchant, support, download, privacy, terms, and refund-policy routes.
- Deployed customer-app guest entry and guest `/orders` auth guard now pass on the production alias after the deep-link preservation fix was deployed.
- Deployed merchant-console anonymous `/demo-store/orders` access redirects to login.
- Deployed admin-console anonymous `/orders` access redirects to login.
- GitHub Actions workflow `.github/workflows/phase1-deployed-boundary-e2e.yml` now provides a manual deployed E2E runner that can use Vercel automation bypass secrets and optional merchant/admin test credentials.
- A preflight environment validator now gates the deployed E2E runner so missing bypass secrets fail fast and skip-mode runs are explicitly non-release evidence.
- Vercel automation bypass has now been configured directly on the four deployed Vercel projects, and the GitHub repository secret has been synchronized to a shared bypass value.
- Merchant production project settings now declare `rootDirectory=merchant-console` with `sourceFilesOutsideRootDirectory=true`, closing the deployed build gap for repo-root shared imports.
- Merchant and admin production env vars have been realigned to the active Supabase project URL, anon key, and service-role key.
- A dedicated admin browser test account has been provisioned in the linked Supabase project, and merchant/admin browser test credentials are now wired into GitHub Actions secrets.
- Deployed merchant authenticated entry smoke now passes.
- Deployed admin authenticated entry smoke now passes.
- Deployed merchant authenticated read-only queue smoke now passes for `/demo-store/orders`.
- Deployed admin authenticated read-only dashboard smoke now passes for `/dashboard` after the role-boundary selection step.
- Deployed merchant authenticated queue smoke now also verifies table structure and row presence.
- Deployed admin authenticated dashboard smoke now also verifies support-role navigation filtering and recent-order row presence.
- Deployed merchant authenticated queue smoke now also verifies order-detail drawer visibility.
- Deployed admin authenticated smoke now also verifies support-role route-level redirect away from `/finance`.
- Deployed merchant authenticated queue smoke now also verifies tab switching across active, completed, and cancelled queues.
- Deployed admin authenticated support-role smoke now also verifies direct entry into `/orders` and `/customer-service`.
- Deployed admin authenticated finance-role smoke now verifies direct entry into `/settlements` and `/finance`, plus redirect away from `/marketing`.
- Deployed admin authenticated marketing-role smoke now verifies direct entry into `/marketing` and `/announcements`, plus redirect away from `/orders`.
- Deployed admin authenticated operations-role smoke now verifies direct entry into `/users` and `/disputes`, plus redirect away from `/finance`.
- Deployed admin authenticated role smoke now also verifies per-role nav visibility and suppression for support, finance, marketing, and operations scopes.
- Deployed admin authenticated platform-role smoke now verifies full-nav visibility plus direct entry into `/users`, `/finance`, `/marketing`, and `/system-management`.
- Deployed merchant authenticated store-scoped smoke now verifies full-nav visibility, direct entry into `/menu`, `/promotions`, `/settlement`, `/analytics`, and `/settings`, plus redirect away from a foreign `storeId`.
- Deployed merchant authenticated read-only smoke now also verifies dashboard queue rows and alerts, store operating-hours rows, and review-card presence.
- Deployed customer guest browse smoke now also verifies home discovery signals, store/menu route visibility, add-to-cart success, and cart summary CTA presence.
- Deployed customer guest checkout smoke now also verifies checkout route visibility, payment placeholders, order summary, and the place-order CTA.
- The deployed browser harness now supports customer authenticated session seeding through `CUSTOMER_AUTH_SESSION_JSON`, so `/#/orders` plus downstream order status/detail smoke can run as soon as a reproducible customer session fixture is available.
- The deployed browser harness now also supports customer password-grant auth fixtures through `CUSTOMER_E2E_EMAIL` and `CUSTOMER_E2E_PASSWORD`, reducing replay friction once a governed customer browser test user exists.
- A governed deployed customer browser fixture has now been provisioned, and the deployed customer authenticated smoke passes for session restore, `/#/orders`, order status, and order detail.
- A production customer-auth closure blocker was confirmed on 2026-04-29: the linked project still reports `phone=false`, email sign-up is rate-limited, and direct password grant against the seeded customer email accounts returns `500 unexpected_failure: Database error querying schema`.
- The deployed browser gate is now green on `main` through GitHub Actions run `25097914890`, which closes the full non-skip deployed boundary suite across public, customer, merchant, and admin surfaces.
- The deployed gate workflow now uses the Node 24-capable GitHub Actions majors directly and explicitly carries the governed customer fixture credentials through repo secrets.

## Phase 2 — Auth And Session Production Hardening

Target duration: 1-2 weeks.

Goal:

Make identity and access boundaries production-grade across all authenticated surfaces.

Work:

- Harden customer OAuth, phone auth, guest restrictions, onboarding gate, and address-required gate.
- Harden merchant login, onboarding, store selection, membership, and store-scoped routing.
- Harden admin login, role selection, permission gating, and denied-access routing.
- Define session expiry, refresh behavior, logout behavior, account recovery, and failed-auth copy for each surface.
- Add automated smoke coverage for role access and cross-surface leakage.

Exit criteria:

- Customer cannot access another customer order.
- Merchant cannot access another merchant store.
- Admin role restrictions are enforced by route and server access helpers.
- Guest checkout remains blocked.
- Auth failure states are visible and recoverable.

Blocked by:

- Phase 1 actor and permission contract clarity.

## Phase 3 — Customer Production Flow

Target duration: 2 weeks.

Goal:

Make the customer order journey production-coherent before live payment state transitions are enabled.

Work:

- Verify home, discovery, search, filter, store, menu, cart, checkout, order list, order detail, order status, reviews, profile, settings, addresses, and notifications against runtime truth.
- Separate production-safe runtime behavior from mock-backed display fixtures.
- Ensure cart totals, service fees, delivery fees, taxes, discounts, and minimum-order checks are server-validated.
- Preserve payment-method selection while keeping card/pay pending unless Phase 4 is approved.
- Decide whether group order remains visible, hidden, or limited to local-only preview for production.

Exit criteria:

- Signed-in customer happy path passes.
- Missing address, empty cart, store closed, unavailable item, subtotal below minimum, and guest checkout guard pass.
- Order identity remains continuous across checkout, order list, detail, and status.
- Payment placeholder language remains honest until Phase 4.

Blocked by:

- Phase 1 order/cart contract hardening.
- Phase 2 customer session hardening.

## Phase 4 — VNPAY Production Payment

Target duration: 2-3 weeks.

Goal:

Introduce live VNPAY payment verification only after governance explicitly approves payment verification.

Work:

- Replace sandbox credentials with production credentials in server-only environments.
- Keep VNPAY return handling display-only.
- Implement production IPN as the only payment-state transition owner.
- Validate checksum, terminal code, order identity, payment reference, amount, currency, response code, transaction status, and duplicate callback handling.
- Add idempotency so duplicate IPN callbacks cannot double-capture or corrupt payment state.
- Add pending timeout and manual reconciliation reporting.
- Keep refund, reversal, installment, settlement automation, and chargeback handling out of scope unless finance/legal approves a separate phase.

Exit criteria:

- VNPAY SIT scenarios pass.
- Duplicate IPN is harmless.
- Wrong checksum is rejected.
- Wrong amount is rejected.
- Late IPN is handled.
- Return URL never updates payment state.
- Payment state transitions are auditable.

Blocked by:

- VNPAY production contract and credentials.
- Binding guardrail revision that reintroduces payment verification.
- Finance/legal approval for live card/pay processing.

## Phase 5 — Merchant Operations Productionization

Target duration: 2 weeks.

Goal:

Make merchant-console safe for real store operations.

Work:

- Move order accept, reject, preparing, ready, delivered, and cancel actions through audited server mutations.
- Ensure order queue updates do not depend on hidden client-only state.
- Harden menu item create/edit/delete/availability/photo flows.
- Harden store profile, accepting-orders status, business hours, review response, promotion, settlement visibility, and settings flows.
- Add clear save failure and retry behavior.
- Keep merchant settlement as visibility unless payout-control scope is separately approved.

Exit criteria:

- Merchant actions are store-scoped and audited.
- Merchant cannot mutate another store.
- Failed saves preserve user input and explain next steps.
- Order state changes match the governed order state machine.

Blocked by:

- Phase 1 contracts.
- Phase 2 merchant access hardening.

## Phase 6 — Admin And Support Operations

Target duration: 2 weeks.

Goal:

Make admin-console useful and safe for production oversight without turning it into merchant self-service.

Work:

- Harden users, merchants, stores, orders, disputes, customer service, settlements, finance, marketing, announcements, catalog, B2B, analytics, reporting, and system management boundaries.
- Add confirmation and audit logs for governance-sensitive actions.
- Ensure finance and settlement screens distinguish read-only oversight, manual reconciliation, and approved mutations.
- Define support ticket lifecycle and dispute escalation ownership.
- Add permission-aware UI hints without relying on UI as the only enforcement layer.

Exit criteria:

- Admin role matrix passes.
- Governance-sensitive actions are audited.
- Support and dispute states are visible and operationally meaningful.
- Merchant store-ops workflows are not copied into admin ownership.

Blocked by:

- Phase 1 admin/support/dispute contracts.
- Phase 2 admin permission hardening.

## Phase 7 — Observability, Security, And Release Operations

Target duration: 1-2 weeks.

Goal:

Make failures observable, recoverable, and safe to operate.

Work:

- Add production logging for order creation, payment URL creation, IPN processing, merchant mutation, admin mutation, auth failure, and server function failure.
- Add alerting for payment failures, repeated IPN rejection, high order failure rate, auth outage, and Edge Function errors.
- Create incident runbook, deploy runbook, rollback runbook, and manual reconciliation runbook.
- Verify backup and restore path for Supabase.
- Audit secrets and environment parity across local, staging, and production.
- Define staging promotion flow and release approval path.

Exit criteria:

- Production incidents have named owners and escalation paths.
- Logs can trace one order from customer checkout through payment and merchant/admin visibility.
- Rollback is documented for UI deploys, Edge Functions, feature flags, and additive migrations.
- Backup restore proof exists.

Blocked by:

- Phase 4 payment shape for payment-specific alerts.
- Vercel and Supabase production access.

## Phase 8 — Device, Browser, And Store Release QA

Target duration: 1-2 weeks.

Goal:

Validate production behavior on real user environments.

Work:

- Run Flutter analyze, Flutter test, Flutter web build, iOS device QA, Android device QA, and browser QA.
- Run Next.js typecheck and build for merchant-console, admin-console, and public-website.
- Promote Playwright route-width QA to a release gate.
- Validate Chrome, Safari, mobile Safari, Android Chrome, tablet widths, and desktop widths.
- Prepare app store and Play Store assets if native app launch is in scope.
- Verify privacy labels, permissions, app links, OAuth redirects, production env vars, and legal pages.

Exit criteria:

- No critical visual overflow.
- No payment honesty regression.
- No broken production route.
- Store release artifacts are ready if mobile launch is approved.

Blocked by:

- Production build environments.
- App Store Connect and Google Play Console access if native store launch is included.

## Required Test Paths

Happy paths:

- Customer login -> address -> store -> cart -> checkout -> payment -> order status -> merchant accept -> admin observe.
- Merchant login -> select store -> accept order -> update preparation state -> verify admin order oversight.
- Admin login -> inspect merchant/store/order/payment/support state -> verify audit visibility.
- Public visitor -> landing -> service -> merchant -> support -> download -> legal pages.

Error paths:

- Expired customer session.
- Missing delivery address.
- Empty cart.
- Store closed.
- Unavailable menu item.
- Subtotal below minimum order.
- Payment launch failure.
- Wrong VNPAY checksum.
- Wrong VNPAY amount.
- Duplicate VNPAY IPN.
- Merchant mutation failure.
- Admin denied access.

Edge paths:

- Concurrent orders.
- Repeated checkout tap.
- Merchant changes menu during checkout.
- Long customer address.
- Long menu/store/legal text.
- Small mobile width.
- Tablet POS/operator width.
- Empty merchant order queue.
- Empty admin dispute/support queues.

Recovery paths:

- Pending payment timeout.
- Order created but IPN delayed.
- Supabase Edge Function failure.
- Vercel deploy rollback.
- Admin manual reconciliation export.
- Merchant save retry after network error.

Security paths:

- Customer attempts to read another customer's order.
- Merchant attempts to read or mutate another store.
- Admin role attempts a forbidden route.
- Forged payment callback.
- Service-role-only mutation attempted from client context.

## Required External Dependencies

Already verified locally on 2026-04-28:

- `flutter`
- `node`
- `npm`
- `npx`
- `gh`
- `vercel`
- `supabase`
- `deno`
- `playwright`

Already verified reachable on 2026-04-28:

- VNPAY sandbox payment host
- Current Supabase VNPAY return function

Required before production implementation:

- Supabase production project and admin access.
- Vercel team/project access for all web surfaces.
- VNPAY production merchant credentials.
- OAuth provider production apps for customer authentication.
- SMS/OTP production policy and quota.
- App Store Connect account if iOS release is in scope.
- Google Play Console account if Android release is in scope.

Required secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- server-only Supabase service role key for approved backend jobs
- VNPAY production `TMN_CODE`
- VNPAY production `HASH_SECRET`
- VNPAY production payment URL
- OAuth client IDs and secrets
- SMS/OTP provider credentials if production phone auth uses a third-party provider

## Rollback Policy

- UI-only changes: rollback by redeploying the previous Vercel/Flutter build.
- Edge Function changes: rollback by redeploying the previous function version and disabling the new feature flag.
- Additive migrations: do not drop columns or tables during incident response; disable new reads/writes through feature flags.
- Payment-state changes: never rewrite payment history; add compensating payment event records and manual reconciliation notes.
- Public legal copy: rollback by reverting the specific legal presentation files and redeploying public-website.

## Production Release Gates

Gate 1: Scope and guardrail approval.

- Phase 0 complete.
- Payment verification status explicitly approved or still excluded.

Gate 2: Runtime safety.

- Phase 1 and Phase 2 complete.
- RLS, auth, actor, and audit checks pass.

Gate 3: Customer order readiness.

- Phase 3 complete.
- Customer order journey passes happy, error, edge, and recovery paths.

Gate 4: Payment go-live readiness.

- Phase 4 complete.
- VNPAY SIT scenarios pass.
- Finance/legal approval recorded.

Gate 5: Operations readiness.

- Phase 5, Phase 6, and Phase 7 complete.
- Merchant/admin/support/finance workflows are auditable.

Gate 6: Release readiness.

- Phase 8 complete.
- Visual QA, build QA, device QA, legal QA, and rollback drill pass.

## Unknowns And Owners

- VNPAY production contract date: business/legal owner.
- Finance approval for refund, reversal, installment, and settlement automation: finance/legal owner.
- App Store and Play Store launch date: product owner.
- Production SMS/OTP quota and country policy: product/operations owner.
- Production support staffing and SLA: operations owner.

These unknowns do not block Phase 0 through Phase 3. They do block payment go-live, native app store launch, and production support SLA commitments.

## Recommended First Execution Slice

Run Phase 0 through Phase 3 as the first production-core slice.

Reason:

- It hardens the platform before money moves.
- It preserves current payment honesty while preparing the system for payment verification.
- It reduces the risk that VNPAY production work lands on top of weak auth, weak RLS, or unclear order contracts.

Execution progress:

- Phase 0 is complete as of 2026-04-28.
- Phase 1 contract and mutation inventory is started as of 2026-04-28.
- Shared contract reconciliation and RLS verification SQL are complete as source artifacts.
- Local RLS verification is complete and produced one additive permission migration.
- Remote schema verification is complete through Supabase schema dump inspection.
- Local role-boundary negative testing is complete.
- Local real-auth API E2E testing is complete.
- Deployed public-website route smoke and deployed admin anonymous guard smoke are complete.
- The next executable slice is keeping the green deployed boundary baseline current while trimming the remaining workflow maintenance noise, especially artifact retention and future smoke-runtime split decisions.

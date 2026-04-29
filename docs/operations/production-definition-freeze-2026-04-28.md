# Production Definition Freeze -- 2026-04-28

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: production-scope, release-gates, payment-governance, rollback, incidents
Last updated: 2026-04-29
Last verified: 2026-04-29

## Purpose

This document closes Phase 0 of the governed production roadmap. It defines what "production" means for Deliberry before additional hardening work begins. It does not revise the binding architecture guardrails and does not approve live payment verification.

## Source of Truth

- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`
- `docs/operations/showable-product-closure-plan-2026-04-28.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/vnpay-sandbox-readiness.md`

## Production Definition

Deliberry production means a public, customer-facing, merchant-operable, admin-governed service where order creation, order visibility, merchant operations, admin oversight, support, legal copy, auth/session boundaries, audit trails, deployment rollback, and incident response are ready for real users.

Production does not mean every roadmap item is live. Features explicitly excluded by guardrail remain excluded until the binding documents are revised.

## Current Payment Decision

Decision: live payment verification remains excluded.

Approved production payment behavior before a guardrail revision:

- Customer checkout keeps payment method selection.
- Cash or offline-style order placement may continue through the approved order-submission flow.
- Card, VNPAY, and alternate pay methods remain future-ready or sandbox-only.
- VNPAY sandbox URL creation may exist for test readiness when clearly labeled as sandbox/test.
- VNPAY return pages may display sandbox results.
- Payment state must remain `pending` for sandbox/card/pay flows.
- Return URL must never update payment state.
- IPN must not update live payment state until payment verification is reintroduced by governance.

Not approved:

- live VNPAY credentials in client code
- payment completion from Return URL
- payment completion from sandbox IPN
- refund, reversal, installment, chargeback, or settlement automation
- customer card data handling inside Deliberry
- any UI copy that implies card/pay settlement is live before finance/legal approval

Payment verification may only be reintroduced after all of the following are recorded:

- a revised binding payment guardrail
- signed VNPAY production contract or written provider approval
- finance/legal approval for live card/pay processing
- server-only production credential storage
- production IPN design with checksum, amount, currency, order identity, idempotency, and audit controls
- SIT result record for approved VNPAY scenarios

## Release Gates

### Gate 1 -- Scope And Guardrail Approval

Required evidence:

- this production definition freeze is active
- payment verification status is explicit
- release gates, rollback policy, and incident severity model are documented
- all work maps to the approved surface ownership model

Blocks:

- Phase 1 schema hardening cannot merge without Gate 1 evidence.
- Live payment work cannot start while payment verification remains excluded.

### Gate 2 -- Runtime Safety

Required evidence:

- order, payment-event placeholder, settlement, dispute, support ticket, merchant store, menu, review, promotion, and actor profile contracts are reviewed
- RLS verification queries pass for customer, merchant, admin, and service-role boundaries
- production-critical mutations record actor, actor type, timestamp, target entity, result, and failure reason where applicable
- idempotency exists for production-critical order/payment-state mutations that can be retried

Blocks:

- customer production flow hardening cannot be called production-ready without Gate 2 evidence.

### Gate 3 -- Customer Order Readiness

Required evidence:

- signed-in customer happy path passes from address to order status
- missing address, empty cart, store closed, unavailable item, subtotal below minimum, guest checkout guard, and payment launch failure are covered
- order identity remains continuous from checkout through order list, detail, and status
- card/pay language remains honest while payment verification is excluded

Blocks:

- payment go-live cannot start on top of an unverified order journey.

### Gate 4 -- Payment Go-Live Readiness

Required evidence:

- binding payment guardrail has been revised to permit payment verification
- production VNPAY credentials are stored server-side only
- Return URL remains display-only
- production IPN is the only payment-state transition owner
- wrong checksum, wrong amount, duplicate IPN, late IPN, and unknown order cases are rejected or safely reconciled
- payment state transitions are auditable
- finance/legal approval is recorded

Blocks:

- live card/pay release cannot proceed without Gate 4 evidence.

### Gate 5 -- Operations Readiness

Required evidence:

- merchant actions are store-scoped and audited
- admin governance actions are permission-aware and audited
- support and dispute lifecycles are documented and operationally meaningful
- finance and settlement screens distinguish read-only oversight from approved mutations
- logs can trace one order across customer, merchant, admin, and payment placeholder or payment event surfaces

Blocks:

- market launch cannot proceed without Gate 5 evidence.

### Gate 6 -- Release Readiness

Required evidence:

- `customer-app` passes `flutter analyze`, `flutter test`, and production build verification
- merchant, admin, and public web surfaces pass typecheck and build
- Playwright route-width QA passes as a release gate
- deployed boundary browser E2E passes on `main` against the protected production aliases with non-skip credentials and bypass secrets
- real device or browser QA covers small mobile, tablet, and desktop widths
- legal pages and payment copy remain honest
- rollback drill has been performed for UI deploy, Edge Function deploy, and additive migration disablement

Blocks:

- production launch announcement cannot proceed without Gate 6 evidence.

## Surface Release Requirements

### Customer App

Required before production launch:

- runtime source is explicit for mock, in-memory, and Supabase modes
- production launch cannot silently run on mock or in-memory data
- auth, onboarding, address, cart, checkout, orders, order detail, order status, reviews, profile, settings, and notifications are recoverable from failure states
- payment method selection is preserved, but card/pay remains pending until Gate 4

### Merchant Console

Required before production launch:

- production cannot silently fall back to demo-cookie auth
- every store operation is store-scoped
- order status mutation, menu mutation, store settings mutation, review response, promotion, settlement visibility, analytics, and settings flows either persist through approved runtime paths or clearly fail with retry-safe UI
- merchant settlement remains visibility-only unless a later finance phase approves payout controls

### Admin Console

Required before production launch:

- admin role and permission checks are enforced outside UI presentation
- platform governance routes stay separate from merchant self-service
- users, merchants, stores, orders, disputes, customer service, settlements, finance, marketing, announcements, catalog, B2B, analytics, reporting, and system management routes preserve audit boundaries
- governance-sensitive actions require confirmation and audit events

### Public Website

Required before production launch:

- public routes remain acquisition, support, legal, and download only
- legal copy does not claim live payment processing until Gate 4 is complete
- app download copy matches actual App Store, Play Store, or web availability
- merchant onboarding stays inquiry/acquisition and does not become authenticated console behavior

### Shared

Required before production launch:

- repo-level `shared` contains only contracts, DTOs, models, enums, constants, types, validation schemas, pure utilities, and docs
- no Flutter widgets, React components, router code, app state, runtime orchestration, or surface-specific workflows are introduced

### Supabase And Edge Functions

Required before production launch:

- RLS is enabled and verified for production-critical tables
- service-role use is limited to approved backend paths
- Edge Functions validate origin, method, input shape, auth/session context, and idempotency where relevant
- secrets are present only in deployment environments and are not committed
- migration strategy is additive unless a separate destructive migration approval exists

## Rollback Policy

### UI-Only Changes

Rollback action:

- redeploy the previous Vercel deployment for web surfaces
- redeploy the previous Flutter web/native build for customer-app

Data handling:

- no database rollback is required
- do not modify order, payment, settlement, support, or audit rows

### Additive Schema Changes

Rollback action:

- disable new reads and writes through feature flags or runtime configuration
- leave added columns, tables, policies, indexes, and functions in place during incident response
- apply a reviewed cleanup migration only after the incident is closed

Data handling:

- do not drop tables or columns during active rollback unless a separate destructive rollback approval exists

### Edge Function Changes

Rollback action:

- redeploy the previous function version
- disable new function callers through feature flags or endpoint configuration
- preserve request logs and response logs for investigation

Data handling:

- add compensating audit events for any partial business effect
- do not delete failed callback records needed for reconciliation

### Payment-State Changes

Rollback action:

- disable the payment feature flag
- stop accepting payment-state transitions from the new handler
- keep Return URL display-only
- route unresolved cases to manual reconciliation

Data handling:

- never rewrite payment history
- never delete payment events
- use compensating payment event records and reconciliation notes

### Public Legal Copy

Rollback action:

- revert the specific legal presentation files
- redeploy public-website

Data handling:

- no database rollback is required

## Incident Severity Model

### SEV-0 -- Critical Business Or Security Incident

Examples:

- unauthorized cross-customer order access
- merchant can access or mutate another merchant store
- admin permission bypass
- live payment state corruption
- committed secret in source control
- outage affecting order creation for all users

Initial owner:

- engineering lead

Required response:

- freeze deploys except emergency rollback
- preserve logs and evidence
- disable affected feature flags
- notify product, operations, finance/legal when payment or privacy is involved
- produce incident record before resuming normal releases

### SEV-1 -- Major Production Degradation

Examples:

- high order creation failure rate
- merchant order queue unavailable
- admin oversight unavailable during active operations
- repeated payment sandbox or future production payment launch failures
- Supabase Edge Function elevated error rate

Initial owner:

- surface owner for the failing surface, with engineering lead escalation

Required response:

- triage within the active operations window
- rollback the last related deploy when correlation is clear
- add incident notes and follow-up action items

### SEV-2 -- Localized User-Visible Failure

Examples:

- one route or screen broken
- recoverable checkout validation bug
- incorrect empty state or non-critical copy regression
- localized browser visual overflow that does not block ordering

Initial owner:

- surface owner

Required response:

- patch in the next normal release or hotfix when it blocks a demo or real user action
- add regression coverage when the failure can recur

### SEV-3 -- Non-Blocking Quality Issue

Examples:

- minor copy inconsistency
- low-risk visual polish defect
- documentation mismatch that does not affect runtime behavior

Initial owner:

- owning surface or documentation owner

Required response:

- track in the next planned cleanup slice
- do not block production unless the issue affects legal or payment honesty

## Phase 0 Exit Criteria

Phase 0 is complete when:

- production scope is documented
- payment verification remains explicitly excluded until guardrails are revised
- release gate checklist exists
- rollback policy exists
- production severity levels and incident ownership exist
- the production roadmap points to this document as the Phase 0 artifact

## Next Execution Slice

Proceed to Phase 1: Data Contract And Schema Hardening.

The first Phase 1 work item is a contract and mutation inventory, not a schema change. The inventory must identify the current order, payment placeholder/event, settlement, dispute, support ticket, merchant store, menu, review, promotion, and actor profile runtime paths before any migration is written.

# Release Gate Checklist -- 2026-04-29

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: release-gates, launch-readiness, qa-evidence, rollback
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This checklist turns Gate 1 through Gate 6 into a single execution artifact for release readiness.

It is not a scope document. It is a release-evidence document.

## Source Of Truth

- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- `docs/operations/phase-1-route-width-qa-2026-04-29.md`
- `docs/operations/phase-1-target-browser-qa-2026-05-04.md`
- `docs/operations/phase-1-deployed-browser-e2e-secret-checklist-2026-04-28.md`
- `docs/operations/rollback-drill-prep-2026-04-29.md`
- `docs/operations/rollback-drill-evidence-2026-05-04.md`
- `docs/operations/edge-function-rollback-evidence-2026-05-04.md`
- `docs/operations/additive-migration-disablement-evidence-2026-05-04.md`
- `docs/operations/gate2-remote-audit-and-device-qa-blockers-2026-05-04.md`
- `docs/operations/phase-1-remote-production-audit-evidence-2026-05-04.md`
- `docs/operations/phase-1-merchant-audited-mutation-evidence-2026-05-04.md`
- `docs/operations/phase-1-merchant-review-response-audit-evidence-2026-05-04.md`
- `docs/operations/phase-1-admin-dispute-audit-evidence-2026-05-04.md`
- `docs/operations/phase-1-admin-support-audit-evidence-2026-05-04.md`
- `docs/operations/phase-1-admin-settlement-audit-evidence-2026-05-04.md`
- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- `docs/operations/payment-event-persistence-design-2026-05-04.md`
- `docs/operations/payment-guardrail-revision-draft-2026-05-04.md`
- `docs/operations/payment-server-side-credentials-plan-2026-05-04.md`
- `docs/operations/payment-finance-legal-approval-record-template-2026-05-04.md`
- `docs/operations/payment-vnpay-sit-evidence-template-2026-05-04.md`
- `docs/operations/payment-production-rollout-checklist-2026-05-04.md`
- `docs/operations/physical-target-device-qa-execution-plan-2026-05-04.md`
- `docs/operations/physical-target-device-qa-evidence-template-2026-05-04.md`
- `docs/06-guardrails.md`

## Current Baseline

- Latest green deployed browser release-evidence run:
  `GitHub Actions / Phase 1 Deployed Boundary E2E / 25097914890`
- Baseline commit:
  `79e2e09d5ecfdce5d3d28f001c80158576335196`
- Baseline mode:
  non-skip, protected Vercel aliases, authenticated customer/merchant/admin fixtures enabled

## Gate Status

### Gate 1 -- Scope And Guardrail Approval

- [x] Production definition freeze exists.
- [x] Payment verification remains explicitly excluded.
- [x] Release gates, rollback policy, and incident severity model are documented.
- [x] Surface ownership model remains explicit.

### Gate 2 -- Runtime Safety

- [x] Phase 1 contract and mutation inventory exists.
- [x] RLS verification queries exist and have been run locally.
- [x] Production-critical mutation audit/idempotency paths are inventoried.
- [x] Remote production-grade audit coverage is complete for the governed Phase 1 auth and menu mutation paths.

### Gate 3 -- Customer Order Readiness

- [x] Deployed guest browse path is covered through home, store, menu, cart, and checkout.
- [x] Guest access to protected orders is blocked by auth boundary.
- [x] Authenticated customer orders, status, and detail smoke are covered with a governed fixture.
- [x] Governed target-browser QA covers customer mobile, tablet, and desktop widths.
- [ ] Physical target-device QA is complete across supported form factors.

### Gate 4 -- Payment Go-Live Readiness

- Guardrail reference: `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- Design reference: `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- Persistence reference: `docs/operations/payment-event-persistence-design-2026-05-04.md`
- Revision draft reference: `docs/operations/payment-guardrail-revision-draft-2026-05-04.md`
- Credential storage reference: `docs/operations/payment-server-side-credentials-plan-2026-05-04.md`
- Approval record template: `docs/operations/payment-finance-legal-approval-record-template-2026-05-04.md`
- SIT evidence template: `docs/operations/payment-vnpay-sit-evidence-template-2026-05-04.md`
- Rollout checklist: `docs/operations/payment-production-rollout-checklist-2026-05-04.md`
- Sandbox guardrail smoke evidence: `docs/operations/vnpay-sandbox-guardrail-smoke-2026-05-04.md`
- Sandbox guardrail re-run artifact: `output/vnpay-guardrail-smoke/phase1-vnpay-guardrail-smoke-2026-05-04T05-56-17.237Z/summary.json`
- [ ] Binding payment guardrail is revised to allow live verification.
- [ ] Production VNPAY credentials are stored server-side only.
- [ ] IPN-owned payment-state transition design is approved and implemented.
- [ ] Finance/legal approval for live payment is recorded.
- [x] Sandbox callback guardrails now fail closed on reference, amount, currency, and duplicate replay before any live payment go-live work.

### Gate 5 -- Operations Readiness

- [x] Merchant authenticated read-only store-scoped smoke passes.
- [x] Admin authenticated role-boundary smoke passes.
- [x] Public, customer, merchant, and admin routes are covered by deployed browser evidence.
- [x] Merchant audited mutation evidence is attached for order status, store settings, and store profile.
- [x] Merchant review response audited mutation evidence is attached.
- [x] Admin dispute audited mutation evidence is attached for governed status transitions.
- [x] Admin customer-service audited mutation evidence is attached for governed status transitions.
- [x] Audited mutation workflows for the approved support, settlement, and governance-sensitive Phase 1 actions are closed for production.

### Gate 6 -- Release Readiness

- [x] Deployed boundary browser E2E passes on `main` in non-skip mode.
- [x] Protected production aliases are reachable through governed bypass automation.
- [x] Customer, merchant, and admin browser fixtures are wired through repo secrets.
- [x] Release-evidence artifact path is captured in workflow output.
- [x] Route-width QA passes on `main` against the governed deployed aliases.
- [x] Governed target-browser QA evidence is attached across supported mobile, tablet, and desktop browser widths.
- Physical device plan: `docs/operations/physical-target-device-qa-execution-plan-2026-05-04.md`
- Physical device evidence template: `docs/operations/physical-target-device-qa-evidence-template-2026-05-04.md`
- [ ] Physical target-device QA is complete across supported mobile, tablet, and desktop devices.
- [x] Rollback evidence is fully attached across UI deploy, Edge Function deploy, and additive migration disablement.

Current Gate 6 route-width evidence:

- route-width green baseline: `GitHub Actions / Phase 1 Route Width QA / 25296145098`
- merchant shell-overflow fix verified on `merchant-console-six.vercel.app`
- latest route-width closure details are recorded in `docs/operations/phase-1-route-width-qa-2026-04-29.md`
- target-browser screenshot evidence is recorded in `docs/operations/phase-1-target-browser-qa-2026-05-04.md`

Rollback readiness note:

- candidate inventory and official rollback command paths are now recorded in `docs/operations/rollback-drill-prep-2026-04-29.md`
- governed UI rollback evidence is now recorded in `docs/operations/rollback-drill-evidence-2026-05-04.md`
- governed Edge Function rollback evidence is now recorded in `docs/operations/edge-function-rollback-evidence-2026-05-04.md`
- additive migration disablement evidence is now recorded in `docs/operations/additive-migration-disablement-evidence-2026-05-04.md`
- rollback evidence is now closed across UI deploy, Edge Function deploy, and additive migration disablement

Remaining blocker note:

- `docs/operations/gate2-remote-audit-and-device-qa-blockers-2026-05-04.md` records the current machine-level blocker state that led to the remote-audit workflow follow-through
- `docs/operations/phase-1-remote-production-audit-evidence-2026-05-04.md` records the now-closed Gate 2 remote runtime audit evidence
- `docs/operations/phase-1-merchant-audited-mutation-evidence-2026-05-04.md` records the now-closed merchant-side audited mutation evidence and the narrower remaining Gate 5 blockers
- `docs/operations/phase-1-merchant-review-response-audit-evidence-2026-05-04.md` records the now-closed merchant review-response audit evidence
- `docs/operations/phase-1-admin-dispute-audit-evidence-2026-05-04.md` records the now-closed governed admin dispute status-transition slice
- `docs/operations/phase-1-admin-support-audit-evidence-2026-05-04.md` records the now-closed governed admin support status-transition slice
- `docs/operations/phase-1-admin-settlement-audit-evidence-2026-05-04.md` records the now-closed governed admin settlement acknowledgment slice for the approved `calculated -> received` path

## Immediate Follow-Through

1. Keep `25097914890` as the current green deployed baseline until a newer non-skip run supersedes it.
2. Re-run the deployed boundary workflow after any material auth, routing, or checkout-shell UI change.
3. Track workflow hygiene separately:
   - artifact retention policy
   - optional split of long customer smoke sections if runtime grows

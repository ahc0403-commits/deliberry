# Release Gate Checklist -- 2026-04-29

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: release-gates, launch-readiness, qa-evidence, rollback
Last updated: 2026-04-29
Last verified: 2026-04-29

## Purpose

This checklist turns Gate 1 through Gate 6 into a single execution artifact for release readiness.

It is not a scope document. It is a release-evidence document.

## Source Of Truth

- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- `docs/operations/phase-1-deployed-browser-e2e-secret-checklist-2026-04-28.md`
- `docs/06-guardrails.md`

## Current Baseline

- Latest green deployed browser release-evidence run:
  `GitHub Actions / Phase 1 Deployed Boundary E2E / 25096403811`
- Baseline commit:
  `ca4ce4b440b0401eea74b2b4a7f5026cdd9471d5`
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
- [ ] Remote production-grade audit coverage is complete for all governed mutations.

### Gate 3 -- Customer Order Readiness

- [x] Deployed guest browse path is covered through home, store, menu, cart, and checkout.
- [x] Guest access to protected orders is blocked by auth boundary.
- [x] Authenticated customer orders, status, and detail smoke are covered with a governed fixture.
- [ ] Real device/browser width QA is complete across supported form factors.

### Gate 4 -- Payment Go-Live Readiness

- [ ] Binding payment guardrail is revised to allow live verification.
- [ ] Production VNPAY credentials are stored server-side only.
- [ ] IPN-owned payment-state transition design is approved and implemented.
- [ ] Finance/legal approval for live payment is recorded.

### Gate 5 -- Operations Readiness

- [x] Merchant authenticated read-only store-scoped smoke passes.
- [x] Admin authenticated role-boundary smoke passes.
- [x] Public, customer, merchant, and admin routes are covered by deployed browser evidence.
- [ ] Audited mutation workflows for support, finance, and governance-sensitive actions are fully closed for production.

### Gate 6 -- Release Readiness

- [x] Deployed boundary browser E2E passes on `main` in non-skip mode.
- [x] Protected production aliases are reachable through governed bypass automation.
- [x] Customer, merchant, and admin browser fixtures are wired through repo secrets.
- [x] Release-evidence artifact path is captured in workflow output.
- [ ] Route-width QA and device QA are complete on real target devices/browsers.
- [ ] Rollback drill evidence is attached.

## Immediate Follow-Through

1. Keep `25096403811` as the current green deployed baseline until a newer non-skip run supersedes it.
2. Re-run the deployed boundary workflow after any material auth, routing, or checkout-shell UI change.
3. Track workflow hygiene separately:
   - action version upgrades
   - artifact retention policy
   - optional split of long customer smoke sections if runtime grows

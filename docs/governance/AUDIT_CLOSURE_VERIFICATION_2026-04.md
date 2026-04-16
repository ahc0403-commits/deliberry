# Audit Closure Verification -- 2026-04

Status: Active
Owner: governance remediation track
Last updated: 2026-04-15

## Purpose

This note records the closing re-audit for the April 2026 remediation batches. It distinguishes what is now resolved, what remains intentionally open, and what is historical-only.

## Re-Audit Summary

### 1. Public auth ownership

Status: resolved as documented temporary exception

Evidence:
- `public-website/src/app/customer-zalo-auth-exchange/route.ts`
- `docs/08-auth-session-strategy.md`
- `docs/governance/STRUCTURE.md`
- `docs/governance/exceptions/2026-04-15-R-001-R-073-public-auth-exchange.md`

Closing note:
- The contradiction is no longer undocumented.
- The public route still exists, but it is now explicitly governed as a temporary exception rather than hidden drift.

### 2. Admin identity alignment

Status: resolved to one canonical runtime model

Evidence:
- `docs/governance/IDENTITY.md`
- `docs/governance/ADMIN_IDENTITY_RECONCILIATION_2026-04.md`
- `shared/constants/domain.constants.ts`
- `admin-console/src/shared/auth/admin-session.ts`
- `supabase/migrations/20260317150000_phase_1_runtime_foundation.sql`

Closing note:
- Canonical runtime identity is now documented as `actor_type = admin` plus `role in PERMISSION_ROLES`.
- Schema, runtime code, and reconciliation docs all point to the same model.

### 3. Merchant and customer currency writes

Status: resolved for governed write paths audited in this remediation

Evidence:
- `merchant-console/src/shared/data/external-sales-service.ts`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `docs/governance/CURRENCY_POLICY_CLARIFICATION_2026-04.md`
- `scripts/check-governed-currency-literals.sh`

Closing note:
- Merchant governed writes no longer persist `VND`.
- Customer order creation no longer defaults to `USD`.
- `scripts/check-governed-currency-literals.sh` passes on the current repo state.

### 4. Audit coverage claims

Status: partially resolved, with declared residual gaps

Evidence:
- `docs/governance/AUDIT_MUTATION_INVENTORY_2026-04.md`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `admin-console/src/app/(platform)/system-management/page.tsx`

Closing note:
- Critical order-create audit coverage is now present.
- Admin has a supported read-only audit visibility path.
- The inventory explicitly records remaining `neither` and `hardened but not audited` classes, so the gap is now governed rather than hidden.

## Remaining Intentional Open Items

- The public auth exchange remains a temporary exception rather than a structural relocation.
- Some governed resource classes still have no runtime mutation path and therefore remain `neither` in the audit inventory.
- User-profile preference persistence is still hardened but not audited.
- Historical and archived governance docs may still mention older `VND` or excluded-feature language as past-state evidence.
- Flutter-specific runtime verification for the wording cleanup was not run in this closure pass.

## Reopened Findings After Closure

The original closure pass did not capture two follow-up contradictions discovered during re-verification.

See `docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md`.

### 1. Order idempotency

Status: resolved in source

Note:
- `docs/governance/FLOW.md` still requires `idempotency_key` for all order mutations.
- source now implements that contract in customer order create and merchant order-status update paths.
- local duplicate-replay verification on 2026-04-16 confirmed one order row, one audit row, and one completed idempotency row per repeated key.
- remote duplicate-replay verification on 2026-04-16 confirmed the same behavior on the linked Supabase project after migration `20260415173000` was applied.

### 2. Domain mapping matrix maturity drift

Status: resolved in docs

Note:
- `docs/governance/DOMAIN_MAPPING_MATRIX.md` no longer understates runtime maturity in the rows that triggered the reopened finding.
- closure and verdict docs now reference the reconciled matrix state.

## Later Re-Audit Findings After Follow-Up Closure

The later 2026-04-16 re-audit identified three additional contradictions.

Current state:

- one documentation contradiction is now resolved
- two higher-risk follow-up tracks remain open with decision gates closed and implementation or doc reconciliation still pending

See:

- `docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md`
- `docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md`
- `docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md`
- `docs/governance/MERCHANT_CANCELLATION_DECISION_2026-04.md`
- `docs/governance/ADMIN_GOVERNANCE_SCOPE_DECISION_2026-04.md`
- `docs/governance/REAUDIT_REMEDIATION_PLAN_2026-04-16.md`
- `docs/governance/REAUDIT_REMEDIATION_CHECKLIST_2026-04-16.md`

## Closure Verdict

The April 2026 remediation effort is closed for Tracks A through F and the reopened follow-up track is now resolved in source and docs.

The highest-risk findings from the original audit are no longer active undocumented contradictions. The current state is now:

- formal exceptions,
- declared residual gaps with inventory evidence,
- historical records outside the live runtime path,
- one implemented follow-up idempotency track with local and remote replay verification completed.

That closure statement does not include the later 2026-04-16 re-audit set.

Within that set:

- the runtime-truth review-persistence contradiction is now closed in docs
- the merchant cancellation alignment track is implemented in source and verified in both local and linked remote environments for `confirmed -> cancelled` and `preparing -> cancelled`
- the admin governance capability track is reconciled in binding and supporting docs as deferred current scope

# Full-Project Audit Verdict — 2026-04-08 (Updated 2026-04-15)

**Original verdict: PARTIAL**
**Current verdict: STRUCTURALLY COMPLETE / PRE-QA READY / GOVERNANCE REMEDIATION CLOSED IN SOURCE**

All source remediations are complete and production-applied. Remaining blockers are operator confirmation (secret rotation) and human E2E QA before real-user rollout.

## Summary

- Architecture consistency: PASS (5-surface separation intact, shared contract-only, auth isolated per surface)
- Customer security hardening: PASS in source + **PRODUCTION APPLIED** (Q1–Q6 all passed 2026-04-11)
- Documentation alignment: PASS in source (reopened governance contradictions reconciled in source/docs)
- VN proxy cutover: PASS (Cloudflare Tunnel at proxy.deli-berry.com)
- Production apply status: **DONE** — migrations 20260408113000, 20260408140000, 20260408160000 applied; Supabase verification queries Q1–Q6 passed
- Public-website CORS: **LIVE VERIFIED** — GET→400 JSON, OPTIONS allowed→200 specific ACAO, OPTIONS disallowed→403
- Legacy Supabase edge function: **DELETED** — returns 404 NOT_FOUND
- Merchant/admin security: FIXED in source + production-applied (migration `20260408140000` — all RPCs use `auth.uid()`, KPI authorized, old signatures dropped)
- Deterministic password bridge: FIXED in source (commit `4e69adc` — admin generateLink + OTP verify replaces deterministicPasswordFor)
- Settlement edge functions: FIXED in source (admin check uses `app_metadata` only, CORS restricted to admin origins) — **redeploy to Supabase still required**
- Client-side auth storage: FIXED in source (commit `7fb8181` — flutter_secure_storage replaces SharedPreferences)
- Customer ordering closure: CLOSED in source (commit `02898ad` — priorities 1–3 complete)
- macOS local blockers: FIXED — deep link callback handling, secure storage behavior, layout issues resolved in source
- April governance remediation: CLOSED in source/docs (`AUDIT_REMEDIATION_*` batches 0–6 completed, reopened follow-up track resolved)

## Remaining Before Real-User Rollout

1. ⚠️ **Secret rotation** — Hyochang must confirm VN proxy shared secret + Vercel CLI token were rotated
2. ⚠️ **Settlement edge function redeploy** — `supabase functions deploy trigger-settlement generate-settlement`
3. ⬜ **Human E2E QA** — Zalo login → address gate → order creation flow, manual acceptance test
4. ⬜ **Second audit before payment integration** — when payment gateway work begins

## Governance Closure Snapshot (2026-04-15)

- public auth ownership contradiction is now a formal temporary exception, not hidden drift
- admin identity is reconciled to `actor_type = admin` plus `role`
- merchant/customer governed currency writes now follow the approved ARS-first rule
- audit coverage now has inventory evidence plus critical-path order-create coverage
- customer/merchant/admin/public runtime-truth and README drift found by the audit has been reconciled
- excluded-feature wording leakage was cleaned up on high-visibility surfaces

Remaining intentional residuals:
- the public auth bridge is still an exception, not a relocation
- some governed entity classes remain inventory-tracked rather than fully audited
- human E2E QA and operator rollout confirmations still sit outside this source-only closure pass

## Reopened Governance Follow-Up Snapshot (2026-04-15)

- order mutation idempotency is now implemented for customer order create and merchant order-status update
- `DOMAIN_MAPPING_MATRIX.md` now reflects the post-remediation runtime maturity that triggered the follow-up finding
- local replay verification on 2026-04-16 confirmed duplicate customer-create and merchant-status requests do not duplicate order or audit rows
- remote replay verification on 2026-04-16 confirmed the same duplicate-protection behavior on the linked Supabase project
- the reopened follow-up items are resolved in source/docs and verified on the linked remote project

## Later Re-Audit Snapshot (2026-04-16)

- merchant cancellation runtime is widened in source to match the binding merchant flow
- admin order/dispute governance authority is now explicitly deferred in binding docs rather than overstated as live admin-console capability
- `customer-orders-truth.md` review-persistence drift is now corrected in docs
- merchant cancellation direction is fixed to runtime widening, implemented in source, and replay-verified in both local and linked remote environments
- admin governance direction is fixed to deferred-scope doc reconciliation and implemented in docs
- see:
  - `docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md`
  - `docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md`
  - `docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md`
  - `docs/governance/MERCHANT_CANCELLATION_DECISION_2026-04.md`
  - `docs/governance/ADMIN_GOVERNANCE_SCOPE_DECISION_2026-04.md`
  - `docs/governance/REAUDIT_REMEDIATION_PLAN_2026-04-16.md`
  - `docs/governance/REAUDIT_REMEDIATION_CHECKLIST_2026-04-16.md`

## Blocking Execution Order

See `Obsidian Operations/09-FULL-PROJECT-AUDIT-2026-04-08.md` for the full audit report.
See `docs/security-remediation-rollout-checklist-2026-04-08.md` for the operational rollout checklist.

## Source Artifacts

- Security audit: `docs/customer-flow-security-audit-2026-04-08.md`
- Remediation checklist: `docs/security-remediation-rollout-checklist-2026-04-08.md`
- Customer security hardening migration: `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- Full audit: `Obsidian Operations/09-FULL-PROJECT-AUDIT-2026-04-08.md`
- Governance remediation closure: `docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md`
- Reopened findings addendum: `docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md`
- Idempotency implementation design: `docs/governance/ORDER_IDEMPOTENCY_IMPLEMENTATION_DESIGN_2026-04.md`

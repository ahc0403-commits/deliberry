# Payment Production Rollout Checklist -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: payment, rollout, vnpay, gate-4, operations, release
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This checklist turns the Gate 4 payment design and governance documents into an execution sequence for a future VNPAY production rollout.

It is not a go-live approval by itself. It is the ordered operator checklist that must be walked before Deliberry can claim live payment readiness.

## Source Of Truth

- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- `docs/operations/payment-event-persistence-design-2026-05-04.md`
- `docs/operations/payment-guardrail-revision-draft-2026-05-04.md`
- `docs/operations/payment-server-side-credentials-plan-2026-05-04.md`
- `docs/operations/payment-finance-legal-approval-record-template-2026-05-04.md`
- `docs/operations/payment-vnpay-sit-evidence-template-2026-05-04.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`

## Rollout Rule

Do not skip ahead in this checklist.

If any checkpoint is blocked, VNPAY remains sandbox-only or placeholder-only and Gate 4 stays open.

## Phase A — Governance Opening

- [ ] Confirm the current binding rule still blocks live payment in `docs/06-guardrails.md`.
- [ ] Review [payment-guardrail-revision-draft-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-guardrail-revision-draft-2026-05-04.md).
- [ ] Confirm business/legal owner and engineering owner for the revision decision.
- [ ] Confirm the approved live path still matches:
  - [payment-go-live-guardrail-record-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-go-live-guardrail-record-2026-05-04.md)
  - [payment-ipn-owned-state-transition-design-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md)
  - [payment-event-persistence-design-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-event-persistence-design-2026-05-04.md)
- [ ] If accepted, update the binding docs and move the revision draft into an active recorded decision.

## Phase B — Credential Readiness

- [ ] Prepare production `VNPAY_TMN_CODE`.
- [ ] Prepare production `VNPAY_HASH_SECRET`.
- [ ] Prepare production `VNPAY_RETURN_URL`.
- [ ] Prepare production payment endpoint configuration.
- [ ] Confirm all production values will live only in server-side secret storage per [payment-server-side-credentials-plan-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-server-side-credentials-plan-2026-05-04.md).
- [ ] Confirm sandbox and production credentials are separated.
- [ ] Confirm rotation path exists and does not require client rebuilds.
- [ ] Confirm no client bundle or tracked env file contains production payment secrets.

## Phase C — Runtime Design Closure

- [ ] Confirm Return URL remains display-only.
- [ ] Confirm IPN remains the only payment-state transition owner.
- [ ] Confirm payment event persistence shape is finalized.
- [ ] Confirm duplicate callback idempotency boundary is finalized.
- [ ] Confirm unknown order / wrong amount / wrong currency / late callback handling is finalized.
- [ ] Confirm rollback path disables the mutator before any data rewrite.
- [ ] Confirm manual reconciliation read surface is defined for unresolved cases.

## Phase D — Finance And Legal Approval

- [ ] Create a filled approval artifact from [payment-finance-legal-approval-record-template-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-finance-legal-approval-record-template-2026-05-04.md).
- [ ] Record named finance owner.
- [ ] Record named legal owner.
- [ ] Record approved payment scope.
- [ ] Reconfirm explicit remaining exclusions.
- [ ] Record any conditions or blockers that are accepted for the rollout scope.

## Phase E — SIT Execution

- [ ] Create a filled SIT artifact from [payment-vnpay-sit-evidence-template-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-vnpay-sit-evidence-template-2026-05-04.md).
- [ ] Execute happy-path payment acceptance.
- [ ] Execute duplicate IPN replay.
- [ ] Execute wrong checksum rejection.
- [ ] Execute wrong amount rejection or manual reconciliation.
- [ ] Execute wrong currency rejection if applicable.
- [ ] Execute unknown-order handling.
- [ ] Execute late-IPN handling.
- [ ] Execute already-finalized payment-state handling.
- [ ] Attach payment event persistence evidence.
- [ ] Attach audit evidence.
- [ ] Confirm Return URL remained display-only in all relevant cases.

## Phase F — Release-Gate Closure

- [ ] Update [release-gate-checklist-2026-04-29.md](/Users/andremacmini/Deliberry/docs/operations/release-gate-checklist-2026-04-29.md) with completed Gate 4 evidence.
- [ ] Update [production-roadmap-2026-04-28.md](/Users/andremacmini/Deliberry/docs/operations/production-roadmap-2026-04-28.md) with final Gate 4 closure status.
- [ ] Reconfirm legal/public copy does not over-claim any excluded behavior.
- [ ] Reconfirm rollback evidence is still valid for the live payment path.
- [ ] Re-run governed browser and runtime release checks after the live payment rollout candidate is deployed.

## Stop Conditions

Stop the rollout immediately if any of the following occurs:

- Return URL is observed mutating payment state
- production secrets appear in client bundles, logs, or tracked files
- duplicate IPN mutates payment state twice
- payment events are not durable or not replay-safe
- finance/legal approval is missing or conditional items are not explicitly accepted

## Final Closure Rule

Gate 4 may be marked complete only when all of the following are true:

- binding guardrail revision is active
- production credentials are server-side only
- IPN-owned payment-state transition design is implemented and verified
- finance/legal approval is recorded
- SIT evidence is recorded

If any one of those remains open, live payment remains out of scope.

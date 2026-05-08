# Phase 1 Admin Settlement Audit Evidence -- 2026-05-04

Status: active
Authority: operational
Surface: admin-console, supabase
Domains: settlement, finance, audit, mutations, release-readiness
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the governed Phase 1 evidence for the narrow admin settlement mutation path that was approved for production hardening.

The approved scope is intentionally small:

- `calculated -> received` only
- admin-only
- `finance_admin` and `platform_admin` only
- audited and idempotent

This evidence does not approve payout execution, refunds, reversals, chargebacks, payment verification, or broader finance lifecycle control.

## Source Of Truth

- `docs/06-guardrails.md`
- `docs/operations/phase-1-audit-gap-decisions-2026-04-28.md`
- `docs/operations/phase-1-contract-mutation-inventory-2026-04-28.md`
- `shared/api/settlement.contract.json`
- `supabase/migrations/20260504130000_add_admin_settlement_receipt_audit_rpc.sql`
- `admin-console/src/features/settlements/server/settlement-actions.ts`

## Governed Runtime Path

- Admin server action:
  `admin-console/src/features/settlements/server/settlement-actions.ts`
- RPC:
  `public.acknowledge_settlement_received_with_audit(p_settlement_id uuid)`
- Remote verification runner:
  `docs/operations/phase-1-admin-settlement-audit-e2e-2026-05-04.mjs`

The mutation path updates `delivery_settlements.status` from `calculated` to `received`, sets `received_at` when missing, and appends an immutable `audit_logs` row with `action = admin_settlement_received_acknowledged`.

## Remote Target

- Linked Supabase project: `gjcwxsezrovxcrpdnazc`
- Migration applied through:
  `supabase db push --linked`

## Evidence Artifact

- Summary artifact:
  `output/admin-settlement-audit/phase1-admin-settlement-audit-2026-05-04T03-20-13-761Z/summary.json`

## Verified Behaviors

- `finance_admin` can acknowledge a `calculated` settlement as `received`.
- The first acknowledgment writes exactly one settlement audit row.
- The audit row captures `before_state.status = calculated` and `after_state.status = received`.
- Replaying the same acknowledgment payload succeeds without creating a duplicate audit row.
- `platform_admin` can also acknowledge a separate `calculated` settlement.
- A `pending` settlement cannot be acknowledged as `received`.
- `support_admin` cannot acknowledge settlements.
- `marketing_admin` cannot acknowledge settlements.
- A non-admin actor cannot acknowledge settlements.

## Production Claim Allowed Now

The admin settlement route may now be described as:

- runtime-backed settlement visibility
- plus a limited audited manual acknowledgment path for marking a `calculated` settlement as `received`

It must not be described as:

- payout execution
- payment reconciliation automation
- refund handling
- payment verification
- broader finance control

## Remaining Out Of Scope

- `pending -> calculated`
- `received -> adjusted`
- any disputed settlement mutation
- settlement creation or deletion
- payout initiation or completion
- refund, reversal, chargeback, or payment-state mutation

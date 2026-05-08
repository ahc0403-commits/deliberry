# Phase 1 Admin Dispute Audit Evidence -- 2026-05-04

Status: active  
Authority: operational  
Surface: admin-console, supabase  
Domains: release-gates, disputes, audit, idempotency  
Last updated: 2026-05-04  
Last verified: 2026-05-04

## Purpose

Record the governed remote evidence that closes the approved Phase 1 admin dispute status-transition slice inside Gate 5.

## Scope

This evidence covers only the approved admin dispute lifecycle subset:

- `open -> investigating`
- `open -> escalated`
- `investigating -> escalated`
- `investigating -> resolved`
- `escalated -> resolved`

It does not approve:

- dispute assignment
- dispute reopen
- refund or settlement-side dispute control
- support ticket lifecycle writes

## Runtime Path

- Surface action: `admin-console/src/features/disputes/server/dispute-actions.ts`
- UI action cell: `admin-console/src/features/disputes/presentation/dispute-action-cell.tsx`
- Audited RPC migration: `supabase/migrations/20260504113000_add_admin_dispute_audit_rpc.sql`
- Remote runner: `docs/operations/phase-1-admin-dispute-audit-e2e-2026-05-04.mjs`

## Remote Target

- Linked Supabase project: `gjcwxsezrovxcrpdnazc`

## Execution Result

Local remote execution succeeded on 2026-05-04.

Artifact:

- `output/admin-dispute-audit/phase1-admin-dispute-audit-2026-05-04T02-58-01-194Z/summary.json`

## Verified Behaviors

- support admin can move a dispute from `open` to `investigating`
- replaying the same support-admin transition returns the same dispute snapshot and does not duplicate audit rows
- operations admin can move a dispute from `investigating` to `escalated`
- platform admin can move a dispute from `escalated` to `resolved`
- each transition appends exactly one immutable `audit_logs` row with:
  - `action = admin_dispute_status_updated`
  - `resource_type = Dispute`
  - correct `before_state` and `after_state`
- invalid transition `open -> resolved` is rejected
- finance admin cannot mutate disputes
- marketing admin cannot mutate disputes
- non-admin actors cannot mutate disputes even if they submit an admin role payload

## Interpretation

Admin disputes are no longer read-only in the approved Phase 1 scope.

They are now a governed audited mutation path for status transitions only. This closes the dispute portion of the remaining admin governance gap without implying broader support, finance, refund, or payout authority.

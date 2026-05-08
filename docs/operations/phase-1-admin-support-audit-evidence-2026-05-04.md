# Phase 1 Admin Support Audit Evidence -- 2026-05-04

Status: active  
Authority: operational  
Surface: admin-console, supabase  
Domains: release-gates, support, audit, idempotency  
Last updated: 2026-05-04  
Last verified: 2026-05-04

## Purpose

Record the governed remote evidence that closes the approved Phase 1 admin customer-service status-transition slice inside Gate 5.

## Scope

This evidence covers only the approved admin support lifecycle subset:

- `open -> in_progress`
- `open -> closed`
- `in_progress -> awaiting_reply`
- `in_progress -> resolved`
- `in_progress -> closed`
- `awaiting_reply -> in_progress`
- `awaiting_reply -> resolved`
- `awaiting_reply -> closed`
- `resolved -> closed`

It does not approve:

- ticket assignment
- internal notes
- customer reply sending
- refund or payment adjustment from support

## Runtime Path

- Surface action: `admin-console/src/features/customer-service/server/customer-service-actions.ts`
- UI action cell: `admin-console/src/features/customer-service/presentation/support-ticket-action-cell.tsx`
- Audited RPC migration: `supabase/migrations/20260504121500_add_admin_support_ticket_audit_rpc.sql`
- Remote runner: `docs/operations/phase-1-admin-support-audit-e2e-2026-05-04.mjs`

## Remote Target

- Linked Supabase project: `gjcwxsezrovxcrpdnazc`

## Execution Result

Local remote execution succeeded on 2026-05-04.

Artifact:

- `output/admin-support-audit/phase1-admin-support-audit-2026-05-04T03-08-10-821Z/summary.json`

## Verified Behaviors

- support admin can move a ticket from `open` to `in_progress`
- replaying the same support-admin transition returns the same ticket snapshot and does not duplicate audit rows
- operations admin can move a ticket from `in_progress` to `awaiting_reply`
- platform admin can move a ticket from `awaiting_reply` to `resolved`
- platform admin can move a ticket from `resolved` to `closed`
- each transition appends exactly one immutable `audit_logs` row with:
  - `action = admin_support_ticket_status_updated`
  - `resource_type = SupportTicket`
  - correct `before_state` and `after_state`
- invalid transition `open -> resolved` is rejected
- finance admin cannot mutate support tickets
- marketing admin cannot mutate support tickets
- non-admin actors cannot mutate support tickets even if they submit an admin role payload

## Interpretation

Admin customer-service is no longer read-only in the approved Phase 1 scope.

It is now a governed audited mutation path for support-ticket status transitions only. This closes the support portion of the remaining admin governance gap without implying assignment ownership, agent notes, customer reply handling, refunds, or payment-side authority.

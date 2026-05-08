# Admin Customer Service

Status: Active
Authority: Operational
Surface: admin-console
Domains: customer-service, support-tickets, admin, audited-status-mutations
Last updated: 2026-05-04
Retrieve when:
- editing the admin customer-service route
- checking whether ticket actions are governed audited transitions or still read-only
Related files:
- admin-console/src/app/(platform)/customer-service/page.tsx
- admin-console/src/features/customer-service/presentation/customer-service-screen.tsx
- admin-console/src/features/customer-service/presentation/support-ticket-action-cell.tsx
- admin-console/src/features/customer-service/server/customer-service-actions.ts
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform customer-service route, runtime-backed support queue, and the narrow audited support-ticket status workflow.

## Primary Routes and Screens

- `/(platform)/customer-service` -> `admin-console/src/app/(platform)/customer-service/page.tsx`
- Screen component -> `admin-console/src/features/customer-service/presentation/customer-service-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/customer-service/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Row inspection surfaces runtime-backed ticket context while status transitions continue through the audited action path

## Key Files to Read First

- `admin-console/src/app/(platform)/customer-service/page.tsx`
- `admin-console/src/features/customer-service/presentation/customer-service-screen.tsx`
- `admin-console/src/features/customer-service/server/customer-service-actions.ts`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`
- `shared/api/support.contract.json`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-disputes-truth.md`

## Known Limitations

- Ticket data is read through the admin runtime repository.
- Ticket summaries are derived in the screen from repository data.
- Approved writes are limited to audited status transitions only.
- Row inspection is runtime-backed but remains contextual; it does not expand assignment or refund authority.
- Assignment, internal notes, customer replies, and refund/payment-side support actions remain outside this scope.

## Safe Modification Guidance

- Start at the route page to confirm route ownership.
- Change summary and table presentation in `customer-service-screen.tsx`.
- Change ticket data shape or read behavior in `supabase-admin-runtime-repository.ts`.
- Treat any future assignment or note/reply workflow as new runtime work, not a small screen edit.

## What Not to Change Casually

- Do not imply assignment ownership, customer reply handling, or refund authority from this screen.
- Do not bypass the audited RPC path for support ticket status changes.
- Do not bypass the runtime repository boundary and read persistence or fixture files directly from the screen.
- Do not infer support workflow completeness from the screen polish alone.

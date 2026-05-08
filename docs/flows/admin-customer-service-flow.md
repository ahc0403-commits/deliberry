# Admin Customer Service Flow

Status: Active
Authority: Operational
Surface: admin-console
Domains: customer-service, support-tickets, audited-status-mutations
Last updated: 2026-05-04
Retrieve when:
- changing admin customer-service route behavior, summary metrics, or ticket action behavior
- debugging whether a customer-service issue is in repository data or the audited mutation path
- checking whether support actions are approved runtime writes or still outside scope
Related files:
- admin-console/src/app/(platform)/customer-service/page.tsx
- admin-console/src/features/customer-service/presentation/customer-service-screen.tsx
- admin-console/src/features/customer-service/server/customer-service-actions.ts
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Describe the current admin customer-service journey from platform route entry into persisted support-ticket visibility and the approved audited status-transition path.

## Entry Points

- platform sidebar link to `/customer-service`
- `admin-console/src/app/(platform)/customer-service/page.tsx`
- any direct navigation into `/customer-service`

## Main Route Sequence

- `/customer-service` -> render `AdminCustomerServicePage`
- page renders `AdminCustomerServiceScreen`
- `supabaseAdminRuntimeRepository.getCustomerServiceData()` reads the persisted support-ticket bundle
- screen derives summary counts from the current ticket list
- row action cells submit `transitionSupportTicketStatusAction`
- server action enforces admin route access and allowed session roles
- authenticated admin Supabase client calls `update_support_ticket_status_with_audit`
- RPC validates admin actor identity, allowed support-ticket transitions, and idempotent replay
- RPC writes one immutable `audit_logs` row and returns the updated support-ticket snapshot
- page revalidation refreshes `/customer-service` and `/dashboard`

## Source-of-Truth Files Involved

- `admin-console/src/app/(platform)/customer-service/page.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `admin-console/src/features/customer-service/presentation/customer-service-screen.tsx`
- `admin-console/src/features/customer-service/server/customer-service-actions.ts`
- `supabase/migrations/20260504121500_add_admin_support_ticket_audit_rpc.sql`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - repository-returned support-ticket data
  - runtime-repository read path for support tickets
  - audited RPC status transition rules
- Derived:
  - total/open/in-progress/unassigned counts
  - action button availability and badge presentation

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Support tickets are persisted and read from Supabase.
- Approved writes are limited to status transitions only.
- No assign, internal note, reply, refund, or payment-adjustment path exists in the current governance scope.
- Summary metrics are derived on render from the current persisted ticket set.
- The platform route is session- and role-enforced before the page renders.

## Common Edit Mistakes

- Treating summary cards as durable truth instead of derived calculations.
- Adding new action language without extending the audited RPC and evidence runner.
- Mixing permission-enforcement assumptions into customer-service UI edits.

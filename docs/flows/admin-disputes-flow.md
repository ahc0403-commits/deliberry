# Admin Disputes Flow

Status: Active
Authority: Operational
Surface: admin-console
Domains: disputes, platform-oversight, audited-status-mutations
Last updated: 2026-05-04
Retrieve when:
- changing admin disputes route behavior, summary metrics, or action labels
- debugging whether a disputes issue is in repository data or derived screen logic
- checking whether dispute actions are runtime-real or still outside approved scope
Related files:
- admin-console/src/app/(platform)/disputes/page.tsx
- admin-console/src/features/disputes/presentation/disputes-screen.tsx
- admin-console/src/features/disputes/server/dispute-actions.ts
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Describe the current admin disputes journey from platform route entry into persisted dispute visibility and the approved audited status-transition path.

## Entry Points

- platform sidebar link to `/disputes`
- `admin-console/src/app/(platform)/disputes/page.tsx`
- any direct navigation into `/disputes`

## Main Route Sequence

- `/disputes` -> render `AdminDisputesPage`
- page renders `AdminDisputesScreen`
- `supabaseAdminRuntimeRepository.getDisputesData()` reads the persisted disputes bundle
- screen derives summary counts and total dispute value from the current dispute list
- row action cells submit `transitionDisputeStatusAction`
- server action enforces admin route access and allowed session roles
- authenticated admin Supabase client calls `update_dispute_status_with_audit`
- RPC validates admin actor identity, allowed dispute transitions, and idempotent replay
- RPC writes one immutable `audit_logs` row and returns the updated dispute snapshot
- page revalidation refreshes `/disputes` and `/dashboard`

## Source-of-Truth Files Involved

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`
- `admin-console/src/features/disputes/server/dispute-actions.ts`
- `supabase/migrations/20260504113000_add_admin_dispute_audit_rpc.sql`

## Key Dependent Screens and Files

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - repository-returned disputes data
  - runtime-repository read path for disputes
  - audited RPC status transition rules
- Derived:
  - total/open/escalated counts
  - total dispute value
  - action button availability and badge presentation

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Disputes are persisted and read from Supabase.
- Approved writes are limited to status transitions only.
- No assign, reopen, refund, or payout-side control path exists in the current governance scope.
- Summary metrics are derived on render from the current persisted dispute set.
- The platform route is session- and role-enforced before the page renders.

## Common Edit Mistakes

- Treating summary cards as durable truth instead of derived calculations.
- Adding new action language without extending the audited RPC and evidence runner.
- Mixing permission-enforcement assumptions into disputes UI edits.

## Related Filemaps

- `docs/filemaps/admin-disputes-filemap.md`
- `docs/filemaps/admin-permissions-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/admin-disputes-truth.md`
- `docs/runtime-truth/admin-permissions-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

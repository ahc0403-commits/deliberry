# Admin Disputes Flow

Status: Active
Authority: Operational
Surface: admin-console
Domains: disputes, platform-oversight, query-read-model
Last updated: 2026-03-28
Retrieve when:
- changing admin disputes route behavior, summary metrics, or action labels
- debugging whether a disputes issue is in repository data or derived screen logic
- checking whether dispute actions are runtime-real or display-only
Related files:
- admin-console/src/app/(platform)/disputes/page.tsx
- admin-console/src/features/disputes/presentation/disputes-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts

## Purpose

Describe the current admin disputes journey from platform route entry into persisted dispute visibility and derived summary state.

## Entry Points

- platform sidebar link to `/disputes`
- `admin-console/src/app/(platform)/disputes/page.tsx`
- any direct navigation into `/disputes`

## Main Route Sequence

- `/disputes` -> render `AdminDisputesPage`
- page renders `AdminDisputesScreen`
- `adminQueryServices.getDisputesData()` reads the persisted disputes bundle
- screen derives summary counts and total dispute value from the current dispute list
- table renders action labels `Assign`, `Review`, or `View` based on dispute status

## Source-of-Truth Files Involved

- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`
- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`

## Key Dependent Screens and Files

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - repository-returned disputes data
  - query-service read path for disputes
- Derived:
  - total/open/escalated counts
  - total dispute value
  - action labels and badge presentation

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Disputes are persisted and read from Supabase.
- No assign, review, or case-update path exists.
- Summary metrics are derived on render from the current persisted dispute set.
- The platform route is session- and role-enforced before the page renders.

## Common Edit Mistakes

- Treating summary cards as durable truth instead of derived calculations.
- Strengthening action language without adding a mutation path.
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

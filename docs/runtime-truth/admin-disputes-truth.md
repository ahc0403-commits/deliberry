# Admin Disputes Truth

Status: Active
Authority: Operational
Surface: admin-console
Domains: disputes, platform-oversight, query-read-model
Last updated: 2026-03-28
Retrieve when:
- changing admin dispute reads, summary behavior, or action language
- checking whether dispute actions mutate real state
- debugging whether a dispute screen issue is data-shape or UI-only
Related files:
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts
- admin-console/src/features/disputes/presentation/disputes-screen.tsx

## Purpose

Identify where admin dispute data actually comes from and what the current screen only derives at render time.

## Real Source-of-Truth Locations

- Disputes read-model entry: `admin-console/src/shared/data/admin-query-services.ts`
- Disputes runtime repository: `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## What State Is Owned There

- repository-returned `disputes` array from `getDisputesData()`
- derived summary metrics computed in `admin-console/src/features/disputes/presentation/disputes-screen.tsx`

## What Screens and Routes Depend on It

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - read result returned by `adminQueryServices.getDisputesData()`
  - persisted dispute data returned by `supabaseAdminRuntimeRepository.getDisputesData()`
- Derived:
  - total/open/escalated counts
  - total dispute value
  - action labels `Assign`, `Review`, and `View`
  - rendered priority and status badge presentation

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Disputes are persisted and read from Supabase.
- There is no assignment, review, or case-mutation path.
- Summary metrics are recalculated directly from the current persisted read set on render.
- The platform route is session- and role-gated before the screen renders, but the dispute actions themselves are still read-only.

## Known Risks

- The disputes table can look like durable case management even though nothing is persisted.
- Summary cards can drift from data shape changes if the repository contract changes casually.
- Action labels can overstate operational support.

## Safe Modification Guidance

- Change dispute data shape in `admin-repository.ts` before changing summary or table assumptions.
- Keep derived summary logic aligned with the dispute fixture structure.
- Do not imply assign/review persistence without a real write path.

## Related Filemaps

- `docs/filemaps/admin-disputes-filemap.md`
- `docs/filemaps/admin-permissions-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

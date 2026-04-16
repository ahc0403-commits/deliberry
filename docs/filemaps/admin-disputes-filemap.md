# Admin Disputes Filemap

Status: Active
Authority: Operational
Surface: admin-console
Domains: disputes, platform-oversight, query-read-model
Last updated: 2026-04-15
Retrieve when:
- changing dispute oversight UI, summary cards, or table behavior
- debugging whether a disputes issue comes from repository data or presentation-only action state
- checking whether dispute actions are real or display-only
Related files:
- admin-console/src/app/(platform)/disputes/page.tsx
- admin-console/src/features/disputes/presentation/disputes-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Show the narrow file cluster for admin disputes rendering, runtime-backed dispute reads, and derived summary metrics.

## When To Retrieve This Filemap

- before changing dispute table columns, summary calculations, or action labels
- before changing where dispute data comes from
- when a dispute screen issue is really a repository-shape issue

## Entry Files

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`

## Adjacent Files Usually Read Together

- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`

## Source-of-Truth Files

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

The authoritative dispute data is runtime-backed and read through the page plus runtime repository. Summary cards and button labels are derived in the screen.

## Files Often Mistaken as Source of Truth but Are Not

- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`
- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/domain.ts`

The disputes screen is presentation over repository data, not the data owner itself. `admin-query-services.ts` is no longer the live disputes owner.

## High-Risk Edit Points

- `getDisputesData()` in `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- summary metric calculations in `admin-console/src/features/disputes/presentation/disputes-screen.tsx`
- action labels `Assign`, `Review`, and `View` that can overstate runtime support
- any future attempt to imply permission enforcement only inside disputes UI

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `admin-console/src/features/disputes/README.md`
- `admin-console/src/features/permissions/README.md`

## Safe Edit Sequence

1. Confirm dispute data shape in `supabase-admin-runtime-repository.ts`.
2. Confirm screen-level summary and table assumptions against that shape.
3. Update action labels or affordances only after deciding whether they remain presentation-only.
4. Keep auth or role-enforcement work separate from dispute rendering changes.

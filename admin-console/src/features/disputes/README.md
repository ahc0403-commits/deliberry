# Admin Disputes

Status: Active
Authority: Operational
Surface: admin-console
Domains: disputes, platform-oversight, query-read-model
Last updated: 2026-04-15
Retrieve when:
- editing dispute oversight UI or case summary behavior
- checking where admin dispute data comes from
- verifying whether dispute actions are real or presentation-only
Related files:
- admin-console/src/app/(platform)/disputes/page.tsx
- admin-console/src/features/disputes/presentation/disputes-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the admin platform-wide disputes oversight screen.

## Primary Routes and Screens

- `/(platform)/disputes` -> `admin-console/src/app/(platform)/disputes/page.tsx`
- Screen component -> `admin-console/src/features/disputes/presentation/disputes-screen.tsx`

## Source of Truth

- Page-level read-model entry: `admin-console/src/app/(platform)/disputes/page.tsx`
- Runtime data owner: `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

The disputes screen is mostly a presentation layer over persisted runtime repository data.

## Key Files to Read First

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Disputes are persisted and read from Supabase.
- Summary metrics are derived directly from the current persisted read set.
- `Assign`, `Review`, and `View` are display-level buttons with no real action path.
- The platform route is gated before the page renders, but dispute actions still do not mutate state.

## Safe Modification Guidance

- Change dispute data shape in `supabase-admin-runtime-repository.ts` before changing the table or summary cards.
- Keep summary calculations aligned with the dispute fixture structure.
- Treat any future assignment/review flow as new runtime work, not as a quick screen-only edit.

## What Not to Change Casually

- Do not treat the dispute table as durable case-management state.
- Do not imply role-enforced dispute access until permissions are actually wired.
- Do not bypass `admin-console/src/shared/domain.ts` for repo-level shared imports.

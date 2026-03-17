# Admin Disputes

Status: Active
Authority: Operational
Surface: admin-console
Domains: disputes, platform-oversight, query-read-model
Last updated: 2026-03-16
Retrieve when:
- editing dispute oversight UI or case summary behavior
- checking where admin dispute data comes from
- verifying whether dispute actions are real or presentation-only
Related files:
- admin-console/src/app/(platform)/disputes/page.tsx
- admin-console/src/features/disputes/presentation/disputes-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the admin platform-wide disputes oversight screen.

## Primary Routes and Screens

- `/(platform)/disputes` -> `admin-console/src/app/(platform)/disputes/page.tsx`
- Screen component -> `admin-console/src/features/disputes/presentation/disputes-screen.tsx`

## Source of Truth

- Read-model entry: `admin-console/src/shared/data/admin-query-services.ts`
- Fixture-backed data owner: `admin-console/src/shared/data/admin-repository.ts`

The disputes screen is mostly a presentation layer over fixture-backed repository data.

## Key Files to Read First

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

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

- Disputes are fixture-backed and in-memory only.
- Summary metrics are derived directly from the current fixture set.
- `Assign`, `Review`, and `View` are display-level buttons with no real action path.
- The platform shell does not currently gate this route by session or role.

## Safe Modification Guidance

- Change dispute data shape in `admin-repository.ts` before changing the table or summary cards.
- Keep summary calculations aligned with the dispute fixture structure.
- Treat any future assignment/review flow as new runtime work, not as a quick screen-only edit.

## What Not to Change Casually

- Do not treat the dispute table as durable case-management state.
- Do not imply role-enforced dispute access until permissions are actually wired.
- Do not bypass `admin-console/src/shared/domain.ts` for repo-level shared imports.

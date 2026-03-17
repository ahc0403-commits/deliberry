# Admin Users

Status: Active
Authority: Operational
Surface: admin-console
Domains: users, platform-oversight, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin users route
- checking whether user counts, filters, or actions are live or local-only
Related files:
- admin-console/src/app/(platform)/users/page.tsx
- admin-console/src/features/users/presentation/users-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform users route and its read-only overview of platform user accounts.

## Primary Routes and Screens

- `/(platform)/users` -> `admin-console/src/app/(platform)/users/page.tsx`
- Screen component -> `admin-console/src/features/users/presentation/users-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/users/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

## Key Files to Read First

- `admin-console/src/app/(platform)/users/page.tsx`
- `admin-console/src/features/users/presentation/users-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-permissions-truth.md`

## Known Limitations

- User data is fixture-backed through the repository.
- Summary counts are derived in the screen from repository data.
- `View` is a display-only action today, not a full user-management flow.

## Safe Modification Guidance

- Start at the route page to confirm route ownership.
- Change table layout and summary calculations in `users-screen.tsx`.
- Change data shape or read behavior in query/repository files.

## What Not to Change Casually

- Do not treat user actions as live mutation paths.
- Do not bypass `adminQueryServices` and read fixture files directly from the screen.
- Do not assume permission filtering exists beyond the current route enforcement path.

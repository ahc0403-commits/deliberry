# Admin Users

Status: Active
Authority: Operational
Surface: admin-console
Domains: users, platform-oversight, admin
Last updated: 2026-05-05
Retrieve when:
- editing the admin users route
- checking whether user counts, filters, or actions are live or local-only
Related files:
- admin-console/src/app/(platform)/users/page.tsx
- admin-console/src/features/users/presentation/users-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the platform users route, runtime-backed user directory, and row-level runtime inspection pane for account governance review.

## Primary Routes and Screens

- `/(platform)/users` -> `admin-console/src/app/(platform)/users/page.tsx`
- Screen component -> `admin-console/src/features/users/presentation/users-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/users/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Row inspection combines actor identity, order participation, support/dispute signal, and role context from runtime-backed reads

## Key Files to Read First

- `admin-console/src/app/(platform)/users/page.tsx`
- `admin-console/src/features/users/presentation/users-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-permissions-truth.md`

## Known Limitations

- User data is read through the admin runtime repository.
- Summary counts are derived in the screen from repository data.
- Row inspection is runtime-backed but intentionally non-mutating.

## Safe Modification Guidance

- Start at the route page to confirm route ownership.
- Change table layout and summary calculations in `users-screen.tsx`.
- Change data shape or read behavior in `supabase-admin-runtime-repository.ts`.

## What Not to Change Casually

- Do not treat user actions as live mutation paths.
- Do not bypass the runtime repository boundary and read persistence or fixture files directly from the screen.
- Do not add permission filtering outside the shared admin route matrix.

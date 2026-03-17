# Admin Stores

Status: Active
Authority: Operational
Surface: admin-console
Domains: stores, platform-oversight, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin stores route
- tracing how store list data reaches the screen
Related files:
- admin-console/src/app/(platform)/stores/page.tsx
- admin-console/src/features/stores/presentation/stores-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform stores route and its fixture-backed store oversight table.

## Primary Routes and Screens

- `/(platform)/stores` -> `admin-console/src/app/(platform)/stores/page.tsx`
- Screen component -> `admin-console/src/features/stores/presentation/stores-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/stores/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Store data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/stores/page.tsx`
- `admin-console/src/features/stores/presentation/stores-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Store records are fixture-backed.
- Filters and row actions are local UI behavior.
- There is no live platform store-management backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change table composition and local controls in `stores-screen.tsx`.
- Change store data shape in query/repository files.

## What Not to Change Casually

- Do not treat screen-local selection as runtime truth.
- Do not bypass `adminQueryServices`.
- Do not add fake persistence claims to store actions.

# Admin Catalog

Status: Active
Authority: Operational
Surface: admin-console
Domains: catalog, platform-content, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin catalog route
- tracing how catalog list data reaches the screen
Related files:
- admin-console/src/app/(platform)/catalog/page.tsx
- admin-console/src/features/catalog/presentation/catalog-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform catalog route and its fixture-backed catalog overview and moderation-style tables.

## Primary Routes and Screens

- `/(platform)/catalog` -> `admin-console/src/app/(platform)/catalog/page.tsx`
- Screen component -> `admin-console/src/features/catalog/presentation/catalog-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/catalog/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Catalog data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/catalog/page.tsx`
- `admin-console/src/features/catalog/presentation/catalog-screen.tsx`
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

- Catalog records are fixture-backed.
- Moderation and edit actions are local UI affordances.
- There is no live catalog management backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change catalog layout and local controls in `catalog-screen.tsx`.
- Change catalog data shape in query/repository files.

## What Not to Change Casually

- Do not treat moderation controls as persisted platform actions.
- Do not bypass `adminQueryServices`.
- Do not add fake mutation claims to catalog controls.

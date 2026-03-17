# Admin B2B

Status: Active
Authority: Operational
Surface: admin-console
Domains: b2b, enterprise, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin b2b route
- checking whether enterprise controls are fixture-backed or local only
Related files:
- admin-console/src/app/(platform)/b2b/page.tsx
- admin-console/src/features/b2b/presentation/b2b-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform B2B route and its fixture-backed enterprise account overview.

## Primary Routes and Screens

- `/(platform)/b2b` -> `admin-console/src/app/(platform)/b2b/page.tsx`
- Screen component -> `admin-console/src/features/b2b/presentation/b2b-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/b2b/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. B2B data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/b2b/page.tsx`
- `admin-console/src/features/b2b/presentation/b2b-screen.tsx`
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

- Enterprise account data is fixture-backed.
- Local controls do not persist.
- There is no live B2B administration backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change B2B layout and local controls in `b2b-screen.tsx`.
- Change data shape in query/repository files.

## What Not to Change Casually

- Do not describe local controls as persisted enterprise actions.
- Do not bypass `adminQueryServices`.
- Do not assume B2B has deeper runtime support than the current fixtures provide.

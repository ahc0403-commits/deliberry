# Admin Merchants

Status: Active
Authority: Operational
Surface: admin-console
Domains: merchants, platform-oversight, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin merchants route
- tracing how merchant list data reaches the screen
Related files:
- admin-console/src/app/(platform)/merchants/page.tsx
- admin-console/src/features/merchants/presentation/merchants-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform merchants route and its fixture-backed merchant oversight table.

## Primary Routes and Screens

- `/(platform)/merchants` -> `admin-console/src/app/(platform)/merchants/page.tsx`
- Screen component -> `admin-console/src/features/merchants/presentation/merchants-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/merchants/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Merchant list data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/merchants/page.tsx`
- `admin-console/src/features/merchants/presentation/merchants-screen.tsx`
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

- Merchant data is fixture-backed.
- Filters and row actions are local UI behavior.
- There is no live merchant-management backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change table composition and local filters in `merchants-screen.tsx`.
- Change merchant list data shape in query/repository files.

## What Not to Change Casually

- Do not treat row actions as persisted platform mutations.
- Do not bypass `adminQueryServices`.
- Do not change access assumptions without checking admin auth and permissions docs.

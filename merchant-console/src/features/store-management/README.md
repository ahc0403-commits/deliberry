# Merchant Store Management

Status: Active
Authority: Operational
Surface: merchant-console
Domains: store-management, merchant-store-profile, operations
Last updated: 2026-04-15
Retrieve when:
- editing the merchant store-management route
- tracing how store profile data reaches the management screen
Related files:
- merchant-console/src/app/(console)/[storeId]/store/page.tsx
- merchant-console/src/features/store-management/presentation/store-management-screen.tsx
- merchant-console/src/shared/data/merchant-store-runtime-service.ts

## Purpose

Owns the store-scoped store-management route and its runtime-backed store profile sections.

## Primary Routes and Screens

- `/(console)/[storeId]/store` -> `merchant-console/src/app/(console)/[storeId]/store/page.tsx`
- Screen component -> `merchant-console/src/features/store-management/presentation/store-management-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/store/page.tsx`
- Read and write runtime truth flow through `merchant-console/src/shared/data/merchant-store-runtime-service.ts`

The route is store-scoped. Store profile values are runtime-backed and the save path is persisted through the merchant store runtime service.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/store/page.tsx`
- `merchant-console/src/features/store-management/presentation/store-management-screen.tsx`
- `merchant-console/src/shared/data/merchant-store-runtime-service.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Store profile data is runtime-backed.
- Save/edit controls persist through the scoped runtime service rather than a full merchant operations backend.
- Only the validated demo store scope is supported.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change form layout and section behavior in `store-management-screen.tsx`.
- Change store profile read or write behavior in `merchant-store-runtime-service.ts`.

## What Not to Change Casually

- Do not bypass the store-scoped runtime service path.
- Do not change route/store naming without checking navigation docs first.

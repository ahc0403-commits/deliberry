# Merchant Store Management

Status: Active
Authority: Operational
Surface: merchant-console
Domains: store-management, merchant-store-profile, operations
Last updated: 2026-03-17
Retrieve when:
- editing the merchant store-management route
- tracing how store profile data reaches the management screen
Related files:
- merchant-console/src/app/(console)/[storeId]/store/page.tsx
- merchant-console/src/features/store-management/presentation/store-management-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts

## Purpose

Owns the store-scoped store-management route and its editable-looking store profile sections.

## Primary Routes and Screens

- `/(console)/[storeId]/store` -> `merchant-console/src/app/(console)/[storeId]/store/page.tsx`
- Screen component -> `merchant-console/src/features/store-management/presentation/store-management-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/store/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-query-services.ts`
- Repository truth lives in `merchant-console/src/shared/data/merchant-repository.ts`

The route is store-scoped. Store profile values are fixture-backed and edit actions are demo-safe UI only.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/store/page.tsx`
- `merchant-console/src/features/store-management/presentation/store-management-screen.tsx`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Store profile data is fixture-backed.
- Save/edit controls are not backed by persisted mutations.
- Only the validated demo store scope is supported.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change form layout and section behavior in `store-management-screen.tsx`.
- Change store profile fixture shape or store-scope reads in query/repository files.

## What Not to Change Casually

- Do not present local form changes as persisted store truth.
- Do not bypass the store-scoped repository path.
- Do not change route/store naming without checking navigation docs first.

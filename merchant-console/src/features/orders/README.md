# Merchant Orders

Status: Active
Authority: Operational
Surface: merchant-console
Domains: orders, store-scope, merchant-console
Last updated: 2026-03-16
Retrieve when:
- editing the merchant orders screen or store-scoped order route
- changing how order data is read inside the merchant console
- checking whether an order action is real or presentation-only
Related files:
- merchant-console/src/app/(console)/[storeId]/orders/page.tsx
- merchant-console/src/features/orders/presentation/orders-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts
- merchant-console/src/shared/data/merchant-mock-data.ts
- merchant-console/src/features/auth/server/access.ts

## Purpose

Owns the merchant order-management surface for a selected store.

## Primary Routes and Screens

- `/(console)/[storeId]/orders` -> `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- Screen component -> `merchant-console/src/features/orders/presentation/orders-screen.tsx`

## Source of Truth

- Route/store access truth: `merchant-console/src/features/auth/server/access.ts`
- Store-scoped layout truth: `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- Read-model source for orders: `merchant-console/src/shared/data/merchant-query-services.ts`
- Fixture-backed data owner behind the query service: `merchant-console/src/shared/data/merchant-repository.ts`

This feature has split truth: route access is enforced by server redirects, but order content is still mock-backed.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Orders are read from in-memory mock data.
- `Accept Order`, `Reject`, `Mark Ready`, and `Mark Picked Up` are currently presentation-only buttons.
- The detail panel is local UI state inside `orders-screen.tsx`; there is no server-backed order detail route.
- Badge counts in the sidebar are static display values, not derived from current orders data.

## Safe Modification Guidance

- Change route guards or store ownership in `access.ts` and store layout files first, not inside the screen.
- Change order data shape in `merchant-repository.ts` and `merchant-mock-data.ts` before changing rendering assumptions.
- Keep store-scoped routing intact when editing links or order entry points.

## What Not to Change Casually

- Do not bypass `ensureMerchantStoreScope`.
- Do not treat `merchant-mock-data.ts` as durable backend truth.
- Do not introduce direct imports from repo-level `shared/*`; keep using `merchant-console/src/shared/domain.ts`.

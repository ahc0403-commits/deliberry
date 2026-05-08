# Merchant Orders

Status: Active
Authority: Operational
Surface: merchant-console
Domains: orders, store-scope, merchant-console
Last updated: 2026-04-24
Retrieve when:
- editing the merchant orders screen or store-scoped order route
- changing how order data is read inside the merchant console
- checking whether an order action is real or presentation-only
Related files:
- merchant-console/src/app/(console)/[storeId]/orders/page.tsx
- merchant-console/src/features/orders/presentation/orders-screen.tsx
- merchant-console/src/shared/data/merchant-order-runtime-service.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts
- merchant-console/src/features/orders/server/order-actions.ts
- merchant-console/src/features/auth/server/access.ts

## Purpose

Owns the merchant order-management surface for a selected store.

## Primary Routes and Screens

- `/(console)/[storeId]/orders` -> `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- Screen component -> `merchant-console/src/features/orders/presentation/orders-screen.tsx`

## Source of Truth

- Route/store access truth: `merchant-console/src/features/auth/server/access.ts`
- Store-scoped layout truth: `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- Read-model source for orders: `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- Persisted repository owner: `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`
- Mutation entrypoint: `merchant-console/src/features/orders/server/order-actions.ts`

This feature is now runtime-backed for the supported merchant store scope.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-runtime-repository.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Orders are read from Supabase for the validated merchant store scope.
- The detail panel is still local UI state inside `orders-screen.tsx`; there is no separate server-backed order detail route yet.
- Dashboard and sidebar counts are derived snapshots, so wording and iconography should stay aligned with runtime repository truth.
- Fallback language can still appear if runtime compatibility ever routes this feature through local preview mode.

## Safe Modification Guidance

- Change route guards or store ownership in `access.ts` and store layout files first, not inside the screen.
- Change order data shape and mutation behavior in `merchant-order-runtime-service.ts` or `supabase-merchant-runtime-repository.ts` before changing rendering assumptions.
- Keep store-scoped routing intact when editing links or order entry points.

## What Not to Change Casually

- Do not bypass `ensureMerchantStoreScope`.
- Do not bypass the runtime service and mutate repository state directly from the screen.
- Do not introduce direct imports from repo-level `shared/*`; keep using `merchant-console/src/shared/domain.ts`.

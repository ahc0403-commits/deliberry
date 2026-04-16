# Merchant Orders Filemap

Status: Active
Authority: Operational
Surface: merchant-console
Domains: orders, store-scope, query-read-model
Last updated: 2026-04-15
Retrieve when:
- changing merchant order data reads or table/detail behavior
- debugging store-scoped order rendering
- checking whether an order action is real, local-only, or fixture-backed
Related files:
- merchant-console/src/app/(console)/[storeId]/orders/page.tsx
- merchant-console/src/features/orders/presentation/orders-screen.tsx
- merchant-console/src/shared/data/merchant-order-runtime-service.ts

## Purpose

Shows the narrow file cluster for merchant orders rendering, store-scope enforcement, and runtime-backed order reads.

## When To Retrieve This Filemap

- before changing order table columns, detail panel behavior, or tab filtering
- before changing where merchant order data comes from
- when order pages look correct but route or store context is wrong

## Entry Files

- `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Adjacent Files Usually Read Together

- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- `merchant-console/src/shared/data/product-telemetry-service.ts`

## Source-of-Truth Files

- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`

This source of truth is split: route/store ownership is enforced by access helpers and the store-scoped layout, while order content is read from the runtime service.

## Files Often Mistaken as Source of Truth but Are Not

- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- `merchant-console/src/app/(console)/layout.tsx`
- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-query-services.ts`

The screen owns local UI state like active tab and selected order, but not authoritative order data or store access policy. `merchant-query-services.ts` remains a legacy fixture path, not the live orders owner.

## High-Risk Edit Points

- `ensureMerchantStoreScope` and redirect logic in `merchant-console/src/features/auth/server/access.ts`
- Store ID boundary in `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `getMerchantOrdersRuntimeData` in `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- Local action buttons and overlay state in `merchant-console/src/features/orders/presentation/orders-screen.tsx`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `merchant-console/src/features/orders/README.md`
- `merchant-console/src/features/auth/README.md`

## Safe Edit Sequence

1. Confirm the store-scoped route boundary in the page and layout files.
2. Confirm data-read ownership in `merchant-order-runtime-service.ts`.
3. Update `orders-screen.tsx` after the data and route assumptions are clear.
4. If actions become real later, add a real write path before changing action labels or states.

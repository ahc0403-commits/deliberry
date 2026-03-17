# Merchant Menu Filemap

Status: Active
Authority: Operational
Surface: merchant-console
Domains: menu, catalog, filter-state, store-scope
Last updated: 2026-03-16
Retrieve when:
- changing merchant menu data reads, category filtering, or search behavior
- debugging store-scoped menu rendering
- checking whether menu mutations are persisted or only local UI
Related files:
- merchant-console/src/app/(console)/[storeId]/menu/page.tsx
- merchant-console/src/features/menu/presentation/menu-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts

## Purpose

Shows the narrow file cluster for merchant menu rendering, store-scope enforcement, and local filter/search state over fixture-backed menu data.

## When To Retrieve This Filemap

- before changing category chips, search behavior, or menu item rows
- before changing where categories and menu items are read from
- when the menu page renders but the wrong store or wrong data source is involved

## Entry Files

- `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Adjacent Files Usually Read Together

- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Source-of-Truth Files

- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`

This source of truth is split: route/store ownership is enforced server-side, while categories and items are read from the query service and in-memory repository. Search query and selected category remain local UI state in the screen.

## Files Often Mistaken as Source of Truth but Are Not

- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
- `merchant-console/src/app/(console)/layout.tsx`
- `merchant-console/src/shared/domain.ts`

The screen owns temporary filter/search state, not authoritative menu data.

## High-Risk Edit Points

- `ensureMerchantStoreScope` in `merchant-console/src/features/auth/server/access.ts`
- Store ID boundary in `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `getMenuData` in `merchant-console/src/shared/data/merchant-query-services.ts`
- `getMenuData` and item/category fixture wiring in `merchant-console/src/shared/data/merchant-repository.ts`
- Local filter/search state and action buttons in `merchant-console/src/features/menu/presentation/menu-screen.tsx`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `merchant-console/src/features/menu/README.md`
- `merchant-console/src/features/auth/README.md`

## Safe Edit Sequence

1. Confirm the store-scoped route and layout boundary first.
2. Confirm query-service and repository ownership of menu reads.
3. Update screen-level filter/search behavior only after the data contract is clear.
4. If adding real writes later, do not imply persistence until a real mutation path exists.

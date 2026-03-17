# Merchant Menu Flow

Status: Active
Authority: Operational
Surface: merchant-console
Domains: menu, catalog, filter-state, store-scope
Last updated: 2026-03-16
Retrieve when:
- changing merchant menu route behavior, category filtering, or search interactions
- debugging whether menu issues come from route scope, data reads, or local filter state
- checking whether menu actions persist real state
Related files:
- merchant-console/src/app/(console)/[storeId]/menu/page.tsx
- merchant-console/src/features/menu/presentation/menu-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts

## Purpose

Describe the current merchant menu journey from store-scoped route entry into the menu screen and its local search/category behavior.

## Entry Points

- merchant store sidebar link to `/${storeId}/menu`
- direct navigation to `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- any store-scoped route already inside `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Main Route Sequence

- `/${storeId}/menu` -> page resolves `storeId`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx` runs `ensureMerchantStoreScope(storeId)`
- page renders `MerchantMenuScreen(storeId)`
- `merchantQueryServices.getMenuData(storeId)` reads the fixture-backed menu bundle
- user applies local category chip filtering through `selectedCategory`
- user applies local text filtering through `searchQuery`

## Source-of-Truth Files Involved

- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`

## Key Dependent Screens and Files

- `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - store-scope route guard result
  - repository-returned categories and items
  - repository-returned store data paired with menu data
- Derived:
  - filtered item list
  - selected category label
  - local search query state
  - visible toggle state and button affordances for edit/add actions

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Menu data is fixture-backed and in-memory only.
- `storeId` is currently ignored by the repository.
- Search and category filters are local UI state only.
- `Add Category`, `Add Item`, `Edit`, and availability toggles do not persist any mutation.

## Common Edit Mistakes

- Treating filter state as authoritative menu truth.
- Adding apparent save behavior in the screen without a real write path.
- Changing menu route behavior without checking store-scope enforcement first.

## Related Filemaps

- `docs/filemaps/merchant-menu-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/merchant-menu-truth.md`
- `docs/runtime-truth/merchant-auth-session-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

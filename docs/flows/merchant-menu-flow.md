# Merchant Menu Flow

Status: Active
Authority: Operational
Surface: merchant-console
Domains: menu, catalog, filter-state, store-scope
Last updated: 2026-04-24
Retrieve when:
- changing merchant menu route behavior, category filtering, or search interactions
- debugging whether menu issues come from route scope, data reads, or local filter state
- checking whether menu actions persist real state
Related files:
- merchant-console/src/app/(console)/[storeId]/menu/page.tsx
- merchant-console/src/features/menu/presentation/menu-screen.tsx
- merchant-console/src/features/menu/server/menu-actions.ts
- merchant-console/src/shared/data/merchant-menu-runtime-service.ts

## Purpose

Describe the current merchant menu journey from store-scoped route entry into runtime menu reads, item/photo writes, and local search/category behavior.

## Entry Points

- merchant store sidebar link to `/${storeId}/menu`
- direct navigation to `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- any store-scoped route already inside `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Main Route Sequence

- `/${storeId}/menu` -> page resolves `storeId`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx` runs `ensureMerchantStoreScope(storeId)`
- page reads persisted menu data through `getMerchantMenuRuntimeData(storeId)`
- page renders `MerchantMenuScreen(storeId, initialData)`
- add/edit item submits to `upsertMerchantMenuItemAction`
- availability toggle submits to `setMerchantMenuItemAvailabilityAction`
- user applies local category chip filtering through `selectedCategory`
- user applies local text filtering through `searchQuery`

## Source-of-Truth Files Involved

- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/features/menu/server/menu-actions.ts`
- `merchant-console/src/shared/data/merchant-menu-runtime-service.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`

## Key Dependent Screens and Files

- `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
- `supabase/migrations/20260424103000_add_merchant_menu_photo_runtime.sql`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - store-scope route guard result
  - `public.store_menu_items`
  - `menu-item-images` storage paths referenced by menu rows
  - runtime-returned store data paired with menu data
- Derived:
  - filtered item list
  - selected category label
  - local search query state
  - public image URL generated from storage path

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Menu data is runtime-backed by Supabase.
- `storeId` is enforced before reads and writes.
- Search and category filters are local UI state only.
- Category CRUD is not a separate feature yet; category labels are persisted per item.

## Common Edit Mistakes

- Treating filter state as authoritative menu truth.
- Moving write behavior into the client screen instead of server actions.
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

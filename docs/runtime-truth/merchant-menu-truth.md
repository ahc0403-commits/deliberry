# Merchant Menu Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: menu, catalog, filter-state, store-scope
Last updated: 2026-04-24
Retrieve when:
- changing merchant menu reads, filter behavior, or availability UI
- checking whether menu actions write real state or only affect local UI
- debugging store-scoped menu rendering
Related files:
- merchant-console/src/app/(console)/[storeId]/menu/page.tsx
- merchant-console/src/shared/data/merchant-menu-runtime-service.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts
- merchant-console/src/features/menu/server/menu-actions.ts
- merchant-console/src/features/menu/presentation/menu-screen.tsx

## Purpose

Identify where merchant menu and category data actually comes from and where the current screen only owns temporary UI state.

## Real Source-of-Truth Locations

- Menu read-model entry: `merchant-console/src/shared/data/merchant-menu-runtime-service.ts`
- Persisted menu owner: `public.store_menu_items`
- Menu image storage bucket: `menu-item-images`
- Menu mutation entry: `merchant-console/src/features/menu/server/menu-actions.ts`
- Store-scope route enforcement: `merchant-console/src/features/auth/server/access.ts` and `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- Local screen state owner: `merchant-console/src/features/menu/presentation/menu-screen.tsx`

## What State Is Owned There

- Runtime-returned `categories` and `items` for `getMenuData(storeId)`
- Repository-returned `store` value paired with menu data
- Local screen-only state:
  - `selectedCategory`
  - `searchQuery`
  - currently edited item form state

## What Screens and Routes Depend on It

- `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - rows in `public.store_menu_items`
  - `image_storage_path` values pointing at `menu-item-images`
  - store-scope access enforced before the page renders
- Derived:
  - filtered item list
  - selected category label
  - item counts shown in the header and category chips
  - visible toggle position in each item row
  - public image URL generated from storage path

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Menu categories and items are runtime-backed by `public.store_menu_items`.
- Category is still a text column on `public.store_menu_items`; there are no normalized menu-category or modifier-group tables yet.
- Menu item photo storage is backed by Supabase Storage bucket `menu-item-images`; the table stores `image_storage_path`.
- Search and category filtering are local client state only.
- Add/edit item and availability toggles persist through server actions after `ensureMerchantStoreScope(storeId)`.
- Dedicated category CRUD is not implemented; category creation happens implicitly by saving an item with a category label.

## Known Risks

- The denormalized category text model can produce spelling variants that behave like separate categories.
- Menu photo uploads are constrained to JPEG, PNG, and WebP, maximum 5MB.
- Write actions use the service-role client after server-side merchant store-scope validation; do not move these writes into client components.

## Safe Modification Guidance

- Change menu data ownership in `merchant-menu-runtime-service.ts` or `supabase-merchant-runtime-repository.ts` before changing UI assumptions.
- Keep local search/category state in the screen unless a broader runtime plan exists.
- Keep all menu mutations behind server actions and `ensureMerchantStoreScope(storeId)`.

## Related Filemaps

- `docs/filemaps/merchant-menu-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

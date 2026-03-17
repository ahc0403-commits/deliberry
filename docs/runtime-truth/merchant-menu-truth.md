# Merchant Menu Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: menu, catalog, filter-state, store-scope
Last updated: 2026-03-17
Retrieve when:
- changing merchant menu reads, filter behavior, or availability UI
- checking whether menu actions write real state or only affect local UI
- debugging store-scoped menu rendering
Related files:
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts
- merchant-console/src/features/menu/presentation/menu-screen.tsx

## Purpose

Identify where merchant menu and category data actually comes from and where the current screen only owns temporary UI state.

## Real Source-of-Truth Locations

- Menu read-model entry: `merchant-console/src/shared/data/merchant-query-services.ts`
- Fixture owner for categories and items: `merchant-console/src/shared/data/merchant-repository.ts`
- Store-scope route enforcement: `merchant-console/src/features/auth/server/access.ts` and `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- Local screen state owner: `merchant-console/src/features/menu/presentation/menu-screen.tsx`

## What State Is Owned There

- Repository-returned `categories` and `items` for `getMenuData(storeId)`
- Repository-returned `store` value paired with menu data
- Local screen-only state:
  - `selectedCategory`
  - `searchQuery`

## What Screens and Routes Depend on It

- `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - the read result returned by `merchantQueryServices.getMenuData(storeId)`
  - the fixture data returned by `merchantRepository.getMenuData(storeId)`
  - store-scope access enforced before the page renders
- Derived:
  - filtered item list
  - selected category label
  - item counts shown in the header and category chips
  - visible toggle position in each item row

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Menu categories and items are fixture-backed and in-memory only.
- `storeId` is now validated by the repository against the supported demo-store scope instead of being ignored silently.
- Search and category filtering are local client state only.
- Availability toggles, `Add Category`, `Add Item`, and `Edit` do not persist any mutation.

## Known Risks

- The screen can look interactive enough to imply saved catalog changes even though no mutation path exists.
- `defaultChecked` on the availability toggle can be mistaken for durable state.
- A future change that adds real writes only in the screen will bypass the current query/repository ownership model.
- The merchant surface still has only one fixture-backed store, so store-specific catalog variation is not implemented yet.

## Safe Modification Guidance

- Change menu data ownership in `merchant-repository.ts` before changing UI assumptions.
- Keep local search/category state in the screen unless a broader runtime plan exists.
- Do not represent toggles or edit actions as saved behavior without a real write path.

## Related Filemaps

- `docs/filemaps/merchant-menu-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

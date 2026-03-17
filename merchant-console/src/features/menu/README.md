# Merchant Menu

Status: Active
Authority: Operational
Surface: merchant-console
Domains: menu, catalog, store-scope
Last updated: 2026-03-16
Retrieve when:
- editing the merchant menu screen or store-scoped menu route
- changing category filtering or item search behavior in the merchant console
- checking whether a menu action is real or local-only
Related files:
- merchant-console/src/app/(console)/[storeId]/menu/page.tsx
- merchant-console/src/features/menu/presentation/menu-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts
- merchant-console/src/shared/data/merchant-mock-data.ts
- merchant-console/src/features/auth/server/access.ts

## Purpose

Owns the merchant menu-management screen for the selected store.

## Primary Routes and Screens

- `/(console)/[storeId]/menu` -> `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- Screen component -> `merchant-console/src/features/menu/presentation/menu-screen.tsx`

## Source of Truth

- Route/store access truth: `merchant-console/src/features/auth/server/access.ts`
- Read-model source for categories and items: `merchant-console/src/shared/data/merchant-query-services.ts`
- Fixture-backed data owner: `merchant-console/src/shared/data/merchant-repository.ts`
- Local UI state for selected category and search query: `merchant-console/src/features/menu/presentation/menu-screen.tsx`

This feature also has split truth: store scope is server-enforced, but menu content and edits are mock-backed and local-only.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/menu/page.tsx`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
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

- Categories and items are fixture-backed.
- `Add Category`, `Add Item`, `Edit`, and availability toggles are not persisted.
- Search and category filters are client-only state inside the screen component.
- Store name and counts come from mock-backed repository data.

## Safe Modification Guidance

- Change data read behavior in `merchant-query-services.ts` or `merchant-repository.ts` before changing UI assumptions.
- Keep local filter/search state contained unless a broader runtime plan exists.
- Preserve store-scoped route ownership and server guard behavior.

## What Not to Change Casually

- Do not move menu truth into random client modules.
- Do not treat toggle state as saved without adding a real write path.
- Do not import repo-level `shared/*` directly from feature code.

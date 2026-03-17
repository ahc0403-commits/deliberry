# Merchant Promotions

Status: Active
Authority: Operational
Surface: merchant-console
Domains: promotions, store-scoped-marketing, merchant
Last updated: 2026-03-17
Retrieve when:
- editing the merchant promotions route or campaign cards
- tracing how store-scoped promotion data reaches the screen
Related files:
- merchant-console/src/app/(console)/[storeId]/promotions/page.tsx
- merchant-console/src/features/promotions/presentation/promotions-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts

## Purpose

Owns the store-scoped promotions route and its fixture-backed campaign list.

## Primary Routes and Screens

- `/(console)/[storeId]/promotions` -> `merchant-console/src/app/(console)/[storeId]/promotions/page.tsx`
- Screen component -> `merchant-console/src/features/promotions/presentation/promotions-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/promotions/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-query-services.ts`
- Repository truth lives in `merchant-console/src/shared/data/merchant-repository.ts`

The route is store-scoped and fixture-backed. Promotion actions are presentation-only.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/promotions/page.tsx`
- `merchant-console/src/features/promotions/presentation/promotions-screen.tsx`
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

- Promotion data is fixture-backed.
- Create, edit, pause, and resume controls are local UI affordances only.
- The current route supports the validated demo store scope only.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change campaign composition and local controls in `promotions-screen.tsx`.
- Change data shape or store-scoped reads in query/repository files, not in the screen.

## What Not to Change Casually

- Do not bypass `merchantQueryServices`.
- Do not treat campaign actions as persisted runtime behavior.
- Do not weaken the validated store-scope path.

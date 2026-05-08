# Merchant Promotions

Status: Active
Authority: Operational
Surface: merchant-console
Domains: promotions, store-scoped-marketing, merchant
Last updated: 2026-05-06
Retrieve when:
- editing the merchant promotions route or campaign cards
- tracing how store-scoped promotion data reaches the screen
Related files:
- merchant-console/src/app/(console)/[storeId]/promotions/page.tsx
- merchant-console/src/features/promotions/presentation/promotions-screen.tsx
- merchant-console/src/shared/data/merchant-promotions-runtime-service.ts
- merchant-console/src/shared/data/merchant-query-services.ts

## Purpose

Owns the store-scoped promotions route and its current planning snapshot.

## Primary Routes and Screens

- `/(console)/[storeId]/promotions` -> `merchant-console/src/app/(console)/[storeId]/promotions/page.tsx`
- Screen component -> `merchant-console/src/features/promotions/presentation/promotions-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/promotions/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-promotions-runtime-service.ts`
- Campaign snapshot rows still originate from `merchant-console/src/shared/data/merchant-query-services.ts` via `merchantFixtureFacade`

The route is store-scoped and currently serves a planning snapshot. Store identity is loaded from the persisted store profile, while campaign rows remain snapshot data coordinated through the promotions runtime service. Promotion actions are not yet persisted.
Visible campaign framing and status/type labels follow the merchant locale layer, while campaign rows themselves remain snapshot-owned.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/promotions/page.tsx`
- `merchant-console/src/features/promotions/presentation/promotions-screen.tsx`
- `merchant-console/src/shared/data/merchant-promotions-runtime-service.ts`
- `merchant-console/src/shared/data/merchant-query-services.ts` (`merchantFixtureFacade`)

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Promotion data is currently a store-scoped planning snapshot.
- Create, edit, pause, and resume controls are local UI affordances only.
- The route can render for persisted merchant stores, but the campaign rows remain snapshot data.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change campaign composition and local controls in `promotions-screen.tsx`.
- Change data shape or store-scoped reads in the promotions runtime service, not in the screen.

## What Not to Change Casually

- Do not reintroduce direct screen-level fixture reads.
- Do not bypass the promotions runtime service.
- Do not treat campaign actions as persisted runtime behavior.
- Do not weaken the validated store-scope path.

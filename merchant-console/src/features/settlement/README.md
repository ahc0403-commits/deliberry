# Merchant Settlement

Status: Active
Authority: Operational
Surface: merchant-console
Domains: settlement, payouts, merchant
Last updated: 2026-03-17
Retrieve when:
- editing the merchant settlement route or payout tables
- tracing how store-scoped settlement records reach the screen
Related files:
- merchant-console/src/app/(console)/[storeId]/settlement/page.tsx
- merchant-console/src/features/settlement/presentation/settlement-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts

## Purpose

Owns the store-scoped settlement route and its fixture-backed payout summaries and records.

## Primary Routes and Screens

- `/(console)/[storeId]/settlement` -> `merchant-console/src/app/(console)/[storeId]/settlement/page.tsx`
- Screen component -> `merchant-console/src/features/settlement/presentation/settlement-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/settlement/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-query-services.ts`
- Repository truth lives in `merchant-console/src/shared/data/merchant-repository.ts`

The route is store-scoped and fixture-backed. Settlement rows are read-only.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/settlement/page.tsx`
- `merchant-console/src/features/settlement/presentation/settlement-screen.tsx`
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

- Settlement records are fixture-backed.
- Export/download actions are presentation-only.
- There is no real payout system integration.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change table composition and summaries in `settlement-screen.tsx`.
- Change settlement fixtures or store-scoped reads in query/repository files.

## What Not to Change Casually

- Do not treat settlement statuses as live payout truth.
- Do not bypass the query-service layer.
- Do not weaken store-scope validation.

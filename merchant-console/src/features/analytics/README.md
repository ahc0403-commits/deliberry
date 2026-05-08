# Merchant Analytics

Status: Active
Authority: Operational
Surface: merchant-console
Domains: analytics, store-scoped-reporting, merchant
Last updated: 2026-05-06
Retrieve when:
- editing the merchant analytics route or KPI charts
- tracing how analytics read models reach the store-scoped screen
Related files:
- merchant-console/src/app/(console)/[storeId]/analytics/page.tsx
- merchant-console/src/features/analytics/presentation/analytics-screen.tsx
- merchant-console/src/shared/data/merchant-analytics-runtime-service.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts

## Purpose

Owns the store-scoped analytics route and its current read-only analytics view.

## Primary Routes and Screens

- `/(console)/[storeId]/analytics` -> `merchant-console/src/app/(console)/[storeId]/analytics/page.tsx`
- Screen component -> `merchant-console/src/features/analytics/presentation/analytics-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/analytics/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-analytics-runtime-service.ts`
- Repository truth lives in `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

The route is store-scoped and currently serves a read-only analytics view derived from runtime store, order, review, and menu reads. It is not a separate reporting warehouse, but it is no longer a screen-local fixture snapshot.
Metric labels and weekday chips on the screen now follow the merchant locale layer instead of staying English-only.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/analytics/page.tsx`
- `merchant-console/src/features/analytics/presentation/analytics-screen.tsx`
- `merchant-console/src/shared/data/merchant-analytics-runtime-service.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Analytics data is derived from runtime records rather than a dedicated reporting backend.
- Date-range and chart controls are local UI state only.
- There is no live reporting backend.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change chart layout and local filtering in `analytics-screen.tsx`.
- Change metric derivation or scoping rules in the analytics runtime service or repository files.

## What Not to Change Casually

- Do not reintroduce screen-local fixture reads for analytics.
- Do not treat chart data as warehouse-grade reporting truth.
- Do not move read logic into the screen.
- Do not bypass the store-scoped repository path.

# Merchant Analytics

Status: Active
Authority: Operational
Surface: merchant-console
Domains: analytics, store-scoped-reporting, merchant
Last updated: 2026-03-17
Retrieve when:
- editing the merchant analytics route or KPI charts
- tracing how analytics read models reach the store-scoped screen
Related files:
- merchant-console/src/app/(console)/[storeId]/analytics/page.tsx
- merchant-console/src/features/analytics/presentation/analytics-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts

## Purpose

Owns the store-scoped analytics route and its fixture-backed KPI, chart, and top-item views.

## Primary Routes and Screens

- `/(console)/[storeId]/analytics` -> `merchant-console/src/app/(console)/[storeId]/analytics/page.tsx`
- Screen component -> `merchant-console/src/features/analytics/presentation/analytics-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/analytics/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-query-services.ts`
- Repository truth lives in `merchant-console/src/shared/data/merchant-repository.ts`

The route is store-scoped and fixture-backed. Metrics are read-only.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/analytics/page.tsx`
- `merchant-console/src/features/analytics/presentation/analytics-screen.tsx`
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

- Analytics data is fixture-backed.
- Date-range and chart controls are local UI state only.
- There is no live reporting backend.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change chart layout and local filtering in `analytics-screen.tsx`.
- Change metric values or scoping rules in query/repository files.

## What Not to Change Casually

- Do not treat chart data as live operational truth.
- Do not move read logic into the screen.
- Do not bypass the store-scoped repository path.

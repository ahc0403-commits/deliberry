# Merchant Dashboard

Status: Active
Authority: Operational
Surface: merchant-console
Domains: dashboard, store-scoped-overview, merchant
Last updated: 2026-04-24
Retrieve when:
- editing the merchant dashboard route or overview cards
- tracing how store-scoped dashboard data reaches the screen
Related files:
- merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx
- merchant-console/src/features/dashboard/presentation/dashboard-screen.tsx
- merchant-console/src/shared/data/merchant-order-runtime-service.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts

## Purpose

Owns the store-scoped merchant dashboard route and its overview of KPIs, recent orders, and alerts.

## Primary Routes and Screens

- `/(console)/[storeId]/dashboard` -> `merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx`
- Screen component -> `merchant-console/src/features/dashboard/presentation/dashboard-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- Persisted repository truth lives in `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

The dashboard is store-scoped and now reads through the runtime service. It can render persisted data or an explicit fixture fallback, but it does not own mutation truth.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx`
- `merchant-console/src/features/dashboard/presentation/dashboard-screen.tsx`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/08-auth-session-strategy.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`
- `docs/runtime-truth/merchant-menu-truth.md`

## Known Limitations

- Dashboard data is now runtime-backed when persisted reads succeed.
- Persisted dashboard alerts now derive from current store runtime state: active orders, ready handoff counts, visible menu items, and review follow-up.
- Persisted and fallback dashboard KPIs now use store-scoped rating and prep-time values instead of mock defaults.
- Order links are real route handoffs, but dashboard actions do not own any write path.
- Runtime failures can still fall back to fixture data when merchant compatibility policy allows it.
- Sidebar badge counts, recent-order status labels, and unanswered-review alert counts now derive from the current query/repository truth instead of hardcoded literals.
- Local merchant development should not force `MERCHANT_AUTH_AUTHORITY=demo-cookie` if runtime-backed dashboard verification is the goal.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change dashboard layout and display behavior in `dashboard-screen.tsx`.
- Change data shape or store-scope read behavior in query/repository files, not in the screen.

## What Not to Change Casually

- Do not bypass the runtime service and read repository or fixture files directly from the screen.
- Do not treat all dashboard KPI labels as fully live business semantics without checking the runtime repository shape.
- Do not break the storeId path between route page and repository read methods.

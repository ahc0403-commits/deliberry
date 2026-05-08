# Merchant Dashboard Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: dashboard, store-scoped-overview, runtime-read
Last updated: 2026-04-24
Retrieve when:
- changing the merchant dashboard route or KPI/alert read path
- deciding whether dashboard values are persisted, derived, or fixture fallback
- debugging first merchant arrival at `/${storeId}/dashboard`
Related files:
- merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx
- merchant-console/src/features/dashboard/presentation/dashboard-screen.tsx
- merchant-console/src/shared/data/merchant-order-runtime-service.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts

## Purpose

Identify where merchant dashboard read truth actually lives today and where fallback behavior is still allowed.

## Real Source-of-Truth Locations

- Page-level runtime entry: `merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx`
- Dashboard runtime service: `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- Persisted repository reads: `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

## What State Is Owned There

- Runtime-service-returned `DashboardData`
- Runtime-service-returned `source` (`persisted` or `fallback`)
- Store-scoped route handoff into the dashboard
- Screen-local rendering only:
  - KPI icon selection
  - status label mapping
  - alert icon mapping

## What Screens and Routes Depend on It

- `merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx`
- `merchant-console/src/features/dashboard/presentation/dashboard-screen.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - `getMerchantDashboardRuntimeData(storeId)` result
  - persisted store/order/review reads from `supabase-merchant-runtime-repository.ts`
  - store-scope route access before page render
- Derived:
  - KPI card presentation
  - alert ordering and iconography
  - wording of the dashboard source badge

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- The dashboard route now reads through the runtime service rather than the fixture facade.
- Merchant compatibility policy can still fall back to fixture dashboard data after persisted-read failure.
- Persisted KPI cards now derive revenue, active orders, average prep time, and rating from current store-scoped runtime reads instead of mock defaults.
- Alert composition now reflects active orders, ready handoff counts, visible menu items, and review follow-up for the current store.
- The first dashboard arrival can still be fixture fallback if runtime compatibility or persisted-read conditions require it.
- Local verification only proves persisted reads when merchant auth authority is actually `supabase`; a forced `demo-cookie` override will mask that path.

## Known Risks

- It is easy to misread fallback dashboard data as proof that the route is still fixture-owned; the route is runtime-owned now, but fallback remains part of the compatibility policy.
- Dashboard semantics can drift from orders truth if KPI labels are changed without checking the runtime repository shape.

## Safe Modification Guidance

- Change persisted dashboard data shape in `supabase-merchant-runtime-repository.ts` first.
- Change fallback policy in `merchant-order-runtime-service.ts` second.
- Change screen wording and source-badge disclosure last.

## Related Filemaps

- `docs/filemaps/merchant-orders-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

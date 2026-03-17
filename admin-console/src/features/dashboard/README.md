# Admin Dashboard

Status: Active
Authority: Operational
Surface: admin-console
Domains: dashboard, platform-overview, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin dashboard route
- tracing how platform overview data reaches the dashboard screen
Related files:
- admin-console/src/app/(platform)/dashboard/page.tsx
- admin-console/src/features/dashboard/presentation/dashboard-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform dashboard route and its summary of KPIs, recent orders, and alerts.

## Primary Routes and Screens

- `/(platform)/dashboard` -> `admin-console/src/app/(platform)/dashboard/page.tsx`
- Screen component -> `admin-console/src/features/dashboard/presentation/dashboard-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/dashboard/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced, but its data is still fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/dashboard/page.tsx`
- `admin-console/src/features/dashboard/presentation/dashboard-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/08-auth-session-strategy.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Dashboard data is fixture-backed through the repository.
- Alert and KPI values are static mock-backed read models.
- Dashboard links route correctly, but there is no live analytics backend.

## Safe Modification Guidance

- Start at the route page to confirm route ownership.
- Change dashboard composition in `dashboard-screen.tsx`.
- Change data shape or read behavior in query/repository files, not in the screen.

## What Not to Change Casually

- Do not bypass `adminQueryServices` and read fixture files directly from the screen.
- Do not treat dashboard metrics as live backend truth.
- Do not change access assumptions without checking admin auth and permissions docs first.

# Admin Analytics

Status: Active
Authority: Operational
Surface: admin-console
Domains: analytics, platform-reporting, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin analytics route
- tracing how analytics metrics reach the screen
Related files:
- admin-console/src/app/(platform)/analytics/page.tsx
- admin-console/src/features/analytics/presentation/analytics-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform analytics route and its fixture-backed KPI and chart views.

## Primary Routes and Screens

- `/(platform)/analytics` -> `admin-console/src/app/(platform)/analytics/page.tsx`
- Screen component -> `admin-console/src/features/analytics/presentation/analytics-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/analytics/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Analytics data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/analytics/page.tsx`
- `admin-console/src/features/analytics/presentation/analytics-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Analytics metrics are fixture-backed.
- Date-range and chart controls are local UI state only.
- There is no live analytics pipeline.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change chart composition and local filtering in `analytics-screen.tsx`.
- Change metric values or data shape in query/repository files.

## What Not to Change Casually

- Do not treat charts as live platform telemetry.
- Do not bypass `adminQueryServices`.
- Do not introduce fake persistence to filter controls.

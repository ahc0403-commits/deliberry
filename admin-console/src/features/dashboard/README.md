# Admin Dashboard

Status: Active
Authority: Operational
Surface: admin-console
Domains: dashboard, platform-overview, admin
Last updated: 2026-04-18
Retrieve when:
- editing the admin dashboard route
- tracing how platform overview data reaches the dashboard screen
Related files:
- admin-console/src/app/(platform)/dashboard/page.tsx
- admin-console/src/features/dashboard/presentation/dashboard-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the platform dashboard route and its summary of KPIs, recent orders, and alerts.

## Primary Routes and Screens

- `/(platform)/dashboard` -> `admin-console/src/app/(platform)/dashboard/page.tsx`
- Screen component -> `admin-console/src/features/dashboard/presentation/dashboard-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/dashboard/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Repository truth lives in `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

The route is access-enforced and now reads runtime-backed dashboard data from the admin Supabase repository. Dashboard actions remain read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/dashboard/page.tsx`
- `admin-console/src/features/dashboard/presentation/dashboard-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/08-auth-session-strategy.md`
- `docs/runtime-truth/admin-auth-session-truth.md`
- `docs/runtime-truth/admin-dashboard-truth.md`

## Known Limitations

- Dashboard reads are runtime-backed for KPIs, recent orders, and alert derivation.
- Dashboard actions are still read-only and do not mutate platform state.
- Trend/change strings are descriptive runtime labels, not comparative analytics windows.
- `Orders Today` uses the local server day boundary rather than UTC midnight.

## Safe Modification Guidance

- Start at the route page to confirm route ownership.
- Change dashboard composition in `dashboard-screen.tsx`.
- Change data shape or read behavior in `supabase-admin-runtime-repository.ts`, not in the screen.

## What Not to Change Casually

- Do not bypass `supabase-admin-runtime-repository.ts` and read database state directly from the screen.
- Do not present dashboard KPIs as mutation authority or full analytics truth.
- Do not change access assumptions without checking admin auth and permissions docs first.

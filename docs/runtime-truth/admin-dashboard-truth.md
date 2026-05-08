# Admin Dashboard Truth

Status: Active
Authority: Operational
Surface: admin-console
Domains: dashboard, kpis, alerts, recent-orders, oversight
Last updated: 2026-05-06
Last verified: 2026-05-06
Retrieve when:
- changing admin dashboard KPI, alert, or recent-order behavior
- checking whether the admin dashboard is fixture-backed or runtime-backed
- deciding how dashboard counts relate to admin orders truth
Related files:
- admin-console/src/app/(platform)/dashboard/page.tsx
- admin-console/src/features/dashboard/presentation/dashboard-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Give one clear answer to the admin dashboard question: what data on `/(platform)/dashboard` is runtime-real today, and what that route is allowed to mean.

## Real Source-of-Truth Locations

- Route owner: [page.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/dashboard/page.tsx)
- Runtime read owner: [supabase-admin-runtime-repository.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/data/supabase-admin-runtime-repository.ts)
- Screen composition owner: [dashboard-screen.tsx](/Users/andremacmini/Deliberry/admin-console/src/features/dashboard/presentation/dashboard-screen.tsx)
- Shared dashboard shape: [admin-repository.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/data/admin-repository.ts)

## What State Is Owned There

- dashboard KPI values
- dashboard alert feed
- recent cross-platform orders list
- active order queue count shown as `Orders under watch`
- dashboard-local explanatory copy for read-only oversight intent

## What Reads Feed It Today

- `actor_profiles` for total-user count
- `merchant_profiles` for active-merchant count
- `orders` for:
  - local-day `Orders Today`
  - non-cancelled revenue total
  - recent orders
  - active/pending/cancelled queue-derived alerts
- `disputes` for open-dispute count and critical alert generation
- `stores.rating` for average rating

## What Is Authoritative vs Derived

- Authoritative:
  - rows returned from Supabase by `supabase-admin-runtime-repository.ts`
  - dashboard data object assembled in `getDashboardData()`
  - the route-level decision to keep dashboard actions read-only
- Derived:
  - `Orders under watch` from active runtime order statuses
  - alert messages derived from counts and latest order state
  - KPI `change` strings such as `Live count`, `Runtime-backed`, `Asia/Saigon day window`, and `Non-cancelled total`
  - display labels like order badges and summary-card copy

## What Is Still Shallow, Partial, or Read-Only

- The dashboard is now runtime-backed for KPI, alert, and recent-order visibility.
- The route is still read-only. It does not mutate orders, disputes, merchants, or platform settings.
- It is an oversight and triage surface, not a full analytics product and not an incident-response console.
- Long-tail admin routes outside dashboard and orders can still remain fixture-backed; this document applies only to `/(platform)/dashboard`.

## Date and Time Interpretation

- `Orders Today` is calculated from the server-local day boundary, not UTC midnight.
- On the current local machine that resolves to `Asia/Saigon`.
- Persisted order timestamps remain stored in UTC-compatible ISO values; only the daily aggregation window is localized.

## Known Risks

- If `getOrdersData()` changes status vocabulary or ordering without updating dashboard derivations, `Orders under watch` and alert counts can drift from the orders route.
- If future KPI copy starts implying trend analytics, the dashboard can overstate what is really just current-state runtime visibility.
- Dashboard presentation still depends on status/source label mapping staying aligned with persisted runtime vocabulary; if those maps drift, live rows can regress to raw identifiers even though the underlying runtime data is correct.

## Safe Modification Guidance

- Change runtime reads and KPI derivation in `supabase-admin-runtime-repository.ts` first.
- Change presentation copy and layout in `dashboard-screen.tsx` second.
- Keep `DashboardData` in `admin-repository.ts` aligned with both runtime and fallback repository implementations.
- Do not reintroduce `adminQueryServices` as the dashboard owner for this route.

## Related Docs

- [admin-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-orders-truth.md)
- [admin-permissions-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-permissions-truth.md)
- [RETRIEVAL_ENTRY_ADMIN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md)
- [README.md](/Users/andremacmini/Deliberry/admin-console/src/features/dashboard/README.md)

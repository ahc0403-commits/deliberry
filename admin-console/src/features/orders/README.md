# Admin Orders

Status: Active
Authority: Operational
Surface: admin-console
Domains: orders, platform-oversight, query-read-model
Last updated: 2026-04-15
Retrieve when:
- editing platform-wide order oversight UI
- checking where admin order data comes from
- verifying whether order actions mutate real state or only local UI state
Related files:
- admin-console/src/app/(platform)/orders/page.tsx
- admin-console/src/features/orders/presentation/orders-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the admin platform-wide order oversight screen.

## Primary Routes and Screens

- `/(platform)/orders` -> `admin-console/src/app/(platform)/orders/page.tsx`
- Screen component -> `admin-console/src/features/orders/presentation/orders-screen.tsx`

## Source of Truth

- Page-level read-model entry: `admin-console/src/app/(platform)/orders/page.tsx`
- Runtime data owner: `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

This source of truth is split: order data is read through the runtime repository, while selected tab and selected order are local screen state.

## Key Files to Read First

- `admin-console/src/app/(platform)/orders/page.tsx`
- `admin-console/src/features/orders/presentation/orders-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Orders are persisted and read from Supabase.
- `activeTab` and `selectedOrder` live only inside the screen.
- `Open Dispute`, `Review Cancellation`, and `View Full History` are display-level buttons with no write path.
- The platform route is gated before the page renders, but the order actions themselves remain read-only.

## Safe Modification Guidance

- Change order data shape in `supabase-admin-runtime-repository.ts` before changing screen assumptions.
- Keep screen-local selection/filter state in the screen unless a broader runtime plan is introduced.
- Treat route guarding as separate from orders rendering; actions are still non-mutating even though read access is enforced.

## What Not to Change Casually

- Do not treat legacy query services as the live backend boundary for this route.
- Do not imply platform actions are persisted without adding a real mutation path.
- Do not import repo-level `shared/*` directly from feature code.

# Admin Orders

Status: Active
Authority: Operational
Surface: admin-console
Domains: orders, platform-oversight, query-read-model
Last updated: 2026-03-16
Retrieve when:
- editing platform-wide order oversight UI
- checking where admin order data comes from
- verifying whether order actions mutate real state or only local UI state
Related files:
- admin-console/src/app/(platform)/orders/page.tsx
- admin-console/src/features/orders/presentation/orders-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the admin platform-wide order oversight screen.

## Primary Routes and Screens

- `/(platform)/orders` -> `admin-console/src/app/(platform)/orders/page.tsx`
- Screen component -> `admin-console/src/features/orders/presentation/orders-screen.tsx`

## Source of Truth

- Read-model entry: `admin-console/src/shared/data/admin-query-services.ts`
- Fixture-backed data owner: `admin-console/src/shared/data/admin-repository.ts`

This source of truth is split: order data is read through the query service and in-memory repository, while selected tab and selected order are local screen state.

## Key Files to Read First

- `admin-console/src/app/(platform)/orders/page.tsx`
- `admin-console/src/features/orders/presentation/orders-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

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

- Orders are fixture-backed and in-memory only.
- `activeTab` and `selectedOrder` live only inside the screen.
- `Open Dispute`, `Review Cancellation`, and `View Full History` are display-level buttons with no write path.
- The platform shell does not currently gate this route by session or role.

## Safe Modification Guidance

- Change order data shape in `admin-repository.ts` before changing screen assumptions.
- Keep screen-local selection/filter state in the screen unless a broader runtime plan is introduced.
- Treat route guarding as separate from orders rendering; there is no real enforcement here yet.

## What Not to Change Casually

- Do not treat the query service as a live backend boundary.
- Do not imply platform actions are persisted without adding a real mutation path.
- Do not import repo-level `shared/*` directly from feature code.

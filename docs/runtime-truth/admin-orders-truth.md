# Admin Orders Truth

Status: Active
Authority: Operational
Surface: admin-console
Domains: orders, platform-oversight, query-read-model
Last updated: 2026-04-16
Retrieve when:
- changing admin order data reads or display logic
- checking whether order actions mutate real state
- debugging the split between repository data and local screen state
Related files:
- admin-console/src/app/(platform)/orders/page.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts
- admin-console/src/features/orders/presentation/orders-screen.tsx

## Purpose

Identify where admin order data actually comes from and where the current screen only owns temporary UI state.

## Real Source-of-Truth Locations

- Page-level read-model entry: `admin-console/src/app/(platform)/orders/page.tsx`
- Orders runtime repository: `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Local UI state owner: `admin-console/src/features/orders/presentation/orders-screen.tsx`

## What State Is Owned There

- repository-returned `orders` array from `getOrdersData()`
- local `activeTab`
- local `selectedOrder`

## What Screens and Routes Depend on It

- `admin-console/src/app/(platform)/orders/page.tsx`
- `admin-console/src/features/orders/presentation/orders-screen.tsx`
- any future admin flow that opens a dispute from an order

## What Is Authoritative vs Derived

- Authoritative:
  - read result returned by `supabaseAdminRuntimeRepository.getOrdersData()`
  - persisted order data returned by `supabaseAdminRuntimeRepository.getOrdersData()`
- Derived:
  - tab counts
  - filtered order lists
  - selected order detail panel state
  - action affordances such as `Open Dispute`, `Review Cancellation`, and `View Full History`

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Orders are persisted and read from Supabase.
- There is no live admin write path for order governance actions; admin mutation authority is deferred in the current runtime scope.
- `activeTab` and `selectedOrder` exist only in screen-local React state.
- The platform route is session- and role-gated before the screen renders, but the order actions themselves are still read-only.

## Known Risks

- Engineers can mistake legacy query services for backend-backed data sources.
- The screen can over-promise platform control because the action buttons have no mutation path.
- Local detail-panel state can be confused with durable selection or route state.

## Safe Modification Guidance

- Change order data ownership in `supabase-admin-runtime-repository.ts` before changing screen assumptions.
- Keep screen-local tab and selection state in the screen unless there is an explicit runtime plan.
- Add a real write path only after the deferred-scope governance decision is reopened and implemented.

## Related Filemaps

- `docs/filemaps/admin-orders-filemap.md`
- `docs/filemaps/admin-auth-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

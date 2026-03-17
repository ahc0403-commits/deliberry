# Merchant Orders Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: orders, query-read-model, store-scope
Last updated: 2026-03-17
Retrieve when:
- changing merchant order data reads or display logic
- checking whether order actions mutate real state
- debugging order list/detail behavior across store-scoped routes
Related files:
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts
- merchant-console/src/features/orders/presentation/orders-screen.tsx

## Purpose

Identify where merchant orders data actually comes from and where the current screen only uses local UI state.

## Real Source-of-Truth Locations

- Orders read-model entry: `merchant-console/src/shared/data/merchant-query-services.ts`
- Orders fixture owner: `merchant-console/src/shared/data/merchant-repository.ts`
- Store-scope route enforcement: `merchant-console/src/features/auth/server/access.ts` and `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## What State Is Owned There

- Repository-returned `orders` array for `getOrdersData(storeId)`
- Repository-returned `store` value paired with order data
- In-memory order status mutations written by `updateOrderStatus(storeId, orderId, status)`
- Store-scope validity for the current route
- Local screen-only state:
  - `activeTab`
  - `selectedOrder`

## What Screens and Routes Depend on It

- `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - the read result returned by `merchantQueryServices.getOrdersData(storeId)`
  - the fixture data returned by `merchantRepository.getOrdersData(storeId)`
  - store-scope access enforced before the page renders
- Derived:
  - filtered tab views
  - counts shown on tabs
  - selected order detail panel state
  - status labels rendered from `STATUS_LABELS`

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Orders are fixture-backed and in-memory only.
- `storeId` is now validated by the repository against the supported demo-store scope instead of being ignored silently.
- `Accept Order`, `Reject`, `Mark Ready`, and `Mark Picked Up` now update the in-memory order status path for the current merchant session.
- The detail panel is local UI state only, not a durable route or persisted selection.

## Known Risks

- Engineers can mistake the query service for a live backend abstraction when it is only a thin wrapper over in-memory fixtures.
- Order status changes are session-local and fixture-backed, not backend-persisted.
- The merchant surface still supports only one fixture-backed store, so a broader multi-store dataset is not yet present even though the store scope is now enforced consistently.

## Safe Modification Guidance

- Change data ownership in `merchant-repository.ts` before changing screen assumptions.
- Keep route/store enforcement changes separate from order-data changes.
- Keep `orders-screen.tsx` aligned with the repository mutation path so list counts and the detail panel stay in sync.

## Related Filemaps

- `docs/filemaps/merchant-orders-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

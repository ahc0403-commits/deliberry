# Merchant Orders Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: orders, query-read-model, store-scope
Last updated: 2026-03-28
Retrieve when:
- changing merchant order data reads or display logic
- checking whether order actions mutate real state
- debugging order list/detail behavior across store-scoped routes
Related files:
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts
- merchant-console/src/features/orders/presentation/orders-screen.tsx

## Purpose

Identify where merchant orders data actually comes from and where the current screen only uses local UI state.

## Real Source-of-Truth Locations

- Orders read-model entry: `merchant-console/src/shared/data/merchant-query-services.ts`
- Orders runtime repository: `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`
- Store-scope route enforcement: `merchant-console/src/features/auth/server/access.ts` and `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## What State Is Owned There

- Repository-returned `orders` array for `getOrdersData(storeId)`
- Repository-returned `store` value paired with order data
- Persisted order status mutations written by `updateOrderStatus(storeId, orderId, status)`
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
  - the persisted order data returned by `supabaseMerchantRuntimeRepository.getOrdersData(storeId)`
  - store-scope access enforced before the page renders
- Derived:
  - filtered tab views
  - counts shown on tabs
  - selected order detail panel state
  - status labels rendered from `STATUS_LABELS`

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Orders are persisted and read from Supabase for the supported merchant store scope.
- `storeId` is enforced and applied to persisted order reads.
- `Accept Order`, `Reject`, `Mark Ready`, and `Mark Picked Up` update real order status in the persisted runtime.
- The detail panel is local UI state only, not a durable route or persisted selection.

## Known Risks

- The merchant surface still supports only one actively verified store scope in the current runtime.

## Safe Modification Guidance

- Change data ownership in `supabase-merchant-runtime-repository.ts` before changing screen assumptions.
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

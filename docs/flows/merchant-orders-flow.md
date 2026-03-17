# Merchant Orders Flow

Status: Active
Authority: Operational
Surface: merchant-console
Domains: orders, store-scope, query-read-model
Last updated: 2026-03-16
Retrieve when:
- changing merchant orders route behavior, table filtering, or detail interactions
- debugging whether order rendering problems come from routing, data reads, or local UI state
- checking whether order actions are real or only display-level
Related files:
- merchant-console/src/app/(console)/[storeId]/orders/page.tsx
- merchant-console/src/features/orders/presentation/orders-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts

## Purpose

Describe the current merchant orders journey from store-scoped route entry into the orders screen and local detail panel behavior.

## Entry Points

- merchant store sidebar link to `/${storeId}/orders`
- direct navigation to `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- any store-scoped route already inside `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Main Route Sequence

- `/${storeId}/orders` -> page resolves `storeId`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx` runs `ensureMerchantStoreScope(storeId)`
- page renders `MerchantOrdersScreen(storeId)`
- `merchantQueryServices.getOrdersData(storeId)` reads the fixture-backed orders bundle
- user switches between local tabs: `active`, `completed`, `cancelled`
- user opens and closes a local detail overlay through `selectedOrder`

## Source-of-Truth Files Involved

- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`

## Key Dependent Screens and Files

- `merchant-console/src/app/(console)/[storeId]/orders/page.tsx`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - store-scope route guard result
  - repository-returned orders data
  - repository-returned store data paired with the orders bundle
- Derived:
  - tab counts and filtered lists
  - detail overlay visibility
  - displayed status labels
  - button affordances for `Accept Order`, `Reject`, `Mark Ready`, `Mark Picked Up`

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Orders are fixture-backed and in-memory only.
- `storeId` is currently ignored by the repository.
- Order actions do not mutate any state.
- The detail panel is local overlay state only, not a route or persisted selection.

## Common Edit Mistakes

- Editing the screen as if it owns order truth instead of reading from the repository layer.
- Treating action buttons as operational without adding a real write path.
- Changing order route behavior without checking store-scope enforcement in the layout and access helpers.

## Related Filemaps

- `docs/filemaps/merchant-orders-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/merchant-orders-truth.md`
- `docs/runtime-truth/merchant-auth-session-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

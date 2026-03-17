# Admin Orders Flow

Status: Active
Authority: Operational
Surface: admin-console
Domains: orders, platform-oversight, query-read-model
Last updated: 2026-03-16
Retrieve when:
- changing admin orders route behavior, table filtering, or detail interactions
- debugging whether an orders issue is caused by fixture data or local UI state
- checking whether order actions are runtime-real or display-only
Related files:
- admin-console/src/app/(platform)/orders/page.tsx
- admin-console/src/features/orders/presentation/orders-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts

## Purpose

Describe the current admin orders journey from platform route entry into fixture-backed order oversight and local detail state.

## Entry Points

- platform sidebar link to `/orders`
- `admin-console/src/app/(platform)/orders/page.tsx`
- any direct navigation into `/orders`

## Main Route Sequence

- `/orders` -> render `AdminOrdersPage`
- page renders `AdminOrdersScreen`
- `adminQueryServices.getOrdersData()` reads the fixture-backed orders bundle
- user switches among local tabs: `all`, `active`, `delivered`, `disputed`
- user opens and closes the local detail panel through `selectedOrder`
- action buttons remain display-only in the detail panel

## Source-of-Truth Files Involved

- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`
- `admin-console/src/features/orders/presentation/orders-screen.tsx`

## Key Dependent Screens and Files

- `admin-console/src/app/(platform)/orders/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/shared/data/admin-mock-data.ts`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - repository-returned orders data
  - query-service read path for orders
- Derived:
  - tab counts
  - filtered rows
  - selected-order panel visibility
  - `Open Dispute`, `Review Cancellation`, and `View Full History` affordances

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Orders are fixture-backed and in-memory only.
- No platform order action writes state back anywhere.
- `activeTab` and `selectedOrder` are local React state only.
- The platform route itself is still not session- or role-enforced.

## Common Edit Mistakes

- Treating `orders-screen.tsx` as the data owner instead of the repository/query layer.
- Making action copy stronger without adding a write path.
- Mixing auth or permission work into orders rendering changes.

## Related Filemaps

- `docs/filemaps/admin-orders-filemap.md`
- `docs/filemaps/admin-auth-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/admin-orders-truth.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

# Admin Orders Filemap

Status: Active
Authority: Operational
Surface: admin-console
Domains: orders, platform-oversight, query-read-model
Last updated: 2026-04-15
Retrieve when:
- changing platform-wide order oversight UI or selection behavior
- debugging whether an orders issue comes from repository data or local screen state
- checking whether order actions are real or presentation-only
Related files:
- admin-console/src/app/(platform)/orders/page.tsx
- admin-console/src/features/orders/presentation/orders-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Show the narrow file cluster for admin orders rendering, runtime-backed data reads, and local detail-panel state.

## When To Retrieve This Filemap

- before changing order tabs, detail panels, or action buttons
- before changing where platform order data comes from
- when route access assumptions and orders UI assumptions get mixed together

## Entry Files

- `admin-console/src/app/(platform)/orders/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`

## Adjacent Files Usually Read Together

- `admin-console/src/features/orders/presentation/orders-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `admin-console/src/features/auth/server/auth-actions.ts`

## Source-of-Truth Files

- `admin-console/src/app/(platform)/orders/page.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

The source of truth is split: persisted reads come through the runtime repository, while selected tab and selected order are local screen state inside `orders-screen.tsx`.

## Files Often Mistaken as Source of Truth but Are Not

- `admin-console/src/features/orders/presentation/orders-screen.tsx`
- `admin-console/src/app/(platform)/orders/page.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/domain.ts`

The screen owns temporary UI state and derived views, not authoritative order data. `admin-query-services.ts` is now a legacy fixture path rather than the live orders owner.

## High-Risk Edit Points

- `getOrdersData()` in `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `activeTab` and `selectedOrder` handling in `admin-console/src/features/orders/presentation/orders-screen.tsx`
- button affordances such as `Open Dispute`, `Review Cancellation`, and `View Full History`
- any future attempt to add auth/role enforcement directly in the orders screen

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `admin-console/src/features/orders/README.md`
- `admin-console/src/features/auth/README.md`

## Safe Edit Sequence

1. Confirm data-read ownership in `supabase-admin-runtime-repository.ts`.
2. Confirm the route/page entry still matches the intended platform scope.
3. Update screen-level tab or detail behavior only after the data contract is clear.
4. If actions become real later, add a real write path before changing action labels or expectations.

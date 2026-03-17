# Merchant Store Selection Filemap

Status: Active
Authority: Operational
Surface: merchant-console
Domains: store-selection, selected-store, access-handoff
Last updated: 2026-03-16
Retrieve when:
- changing `/select-store` behavior
- debugging selected-store redirects into store-scoped routes
- checking where selected store is actually persisted
Related files:
- merchant-console/src/app/(console)/select-store/page.tsx
- merchant-console/src/features/store-selection/server/store-selection-actions.ts
- merchant-console/src/shared/auth/merchant-session.ts

## Purpose

Shows the narrow file cluster for selected-store persistence and the handoff from onboarding into store-scoped merchant routes.

## When To Retrieve This Filemap

- before changing selected-store persistence
- before changing the post-onboarding route path
- when store-scoped pages redirect unexpectedly

## Entry Files

- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx`

## Adjacent Files Usually Read Together

- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/features/auth/server/auth-actions.ts`
- `merchant-console/src/app/(auth)/onboarding/page.tsx`

## Source-of-Truth Files

- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- `merchant-console/src/features/auth/server/access.ts`

This source of truth is split: the selected-store value is stored in cookies, while the handoff and guard logic live in server actions and access helpers.

## Files Often Mistaken as Source of Truth but Are Not

- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- `merchant-console/src/features/store-selection/state/store-selection-placeholder-state.ts`
- `merchant-console/src/app/(console)/layout.tsx`

These files render or frame the flow, but they do not own selected-store truth.

## High-Risk Edit Points

- `MERCHANT_STORE_COOKIE` usage in `merchant-console/src/shared/auth/merchant-session.ts`
- Redirect target in `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- `ensureMerchantStoreScope` in `merchant-console/src/features/auth/server/access.ts`
- Store ID assumptions in `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`

## Related Local Feature READMEs

- `merchant-console/src/features/store-selection/README.md`
- `merchant-console/src/features/auth/README.md`

## Safe Edit Sequence

1. Confirm selected-store read and write behavior in `merchant-session.ts` and `store-selection-actions.ts`.
2. Confirm redirect expectations in `access.ts`.
3. Verify the affected route pages and store-scoped layout still agree on the store ID path.
4. Update the selection screen last if the visible options or wording must change.

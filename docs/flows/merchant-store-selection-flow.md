# Merchant Store Selection Flow

Status: Active
Authority: Operational
Surface: merchant-console
Domains: store-selection, selected-store, store-scope
Last updated: 2026-03-16
Retrieve when:
- changing store-selection behavior or handoff into store-scoped routes
- debugging why a merchant lands on `/select-store` or is redirected away from a store route
- checking whether store selection is authoritative or only UI
Related files:
- merchant-console/src/app/(console)/select-store/page.tsx
- merchant-console/src/features/store-selection/server/store-selection-actions.ts
- merchant-console/src/features/auth/server/access.ts

## Purpose

Describe how the merchant console moves from authenticated access into a selected store and then enforces that store scope.

## Entry Points

- `merchant-console/src/app/(auth)/onboarding/page.tsx`
- `merchant-console/src/app/(console)/select-store/page.tsx`
- any store-scoped route under `merchant-console/src/app/(console)/[storeId]/`

## Main Route Sequence

- completed onboarding with no selected store -> `/select-store`
- `/select-store` -> if a selected store already exists, redirect to `/${selectedStoreId}/dashboard`
- `selectDemoStoreAction()` -> set `MERCHANT_STORE_COOKIE` -> redirect to `/demo-store/dashboard`
- any `/${storeId}/*` route -> `ensureMerchantStoreScope(storeId)` validates the selected-store cookie
- mismatched store path -> redirect to `/${selectedStoreId}/dashboard`
- missing selected store -> redirect to `/select-store`

## Source-of-Truth Files Involved

- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Key Dependent Screens and Files

- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/app/(console)/[storeId]/dashboard/page.tsx`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - selected-store cookie value
  - redirect target written by `selectDemoStoreAction()`
  - route guard decisions in `ensureMerchantStoreScope()`
- Derived:
  - visible store cards on the selection screen
  - active store badge text in the store-scoped layout
  - route links rendered in the sidebar

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- The flow supports only one hardcoded demo store.
- The selection screen is not repository-backed.
- Store identity is cookie-local, not verified against a backend merchant/store relationship.
- The add-store card is non-functional presentation only.

## Common Edit Mistakes

- Changing redirect targets without updating store-scope guard logic.
- Adding visible store options in the screen without adding matching selected-store behavior.
- Treating sidebar store labels as authoritative data instead of derived display.

## Related Filemaps

- `docs/filemaps/merchant-store-selection-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/merchant-store-selection-truth.md`
- `docs/runtime-truth/merchant-auth-session-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`

# Merchant Store Selection Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: store-selection, selected-store, store-scope
Last updated: 2026-03-17
Retrieve when:
- changing `/select-store` behavior or post-onboarding handoff
- debugging selected-store redirects or wrong store-scope routing
- checking where selected store is actually persisted
Related files:
- merchant-console/src/shared/auth/merchant-session.ts
- merchant-console/src/features/store-selection/server/store-selection-actions.ts
- merchant-console/src/features/auth/server/access.ts

## Purpose

Identify where the merchant console stores selected-store truth and how that truth gates store-scoped routes.

## Real Source-of-Truth Locations

- Selected-store cookie read: `merchant-console/src/shared/auth/merchant-session.ts`
- Selected-store write and redirect: `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- Store-scope enforcement: `merchant-console/src/features/auth/server/access.ts`

## What State Is Owned There

- `MERCHANT_STORE_COOKIE`
- Redirect target after store selection
- Route access decision for `/${storeId}/*` pages

## What Screens and Routes Depend on It

- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- all store-scoped merchant routes under `merchant-console/src/app/(console)/[storeId]/`
- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - selected-store cookie value from `readSelectedStoreId()`
  - selected-store cookie write in `selectDemoStoreAction()`
  - route guard decision in `ensureMerchantStoreScope()`
- Derived:
  - store badge text and store name shown in console layouts
  - route redirect destinations calculated from the selected-store cookie
  - visible store option cards in the selection screen

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- The only selectable store is a hardcoded demo store.
- There is no repository-backed store list.
- Selected-store persistence is cookie-only and local to the current browser session context.
- The add-store card is presentational only.
- Store scope is now enforced consistently as a single supported demo-store path across both routing and repository-backed merchant reads.

## Known Risks

- Changing the selected-store cookie key or redirect target can break all store-scoped routes.
- The hardcoded demo-store path can drift from future repository-backed store IDs if changed casually.
- UI can imply a real store directory even though the available store list is not authoritative.

## Safe Modification Guidance

- Change selected-store read and write behavior together in `merchant-session.ts` and `store-selection-actions.ts`.
- Keep `ensureMerchantStoreScope()` aligned with any store ID path changes.
- Treat the selection screen as presentation on top of cookie truth, not as the truth owner.

## Related Filemaps

- `docs/filemaps/merchant-store-selection-filemap.md`
- `docs/filemaps/merchant-auth-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`

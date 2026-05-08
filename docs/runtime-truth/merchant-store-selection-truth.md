# Merchant Store Selection Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: store-selection, selected-store, store-scope
Last updated: 2026-04-24
Retrieve when:
- changing `/select-store` behavior or post-onboarding handoff
- debugging selected-store redirects or wrong store-scope routing
- checking where selected store is actually persisted
Related files:
- merchant-console/src/shared/auth/merchant-session.ts
- merchant-console/src/features/store-selection/server/store-selection-actions.ts
- merchant-console/src/features/auth/server/access.ts
- merchant-console/src/shared/auth/supabase-merchant-auth-adapter.ts
- docs/operations/merchant-registration-first-use-audit-2026-04-22.md

## Purpose

Identify where the merchant console stores selected-store truth and how that truth gates store-scoped routes.

## Real Source-of-Truth Locations

- Selected-store resolution: `merchant-console/src/shared/auth/merchant-session.ts`
- Selected-store write and redirect: `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- Store-scope enforcement: `merchant-console/src/features/auth/server/access.ts`
- Supabase-authority selected-store persistence: `merchant-console/src/shared/auth/supabase-merchant-auth-adapter.ts`

## What State Is Owned There

- selected-store state resolved in `merchant-session.ts`
- Redirect target after store selection
- Route access decision for `/${storeId}/*` pages

## What Screens and Routes Depend on It

- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- all store-scoped merchant routes under `merchant-console/src/app/(console)/[storeId]/`
- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - selected-store persistence resolved by `selectMerchantStoreSession()`
  - route guard decision in `ensureMerchantStoreScope()`
- Derived:
  - store badge text and store name shown in console layouts
  - route redirect destinations calculated from the selected-store cookie
  - visible store option cards in the selection screen

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Under `demo-cookie` authority, the only selectable store is still the seeded demo store.
- Under `supabase` authority, memberships are repository-backed through `merchant_memberships` and selected-store persistence flows through `set_merchant_default_store`.
- The add-store/self-provision path is still absent from the console.
- Store scope remains enforced consistently by the auth access helpers across routing and merchant reads.
- The first post-selection landing can still be a fixture-backed dashboard even when the route handoff is runtime-real.

## Known Risks

- Changing the selected-store cookie key or redirect target can break all store-scoped routes.
- The hardcoded demo-store path can drift from future repository-backed store IDs if changed casually.
- UI can imply a real store directory even though the available store list is not authoritative.

## Safe Modification Guidance

- Change selected-store read and write behavior together in `merchant-session.ts`, `store-selection-actions.ts`, and `supabase-merchant-auth-adapter.ts` when Supabase authority is active.
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

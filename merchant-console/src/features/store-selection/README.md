# Merchant Store Selection

Status: Active
Authority: Operational
Surface: merchant-console
Domains: store-selection, access-handoff, merchant-console
Last updated: 2026-03-16
Retrieve when:
- editing the merchant store-selection route or handoff into store-scoped pages
- changing selected-store behavior or redirects
- checking whether store selection is persisted or only demo-safe
Related files:
- merchant-console/src/app/(console)/select-store/page.tsx
- merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx
- merchant-console/src/features/store-selection/server/store-selection-actions.ts
- merchant-console/src/shared/auth/merchant-session.ts
- merchant-console/src/features/auth/server/access.ts
- merchant-console/src/app/(console)/[storeId]/layout.tsx

## Purpose

Owns the merchant store-selection step between onboarding and store-scoped console routes.

## Primary Routes and Screens

- `/(console)/select-store` -> `merchant-console/src/app/(console)/select-store/page.tsx`
- Screen component -> `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- Handoff target -> `/(console)/[storeId]/dashboard` through `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Source of Truth

- Selected-store cookie: `merchant-console/src/shared/auth/merchant-session.ts`
- Store-selection write path: `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- Redirect rules before and after selection: `merchant-console/src/features/auth/server/access.ts`

This feature has split truth: selected store is stored in a cookie, but the available store list is hardcoded in the screen.

## Key Files to Read First

- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/features/auth/server/access.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/features/store-selection/state/store-selection-placeholder-state.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- The store list is a single demo option plus a disabled fake add-store card.
- Store lookup is not repository-backed.
- Selected-store persistence is cookie-only and local to the current browser/session context.
- The redirect target is hardcoded to `demo-store`.

## Safe Modification Guidance

- Change selected-store persistence in `merchant-session.ts` and `store-selection-actions.ts` together.
- Keep store-scoped redirects aligned with `ensureMerchantStoreScope`.
- If adding a real store list later, replace the hardcoded screen inputs without changing the route ownership model.

## What Not to Change Casually

- Do not treat the store list UI as authoritative merchant/store data.
- Do not add hidden client-only store context that bypasses the selected-store cookie.
- Do not break the `/select-store` -> `/${storeId}/dashboard` handoff shape without updating access guards.

# Merchant Settings

Status: Active
Authority: Operational
Surface: merchant-console
Domains: settings, merchant-preferences, account-controls
Last updated: 2026-03-17
Retrieve when:
- editing the merchant settings route
- checking whether a settings change is local UI only or store-scoped read data
Related files:
- merchant-console/src/app/(console)/[storeId]/settings/page.tsx
- merchant-console/src/features/settings/presentation/settings-screen.tsx
- merchant-console/src/shared/data/merchant-query-services.ts
- merchant-console/src/shared/data/merchant-repository.ts

## Purpose

Owns the store-scoped settings route and its account, notification, and preference controls.

## Primary Routes and Screens

- `/(console)/[storeId]/settings` -> `merchant-console/src/app/(console)/[storeId]/settings/page.tsx`
- Screen component -> `merchant-console/src/features/settings/presentation/settings-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/settings/page.tsx`
- Read-path truth for store context flows through `merchant-console/src/shared/data/merchant-query-services.ts`
- Most toggle and form behavior stays local to `settings-screen.tsx`

This route is store-scoped, but most settings controls are local/demo-safe UI state.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/settings/page.tsx`
- `merchant-console/src/features/settings/presentation/settings-screen.tsx`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Settings controls are mostly local UI state only.
- There is no live merchant account settings backend.
- Store context is real, but preference persistence is not.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change settings composition and local control behavior in `settings-screen.tsx`.
- Change store read context in query/repository files only if the route needs different store-backed data.

## What Not to Change Casually

- Do not describe local toggle state as persisted account truth.
- Do not move store-scope logic into presentation widgets.
- Do not bypass the route-level store context.

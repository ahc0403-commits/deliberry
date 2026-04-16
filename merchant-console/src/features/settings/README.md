# Merchant Settings

Status: Active
Authority: Operational
Surface: merchant-console
Domains: settings, merchant-preferences, account-controls
Last updated: 2026-04-15
Retrieve when:
- editing the merchant settings route
- checking whether a settings change is local UI only or store-scoped read data
Related files:
- merchant-console/src/app/(console)/[storeId]/settings/page.tsx
- merchant-console/src/features/settings/presentation/settings-screen.tsx
- merchant-console/src/shared/data/merchant-settings-runtime-service.ts

## Purpose

Owns the store-scoped settings route and its account, notification, and preference controls.

## Primary Routes and Screens

- `/(console)/[storeId]/settings` -> `merchant-console/src/app/(console)/[storeId]/settings/page.tsx`
- Screen component -> `merchant-console/src/features/settings/presentation/settings-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/settings/page.tsx`
- Read and write runtime truth for settings flows through `merchant-console/src/shared/data/merchant-settings-runtime-service.ts`
- Most toggle and form behavior stays local to `settings-screen.tsx`

This route is store-scoped. Runtime settings data is persisted, while some individual screen interactions still remain local UI state.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/settings/page.tsx`
- `merchant-console/src/features/settings/presentation/settings-screen.tsx`
- `merchant-console/src/shared/data/merchant-settings-runtime-service.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Settings data is persisted through the runtime service.
- Some toggle and form behavior is still local UI state layered over that persisted record.
- There is still no broad merchant account platform backend beyond the scoped settings runtime path.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change settings composition and local control behavior in `settings-screen.tsx`.
- Change store read or write behavior in `merchant-settings-runtime-service.ts` if the route needs different persisted data.

## What Not to Change Casually

- Do not describe local toggle state as persisted account truth.
- Do not move store-scope logic into presentation widgets.
- Do not bypass the route-level store context.

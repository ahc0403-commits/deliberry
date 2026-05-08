# Admin Merchant Customer Runtime Verification — 2026-04-24

Status: active
Authority: operational
Surface: admin-console, merchant-console, customer-app
Domains: runtime-verification, provisioning, menu, guest-browsing
Last updated: 2026-04-24

## Purpose

Capture the cross-surface verification result for the current local runtime path:

- admin provisions merchant and store
- merchant signs in and manages store/menu
- customer browses the resulting store/menu in guest mode

## Scope

- admin `/(platform)/stores`
- admin `/(platform)/merchants`
- merchant `/login`
- merchant `/${storeId}/dashboard`
- merchant `/${storeId}/store`
- merchant `/${storeId}/menu`
- customer guest entry
- customer home and store detail

## Verified Runtime Path

1. Admin store governance provisions merchant owner auth user, merchant profile, first store, membership, and audit log.
2. Merchant owner signs in with the provisioned credentials and lands in the store-scoped console.
3. Merchant can:
   - toggle `accepting_orders`
   - create a menu item
   - upload a menu photo
   - toggle menu availability
4. Customer app launched with local Supabase runtime defines can browse as guest and see:
   - the newly created store on home/discovery
   - the newly created menu item on store detail

## Concrete Verified Example

- Merchant business: `Codex Smoke Merchant`
- Store: `Codex Smoke Kitchen`
- Merchant login: `codex-smoke-0424@deliberry.local`
- Menu item: `Codex Smoke Banh Mi`
- Category: `Smoke Specials`

## What Was Corrected During Verification

- Merchant console header now uses the active runtime store name instead of a hardcoded seeded label.
- Merchant login copy now matches the admin-provisioned account flow.
- Merchant dashboard alert/KPI cards no longer leak mock KPI defaults into persisted store scope.
- Merchant dashboard empty states now explain no-order / no-alert conditions without fake operating events.
- Merchant analytics now derives KPI cards, recent revenue bars, and top-item rows from runtime order/review/menu reads instead of a screen-local fixture snapshot.
- Merchant promotions now flow through a runtime service that preserves persisted store identity while keeping campaign rows explicitly snapshot-only.
- Merchant store/menu reads now have owner-scoped RLS coverage for newly provisioned stores that are not yet customer-visible.
- Customer home featured-store cards were resized to eliminate the overflow regression found during guest browsing.

## Current Truth After Verification

- Admin provisioning is the current canonical live path for operator-created merchant accounts.
- Merchant menu data is persisted in `public.store_menu_items`.
- Merchant menu photos are stored in Supabase Storage bucket `menu-item-images`.
- Customer guest browsing can read customer-visible stores and available menu items from local Supabase runtime when `SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided at launch.
- Merchant dashboard is runtime-owned, with explicit fallback behavior still allowed by compatibility policy.

## Non-Blocking Limits

- Merchant promotions remain current-phase snapshot data, even though store scope is now resolved through a runtime service.
- Merchant analytics is runtime-derived but still not a dedicated reporting backend.
- Settlement is still read-only and must not be interpreted as a live payout-control workflow.
- Payment verification remains excluded.

## Verification Commands

- `npm run typecheck` in `admin-console`
- `npm run build` in `admin-console`
- `npm run typecheck` in `merchant-console`
- `npm run build` in `merchant-console`
- `flutter analyze` in `customer-app`
- `flutter test` in `customer-app`
- `bash scripts/governance-scan.sh`
- `deno check supabase/functions/generate-settlement/index.ts`
- `deno check supabase/functions/trigger-settlement/index.ts`
- `deno check supabase/functions/_shared/settlement-core.ts`

# Merchant Registration And First Use Audit — 2026-04-22

Status: active
Authority: operational
Surface: merchant-console, public-website
Domains: merchant, registration, onboarding, store-selection, first-use
Last updated: 2026-04-24

## Purpose

Capture the remediation and verification result for the merchant registration and first-use audit run on 2026-04-22.

## Scope

- public `/merchant` partner acquisition route
- merchant `/login`
- merchant `/onboarding`
- merchant `/select-store`
- merchant first arrival at `/${storeId}/dashboard`

## What Was Fixed

- `merchant-console/middleware.ts` now stays permissive under `supabase` authority so cookie-only demo guards do not override the current server-side auth truth.
- `merchant-console/src/features/auth/presentation/login-screen.tsx` no longer points new merchants at a placeholder external URL. It now resolves the public `/merchant` route from `NEXT_PUBLIC_PUBLIC_WEBSITE_URL` and falls back to `partners@deliberry.com`.
- `merchant-console/src/shared/auth/supabase-merchant-auth-adapter.ts` now calls `set_merchant_default_store` through the authenticated server client, which matches the hardened `auth.uid()` RPC contract.
- merchant onboarding and store-selection docs/copy were lowered to match current operational truth: console continuation exists, but verified partner approval and live merchant provisioning do not.
- `merchant-console/.env.local` no longer forces `MERCHANT_AUTH_AUTHORITY=demo-cookie`, so local merchant dev now follows Supabase authority when Supabase env vars are present.
- merchant dashboard now reads through the runtime service and discloses persisted vs fallback source directly in the UI.
- admin store governance can now provision a merchant owner auth user, merchant profile, first store, default membership, and audit log entry from `/(platform)/stores`.
- merchant menu first-use now supports persisted add/edit item, availability changes, and menu photo upload through store-scoped server actions.

## Verification Result

Verified against local dev servers on 2026-04-22:

1. `http://localhost:3000/merchant`
   - manual handoff copy present
   - partner email CTA present
2. `http://localhost:3002/login`
   - merchant login screen renders
   - partner CTA no longer points at `your-main-site.com`
3. server-action path
   - route truth still supports `/login` -> `/onboarding` -> `/select-store` -> `/demo-store/dashboard`
   - under current seeded Supabase merchant state, `/login` can also resolve directly to `/demo-store/dashboard`
4. dashboard landing
   - `Dashboard` present
   - route resolves through the dashboard runtime service
   - current local verification now shows `Runtime-backed store snapshot`

## Current Truth

- public merchant acquisition is still manual and email-backed
- merchant console entry is route-real
- merchant first-use handoff is coherent through login, onboarding, store selection, and dashboard
- merchant dashboard is now runtime-owned with explicit fallback rather than directly fixture-owned
- local merchant dev defaults back to Supabase authority when Supabase env vars are present
- admin-created merchant/store provisioning is now the canonical first-use path for an operator-created merchant account
- merchant menu data is runtime-owned by `public.store_menu_items`; photos are stored in `menu-item-images`

## Remaining Non-Blocking Limits

- public `/merchant` still does not provision a merchant account or submit to a live intake backend; admin provisioning is the current live path
- merchant onboarding still does not represent verified business approval; admin-created merchants are marked onboarding-complete after governance provisioning
- merchant dashboard can still fall back to fixture visibility depending on runtime compatibility and persisted-read conditions
- menu category CRUD is not separate yet; categories are text labels on menu items

## Verification Commands

- `npm run typecheck` in `merchant-console`
- `npm run typecheck` in `admin-console`
- `supabase migration up --local`
- `bash scripts/governance-scan.sh`
- local HTTP checks against `public-website` and `merchant-console` dev servers

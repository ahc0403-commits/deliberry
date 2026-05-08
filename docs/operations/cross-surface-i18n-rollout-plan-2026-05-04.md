# Cross-Surface i18n Rollout Plan

Date: 2026-05-04
Status: active baseline with coverage hardening
Surface: cross-surface

## Goal

Deliberry must support English, Korean, and Vietnamese across:

- `customer-app`
- `merchant-console`
- `admin-console`
- `public-website`

Users must be able to change language from any screen. The selected language must persist across reloads or app restarts.

## Boundary Decision

The repo-level `shared` layer may only define the neutral locale contract:

- default locale
- supported locale codes
- locale display labels

It must not contain translation dictionaries, UI components, app state, routing, or runtime orchestration.

Implemented contract:

- `shared/constants/i18n.constants.json`

## Surface Ownership

Each surface owns its own i18n runtime:

- `public-website/src/shared/i18n`
- `merchant-console/src/shared/i18n`
- `admin-console/src/shared/i18n`
- `customer-app/lib/core/i18n`

This keeps framework-specific code local to each surface and preserves the architecture boundary rules.

## Current Implementation

Web surfaces use:

- cookie key: `dlb_locale`
- supported locales: `en`, `ko`, `vi`
- root layout `html lang` synchronization
- surface-local provider
- fixed language selector available globally
- surface-local raw copy bridge for existing hardcoded screen text and common text-bearing attributes such as placeholders, titles, alt text, and ARIA labels
- targeted raw-copy coverage for audited public legal, merchant review/analytics, and admin order/finance screen copy

Customer app uses:

- `SharedPreferences` key: `dlb_locale`
- `MaterialApp.locale`
- Flutter localization delegates
- global language overlay
- direct l10n keys for navigation, settings, entry, auth, cart, profile, checkout, orders, addresses, notifications, reviews, group order, store, search, onboarding, and mock promotion/notification display copy
- parameterized l10n helpers for dynamic search result copy, filter counts, signed-in profile copy, and unavailable setting/action messages
- common widget raw-copy localization for section headers, empty states, search hints, account tiles, price rows, and info pills

## Migration Strategy

The raw copy bridge is a transition layer for existing web screen copy. It should remain surface-local and be reduced over time as screens move to explicit translation keys.

Recommended next migration order:

1. Customer app residual data labels and dynamic runtime messages that are intentionally still passed through raw-copy localization
2. Public website raw-copy entries to explicit translation keys
3. Merchant console raw-copy entries to explicit translation keys
4. Admin console raw-copy entries to explicit translation keys

## QA Checklist

- Switching to English, Korean, and Vietnamese works from any screen.
- Reloading web surfaces keeps the selected language.
- Restarting the customer app keeps the selected language.
- Web root `html lang` matches the selected locale.
- Customer `MaterialApp.locale` matches the selected locale.
- Navigation, shell, auth, settings, and priority transactional text localize.
- Long Korean and Vietnamese text does not overflow primary shell controls.
- No i18n runtime code is moved into repo-level `shared`.

## Verification

Latest local verification:

- `public-website`: `npm run typecheck`
- `merchant-console`: `npm run typecheck`
- `admin-console`: `npm run typecheck`
- `customer-app`: `flutter analyze`
- Web raw-copy dictionaries: Korean and Vietnamese key parity verified for public website, merchant console, and admin console after the audit hardening pass.
- Customer app raw-copy dictionary: Korean and Vietnamese key parity verified.

## 2026-05-04 Audit Hardening Notes

The i18n audit found that the first rollout had correct global selectors, persistence, and shared-boundary separation, but still had untranslated static and dynamic copy in several priority screens.

Hardening completed in this pass:

- `public-website`: added KO/VI raw-copy coverage for audited terms and privacy legal copy.
- `merchant-console`: added KO/VI raw-copy coverage for reviews and analytics copy, plus a surface-local raw helper for client-side dynamic review counts.
- `admin-console`: added KO/VI raw-copy coverage for order and finance oversight copy, plus a surface-local raw helper for client-side order count and pane labels.
- `customer-app`: replaced audited raw-copy misses with parameterized localization helpers for search empty states, result/filter counts, profile phone/account copy, and unavailable action snackbars.

Remaining risk is limited to future copy introduced after this pass. New user-facing strings must be added to the owning surface dictionary or to explicit parameterized localization helpers when runtime values are involved.

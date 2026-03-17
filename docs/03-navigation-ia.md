# Deliberry Navigation and Information Architecture

Status: active
Authority: binding
Surface: cross-surface
Domains: navigation, routing, shells
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- planning route groups, shells, or surface entry flows
- checking route ownership before editing routers or layouts
Related files:
- docs/02-surface-ownership.md
- customer-app/lib/app/router/app_router.dart
- merchant-console/src/app/(console)/layout.tsx
- admin-console/src/app/(platform)/layout.tsx

## Purpose

This document defines navigation ownership and route grouping strategy for all surfaces.

## Route Grouping Strategy

### Customer App

Navigation is owned by `customer-app/lib/app/router/` and `customer-app/lib/app/shells/`.

Recommended route groups:

- `/auth`
- `/onboarding`
- `/home`
- `/search`
- `/store`
- `/group-order`
- `/cart`
- `/checkout`
- `/orders`
- `/reviews`
- `/profile`
- `/addresses`
- `/notifications`

Recommended shell shape:

- main shell tabs: `home`, `search`, `orders`, `profile`
- guarded standalone flows: `auth`, `onboarding`, `group-order`, `checkout`

### Merchant Console

Navigation is owned by `merchant-console/src/app`.

Recommended route groups:

- `(auth)/login`
- `(auth)/onboarding`
- `(console)/select-store`
- `(console)/[storeId]/dashboard`
- `(console)/[storeId]/orders`
- `(console)/[storeId]/menu`
- `(console)/[storeId]/store`
- `(console)/[storeId]/reviews`
- `(console)/[storeId]/promotions`
- `(console)/[storeId]/settlement`
- `(console)/[storeId]/analytics`
- `(console)/[storeId]/settings`

Reason for store-scoped routing:

- merchant workflows are store-bound by default
- deep linking must preserve store context
- store context should not depend on hidden client state alone

### Admin Console

Navigation is owned by `admin-console/src/app`.

Recommended route groups:

- `(auth)/login`
- `(platform)/dashboard`
- `(platform)/users`
- `(platform)/merchants`
- `(platform)/stores`
- `(platform)/orders`
- `(platform)/disputes`
- `(platform)/customer-service`
- `(platform)/settlements`
- `(platform)/finance`
- `(platform)/marketing`
- `(platform)/announcements`
- `(platform)/catalog`
- `(platform)/b2b`
- `(platform)/analytics`
- `(platform)/reporting`
- `(platform)/system-management`

Reason for platform grouping:

- admin scope is platform-wide, not store-scoped
- permissions and governance boundaries should stay explicit in the route tree

### Public Website

Navigation is owned by `public-website/src/app`.

Recommended route groups:

- `(marketing)/`
- `(marketing)/service`
- `(marketing)/merchant`
- `(marketing)/support`
- `(marketing)/download`
- `(legal)/privacy`
- `(legal)/terms`
- `(legal)/refund-policy`

Reason for public grouping:

- marketing and legal content have different ownership and maintenance cadence
- authenticated product flows must stay outside the public tree

## Information Architecture Rules

1. No business feature should start in a root `page.tsx` or directly inside `app.dart`.
2. Route groups define shell ownership first. Feature modules plug into those shells later.
3. Merchant and admin must never share a combined console shell.
4. Public website routes must stay content-first, not dashboard-first.
5. Customer app route ownership stays in the app layer, not scattered through feature folders.

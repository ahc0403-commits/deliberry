# Legacy Owner Decision -- 2026-04

Status: Active
Owner: governance remediation track
Last updated: 2026-04-15

## Decision

`adminQueryServices` and `merchantQueryServices` remain in the repo, but they are no longer treated as authoritative owners for routes already migrated to runtime-backed reads.

The canonical rule is:

- runtime-backed routes must read from their page-level runtime owner or a dedicated runtime service
- query-service layers remain valid only for fixture-backed routes that still intentionally depend on in-memory repositories

## Admin Decision

`adminQueryServices` is retained as a legacy fixture abstraction for dashboard-style and placeholder domains that still read from `admin-repository.ts`.

It is not authoritative for:

- `/(platform)/orders`
- `/(platform)/disputes`
- `/(platform)/system-management` audit visibility
- platform layout badge counts for users, orders, and disputes

Those paths now read from `supabase-admin-runtime-repository.ts` directly.

## Merchant Decision

`merchantQueryServices` is retained as a legacy fixture abstraction for routes that are still intentionally fixture-backed, such as menu, promotions, settlement, analytics, and any remaining placeholder screens that have not yet migrated.

It is not authoritative for:

- `/(console)/[storeId]/orders`
- `/(console)/[storeId]/reviews`
- `/(console)/[storeId]/settings`
- `/(console)/[storeId]/store`
- store-scoped layout badge counts for orders and reviews

Those paths now read from dedicated runtime services or runtime repositories.

## Consequences

- New docs must not describe query-service layers as live owners for migrated routes.
- New runtime-backed routes should not be wired through these query-service classes unless the class itself is deliberately migrated to a real runtime abstraction.
- Fixture-backed routes may continue to use query-service layers, but that status must be documented honestly.

## Follow-up

- Batch 5 handles wording honesty for excluded or placeholder features.
- Any future promotion of query-service layers to live abstractions must be an explicit architectural decision, not an accidental drift.

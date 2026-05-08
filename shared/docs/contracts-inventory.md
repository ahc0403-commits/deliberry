# Deliberry Shared Contracts Inventory

Status: active
Authority: advisory
Surface: shared
Domains: contracts, models, shared-ownership
Last updated: 2026-05-04
Last verified: 2026-05-04
Retrieve when:
- checking what shared currently owns
- auditing whether a new cross-surface type or contract belongs in shared
Related files:
- shared/docs/architecture-boundaries.md
- shared/constants/domain.constants.ts
- shared/types/domain.types.ts

## Purpose

This document defines the shared contract inventory for phase 8 and validates ownership boundaries between `shared` and the four product surfaces.

## Shared Owns

- canonical cross-surface domain vocabulary
- neutral DTO contracts
- neutral model shapes
- enums and constants
- primitive and domain types
- validation schemas
- pure utilities

## Shared Must Never Own

- UI components
- Flutter widgets
- React components
- router code
- app state
- permission runtime logic
- feature orchestration
- screen composition

## Domain Inventory

- `auth`: actor identity, auth challenge, auth session placeholder
- `store`: store summary, store settings, operating hours
- `menu`: menu category, menu item, modifier group
- `order`: order summary, order line item, order status, payment method placeholder
- `payment`: payment method selection, placeholder-safe payment status, sandbox-only provider readiness, future payment-event shape
- `review`: rating summary, review entry, merchant response summary; merchant response mutation now uses a governed audited RPC path
- `dispute`: dispute summary and audited status transition vocabulary; current production scope is limited to admin governed status transitions
- `promotion`: coupon and promotion summary, discount rule placeholder; current production scope is snapshot/read-only
- `settlement`: settlement summary, payout-state placeholder; current production scope is runtime visibility plus limited admin audited received acknowledgment
- `analytics`: range, metric slice, report summary
- `permission`: role, scope, permission matrix summary
- `support`: support case, support channel, inquiry state; current production scope is public contact plus limited admin audited status transitions

## Surface Boundary Notes

- `customer-app` may interpret shared contracts for customer flows, but customer UI/state remains local.
- `merchant-console` may consume shared contracts for store, menu, order, promotion, settlement, analytics, and support vocabulary, but merchant operational UI remains local.
- `admin-console` may consume shared contracts for permission, user/store/order/settlement/support/dispute vocabulary, but admin governance screens remain local.
- `public-website` may consume shared legal/support/channel vocabulary, but page composition remains local.

## Customer-App Adoption Note

`customer-app` must not directly import the current TypeScript shared layer.

Use the documented compatibility path in:

- `shared/docs/customer-app-shared-adoption-strategy.md`

## Placeholder Rules

- Payment methods may exist in shared as placeholder-safe labels and enums.
- Payment event shape may exist in shared as a future production contract, but it must not imply payment-state mutation approval.
- No payment verification or payment completion workflow may exist in shared.
- No realtime tracking states may imply actual realtime behavior.

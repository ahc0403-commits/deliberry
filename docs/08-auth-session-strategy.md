# Deliberry Auth and Session Strategy

Status: active
Authority: operational
Surface: cross-surface
Domains: auth, session, permissions
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing auth or session behavior across surfaces
- checking approved non-live auth/session direction before runtime work
Related files:
- docs/02-surface-ownership.md
- docs/03-navigation-ia.md
- customer-app/lib/core/session/customer_session_controller.dart
- merchant-console/src/shared/auth/merchant-session.ts
- admin-console/src/shared/auth/admin-session.ts

## Purpose

This document defines the approved auth, session, and permission runtime direction required before Track B implementation begins.

It does not rewrite phases 1 through 8.
It does not introduce data-layer work that belongs to later tracks.
It does not allow `shared` to become a runtime auth layer.

## Current State

The repository currently has:

- customer entry and auth skeleton routes
- merchant auth, onboarding, and store-selection skeleton routes
- admin auth and permission-boundary skeleton routes
- public website that remains public-only

The repository does **not** currently have:

- real customer session state
- real merchant session state
- real admin session state
- real admin permission enforcement
- approved backend identity integration

## Customer App Strategy

### Approved auth mechanism

- customer auth remains phone + OTP based
- guest mode remains explicit
- onboarding remains a separate branch after auth decision

### OTP and login handling direction

- login, phone entry, and OTP entry stay inside `customer-app`
- OTP verification runtime stays customer-local
- no shared runtime auth helpers may be introduced

### Local persistence and session handling direction

- use a customer-local session controller
- keep session state inside `customer-app/lib/core` or `customer-app/lib/shared`
- session restoration must remain customer-local
- direct TypeScript imports from `shared` are not allowed

### Guest mode handling

- guest mode remains a real route branch
- guest access must stay explicit, not hidden as an alias
- guest restrictions remain customer-local policy

### Out of scope until later tracks

- backend auth provider wiring
- server-backed account sync
- profile hydration from live APIs
- production-grade session refresh

## Merchant Console Strategy

### Approved auth mechanism

- merchant auth remains merchant-local
- merchant login, onboarding, and store selection remain distinct steps

### Session persistence pattern

- use merchant-local web session persistence
- keep merchant session ownership inside `merchant-console`
- session runtime must not be shared with admin

### Store-context gate approach

- store selection remains part of the merchant access boundary
- selected store context must be enforced locally in merchant runtime
- merchant onboarding completion and selected-store state must be separated

### Route protection approach

- no merchant session -> `/login`
- session but onboarding incomplete -> `/onboarding`
- onboarding complete but no store selected -> `/select-store`
- valid session and selected store -> store-scoped console routes

### Out of scope until later tracks

- backend identity integration
- live merchant data loading
- payment verification
- settlement finalization workflows

## Admin Console Strategy

### Approved auth mechanism

- admin auth remains admin-local
- admin login remains separate from merchant auth

### Session persistence pattern

- use admin-local web session persistence
- admin session must not reuse merchant session logic

### Admin-only route protection

- no admin session -> `/login`
- session without resolved permission scope -> `/access-boundary`
- session with valid role/scope -> platform routes

### Permission enforcement approach

- permissions remain admin-local runtime logic
- route gating must enforce access, not only hide navigation links
- high-risk routes such as finance, settlements, marketing, and system management must be guarded explicitly

### Role and permission boundary direction

- role and scope evaluation belongs in `admin-console`
- permission runtime must not move into `shared`
- permission contracts may live in `shared`, but not permission engines

### Out of scope until later tracks

- backend IAM integration
- live policy source loading
- finance and settlement backend orchestration

## Public Website Rule

- `public-website` stays public-only
- no authenticated merchant/admin/customer console behavior belongs there
- merchant onboarding and inquiry remain public entry only

## Shared Boundary Rule

`shared` remains contract-only because:

- runtime models differ across Flutter and Next.js
- auth/session behavior is surface-specific
- permission enforcement is ownership-specific
- placing runtime auth/session logic in `shared` would collapse product boundaries

`shared` may define:

- auth-related contracts
- roles, statuses, and constants
- validation schemas
- pure utilities

`shared` must never define:

- session storage
- route guards
- auth providers
- permission engines
- runtime orchestration

## Track B Guardrails

Codex may implement after this document exists:

- customer-local auth/session controller
- merchant-local session and store-context gating
- admin-local session and permission enforcement
- route guards and access boundaries within each surface
- local persistence/session handling per surface

Codex must still not implement until Track C:

- backend auth/data provider integration
- repository/data-layer orchestration
- DTO hydration from live APIs
- production-grade sync/refresh behavior
- payment verification

## Decision Summary

### Approved strategy by surface

- `customer-app`: customer-local phone/OTP auth with explicit guest and onboarding branches
- `merchant-console`: merchant-local session with onboarding and selected-store gates
- `admin-console`: admin-local session with role/scope enforcement
- `public-website`: remains public-only
- `shared`: contract-only, never runtime auth

### Prerequisite checklist for starting Track B implementation

1. customer-local auth/session controller location agreed
2. merchant session persistence and selected-store gate agreed
3. admin session persistence and permission gate model agreed
4. public website confirmed as public-only during Track B
5. shared confirmed as contract-only during Track B
6. explicit list of Track C deferrals accepted

# Deliberry Post-Phase Roadmap

Status: active
Authority: advisory
Surface: cross-surface
Domains: roadmap, sequencing, post-skeleton work
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- planning work beyond the original structure/skeleton phases
- checking which post-phase tracks are already approved in principle
Related files:
- docs/05-implementation-phases.md
- docs/08-auth-session-strategy.md
- docs/governance/WAVE_TRACKER.md

## Purpose

This document defines what comes after the current skeleton-complete state established by phases 1 through 8.

It does not rewrite phases 1 through 8.
It does not change architecture ownership.
It does not introduce new product scope by assumption.

Its role is to guide the next implementation stage once the repository has already completed:

- structure freeze
- shell and navigation skeletons
- entry and access boundaries
- customer skeleton
- merchant skeleton
- admin skeleton
- public website skeleton
- shared contract consolidation

## Current Completed State

The repository is currently at a skeleton-complete baseline.

That means:

- `customer-app`, `merchant-console`, `admin-console`, `public-website`, and `shared` are structurally separated.
- each surface owns its own route tree and shell structure.
- customer, merchant, admin, and public core flows exist at stub or placeholder level.
- `shared` exists as a contract-only layer with constants, models, types, schemas, and pure utilities.
- surface-local feature ownership is already established.

This does **not** mean:

- production-ready auth
- production-ready data layer
- full backend orchestration
- final feature completeness
- final QA or release readiness

## Post-Phase Implementation Tracks

Post-phase work should be organized as realistic execution tracks rather than treated as automatic continuation of skeleton phases.

### Track A: Shared Adoption and Contract Wiring

Purpose:
- adopt the shared contract layer inside each surface in a controlled way
- replace duplicated local vocabulary where shared contracts are clearly canonical

Focus:
- order/status vocabulary
- permission vocabulary
- settlement/payment placeholder vocabulary
- support/legal vocabulary
- shared schema adoption where it improves consistency

### Track B: Real Auth, Session, and Permission Integration

Purpose:
- replace auth skeletons with real auth/session infrastructure
- implement permission checks where the current code only expresses boundaries

Focus:
- customer auth and guest/onboarding continuation
- merchant auth and store-scoped access
- admin auth and permission enforcement
- no cross-surface auth mixing

### Track C: Data Layer and Repository Integration

Purpose:
- connect surfaces to real backend-facing repositories, clients, and persistence

Focus:
- surface-local repository and service layers
- DTO-to-domain mapping
- caching and fetch orchestration local to each surface
- no runtime orchestration moved into `shared`

### Track D: Customer Feature Deepening

Purpose:
- deepen customer placeholders into production-facing customer flows

Focus:
- onboarding completion
- discovery/search/store/menu depth
- cart and checkout depth
- orders, reviews, profile, addresses, notifications

### Track E: Merchant Feature Deepening

Purpose:
- deepen merchant operational placeholders into real merchant workflows

Focus:
- onboarding and store selection completion
- dashboard, orders, menu, store management
- reviews/customer response
- coupons/promotions
- settlement visibility
- analytics and settings

### Track F: Admin Feature Deepening

Purpose:
- deepen platform governance placeholders into real admin workflows

Focus:
- permissions
- user, merchant, store governance
- order, dispute, customer-service operations
- settlement and finance oversight
- marketing, announcements, catalog, B2B
- analytics, reporting, system management

### Track G: Public Website Content and Conversion Completion

Purpose:
- turn public placeholders into complete public-facing content and conversion flows

Focus:
- landing page content completion
- service introduction depth
- merchant onboarding and inquiry conversion
- support information completion
- legal content completion
- app download conversion

## Suggested Sequencing

### 1. Shared Adoption Inside Each Surface

Recommended order:
- admin-console
- merchant-console
- public-website
- customer-app

Reason:
- admin and merchant have the highest need for shared governance/status vocabulary
- public can adopt legal/support vocabulary cleanly
- customer should adopt only proven shared contracts, not force cross-runtime coupling

### 2. Real Auth Integration

Recommended order:
- customer-app
- merchant-console
- admin-console

Reason:
- customer auth affects the largest user-facing flow surface
- merchant auth must preserve store-scoped entry
- admin auth must remain permission-aware and governance-specific

### 3. Real Data Layer Integration

Recommended order:
- customer-app
- merchant-console
- admin-console
- public-website

Reason:
- customer and merchant flows gain the most immediate value from replacing placeholders
- admin depends on stable operational vocabulary and governance models
- public website content can remain static longer if needed

### 4. Customer Feature Deepening

Recommended order:
- auth/onboarding
- home/discovery
- search/filter
- store/menu
- cart/checkout
- orders/reviews
- profile/settings/addresses/notifications

### 5. Merchant Feature Deepening

Recommended order:
- onboarding/store selection
- dashboard
- orders
- menu
- store management
- reviews/customer response
- promotions
- settlement
- analytics/settings

### 6. Admin Feature Deepening

Recommended order:
- auth/permissions
- dashboard
- users/merchants/stores
- orders/disputes/customer-service
- settlements/finance
- marketing/announcements
- catalog/B2B
- analytics/reporting/system management

### 7. Public Website Content Completion

Recommended order:
- landing
- service introduction
- merchant onboarding
- support
- legal
- app download

## Explicit Exclusions Still Remain Excluded

The following remain excluded until the core documents are explicitly changed:

- payment verification
- map API address autocomplete
- QR generation library
- QR scanner camera integration
- real-time order tracking

Additional enforcement:

- payment method selection may deepen structurally, but must remain placeholder-safe until docs change
- settlement and finance may remain informational without turning into real payment verification

## Guardrails for Post-Phase Work

1. Do not collapse the five-surface architecture.
2. Do not move UI, router code, app state, or runtime orchestration into `shared`.
3. Do not turn track-based work into arbitrary scope expansion.
4. Do not let merchant and admin share workflow code just because they share vocabulary.
5. Do not let public website absorb authenticated product behavior.
6. Do not treat old code as the architecture base.
7. Do not treat placeholder-safe payment vocabulary as approval to build verification logic.

## Recommendation: Phase 9+ or Separate Tracks

Recommended default:
- keep this roadmap as a **separate track-based execution plan**

Reason:
- phases 1 through 8 were skeleton-oriented and sequential by nature
- post-phase work is broader and may progress at different speeds by surface
- forcing everything into one long linear phase chain will create artificial blocking between unrelated tracks

When to promote work into `Phase 9+`:
- only if the team wants a strict serial execution model again
- only after prioritizing which track must happen first
- only after deciding whether auth/data adoption is more important than feature deepening

Practical guidance:
- use this roadmap for planning and prioritization first
- convert a chosen track into a numbered phase only when the team wants implementation to follow a single mandatory order

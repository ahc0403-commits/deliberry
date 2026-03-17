# Deliberry Agent Rules

## Source of truth documents
Always read and obey these files before doing any work:
- docs/01-product-architecture.md
- docs/02-surface-ownership.md
- docs/03-navigation-ia.md
- docs/04-feature-inventory.md
- docs/05-implementation-phases.md
- docs/06-guardrails.md
- shared/docs/architecture-boundaries.md

## Core execution rules
- Docs are the source of truth.
- If code conflicts with docs, docs win.
- Do not reduce scope to MVP.
- Do not redesign visuals first.
- Do not remove features unless explicitly excluded.
- Treat old code only as feature reference, never as architecture base.

## Surface separation
Deliberry is strictly separated into:
- customer-app
- merchant-console
- admin-console
- public-website
- shared

## Shared rules
shared may contain only:
- contracts
- models
- enums/constants
- types
- validation schemas
- pure utilities

shared must never contain:
- UI components
- router code
- app state
- runtime-specific orchestration
- feature ownership logic

## Explicit exclusions
- payment verification
- map API address autocomplete
- QR generation library
- QR scanner camera integration
- real-time order tracking

## Payment rule
- keep payment method selection in checkout
- keep card / pay methods only as future-ready placeholders
- do not implement real PG verification or payment completion logic

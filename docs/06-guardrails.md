# Deliberry Guardrails

Status: active
Authority: binding
Surface: cross-surface
Domains: guardrails, exclusions, implementation-safety
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- checking whether a proposed implementation is forbidden
- validating exclusions, shared-layer rules, or risky architecture changes
Related files:
- docs/01-product-architecture.md
- docs/02-surface-ownership.md
- shared/docs/architecture-boundaries.md

## Purpose

This document defines non-negotiable rules for future Codex implementation runs.

## Codex Must Never Do

- collapse customer, merchant, admin, and public into one product surface
- move UI components into repo-level `shared`
- move router code into repo-level `shared`
- move app state or runtime orchestration into repo-level `shared`
- use old code structure as the architecture base
- implement excluded features
- implement payment verification or payment completion logic
- start UI styling work before structure and navigation ownership are settled
- introduce workspace tooling unless a real cross-surface need is proven first

## What Must Be Debated Before Implementation

- any proposal to move code into repo-level `shared`
- any proposal to share merchant and admin shells or route groups
- any proposal to change route grouping strategy
- any proposal to reintroduce excluded features
- any proposal to expand placeholders into real integrations
- any proposal to add monorepo orchestration or shared package tooling

## Shared Rules

Repo-level `shared` may contain only:

- contracts
- DTOs
- models
- enums and constants
- types
- validation schemas
- pure utilities
- architecture and reference docs

Repo-level `shared` must never contain:

- UI components
- router code
- app state
- runtime-specific orchestration
- customer-specific business flows
- merchant-specific business flows
- admin-specific business flows
- public website composition

## Placeholder vs Excluded

### Placeholder-Only

Placeholder-only means the user-facing structure may exist, but the underlying real integration must not be implemented yet.

Examples:

- checkout payment method selection
- card and pay method options
- settlement or finance payment-state views that stay informational only

### Excluded

Excluded means no partial implementation, no hidden plumbing, and no preparatory surface behavior beyond documentation.

Excluded features:

- payment verification
- map API address autocomplete
- QR generation library
- QR scanner camera integration
- real-time order tracking

## Implementation Review Rules

Before any future implementation run:

1. confirm the target surface owner
2. confirm the target route group or shell owner
3. confirm whether the work belongs in a surface-local folder or `shared`
4. confirm whether the requested behavior is full-scope, placeholder-only, or excluded
5. confirm that no feature implementation is starting from a root placeholder file without a feature module

## Source of Truth Rule

Future Codex runs should treat the following as the architecture baseline:

- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`

If a new task conflicts with these docs, the conflict should be surfaced and resolved before implementation proceeds.

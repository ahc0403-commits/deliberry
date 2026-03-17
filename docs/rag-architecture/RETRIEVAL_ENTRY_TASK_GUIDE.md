# Retrieval Entry: Task Guide

Status: Active
Authority: Operational
Surface: cross-surface
Domains: retrieval, task-recipes, startup-sequences
Last updated: 2026-03-17
Retrieve when:
- you know the task shape but not which docs to open first
- you need a short retrieval recipe before editing code
Related files:
- docs/rag-architecture/RAG_ACTIVE_INDEX.md
- docs/rag-architecture/RAG_HISTORICAL_INDEX.md
- docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md
- docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md
- docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md
- docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md

## Surface Purpose

Cross-surface retrieval recipe guide for common coding tasks.

## Start Here First

1. [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
2. Relevant surface retrieval entry doc
3. Relevant runtime-truth doc
4. Relevant filemap
5. Relevant local feature README

## Binding Authority Docs

- [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md)
- [docs/governance/STRUCTURE.md](/Users/andremacmini/Deliberry/docs/governance/STRUCTURE.md)
- [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md)
- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)

## Runtime-Truth Docs to Read Next

- Customer:
  - [docs/runtime-truth/customer-runtime-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-runtime-truth.md)
- Merchant:
  - [docs/runtime-truth/merchant-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-auth-session-truth.md)
- Admin:
  - [docs/runtime-truth/admin-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-auth-session-truth.md)
- Public:
  - [docs/runtime-truth/public-landing-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-landing-truth.md)

## Filemaps to Read Next

- Customer:
  - [docs/filemaps/customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- Merchant:
  - [docs/filemaps/merchant-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-auth-filemap.md)
- Admin:
  - [docs/filemaps/admin-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-auth-filemap.md)
- Public:
  - [docs/filemaps/public-landing-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-landing-filemap.md)

## Local Feature READMEs to Read Next

- Customer:
  - [customer-app/lib/features/store/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/store/README.md)
  - [customer-app/lib/features/orders/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/README.md)
- Merchant:
  - [merchant-console/src/features/auth/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/README.md)
  - [merchant-console/src/features/store-selection/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/store-selection/README.md)
- Admin:
  - [admin-console/src/features/permissions/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/README.md)
- Public:
  - [public-website/src/features/landing/README.md](/Users/andremacmini/Deliberry/public-website/src/features/landing/README.md)
  - [public-website/src/features/legal/README.md](/Users/andremacmini/Deliberry/public-website/src/features/legal/README.md)

## Flow Docs to Read Next

- Customer:
  - [docs/flows/customer-browse-store-cart-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-browse-store-cart-flow.md)
  - [docs/flows/customer-checkout-orders-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-checkout-orders-flow.md)
- Merchant:
  - [docs/flows/merchant-auth-onboarding-flow.md](/Users/andremacmini/Deliberry/docs/flows/merchant-auth-onboarding-flow.md)
  - [docs/flows/merchant-store-selection-flow.md](/Users/andremacmini/Deliberry/docs/flows/merchant-store-selection-flow.md)
- Admin:
  - [docs/flows/admin-auth-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-auth-flow.md)
  - [docs/flows/admin-permissions-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-permissions-flow.md)
- Public:
  - [docs/flows/public-landing-to-download-flow.md](/Users/andremacmini/Deliberry/docs/flows/public-landing-to-download-flow.md)
  - [docs/flows/public-legal-flow.md](/Users/andremacmini/Deliberry/docs/flows/public-legal-flow.md)

## Common Task Categories

- Fix a route bug
- Wire a CTA honestly
- Change a screen copy string safely
- Modify cart or checkout behavior
- Modify orders behavior
- Change merchant auth or store-selection behavior
- Change admin permission behavior
- Change public landing, legal, or support content
- Determine source of truth before editing
- Tell active vs historical docs apart

## Common Traps and False Source-of-Truth Locations

- Historical review docs in `reviews/` are not current authority unless [docs/rag-architecture/RAG_HISTORICAL_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_HISTORICAL_INDEX.md) says you are using them for history only.
- Presentation files are often not the truth owner when runtime/controller, cookie/session, or route files own the behavior.
- Shared data repositories are sometimes structural-only and not wired into live routes. Public routes are the clearest example.
- Mock or fixture data files often seed content but do not own mutable runtime truth.

## Fast Retrieval Sequence Examples

- Fix a route bug:
  - relevant surface entry -> navigation/flow doc -> filemap -> route owner file
- Wire a CTA honestly:
  - surface entry -> runtime-truth doc -> flow doc -> local README -> implementation file
- Change a screen copy string safely:
  - surface entry -> relevant README or runtime-truth doc -> route screen file
- Modify cart or checkout behavior:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md) -> [docs/runtime-truth/customer-cart-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-cart-truth.md) -> [docs/filemaps/customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)
- Modify orders behavior:
  - customer or merchant/admin surface entry -> orders runtime-truth doc -> orders filemap -> orders README
- Change merchant auth or store-selection behavior:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md) -> auth/store-selection runtime-truth doc -> matching filemap -> matching README
- Change admin permission behavior:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md) -> [docs/runtime-truth/admin-permissions-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-permissions-truth.md) -> [docs/filemaps/admin-permissions-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-permissions-filemap.md)
- Change public landing, legal, or support content:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md) -> relevant public runtime-truth doc -> relevant filemap -> relevant README
- Determine source of truth before editing:
  - [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md) -> surface retrieval entry -> runtime-truth doc
- Tell active vs historical docs apart:
  - [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md) for current authority
  - [docs/rag-architecture/RAG_HISTORICAL_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_HISTORICAL_INDEX.md) for superseded context only

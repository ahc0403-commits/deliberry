# Retrieval Entry: Merchant

Status: Active
Authority: Operational
Surface: merchant-console
Domains: retrieval, merchant-console, auth, store-selection, dashboard, orders, menu, reviews, promotions, analytics, settlement, settings, store-management
Last updated: 2026-03-17
Retrieve when:
- starting merchant-console implementation or debugging work
- determining which merchant route docs to open before editing code
Related files:
- docs/rag-architecture/RAG_ACTIVE_INDEX.md
- docs/runtime-truth/merchant-auth-session-truth.md
- docs/runtime-truth/merchant-store-selection-truth.md

## Surface Purpose

Merchant-facing console for login, onboarding handoff, store selection, and store-scoped operational views.

## Start Here First

1. [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
2. [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
3. [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
4. [docs/08-auth-session-strategy.md](/Users/andremacmini/Deliberry/docs/08-auth-session-strategy.md)

## Binding Authority Docs

- [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md)
- [docs/governance/STRUCTURE.md](/Users/andremacmini/Deliberry/docs/governance/STRUCTURE.md)
- [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md)
- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/08-auth-session-strategy.md](/Users/andremacmini/Deliberry/docs/08-auth-session-strategy.md)

## Runtime-Truth Docs to Read Next

- [docs/runtime-truth/merchant-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-auth-session-truth.md)
- [docs/runtime-truth/merchant-store-selection-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-store-selection-truth.md)
- [docs/runtime-truth/merchant-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-orders-truth.md)
- [docs/runtime-truth/merchant-menu-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-menu-truth.md)

## Filemaps to Read Next

- [docs/filemaps/merchant-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-auth-filemap.md)
- [docs/filemaps/merchant-store-selection-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-store-selection-filemap.md)
- [docs/filemaps/merchant-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-orders-filemap.md)
- [docs/filemaps/merchant-menu-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-menu-filemap.md)

## Local Feature READMEs to Read Next

- [merchant-console/src/features/auth/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/README.md)
- [merchant-console/src/features/store-selection/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/store-selection/README.md)
- [merchant-console/src/features/dashboard/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/dashboard/README.md)
- [merchant-console/src/features/orders/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/orders/README.md)
- [merchant-console/src/features/menu/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/menu/README.md)
- [merchant-console/src/features/reviews/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/reviews/README.md)
- [merchant-console/src/features/promotions/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/promotions/README.md)
- [merchant-console/src/features/analytics/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/analytics/README.md)
- [merchant-console/src/features/settlement/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/settlement/README.md)
- [merchant-console/src/features/settings/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/settings/README.md)
- [merchant-console/src/features/store-management/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/store-management/README.md)

## Flow Docs to Read Next

- [docs/flows/merchant-auth-onboarding-flow.md](/Users/andremacmini/Deliberry/docs/flows/merchant-auth-onboarding-flow.md)
- [docs/flows/merchant-store-selection-flow.md](/Users/andremacmini/Deliberry/docs/flows/merchant-store-selection-flow.md)
- [docs/flows/merchant-orders-flow.md](/Users/andremacmini/Deliberry/docs/flows/merchant-orders-flow.md)
- [docs/flows/merchant-menu-flow.md](/Users/andremacmini/Deliberry/docs/flows/merchant-menu-flow.md)

## Common Task Categories

- Merchant login, onboarding, and sign-out behavior
- Store-selection cookie and redirect continuity
- Store-scoped dashboard overview changes
- Store-scoped orders view behavior
- Store-scoped menu view behavior
- Store-scoped reviews view behavior
- Store-scoped promotions, analytics, settlement, settings, and store-management changes

## Common Traps and False Source-of-Truth Locations

- Do not assume route guards exist just because the route structure looks scoped; merchant docs explicitly call out structural-only enforcement gaps.
- Do not treat screen-local React state as durable source of truth for orders or menu.
- Do not mistake fixture-backed repository/query data for live backend integration.
- Do not start from visual route files when the real change is in cookie/session helpers.

## Fast Retrieval Sequence Examples

- Merchant auth or redirect bug:
  - [docs/runtime-truth/merchant-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-auth-session-truth.md) -> [docs/filemaps/merchant-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-auth-filemap.md) -> [merchant-console/src/features/auth/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/README.md)
- Store-selection handoff bug:
  - [docs/runtime-truth/merchant-store-selection-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-store-selection-truth.md) -> [docs/filemaps/merchant-store-selection-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-store-selection-filemap.md) -> [merchant-console/src/features/store-selection/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/store-selection/README.md)
- Orders or menu change:
  - relevant runtime-truth doc -> relevant filemap -> feature README -> screen code
- Dashboard or reviews change:
  - relevant feature README -> query-service/repository read path -> screen code
- Promotions, analytics, settlement, settings, or store-management change:
  - relevant feature README -> `merchant-query-services.ts` -> `merchant-repository.ts` -> screen code

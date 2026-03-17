# Retrieval Entry: Admin

Status: Active
Authority: Operational
Surface: admin-console
Domains: retrieval, admin-console, auth, permissions, dashboard, users, orders, disputes, customer-service, merchants, stores, settlements, finance, marketing, announcements, catalog, b2b, analytics, reporting, system-management
Last updated: 2026-03-17
Retrieve when:
- starting admin-console implementation or debugging work
- determining which admin route docs to read before editing
Related files:
- docs/rag-architecture/RAG_ACTIVE_INDEX.md
- docs/runtime-truth/admin-auth-session-truth.md
- docs/runtime-truth/admin-permissions-truth.md

## Surface Purpose

Platform-facing admin console for login, access-boundary selection, and platform oversight clusters such as orders and disputes.

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

- [docs/runtime-truth/admin-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-auth-session-truth.md)
- [docs/runtime-truth/admin-permissions-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-permissions-truth.md)
- [docs/runtime-truth/admin-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-orders-truth.md)
- [docs/runtime-truth/admin-disputes-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-disputes-truth.md)

## Filemaps to Read Next

- [docs/filemaps/admin-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-auth-filemap.md)
- [docs/filemaps/admin-permissions-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-permissions-filemap.md)
- [docs/filemaps/admin-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-orders-filemap.md)
- [docs/filemaps/admin-disputes-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-disputes-filemap.md)

## Local Feature READMEs to Read Next

- [admin-console/src/features/auth/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/auth/README.md)
- [admin-console/src/features/permissions/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/README.md)
- [admin-console/src/features/dashboard/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/dashboard/README.md)
- [admin-console/src/features/users/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/users/README.md)
- [admin-console/src/features/orders/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/orders/README.md)
- [admin-console/src/features/disputes/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/disputes/README.md)
- [admin-console/src/features/customer-service/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/customer-service/README.md)
- [admin-console/src/features/merchants/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/merchants/README.md)
- [admin-console/src/features/stores/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/stores/README.md)
- [admin-console/src/features/settlements/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/settlements/README.md)
- [admin-console/src/features/finance/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/finance/README.md)
- [admin-console/src/features/marketing/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/marketing/README.md)
- [admin-console/src/features/announcements/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/announcements/README.md)
- [admin-console/src/features/catalog/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/catalog/README.md)
- [admin-console/src/features/b2b/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/b2b/README.md)
- [admin-console/src/features/analytics/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/analytics/README.md)
- [admin-console/src/features/reporting/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/reporting/README.md)
- [admin-console/src/features/system-management/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/system-management/README.md)

## Flow Docs to Read Next

- [docs/flows/admin-auth-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-auth-flow.md)
- [docs/flows/admin-permissions-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-permissions-flow.md)
- [docs/flows/admin-orders-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-orders-flow.md)
- [docs/flows/admin-disputes-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-disputes-flow.md)

## Common Task Categories

- Login and sign-out behavior
- Access-boundary role-selection behavior
- Platform route enforcement gaps
- Dashboard and users overview changes
- Orders and disputes screen behavior on fixture-backed data
- Customer-service screen behavior on fixture-backed data
- Merchant, store, settlement, finance, marketing, announcements, catalog, b2b, analytics, reporting, and system-management changes

## Common Traps and False Source-of-Truth Locations

- Do not assume platform auth or permissions are route-enforced just because cookies exist.
- Do not treat presentation tabs, filters, or detail panels as authoritative runtime truth.
- Do not mistake fixture-backed query/repository data for live backend state.
- Do not use historical audits as permission truth when active runtime docs already define the current state.

## Fast Retrieval Sequence Examples

- Admin auth bug:
  - [docs/runtime-truth/admin-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-auth-session-truth.md) -> [docs/filemaps/admin-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-auth-filemap.md) -> [admin-console/src/features/auth/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/auth/README.md)
- Admin permission behavior change:
  - [docs/runtime-truth/admin-permissions-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-permissions-truth.md) -> [docs/filemaps/admin-permissions-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-permissions-filemap.md) -> [admin-console/src/features/permissions/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/README.md)
- Orders or disputes change:
  - relevant runtime-truth doc -> relevant filemap -> feature README -> screen code
- Dashboard, users, or customer-service change:
  - feature README -> query-service/repository read path -> screen code
- Any admin long-tail route change:
  - relevant feature README -> `admin-query-services.ts` -> `admin-repository.ts` -> screen code

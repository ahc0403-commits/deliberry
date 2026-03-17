# Filemap Strategy

Status: Proposed
Last updated: 2026-03-16

## Purpose

Filemaps should answer one coding question fast: “Which files do I need for this kind of change?”

## Recommended Filemap Families

- route filemaps
- runtime-truth filemaps
- flow filemaps
- shared-contract filemaps
- auth/session filemaps

## Recommended Template

```md
# <Filemap Name>

Status: Active
Authority: Operational
Surface: customer-app
Domains: navigation, checkout
Last updated: YYYY-MM-DD
Retrieve when:
- making a route change
- debugging shell ownership
Related files:
- primary path

## Primary Files
- file and why

## Adjacent Files
- file and why

## Usually Not Needed
- file and why

## Common Validation
- analyze/test command
```

## First Filemaps to Add

- customer route/runtime filemap
- customer browse-to-order flow filemap
- merchant auth/store-shell filemap
- admin auth/permission/platform filemap
- shared domain contract filemap

## Progress

Completed in Phase 1C on 2026-03-16:
- [docs/filemaps/customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- [docs/filemaps/customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)
- [docs/filemaps/customer-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-orders-filemap.md)
- [docs/filemaps/customer-search-filter-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-search-filter-filemap.md)

Completed in Phase 2B on 2026-03-16:
- [docs/filemaps/merchant-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-auth-filemap.md)
- [docs/filemaps/merchant-store-selection-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-store-selection-filemap.md)
- [docs/filemaps/merchant-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-orders-filemap.md)
- [docs/filemaps/merchant-menu-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/merchant-menu-filemap.md)

Completed in Phase 3B on 2026-03-16:
- [docs/filemaps/admin-auth-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-auth-filemap.md)
- [docs/filemaps/admin-permissions-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-permissions-filemap.md)
- [docs/filemaps/admin-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-orders-filemap.md)
- [docs/filemaps/admin-disputes-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/admin-disputes-filemap.md)

Completed in Phase 4B on 2026-03-16:
- [docs/filemaps/public-landing-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-landing-filemap.md)
- [docs/filemaps/public-app-download-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-app-download-filemap.md)
- [docs/filemaps/public-legal-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-legal-filemap.md)
- [docs/filemaps/public-support-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-support-filemap.md)

Recommended later:
- customer browse-to-order flow filemap
- shared domain contract filemap
- merchant dashboard/store-shell filemap
- merchant reviews/promotions filemap
- admin platform-shell filemap
- admin finance/settlements filemap
- public marketing-shell filemap
- public service/merchant filemap

## Anti-Patterns

- giant file inventories with no task focus
- filemaps that duplicate `rg --files`
- stale filemaps that are not updated when routing changes

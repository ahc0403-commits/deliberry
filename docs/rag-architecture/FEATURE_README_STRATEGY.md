# Feature README Strategy

Status: Proposed
Last updated: 2026-03-16

## Purpose

Feature READMEs should reduce repeated repo search in high-churn areas. They are local retrieval anchors, not mini-specs.

## Recommended Template

```md
# <Feature Name>

Status: Active
Authority: Operational
Surface: customer-app
Domains: order, cart
Last updated: YYYY-MM-DD
Retrieve when:
- editing routes or screens in this feature
- changing runtime truth or state handoff
Related files:
- relative/path

## Owns
- short ownership list

## Routes
- route -> screen

## Runtime Truth
- where reads happen
- where writes happen

## Common Edit Bundles
- task type -> files

## Governing Docs
- linked authorities

## Known Gaps
- short active gaps only
```

## First READMEs to Add

- [customer-app/lib/features/store/](/Users/andremacmini/Deliberry/customer-app/lib/features/store)
- [customer-app/lib/features/cart/](/Users/andremacmini/Deliberry/customer-app/lib/features/cart)
- [customer-app/lib/features/orders/](/Users/andremacmini/Deliberry/customer-app/lib/features/orders)
- [customer-app/lib/features/search/](/Users/andremacmini/Deliberry/customer-app/lib/features/search)
- [merchant-console/src/features/orders/](/Users/andremacmini/Deliberry/merchant-console/src/features/orders)
- [merchant-console/src/features/menu/](/Users/andremacmini/Deliberry/merchant-console/src/features/menu)
- [admin-console/src/features/orders/](/Users/andremacmini/Deliberry/admin-console/src/features/orders)
- [admin-console/src/features/disputes/](/Users/andremacmini/Deliberry/admin-console/src/features/disputes)

## Progress

Completed in Phase 1B on 2026-03-16:
- [customer-app/lib/features/store/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/store/README.md)
- [customer-app/lib/features/cart/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/README.md)
- [customer-app/lib/features/checkout/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/README.md)
- [customer-app/lib/features/orders/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/README.md)
- [customer-app/lib/features/search/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/search/README.md)

Completed in Phase 2A on 2026-03-16:
- [merchant-console/src/features/orders/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/orders/README.md)
- [merchant-console/src/features/menu/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/menu/README.md)
- [merchant-console/src/features/auth/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/README.md)
- [merchant-console/src/features/store-selection/README.md](/Users/andremacmini/Deliberry/merchant-console/src/features/store-selection/README.md)

Completed in Phase 3A on 2026-03-16:
- [admin-console/src/features/auth/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/auth/README.md)
- [admin-console/src/features/permissions/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/README.md)
- [admin-console/src/features/orders/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/orders/README.md)
- [admin-console/src/features/disputes/README.md](/Users/andremacmini/Deliberry/admin-console/src/features/disputes/README.md)

Completed in Phase 4A on 2026-03-16:
- [public-website/src/features/landing/README.md](/Users/andremacmini/Deliberry/public-website/src/features/landing/README.md)
- [public-website/src/features/app-download/README.md](/Users/andremacmini/Deliberry/public-website/src/features/app-download/README.md)
- [public-website/src/features/legal/README.md](/Users/andremacmini/Deliberry/public-website/src/features/legal/README.md)
- [public-website/src/features/support/README.md](/Users/andremacmini/Deliberry/public-website/src/features/support/README.md)

Still pending from the first wave targets:
- None from the first-wave README targets.

## Anti-Patterns

- repeating whole governance docs
- documenting every widget
- leaving stale “future architecture” notes
- using feature READMEs as backlog dumping grounds

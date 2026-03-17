# Proposed RAG Information Architecture

Status: Proposed
Last updated: 2026-03-16

## 1. Design Principle

The repository should keep its current governance authorities in place and add a thin retrieval layer around them. The goal is not a new documentation empire. The goal is faster, safer coding retrieval.

## 2. Recommended Root Location

Use:
- `docs/rag-architecture/`

This directory should define retrieval standards, unit types, and migration guidance. It should not copy the contents of governance docs.

## 3. What Stays in Place

Keep these authorities where they are:
- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `docs/governance/*`
- `docs/ui-governance/*`
- `shared/docs/*`

These already reflect real ownership and should remain the source of truth.

## 4. What Should Be Linked, Not Duplicated

### Existing governance docs
- Add lightweight metadata headers.
- Add “retrieve when” notes near the top.
- Add related code/file references where missing.
- Do not rewrite their substantive content into RAG duplicates.

### Reviews and audits
- Keep them in `reviews/` and `docs/ui-governance/` where they already live.
- Add an index layer that marks them `active`, `historical`, or `superseded`.
- Do not move them into a new RAG tree.

## 5. New Document Families That Should Exist

### A. Feature README family
- Location:
  - `customer-app/lib/features/<feature>/README.md`
  - `merchant-console/src/features/<feature>/README.md`
  - `admin-console/src/features/<feature>/README.md`
  - `public-website/src/features/<feature>/README.md`
- Purpose:
  - feature-local retrieval entry point
  - route ownership
  - truth owner
  - main dependencies
  - common edit bundle

### B. Flow doc family
- Suggested location:
  - `docs/flows/customer/`
  - `docs/flows/merchant/`
  - `docs/flows/admin/`
  - `docs/flows/public/`
- Purpose:
  - end-to-end journey retrieval
  - route continuity
  - runtime handoff
  - blocking gaps

### C. File-map family
- Suggested location:
  - `docs/filemaps/`
- Purpose:
  - tell agents which files are usually read or edited together
  - reduce repeated repo scanning

### D. Runtime-truth family
- Suggested location:
  - `docs/runtime-truth/`
- Purpose:
  - explain where mutable truth lives per surface and flow
  - distinguish local runtime state from read-only repository/query state

### E. Decision/exception family
- Suggested location:
  - `docs/governance/exceptions/`
  - optionally `docs/decisions/` only if exception volume grows beyond governance-only use
- Purpose:
  - sparse rationale and exception records
  - not a full ADR bureaucracy

## 6. What Should Become Local Feature READMEs First

Start with the highest-churn, highest-ambiguity clusters:
- `customer-app/lib/features/store/`
- `customer-app/lib/features/cart/`
- `customer-app/lib/features/orders/`
- `customer-app/lib/features/search/`
- `merchant-console/src/features/orders/`
- `merchant-console/src/features/menu/`
- `admin-console/src/features/orders/`
- `admin-console/src/features/disputes/`
- `public-website/src/features/landing/`

These areas combine route behavior, runtime truth, and governance-sensitive rules.

## 7. What Should Become File-Map Docs First

- `customer-route-runtime-filemap.md`
- `customer-core-order-flow-filemap.md`
- `merchant-auth-and-store-shell-filemap.md`
- `admin-auth-permission-platform-filemap.md`
- `shared-domain-contract-filemap.md`

## 8. What Should Become Flow Docs First

- Customer browse-to-order flow
- Customer auth/onboarding flow
- Merchant login/onboarding/store-selection flow
- Admin login/access-boundary/platform flow
- Public marketing-to-customer-handoff flow

## 9. What Should Become Runtime-Truth Docs First

- Customer runtime truth
- Merchant store-scoped mock/runtime truth
- Admin platform mock/runtime truth
- Public content truth

## 10. What Should Be Deprecated

Nothing needs immediate deletion.

What should be reduced over time:
- using `reviews/*.md` as de facto primary runtime documentation
- relying on long planning docs as default retrieval entry points
- repeating the same routing/runtime explanation across audits

## 11. What Should Remain Untouched

- Canonical governance authorities
- Surface-local code organization
- `shared/` ownership boundaries
- customer UI governance doc set

## 12. Retrieval-Friendly Operating Model

An agent should enter the repo through this order:

1. authority doc
2. surface README or surface unit
3. relevant flow unit
4. runtime-truth unit
5. file-map unit
6. local code
7. known-gap or backlog unit if implementation is partial

That sequence matches how the repository is actually governed and implemented.

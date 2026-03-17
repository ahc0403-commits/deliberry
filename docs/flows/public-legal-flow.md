# Public Legal Flow

Status: Active
Authority: Operational
Surface: public-website
Domains: legal, privacy, terms, refund-policy
Last updated: 2026-03-16
Retrieve when:
- changing live legal routes, policy cross-links, legal shell behavior, or policy copy ownership
- debugging which files actually control `/privacy`, `/terms`, and `/refund-policy`
Related files:
- public-website/src/app/(legal)/layout.tsx
- public-website/src/app/(legal)/privacy/page.tsx
- public-website/src/app/(legal)/terms/page.tsx
- public-website/src/app/(legal)/refund-policy/page.tsx
- public-website/src/features/legal/presentation/privacy-screen.tsx
- public-website/src/features/legal/presentation/terms-screen.tsx
- public-website/src/features/legal/presentation/refund-policy-screen.tsx

## Purpose

Describe the real current public legal route cluster and the relationships between the three live policy pages.

## Entry Points

- `/privacy`
- `/terms`
- `/refund-policy`
- Shared legal links rendered inside [public-website/src/app/(legal)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx)

## Main Route Sequence

- `/privacy`
- `/terms`
- `/refund-policy`

This is a sibling-route cluster rather than a stateful multi-step journey. The value of this flow doc is showing the shared legal-shell boundary and the manual cross-linking between policy pages.

## Source-of-Truth Files Involved

- [public-website/src/app/(legal)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx)
- [public-website/src/app/(legal)/privacy/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/privacy/page.tsx)
- [public-website/src/app/(legal)/terms/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/terms/page.tsx)
- [public-website/src/app/(legal)/refund-policy/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/refund-policy/page.tsx)
- [public-website/src/features/legal/presentation/privacy-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/privacy-screen.tsx)
- [public-website/src/features/legal/presentation/terms-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/terms-screen.tsx)
- [public-website/src/features/legal/presentation/refund-policy-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/refund-policy-screen.tsx)

## Key Dependent Screens and Files

- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

## What Is Authoritative vs Derived in This Flow

Authoritative:

- The three legal `page.tsx` files for route ownership
- The three legal presentation screens for live policy content
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx) for legal-shell framing and navigation

Derived or structural only:

- [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Those shared data files are not the live content source for the legal routes today.

## Known Static, Hardcoded, Partial, or Retrieval-Shim-Only Limits

- The legal cluster is fully static and manually maintained in the screen files.
- Policy dates, contact details, and cross-links are hardcoded.
- There is no shared legal document store, publishing workflow, or central version source.

## Common Edit Mistakes

- Updating one legal screen and assuming the other policy routes remain consistent automatically.
- Editing shared content-service files and expecting legal-route copy to change.
- Changing the legal shell without checking all three routes together.

## Related Filemaps

- [docs/filemaps/public-legal-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-legal-filemap.md)

## Related Runtime-Truth Docs

- [docs/runtime-truth/public-legal-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-legal-truth.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

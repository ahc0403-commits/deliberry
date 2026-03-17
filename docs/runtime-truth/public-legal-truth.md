# Public Legal Truth

Status: Active
Authority: Operational
Surface: public-website
Domains: legal, privacy, terms, refund-policy
Last updated: 2026-03-17
Retrieve when:
- changing live legal-route copy, legal-layout behavior, policy dates, contact details, or legal cross-links
- checking whether public legal content comes from route screens or from shared repository files
Related files:
- public-website/src/app/(legal)/layout.tsx
- public-website/src/app/(legal)/privacy/page.tsx
- public-website/src/app/(legal)/terms/page.tsx
- public-website/src/app/(legal)/refund-policy/page.tsx
- public-website/src/features/legal/presentation/privacy-screen.tsx
- public-website/src/features/legal/presentation/terms-screen.tsx
- public-website/src/features/legal/presentation/refund-policy-screen.tsx
- docs/filemaps/public-legal-filemap.md

## Purpose

Identify where the live legal-route truth actually lives for the public website.

## Real Source-of-Truth Location(s)

- [public-website/src/features/legal/presentation/privacy-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/privacy-screen.tsx)
- [public-website/src/features/legal/presentation/terms-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/terms-screen.tsx)
- [public-website/src/features/legal/presentation/refund-policy-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/refund-policy-screen.tsx)
- [public-website/src/app/(legal)/privacy/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/privacy/page.tsx)
- [public-website/src/app/(legal)/terms/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/terms/page.tsx)
- [public-website/src/app/(legal)/refund-policy/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/refund-policy/page.tsx)
- [public-website/src/app/(legal)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx)

## What Content or State Is Owned There

- The live privacy-policy copy lives in [privacy-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/privacy-screen.tsx).
- The live terms copy lives in [terms-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/terms-screen.tsx).
- The live refund-policy copy lives in [refund-policy-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/legal/presentation/refund-policy-screen.tsx).
- The legal route ownership lives in the three `page.tsx` files.
- Shared legal navigation chrome lives in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx).

## What Routes or Screens Depend on It

- `/privacy`
- `/terms`
- `/refund-policy`

## What Is Authoritative vs Derived

Authoritative:

- The three legal presentation screens for live policy copy
- The three legal `page.tsx` route files for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx) for legal-shell structure

Derived or structural only:

- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Those shared files are not the live truth for the legal routes today.

## What Is Still Static, Hardcoded, Partial, or Retrieval-Shim-Only

- Policy copy, dates, and contact details are hardcoded in the legal screen files.
- Cross-links between policy pages are manually maintained.
- There is no repository-backed legal publishing path or document versioning system.
- Refund-policy wording is now aligned to the current support route and email-based support flow, not to live in-app cancellation, report-issue, or chat mechanics.
- Privacy and terms wording now stay aligned to payment-method-selection and order-progress truth rather than claiming live payment capture or real-time delivery tracking.

## Known Risks

- Manual updates can create drift between privacy, terms, and refund-policy copy.
- Dates, contact addresses, and legal links can become stale because they are maintained in separate files.
- Editing shared data files will not change the live legal routes.

## Safe Modification Guidance

- Start with the route file to confirm which legal screen is mounted.
- Change live legal copy in the matching presentation file, not in shared data placeholders.
- If a change affects legal-shell navigation or framing, update [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx) separately and verify the three routes still feel coherent together.
- When changing contact details or policy dates, update all affected legal screens intentionally rather than assuming a shared source exists.

## Related Filemaps

- [docs/filemaps/public-legal-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-legal-filemap.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

# Public Service Flow

Status: Active
Authority: Operational
Surface: public-website
Domains: service, marketing, route-flow
Last updated: 2026-03-17
Retrieve when:
- changing the `/service` route or the journey into and out of it
- debugging CTA targets or marketing-shell ownership around the service route
Related files:
- public-website/src/app/(marketing)/service/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx

## Purpose

Describe the real current public marketing flow for the `/service` route.

## Entry Points

- `/service`
- Shared marketing navigation rendered by [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)
- CTA links from `/` and `/merchant`

## Main Route Sequence

- `/service`
- side exits to `/download`
- side exits to `/merchant`

## Source-of-Truth Files Involved

- [public-website/src/app/(marketing)/service/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/service/page.tsx)
- [public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## Key Dependent Screens and Files

- [public-website/src/app/(marketing)/download/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/download/page.tsx)
- [public-website/src/app/(marketing)/merchant/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/merchant/page.tsx)
- [public-website/src/features/landing/presentation/landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx)
- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)

## What Is Authoritative vs Derived in This Flow

Authoritative:

- [service-introduction-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx) for live `/service` composition and CTA targets
- [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/service/page.tsx) for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared navigation/footer ownership

Derived or structural only:

- [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Those files do not own the live route content for this flow today.

## Known Static, Hardcoded, Partial, or Retrieval-Shim-Only Limits

- `/service` is a static screen-driven marketing flow, not a repository-backed content flow.
- Coverage, metrics, and platform claims are static copy.
- There is no personalized or data-driven flow branching.

## Common Edit Mistakes

- Editing [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts) and expecting the live route to change.
- Updating shared nav links in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) without reconciling in-screen CTAs.
- Treating the route as covered by landing docs only because landing links into it.

## Related Filemaps

- [docs/filemaps/public-service-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-service-filemap.md)

## Related Runtime-Truth Docs

- [docs/runtime-truth/public-service-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-service-truth.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

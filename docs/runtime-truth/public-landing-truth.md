# Public Landing Truth

Status: Active
Authority: Operational
Surface: public-website
Domains: landing, marketing, homepage, acquisition
Last updated: 2026-03-16
Retrieve when:
- changing the public homepage route, hero copy, homepage CTA targets, or shared marketing shell behavior
- deciding whether landing content comes from live screen code or from structural content-service files
Related files:
- public-website/src/app/(marketing)/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/landing/presentation/landing-screen.tsx
- docs/filemaps/public-landing-filemap.md

## Purpose

Identify where the live homepage truth actually lives for the public website.

## Real Source-of-Truth Location(s)

- [public-website/src/features/landing/presentation/landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx)
- [public-website/src/app/(marketing)/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/page.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## What Content or State Is Owned There

- Homepage hero copy, supporting marketing sections, static trust/value blocks, and CTA labels live in [landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx).
- The `/` route ownership lives in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/page.tsx).
- Shared marketing navigation, footer links, and page shell behavior live in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).

## What Routes or Screens Depend on It

- `/`
- Shared marketing-shell routes linked from the homepage, including `/service`, `/merchant`, `/support`, and `/download`

## What Is Authoritative vs Derived

Authoritative:

- [landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx) for live homepage copy, section ordering, and CTA targets
- [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/page.tsx) for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared marketing shell behavior

Derived or structural only:

- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Those shared data files describe a structural content boundary, but they are not the live truth for the homepage route today.

## What Is Still Static, Hardcoded, Partial, or Retrieval-Shim-Only

- Homepage content is hardcoded in the screen component.
- Trust metrics, testimonials, and value statements are static presentation content.
- There is no live CMS, repository-backed landing content, or runtime personalization path.

## Known Risks

- Editing [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts) will not change the live homepage unless the route is explicitly rewired.
- Marketing-shell link changes in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) can drift away from landing CTAs if changed separately.
- Static marketing claims can become stale because they are manually maintained in screen code.

## Safe Modification Guidance

- Start in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/page.tsx) to confirm the route owner.
- Change live homepage content in [landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx).
- Change shared header/footer behavior in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).
- Treat [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts) and [public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts) as future structural boundaries unless the live route is intentionally moved onto them.

## Related Filemaps

- [docs/filemaps/public-landing-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-landing-filemap.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

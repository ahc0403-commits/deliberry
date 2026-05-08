# Public Service Truth

Status: Active
Authority: Operational
Surface: public-website
Domains: service, marketing, route-truth
Last updated: 2026-04-18
Retrieve when:
- changing the live `/service` route
- deciding whether service-route content comes from live screen code or shared marketing shell files
Related files:
- public-website/src/app/(marketing)/service/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx
- docs/filemaps/public-service-filemap.md

## Purpose

Identify where the live `/service` route truth actually lives for the public website.

## Real Source-of-Truth Location(s)

- [public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx)
- [public-website/src/app/(marketing)/service/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/service/page.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## What Content or State Is Owned There

- Service-route hero copy, value props, platform explanation, coverage section, and CTA labels live in [service-introduction-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx).
- The `/service` route ownership lives in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/service/page.tsx).
- Shared marketing navigation and footer ownership live in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).

## What Routes or Screens Depend on It

- `/service`
- Shared marketing-shell links from `/`, `/merchant`, `/support`, and `/download`

## What Is Authoritative vs Derived

Authoritative:

- [service-introduction-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx) for live `/service` content and CTA destinations
- [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/service/page.tsx) for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared marketing shell links

## What Is Still Static, Hardcoded, Partial, or Retrieval-Shim-Only

- `/service` content is hardcoded in the screen component.
- Platform stats and neighborhood coverage are static marketing content.
- There is no repository-backed or CMS-backed content path for this route today.
- The unused shared public content seam was removed on 2026-04-18 so `/service` truth stays single-source.

## Known Risks

- Marketing-shell links in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) can drift from in-screen CTAs if updated separately.
- Static claims can go stale because they are maintained directly in screen code.

## Safe Modification Guidance

- Start in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/service/page.tsx) to confirm route ownership.
- Change live `/service` content in [service-introduction-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx).
- Change shared navigation/footer behavior in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).
- Do not reintroduce a second public content source unless the route is migrated in the same pass.

## Related Filemaps

- [docs/filemaps/public-service-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-service-filemap.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

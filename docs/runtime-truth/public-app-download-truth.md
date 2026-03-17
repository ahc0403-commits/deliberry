# Public App Download Truth

Status: Active
Authority: Operational
Surface: public-website
Domains: app-download, customer-handoff, acquisition
Last updated: 2026-03-17
Retrieve when:
- changing the `/download` route, download-page CTAs, store badge behavior, or customer-app handoff copy
- checking whether app-download content is live in the screen or in the shared content-service layer
Related files:
- public-website/src/app/(marketing)/download/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/app-download/presentation/app-download-screen.tsx
- docs/filemaps/public-app-download-filemap.md

## Purpose

Identify where the live app-download route truth actually lives for the public website.

## Real Source-of-Truth Location(s)

- [public-website/src/features/app-download/presentation/app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx)
- [public-website/src/app/(marketing)/download/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/download/page.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## What Content or State Is Owned There

- Download-page copy, store-badge links, and customer handoff messaging live in [app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx).
- The `/download` route ownership lives in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/download/page.tsx).
- Shared marketing-shell navigation and footer behavior live in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).

## What Routes or Screens Depend on It

- `/download`
- Marketing-shell navigation paths that link into the download route

## What Is Authoritative vs Derived

Authoritative:

- [app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx) for the live download-page content and CTA behavior
- [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/download/page.tsx) for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared marketing-shell behavior

Derived or structural only:

- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Those files are not the live truth for `/download` today.

## What Is Still Static, Hardcoded, Partial, or Retrieval-Shim-Only

- Download content is hardcoded in the screen component.
- The app-store badges are now honest non-link placeholders until live store destinations exist.
- The route now uses `/support` as the visible fallback for release updates instead of dead install links.
- Marketing copy is intentionally narrowed to order-progress updates and checkout-ready payment selection, not live map tracking or full payment processing.
- There is no dynamic device detection, store deep-linking, or repository-backed content path.

## Known Risks

- The route still does not provide real app-store installation destinations.
- Editing structural content files will not change the live route.
- Marketing-shell link changes can drift away from the download page’s handoff copy.

## Safe Modification Guidance

- Confirm the route owner in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/download/page.tsx).
- Change live download content and badge behavior in [app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx).
- Change shared shell behavior in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).
- Do not treat [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts) as authoritative unless the live route is deliberately rewired.

## Related Filemaps

- [docs/filemaps/public-app-download-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-app-download-filemap.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

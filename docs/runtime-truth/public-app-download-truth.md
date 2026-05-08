# Public App Download Truth

Status: Active
Authority: Operational
Surface: public-website
Domains: app-download, customer-handoff, acquisition
Last updated: 2026-05-06
Last verified: 2026-05-06
Retrieve when:
- changing the `/download` route, download-page CTAs, store badge behavior, or customer-app handoff copy
- checking whether app-download content is live in the screen or in shared marketing shell files
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

## What Is Still Static, Hardcoded, Partial, or Retrieval-Shim-Only

- Download content is hardcoded in the screen component.
- The app-store badges remain honest placeholders when no store URLs are configured.
- If `NEXT_PUBLIC_CUSTOMER_APP_STORE_URL` or `NEXT_PUBLIC_CUSTOMER_PLAY_STORE_URL` is configured, the matching badge becomes a live external handoff while the missing platform remains explicitly marked `Coming soon`.
- The route continues to use `/support` as the visible fallback for release updates whenever a platform link is not live yet.
- Marketing copy is intentionally narrowed to order-progress updates and checkout-ready payment selection, not live map tracking or full payment processing.
- There is no dynamic device detection, store deep-linking, or repository-backed content path.
- The unused shared public content seam was removed on 2026-04-18 so `/download` truth stays single-source.

## Known Risks

- The route may still lack one or both real app-store installation destinations if the matching public env vars are absent.
- Marketing-shell link changes can drift away from the download page’s handoff copy.

## Safe Modification Guidance

- Confirm the route owner in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/download/page.tsx).
- Change live download content and badge behavior in [app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx).
- Change shared shell behavior in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).
- Do not reintroduce a second public content source unless the route is migrated in the same pass.

## Related Filemaps

- [docs/filemaps/public-app-download-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-app-download-filemap.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

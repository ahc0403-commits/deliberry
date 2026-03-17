# Public Merchant Truth

Status: Active
Authority: Operational
Surface: public-website
Domains: merchant, partner-acquisition, route-truth
Last updated: 2026-03-17
Retrieve when:
- changing the live `/merchant` route
- deciding whether merchant-acquisition copy or form behavior is route-owned, layout-owned, or only presentational
Related files:
- public-website/src/app/(marketing)/merchant/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx
- docs/filemaps/public-merchant-filemap.md

## Purpose

Identify where the live `/merchant` route truth actually lives for the public website.

## Real Source-of-Truth Location(s)

- [public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx)
- [public-website/src/app/(marketing)/merchant/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/merchant/page.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## What Content or State Is Owned There

- Merchant-partner hero copy, benefit cards, onboarding steps, and lead-form copy live in [merchant-onboarding-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx).
- The `/merchant` route ownership lives in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/merchant/page.tsx).
- Shared marketing navigation and footer ownership live in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).

## What Routes or Screens Depend on It

- `/merchant`
- Shared marketing-shell links from `/` and `/service`
- The in-page `#apply` anchor on `/merchant`

## What Is Authoritative vs Derived

Authoritative:

- [merchant-onboarding-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx) for live `/merchant` content and in-page application flow
- [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/merchant/page.tsx) for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared marketing shell links

Derived or structural only:

- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Those shared data files expose a structural content boundary, but they do not drive the live `/merchant` route today.

## What Is Still Static, Hardcoded, Partial, or Retrieval-Shim-Only

- `/merchant` content is hardcoded in the screen component.
- The lead form now produces a visible manual-handoff state and a partner-team email path, but it still does not submit to a live backend intake.
- Partner counts, uplift figures, and response-time claims are static marketing content.

## Known Risks

- Editing [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts) will not change the live `/merchant` route unless the route is rewired.
- The application form is still manual, not backend-connected.
- Shared marketing-shell links in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) can drift from in-screen CTAs if updated separately.

## Safe Modification Guidance

- Start in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/merchant/page.tsx) to confirm route ownership.
- Change live `/merchant` content in [merchant-onboarding-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx).
- Change shared navigation/footer behavior in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).
- Treat the lead form as a manual-handoff UI until runtime truth says otherwise.

## Related Filemaps

- [docs/filemaps/public-merchant-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-merchant-filemap.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

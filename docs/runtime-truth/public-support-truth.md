# Public Support Truth

Status: Active
Authority: Operational
Surface: public-website
Domains: support, customer-help, public-marketing
Last updated: 2026-03-17
Retrieve when:
- changing the `/support` route, support-page content, route imports, or marketing-shell support links
- checking the live implementation folder because the route name and feature-folder name do not match
Related files:
- public-website/src/app/(marketing)/support/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/customer-support/presentation/customer-support-screen.tsx
- public-website/src/features/support/README.md
- docs/filemaps/public-support-filemap.md

## Purpose

Identify where the live support-route truth actually lives for the public website.

## Real Source-of-Truth Location(s)

- [public-website/src/app/(marketing)/support/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/support/page.tsx)
- [public-website/src/features/customer-support/presentation/customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## What Content or State Is Owned There

- The `/support` route ownership lives in [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/support/page.tsx).
- The live support content, FAQ sections, and contact/help blocks live in [customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx).
- Shared marketing navigation and footer ownership live in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx).
- Merchant-partner support is now routed separately through `partners@deliberry.com`, not through the customer support footer path.

## What Routes or Screens Depend on It

- `/support`
- Marketing-shell links that point to the support route

## What Is Authoritative vs Derived

Authoritative:

- [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/support/page.tsx) for route ownership
- [customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx) for live support-page content
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared marketing-shell behavior

Derived, structural, or retrieval-shim-only:

- [public-website/src/features/support/README.md](/Users/andremacmini/Deliberry/public-website/src/features/support/README.md) is a retrieval aid, not the live implementation
- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

## What Is Still Static, Hardcoded, Partial, or Retrieval-Shim-Only

- The support route’s live content is hardcoded in [customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx).
- The `features/support/` folder is currently a retrieval-shim-only cluster for documentation, not the live route implementation.
- There is no live ticketing integration, contact form submission path, or backend support system on this route.
- The page now uses support-safe wording and does not claim live chat, live tracking, password-reset flows, or guaranteed refund automation.

## Known Risks

- The route-to-folder mismatch can mislead agents into editing `features/support/` instead of the live `features/customer-support/` implementation.
- Shared content-service files can be mistaken for live support truth even though the route does not use them.
- Static support contact content can drift from legal or marketing references because it is manually maintained.

## Safe Modification Guidance

- Start with [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/support/page.tsx) to confirm the live import path.
- Make live support content changes in [customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx).
- Use [public-website/src/features/support/README.md](/Users/andremacmini/Deliberry/public-website/src/features/support/README.md) as a routing note, not as proof that `features/support/` owns the live route.
- Only change [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) when support-route shell behavior or shared nav/footer links need to move.

## Related Filemaps

- [docs/filemaps/public-support-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-support-filemap.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

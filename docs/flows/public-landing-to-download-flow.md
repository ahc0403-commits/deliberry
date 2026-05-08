# Public Landing to Download Flow

Status: Active
Authority: Operational
Surface: public-website
Domains: landing, download, acquisition, marketing-handoff
Last updated: 2026-05-06
Last verified: 2026-05-06
Retrieve when:
- changing the public marketing journey from homepage discovery into the download route
- debugging CTA targets, shared marketing-shell links, or route ownership between `/` and `/download`
Related files:
- public-website/src/app/(marketing)/page.tsx
- public-website/src/app/(marketing)/download/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/landing/presentation/landing-screen.tsx
- public-website/src/features/app-download/presentation/app-download-screen.tsx

## Purpose

Describe the real current public marketing flow from the homepage into the app-download route.

## Entry Points

- `/`
- Shared marketing navigation rendered by [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## Main Route Sequence

- `/`
- `/download`

There are also side exits from the landing route into `/service`, `/merchant`, and `/support`, but this flow documents the customer-acquisition handoff path into download.

## Source-of-Truth Files Involved

- [public-website/src/app/(marketing)/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/page.tsx)
- [public-website/src/features/landing/presentation/landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx)
- [public-website/src/app/(marketing)/download/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/download/page.tsx)
- [public-website/src/features/app-download/presentation/app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## Key Dependent Screens and Files

- [public-website/src/features/common/presentation/public_feature_scaffold.tsx](/Users/andremacmini/Deliberry/public-website/src/features/common/presentation/public_feature_scaffold.tsx)

## What Is Authoritative vs Derived in This Flow

Authoritative:

- [landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx) for live homepage composition and CTA destinations
- [app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx) for live download-page copy and store-badge behavior
- The two `page.tsx` files for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared marketing navigation and footer behavior

Derived or structural only:

- [public_feature_scaffold.tsx](/Users/andremacmini/Deliberry/public-website/src/features/common/presentation/public_feature_scaffold.tsx)

Those files do not own the live route content for this flow today.

## Known Static, Hardcoded, Partial, or Retrieval-Shim-Only Limits

- Both screens are hardcoded presentation routes, not repository-backed marketing content.
- The download-page store badges stay as honest placeholders until `NEXT_PUBLIC_CUSTOMER_APP_STORE_URL` or `NEXT_PUBLIC_CUSTOMER_PLAY_STORE_URL` is configured for that platform.
- When one platform link is live and the other is not, the route now supports a mixed state: live external handoff for the configured store and `Coming soon` disclosure for the missing one.
- There is no analytics-backed or personalized handoff logic in this flow.

## Common Edit Mistakes

- Changing marketing-shell navigation in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) without reconciling duplicate CTA targets in [landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx).
- Treating placeholder store-badge links as if they are already real integration points.

## Related Filemaps

- [docs/filemaps/public-landing-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-landing-filemap.md)
- [docs/filemaps/public-app-download-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-app-download-filemap.md)

## Related Runtime-Truth Docs

- [docs/runtime-truth/public-landing-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-landing-truth.md)
- [docs/runtime-truth/public-app-download-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-app-download-truth.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

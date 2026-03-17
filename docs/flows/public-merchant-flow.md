# Public Merchant Flow

Status: Active
Authority: Operational
Surface: public-website
Domains: merchant, partner-acquisition, route-flow
Last updated: 2026-03-17
Retrieve when:
- changing the `/merchant` route or its partner-acquisition journey
- debugging CTA targets, anchor behavior, or marketing-shell ownership around the merchant route
Related files:
- public-website/src/app/(marketing)/merchant/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx

## Purpose

Describe the real current public marketing flow for the `/merchant` route.

## Entry Points

- `/merchant`
- Shared marketing navigation rendered by [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)
- CTA links from `/` and `/service`

## Main Route Sequence

- `/merchant`
- in-page `#apply` anchor within `/merchant`
- side exit to `/service`

## Source-of-Truth Files Involved

- [public-website/src/app/(marketing)/merchant/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/merchant/page.tsx)
- [public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## Key Dependent Screens and Files

- [public-website/src/app/(marketing)/service/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/service/page.tsx)
- [public-website/src/features/landing/presentation/landing-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/landing/presentation/landing-screen.tsx)
- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)

## What Is Authoritative vs Derived in This Flow

Authoritative:

- [merchant-onboarding-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx) for live `/merchant` composition, CTA targets, and in-page form flow
- [page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/merchant/page.tsx) for route ownership
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared navigation/footer ownership

Derived or structural only:

- [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Those files do not own the live route content for this flow today.

## Known Static, Hardcoded, Partial, or Retrieval-Shim-Only Limits

- `/merchant` is a static screen-driven acquisition flow, not a repository-backed merchant intake flow.
- The lead form is display-only and does not submit to a live backend.
- Uplift, timing, and payout statements are static marketing copy.

## Common Edit Mistakes

- Editing [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts) and expecting the live route to change.
- Treating the `Submit application` button as live behavior when it is only presentational.
- Updating shared nav links in [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) without reconciling in-screen CTAs and anchor links.

## Related Filemaps

- [docs/filemaps/public-merchant-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-merchant-filemap.md)

## Related Runtime-Truth Docs

- [docs/runtime-truth/public-merchant-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-merchant-truth.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

# Public Landing

Status: Active
Authority: Operational
Surface: public-website
Domains: landing, marketing, acquisition
Last updated: 2026-03-16
Retrieve when:
- editing the public homepage or hero-to-download path
- checking where landing-page copy and sections actually live
- verifying whether the content repository is active or only structural
Related files:
- public-website/src/app/(marketing)/page.tsx
- public-website/src/features/landing/presentation/landing-screen.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/shared/data/content-service.ts

## Purpose

Owns the public homepage and its primary acquisition path into download, service, merchant, and support routes.

## Primary Routes and Screens

- `/(marketing)/` -> `public-website/src/app/(marketing)/page.tsx`
- Screen component -> `public-website/src/features/landing/presentation/landing-screen.tsx`

## Source of Truth

- Live landing content is currently hardcoded in `public-website/src/features/landing/presentation/landing-screen.tsx`
- Marketing shell navigation and footer links live in `public-website/src/app/(marketing)/layout.tsx`

There is split truth here: `public-website/src/shared/data/content-service.ts` and `public-website/src/shared/data/public-content-repository.ts` define a structural content boundary, but the current landing screen does not read from it.

## Key Files to Read First

- `public-website/src/app/(marketing)/page.tsx`
- `public-website/src/features/landing/presentation/landing-screen.tsx`
- `public-website/src/app/(marketing)/layout.tsx`
- `public-website/src/shared/data/content-service.ts`

## Related Shared and Domain Files

- `public-website/src/shared/domain.ts`
- `public-website/src/shared/data/public-content-repository.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Landing content is static and hardcoded in the screen.
- Metrics, reviews, and app-store signals are presentation content only.
- The repository-backed content boundary exists but is not currently used by the landing route.

## Safe Modification Guidance

- Change live landing copy and section structure in `landing-screen.tsx`.
- Change global header/footer navigation in the marketing layout, not inside the screen.
- If content is moved into the repository later, update the route and screen together instead of splitting truth across both layers indefinitely.

## What Not to Change Casually

- Do not treat `public-content-repository.ts` as live landing truth today.
- Do not move shared public layout concerns into the landing screen.
- Do not import repo-level `shared/*` directly from feature code.

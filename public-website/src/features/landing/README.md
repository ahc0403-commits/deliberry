# Public Landing

Status: Active
Authority: Operational
Surface: public-website
Domains: landing, marketing, acquisition
Last updated: 2026-04-18
Retrieve when:
- editing the public homepage or hero-to-download path
- checking where landing-page copy and sections actually live
- confirming the live landing truth stays in the screen and marketing layout
Related files:
- public-website/src/app/(marketing)/page.tsx
- public-website/src/features/landing/presentation/landing-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Owns the public homepage and its primary acquisition path into download, service, merchant, and support routes.

## Primary Routes and Screens

- `/(marketing)/` -> `public-website/src/app/(marketing)/page.tsx`
- Screen component -> `public-website/src/features/landing/presentation/landing-screen.tsx`

## Source of Truth

- Live landing content is currently hardcoded in `public-website/src/features/landing/presentation/landing-screen.tsx`
- Marketing shell navigation and footer links live in `public-website/src/app/(marketing)/layout.tsx`


## Key Files to Read First

- `public-website/src/app/(marketing)/page.tsx`
- `public-website/src/features/landing/presentation/landing-screen.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

## Related Shared and Domain Files

- `public-website/src/shared/domain.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Landing content is static and hardcoded in the screen.
- Metrics, reviews, and app-store signals are presentation content only.
- There is no repository-backed or CMS-backed landing path today.

## Safe Modification Guidance

- Change live landing copy and section structure in `landing-screen.tsx`.
- Change global header/footer navigation in the marketing layout, not inside the screen.
- Do not add a second public content source unless the route is migrated in the same pass.

## What Not to Change Casually

- Do not move shared public layout concerns into the landing screen.
- Do not import repo-level `shared/*` directly from feature code.

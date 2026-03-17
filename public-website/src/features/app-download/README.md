# Public App Download

Status: Active
Authority: Operational
Surface: public-website
Domains: app-download, acquisition, customer-handoff
Last updated: 2026-03-16
Retrieve when:
- editing the app-download page or store-badge CTA behavior
- checking where download-page copy actually lives
- verifying whether app-store integration is real or static
Related files:
- public-website/src/app/(marketing)/download/page.tsx
- public-website/src/features/app-download/presentation/app-download-screen.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/shared/data/content-service.ts

## Purpose

Owns the public download page for the customer app.

## Primary Routes and Screens

- `/(marketing)/download` -> `public-website/src/app/(marketing)/download/page.tsx`
- Screen component -> `public-website/src/features/app-download/presentation/app-download-screen.tsx`

## Source of Truth

- Live download-page content is currently hardcoded in `public-website/src/features/app-download/presentation/app-download-screen.tsx`
- Marketing shell links live in `public-website/src/app/(marketing)/layout.tsx`

There is split truth here too: `content-service.ts` and `public-content-repository.ts` define a public content boundary, but the current download screen does not use it.

## Key Files to Read First

- `public-website/src/app/(marketing)/download/page.tsx`
- `public-website/src/features/app-download/presentation/app-download-screen.tsx`
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

- Download CTAs use `href="#"`; there is no real app-store integration.
- Ratings, customer counts, and app-feature claims are static content.
- The repository-backed content boundary is not wired into the live screen.

## Safe Modification Guidance

- Change live copy and CTA structure in `app-download-screen.tsx`.
- Keep global nav/footer changes in the marketing layout.
- If real store links are added later, update all badge instances together so the page does not drift into mixed fake and real behavior.

## What Not to Change Casually

- Do not imply real app-store connectivity while `href="#"` links remain.
- Do not treat `public-content-repository.ts` as active download truth today.
- Do not duplicate header/footer behavior inside the screen.

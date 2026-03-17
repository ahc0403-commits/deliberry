# Public Service Introduction

Status: Active
Authority: Operational
Surface: public-website
Domains: service, marketing, route-content
Last updated: 2026-03-17
Retrieve when:
- editing the live `/service` route
- checking whether service-route copy comes from screen code or structural content-service files
Related files:
- public-website/src/app/(marketing)/service/page.tsx
- public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/shared/data/content-service.ts

## Purpose

Owns the live public `/service` marketing route and its explanation of the Deliberry customer, merchant, and platform experience.

## Primary Routes and Screens

- `/(marketing)/service` -> `public-website/src/app/(marketing)/service/page.tsx`
- Screen component -> `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`

## Source of Truth

- Live `/service` content is currently hardcoded in `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
- Route ownership lives in `public-website/src/app/(marketing)/service/page.tsx`
- Shared marketing header/footer ownership lives in `public-website/src/app/(marketing)/layout.tsx`

There is split truth here: `public-website/src/shared/data/content-service.ts` and `public-website/src/shared/data/public-content-repository.ts` expose a structural content boundary, but the live `/service` route does not read from them.

## Key Files to Read First

- `public-website/src/app/(marketing)/service/page.tsx`
- `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
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

- Service-route content is static and hardcoded in the screen.
- Platform metrics and coverage claims are presentation content only.
- The repository-backed content boundary exists but is not currently used by the live route.

## Safe Modification Guidance

- Change live `/service` copy and section structure in `service-introduction-screen.tsx`.
- Change shared header/footer links in the marketing layout, not inside the screen.
- If the route is moved onto the content repository later, update the page owner, screen, and runtime-truth docs together.

## What Not to Change Casually

- Do not treat `public-content-repository.ts` as live `/service` truth today.
- Do not move shared marketing-shell concerns into the service screen.
- Do not assume claims on this route are backed by runtime integrations unless the runtime-truth docs say so.

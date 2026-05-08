# Public Service Introduction

Status: Active
Authority: Operational
Surface: public-website
Domains: service, marketing, route-content
Last updated: 2026-04-18
Retrieve when:
- editing the live `/service` route
- checking whether service-route copy comes from screen code or shared marketing shell files
Related files:
- public-website/src/app/(marketing)/service/page.tsx
- public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Owns the live public `/service` marketing route and its explanation of the Deliberry customer, merchant, and platform experience.

## Primary Routes and Screens

- `/(marketing)/service` -> `public-website/src/app/(marketing)/service/page.tsx`
- Screen component -> `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`

## Source of Truth

- Live `/service` content is currently hardcoded in `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
- Route ownership lives in `public-website/src/app/(marketing)/service/page.tsx`
- Shared marketing header/footer ownership lives in `public-website/src/app/(marketing)/layout.tsx`


## Key Files to Read First

- `public-website/src/app/(marketing)/service/page.tsx`
- `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
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

- Service-route content is static and hardcoded in the screen.
- Platform metrics and coverage claims are presentation content only.
- There is no repository-backed or CMS-backed content path for the live route today.

## Safe Modification Guidance

- Change live `/service` copy and section structure in `service-introduction-screen.tsx`.
- Change shared header/footer links in the marketing layout, not inside the screen.
- Do not add a second public content source unless the route is migrated in the same pass.

## What Not to Change Casually

- Do not move shared marketing-shell concerns into the service screen.
- Do not assume claims on this route are backed by runtime integrations unless the runtime-truth docs say so.

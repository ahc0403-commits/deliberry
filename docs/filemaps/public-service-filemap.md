# Public Service Filemap

Status: Active
Authority: Operational
Surface: public-website
Domains: service, marketing, route-cluster
Last updated: 2026-03-17
Retrieve when:
- changing the public `/service` route
- debugging whether a service-route change belongs in the screen or the marketing layout
- checking whether the content repository is live or only structural
Related files:
- public-website/src/app/(marketing)/service/page.tsx
- public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Show the narrow file cluster for the live `/service` route, its screen owner, and the shared marketing shell around it.

## When To Retrieve This Filemap

- before changing `/service` copy, CTAs, or section ordering
- before editing marketing-shell links from the service-route context
- when the content-service layer looks relevant but may not be wired in

## Entry Files

- `public-website/src/app/(marketing)/service/page.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

## Adjacent Files Usually Read Together

- `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
- `public-website/src/app/(marketing)/merchant/page.tsx`
- `public-website/src/app/(marketing)/download/page.tsx`
- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`

## Source-of-Truth Files

- `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

The live truth is split: service-route content is hardcoded in `service-introduction-screen.tsx`, while shared marketing navigation/footer ownership lives in the marketing layout.

## Files Often Mistaken as Source of Truth but Are Not

- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`
- `public-website/src/shared/domain.ts`

These define a structural content boundary, but they do not currently drive the live `/service` route.

## High-Risk Edit Points

- in-screen CTA targets in `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
- shared nav/footer links in `public-website/src/app/(marketing)/layout.tsx`
- any partial attempt to wire content-service into only one section of the route

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `public-website/src/features/service-introduction/README.md`
- `public-website/src/features/landing/README.md`

## Safe Edit Sequence

1. Confirm whether the change belongs to the service screen or the marketing layout.
2. Update `service-introduction-screen.tsx` for live route-content changes.
3. Update the marketing layout only if shared nav/footer behavior must change.
4. Leave the repository/service layer alone unless you are explicitly wiring the live route onto it.

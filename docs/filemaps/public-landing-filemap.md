# Public Landing Filemap

Status: Active
Authority: Operational
Surface: public-website
Domains: landing, marketing, acquisition
Last updated: 2026-03-16
Retrieve when:
- changing the public homepage or hero-to-download path
- debugging whether a landing change belongs in the screen or the marketing layout
- checking whether the content repository is live or only structural
Related files:
- public-website/src/app/(marketing)/page.tsx
- public-website/src/features/landing/presentation/landing-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Show the narrow file cluster for the public landing route, the live landing screen, and the shared marketing shell around it.

## When To Retrieve This Filemap

- before changing homepage sections, CTAs, or acquisition links
- before editing global marketing header/footer behavior from the landing context
- when the content-service layer looks relevant but may not be wired in

## Entry Files

- `public-website/src/app/(marketing)/page.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

## Adjacent Files Usually Read Together

- `public-website/src/features/landing/presentation/landing-screen.tsx`
- `public-website/src/app/(marketing)/download/page.tsx`
- `public-website/src/app/(marketing)/service/page.tsx`
- `public-website/src/app/(marketing)/merchant/page.tsx`
- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`

## Source-of-Truth Files

- `public-website/src/features/landing/presentation/landing-screen.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

The live truth is split: landing content is hardcoded in `landing-screen.tsx`, while shared marketing navigation and footer ownership live in the marketing layout.

## Files Often Mistaken as Source of Truth but Are Not

- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`
- `public-website/src/shared/domain.ts`

These define a structural content boundary, but they do not currently drive the live landing route.

## High-Risk Edit Points

- hero CTAs and route links in `public-website/src/features/landing/presentation/landing-screen.tsx`
- shared nav and footer links in `public-website/src/app/(marketing)/layout.tsx`
- any future attempt to partially wire content-service into only one landing section

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `public-website/src/features/landing/README.md`
- `public-website/src/features/app-download/README.md`

## Safe Edit Sequence

1. Confirm whether the change belongs to the landing screen or the marketing layout.
2. Update `landing-screen.tsx` for live content changes.
3. Update the marketing layout only if shared nav/footer behavior must change.
4. Leave the repository/service layer alone unless you are explicitly wiring live content into it.

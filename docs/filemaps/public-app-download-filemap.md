# Public App Download Filemap

Status: Active
Authority: Operational
Surface: public-website
Domains: app-download, acquisition, customer-handoff
Last updated: 2026-03-16
Retrieve when:
- changing the app-download page or store-badge CTA behavior
- debugging whether download-page changes belong in the screen or the shared marketing shell
- checking whether app-store links are live or placeholder-only
Related files:
- public-website/src/app/(marketing)/download/page.tsx
- public-website/src/features/app-download/presentation/app-download-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Show the narrow file cluster for the public download route and its current static store-badge behavior.

## When To Retrieve This Filemap

- before changing download CTAs or app-store badge text
- before changing cross-links between download and merchant/service pages
- when a download change might accidentally drift into shared marketing nav work

## Entry Files

- `public-website/src/app/(marketing)/download/page.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

## Adjacent Files Usually Read Together

- `public-website/src/features/app-download/presentation/app-download-screen.tsx`
- `public-website/src/app/(marketing)/merchant/page.tsx`
- `public-website/src/app/(marketing)/service/page.tsx`
- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`

## Source-of-Truth Files

- `public-website/src/features/app-download/presentation/app-download-screen.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

The live truth is split: download content and CTA behavior are hardcoded in the screen, while shared marketing navigation lives in the layout.

## Files Often Mistaken as Source of Truth but Are Not

- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`
- `public-website/src/shared/domain.ts`

These define a structural content boundary, but they do not currently power the live download page.

## High-Risk Edit Points

- `href="#"` store-badge links in `public-website/src/features/app-download/presentation/app-download-screen.tsx`
- repeated store-badge CTA sections inside the same screen
- shared header/footer download links in `public-website/src/app/(marketing)/layout.tsx`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `public-website/src/features/app-download/README.md`
- `public-website/src/features/landing/README.md`

## Safe Edit Sequence

1. Confirm whether the change is screen-local or shared-shell behavior.
2. Update `app-download-screen.tsx` for live CTA and copy changes.
3. Update the marketing layout only if shared nav/footer download links must change too.
4. If real store links are added, replace all placeholder badge links consistently in the same pass.

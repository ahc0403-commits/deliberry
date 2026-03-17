# Public Merchant Filemap

Status: Active
Authority: Operational
Surface: public-website
Domains: merchant, partner-acquisition, route-cluster
Last updated: 2026-03-17
Retrieve when:
- changing the public `/merchant` route
- debugging whether a merchant-route change belongs in the screen or the marketing layout
- checking whether the lead form is live or only presentational
Related files:
- public-website/src/app/(marketing)/merchant/page.tsx
- public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Show the narrow file cluster for the live `/merchant` route, its screen owner, and the shared marketing shell around it.

## When To Retrieve This Filemap

- before changing `/merchant` copy, CTAs, or form wording
- before editing shared marketing-shell links from the merchant-route context
- when the content-service layer looks relevant but may not be wired in

## Entry Files

- `public-website/src/app/(marketing)/merchant/page.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

## Adjacent Files Usually Read Together

- `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx`
- `public-website/src/app/(marketing)/service/page.tsx`
- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`

## Source-of-Truth Files

- `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

The live truth is split: merchant-route content and form copy are hardcoded in `merchant-onboarding-screen.tsx`, while shared marketing navigation/footer ownership lives in the marketing layout.

## Files Often Mistaken as Source of Truth but Are Not

- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`
- `public-website/src/shared/domain.ts`

These define a structural content boundary, but they do not currently drive the live `/merchant` route.

## High-Risk Edit Points

- form copy, CTA targets, and anchor behavior in `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx`
- shared nav/footer links in `public-website/src/app/(marketing)/layout.tsx`
- any partial attempt to treat the lead form as live submission logic without matching runtime-truth updates

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `public-website/src/features/merchant-onboarding/README.md`
- `public-website/src/features/landing/README.md`

## Safe Edit Sequence

1. Confirm whether the change belongs to the merchant screen or the marketing layout.
2. Update `merchant-onboarding-screen.tsx` for live route-content changes.
3. Update the marketing layout only if shared nav/footer behavior must change.
4. Treat the lead form as presentational until a real submission path exists and is documented.

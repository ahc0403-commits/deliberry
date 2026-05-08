# Public Merchant Onboarding

Status: Active
Authority: Operational
Surface: public-website
Domains: merchant, partner-acquisition, marketing
Last updated: 2026-04-18
Retrieve when:
- editing the live `/merchant` route
- checking whether merchant-onboarding copy or form behavior is live, static, or only presentational
Related files:
- public-website/src/app/(marketing)/merchant/page.tsx
- public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Owns the live public `/merchant` route and its partner-acquisition marketing flow.

## Primary Routes and Screens

- `/(marketing)/merchant` -> `public-website/src/app/(marketing)/merchant/page.tsx`
- Screen component -> `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx`

## Source of Truth

- Live `/merchant` content is currently hardcoded in `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx`
- Route ownership lives in `public-website/src/app/(marketing)/merchant/page.tsx`
- Shared marketing shell ownership lives in `public-website/src/app/(marketing)/layout.tsx`


## Key Files to Read First

- `public-website/src/app/(marketing)/merchant/page.tsx`
- `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx`
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

- Merchant onboarding content is static and hardcoded in the screen.
- The application form is presentational only and does not submit to a live backend.
- Timeline, payouts, and benefits copy are marketing statements, not runtime workflow integrations.
- Merchant account creation and approval still happen outside the console through the partner-team handoff.

## Safe Modification Guidance

- Change live `/merchant` copy and form copy in `merchant-onboarding-screen.tsx`.
- Change shared header/footer links in the marketing layout if the route handoff changes.
- Keep console-side merchant login links pointed at the real public `/merchant` route or the partner inbox fallback.
- Keep truth-alignment with current merchant runtime docs if claims about merchant tooling or onboarding scope change.

## What Not to Change Casually

- Do not treat the lead form as a live submission path unless route/runtime docs are updated with matching behavior.
- Do not scatter merchant-acquisition copy across the layout and screen without reconciling both entry points.

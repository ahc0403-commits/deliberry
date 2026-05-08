# Public Legal

Status: Active
Authority: Operational
Surface: public-website
Domains: legal, privacy, terms, refund-policy
Last updated: 2026-04-18
Retrieve when:
- editing legal document pages or legal navigation
- checking where privacy, terms, and refund content actually lives
- verifying whether legal content is route-screen-owned or legal-shell-owned
Related files:
- public-website/src/app/(legal)/privacy/page.tsx
- public-website/src/app/(legal)/terms/page.tsx
- public-website/src/app/(legal)/refund-policy/page.tsx
- public-website/src/app/(legal)/layout.tsx

## Purpose

Owns the public legal document screens and the legal-only route shell.

## Primary Routes and Screens

- `/(legal)/privacy` -> `public-website/src/app/(legal)/privacy/page.tsx`
- `/(legal)/terms` -> `public-website/src/app/(legal)/terms/page.tsx`
- `/(legal)/refund-policy` -> `public-website/src/app/(legal)/refund-policy/page.tsx`
- Screens:
  - `public-website/src/features/legal/presentation/privacy-screen.tsx`
  - `public-website/src/features/legal/presentation/terms-screen.tsx`
  - `public-website/src/features/legal/presentation/refund-policy-screen.tsx`

## Source of Truth

- Live legal copy is currently hardcoded in the three legal presentation screens
- Legal route navigation and shell framing live in `public-website/src/app/(legal)/layout.tsx`


## Key Files to Read First

- `public-website/src/app/(legal)/layout.tsx`
- `public-website/src/features/legal/presentation/privacy-screen.tsx`
- `public-website/src/features/legal/presentation/terms-screen.tsx`
- `public-website/src/features/legal/presentation/refund-policy-screen.tsx`

## Related Shared and Domain Files

- `public-website/src/shared/domain.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Legal documents are static hardcoded content.
- Dates and contact details are manually maintained in the screen files.
- There is no repository-backed legal publishing path today.

## Safe Modification Guidance

- Change document copy in the specific legal screen file that owns it.
- Change legal navigation or shell framing in `app/(legal)/layout.tsx`.
- Keep cross-document consistency in sync when editing dates, contact emails, or policy terms.

## What Not to Change Casually

- Do not merge legal-shell concerns into individual document screens.
- Do not change one legal page’s metadata conventions without checking the others.

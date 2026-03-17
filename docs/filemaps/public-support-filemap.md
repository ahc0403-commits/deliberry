# Public Support Filemap

Status: Active
Authority: Operational
Surface: public-website
Domains: support, customer-help, route-to-folder-mismatch
Last updated: 2026-03-16
Retrieve when:
- changing the public support route or support-page content
- debugging why the `/support` route points into a differently named feature folder
- checking whether support links are live integrations or static content
Related files:
- public-website/src/app/(marketing)/support/page.tsx
- public-website/src/features/customer-support/presentation/customer-support-screen.tsx
- public-website/src/app/(marketing)/layout.tsx

## Purpose

Show the narrow file cluster for the public support route, including the current mismatch between the route-facing README target and the actual implementation folder.

## When To Retrieve This Filemap

- before changing support-page content or support links
- before renaming or moving the support implementation folder
- when a route change and a feature-folder change might be conflated

## Entry Files

- `public-website/src/app/(marketing)/support/page.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

## Adjacent Files Usually Read Together

- `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`
- `public-website/src/features/support/README.md`
- `public-website/src/features/legal/presentation/refund-policy-screen.tsx`
- `public-website/src/app/(marketing)/merchant/page.tsx`
- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`

## Source-of-Truth Files

- `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`
- `public-website/src/app/(marketing)/layout.tsx`

The live truth is split: support-page content is hardcoded in `customer-support-screen.tsx`, while shared support links in header/footer live in the marketing layout. The route points to a differently named implementation folder, and that mismatch is real.

## Files Often Mistaken as Source of Truth but Are Not

- `public-website/src/features/support/README.md`
- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`

The README is a retrieval shim only, and the repository/service layer does not currently drive the live support route.

## High-Risk Edit Points

- the import boundary in `public-website/src/app/(marketing)/support/page.tsx`
- any attempt to move `customer-support-screen.tsx` without updating route imports
- support email/help links and policy cross-links inside `customer-support-screen.tsx`
- shared support nav/footer links in the marketing layout

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `public-website/src/features/support/README.md`
- `public-website/src/features/legal/README.md`

## Safe Edit Sequence

1. Confirm whether the change is route-level, layout-level, or screen-level.
2. If the live content changes, edit `customer-support-screen.tsx`.
3. If the route target or folder naming changes, update `support/page.tsx` and the README shim together.
4. Update marketing-layout support links only if shared nav/footer behavior must change too.

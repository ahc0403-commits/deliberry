# Public Support

Status: Active
Authority: Operational
Surface: public-website
Domains: support, customer-help, public-website
Last updated: 2026-03-16
Retrieve when:
- editing the public support route
- checking why the support route does not live under a `support/` feature folder
- verifying where support-page content actually lives
Related files:
- public-website/src/app/(marketing)/support/page.tsx
- public-website/src/features/customer-support/presentation/customer-support-screen.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/shared/data/content-service.ts

## Purpose

Provides a code-adjacent retrieval entry for the public support route.

## Primary Routes and Screens

- `/(marketing)/support` -> `public-website/src/app/(marketing)/support/page.tsx`
- Actual screen component -> `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`

## Source of Truth

- Live support-page content is currently hardcoded in `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`
- Marketing shell nav/footer links live in `public-website/src/app/(marketing)/layout.tsx`

This feature cluster is structurally mismatched today: the requested `public-website/src/features/support/` folder does not own the live screen. The real implementation currently lives under `public-website/src/features/customer-support/`.

## Key Files to Read First

- `public-website/src/app/(marketing)/support/page.tsx`
- `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`
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

- Support content is static and hardcoded in the `customer-support` screen.
- Email/help paths are presentation content, not live integrations.
- The repository-backed support content boundary is not wired into the live route.
- The feature-folder naming is inconsistent with the route and this README target.

## Safe Modification Guidance

- Edit the live support content in `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`.
- Treat this README as a retrieval shim until the folder naming is normalized in a separate change.
- Keep route-level and layout-level nav changes in the marketing app layer, not in the screen.

## What Not to Change Casually

- Do not assume `public-website/src/features/support/` is the live implementation folder.
- Do not move the live screen just to satisfy naming without checking route imports.
- Do not imply real support tooling or backend-connected help flows that do not exist.

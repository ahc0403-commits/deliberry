# Public Support Flow

Status: Active
Authority: Operational
Surface: public-website
Domains: support, customer-help, marketing-route
Last updated: 2026-03-16
Retrieve when:
- changing the `/support` route, support-page content, route imports, or marketing-shell support links
- debugging the route-to-folder mismatch between `support` and `customer-support`
Related files:
- public-website/src/app/(marketing)/support/page.tsx
- public-website/src/app/(marketing)/layout.tsx
- public-website/src/features/customer-support/presentation/customer-support-screen.tsx
- public-website/src/features/support/README.md

## Purpose

Describe the real current support-route flow for the public website, including the route-to-folder mismatch that can mislead edits.

## Entry Points

- `/support`
- Shared marketing navigation rendered by [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## Main Route Sequence

- `/support`

This is a single-route support flow. The main retrieval value is understanding which files own the route, which file owns the live content, and which support folder is only a documentation shim.

## Source-of-Truth Files Involved

- [public-website/src/app/(marketing)/support/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/support/page.tsx)
- [public-website/src/features/customer-support/presentation/customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx)
- [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)

## Key Dependent Screens and Files

- [public-website/src/features/support/README.md](/Users/andremacmini/Deliberry/public-website/src/features/support/README.md)
- [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

## What Is Authoritative vs Derived in This Flow

Authoritative:

- [support/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/support/page.tsx) for route ownership
- [customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx) for live support content
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx) for shared marketing-shell nav and footer behavior

Derived, structural, or retrieval-shim-only:

- [public-website/src/features/support/README.md](/Users/andremacmini/Deliberry/public-website/src/features/support/README.md) is documentation only
- [content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- [public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

## Known Static, Hardcoded, Partial, or Retrieval-Shim-Only Limits

- The support page is static screen content, not a live support workflow.
- There is no form submission, ticket creation, chat integration, or dynamic help content.
- The `features/support/` cluster is retrieval-shim-only, while the live implementation is still under `features/customer-support/`.

## Common Edit Mistakes

- Editing `public-website/src/features/support/` and expecting the live `/support` route to change.
- Treating shared content-service files as live support content owners.
- Moving the support implementation folder or import path without updating [support/page.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/support/page.tsx).

## Related Filemaps

- [docs/filemaps/public-support-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-support-filemap.md)

## Related Runtime-Truth Docs

- [docs/runtime-truth/public-support-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-support-truth.md)

## Related Governance Docs

- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- [docs/05-implementation-phases.md](/Users/andremacmini/Deliberry/docs/05-implementation-phases.md)

# Admin Permissions Filemap

Status: Active
Authority: Operational
Surface: admin-console
Domains: permissions, role-boundary, access-boundary
Last updated: 2026-03-17
Retrieve when:
- changing admin role selection or access-boundary behavior
- debugging why role selection and route enforcement disagree
- checking where admin role state is written and read
Related files:
- admin-console/src/shared/auth/admin-session.ts
- admin-console/src/features/permissions/server/permission-actions.ts
- admin-console/src/app/(platform)/access-boundary/page.tsx
- admin-console/src/shared/auth/admin-access.ts
- admin-console/src/features/auth/server/access.ts
- admin-console/middleware.ts

## Purpose

Show the narrow file cluster for admin role selection and the current role-cookie handoff into the platform shell.

## When To Retrieve This Filemap

- before changing admin role options or redirect targets
- before adding real permission-aware route or nav filtering
- when role cookie state and visible platform behavior disagree

## Entry Files

- `admin-console/src/app/(platform)/access-boundary/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`

## Adjacent Files Usually Read Together

- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- `admin-console/src/features/permissions/server/permission-actions.ts`
- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/shared/auth/admin-access.ts`
- `admin-console/src/features/auth/server/access.ts`
- `admin-console/src/features/permissions/state/permissions-placeholder-state.ts`
- `admin-console/middleware.ts`

## Source-of-Truth Files

- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/features/permissions/server/permission-actions.ts`

The source of truth is split: role cookies are defined and readable in `admin-session.ts`, role write behavior lives in `permission-actions.ts`, and route-access rules live in `admin-access.ts` plus `access.ts` and `middleware.ts`.

## Files Often Mistaken as Source of Truth but Are Not

- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/shared/domain.ts`

These files describe roles or render access UI, but they do not own the route-access rules.

## High-Risk Edit Points

- `ADMIN_ROLE_COOKIE` usage in `admin-console/src/shared/auth/admin-session.ts`
- redirect target in `admin-console/src/features/permissions/server/permission-actions.ts`
- role list and route matrix alignment in `admin-console/src/shared/auth/admin-access.ts`
- guard behavior in `admin-console/src/features/auth/server/access.ts`
- request-entry enforcement in `admin-console/middleware.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `admin-console/src/features/permissions/README.md`
- `admin-console/src/features/auth/README.md`

## Safe Edit Sequence

1. Confirm current role-cookie semantics in `admin-session.ts`.
2. Confirm write behavior and redirect target in `permission-actions.ts`.
3. Verify whether the platform layout or route pages need to react to the same role assumptions.
4. Update access-boundary UI last, after role semantics are stable.

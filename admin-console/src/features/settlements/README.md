# Admin Settlements

Status: Active
Authority: Operational
Surface: admin-console
Domains: settlements, finance-oversight, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin settlements route
- tracing how settlement records reach the screen
Related files:
- admin-console/src/app/(platform)/settlements/page.tsx
- admin-console/src/features/settlements/presentation/settlements-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform settlements route and its fixture-backed payout oversight tables and summaries.

## Primary Routes and Screens

- `/(platform)/settlements` -> `admin-console/src/app/(platform)/settlements/page.tsx`
- Screen component -> `admin-console/src/features/settlements/presentation/settlements-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/settlements/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Settlement data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/settlements/page.tsx`
- `admin-console/src/features/settlements/presentation/settlements-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Settlement records are fixture-backed.
- Export and detail actions are local UI affordances.
- There is no live platform settlement backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change summaries and table composition in `settlements-screen.tsx`.
- Change settlement data shape in query/repository files.

## What Not to Change Casually

- Do not treat settlement actions as persisted behavior.
- Do not bypass `adminQueryServices`.
- Do not describe fixture data as live finance truth.

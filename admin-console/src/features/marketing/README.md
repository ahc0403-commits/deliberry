# Admin Marketing

Status: Active
Authority: Operational
Surface: admin-console
Domains: marketing, campaigns, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin marketing route
- tracing how campaign data reaches the screen
Related files:
- admin-console/src/app/(platform)/marketing/page.tsx
- admin-console/src/features/marketing/presentation/marketing-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform marketing route and its fixture-backed campaign summaries and tables.

## Primary Routes and Screens

- `/(platform)/marketing` -> `admin-console/src/app/(platform)/marketing/page.tsx`
- Screen component -> `admin-console/src/features/marketing/presentation/marketing-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/marketing/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Marketing data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/marketing/page.tsx`
- `admin-console/src/features/marketing/presentation/marketing-screen.tsx`
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

- Campaign data is fixture-backed.
- Create/edit controls are local UI behavior only.
- There is no live campaign orchestration backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change campaign layout and local controls in `marketing-screen.tsx`.
- Change marketing data shape in query/repository files.

## What Not to Change Casually

- Do not treat campaign actions as persisted admin mutations.
- Do not bypass `adminQueryServices`.
- Do not imply live outbound messaging behavior.

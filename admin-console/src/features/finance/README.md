# Admin Finance

Status: Active
Authority: Operational
Surface: admin-console
Domains: finance, settlement-review, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin finance route
- checking whether finance behavior is fixture-backed or locally derived
Related files:
- admin-console/src/app/(platform)/finance/page.tsx
- admin-console/src/features/finance/presentation/finance-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform finance route and its fixture-backed financial review tables and summaries.

## Primary Routes and Screens

- `/(platform)/finance` -> `admin-console/src/app/(platform)/finance/page.tsx`
- Screen component -> `admin-console/src/features/finance/presentation/finance-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/finance/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Finance data is fixture-backed and read-only.

## Key Files to Read First

- `admin-console/src/app/(platform)/finance/page.tsx`
- `admin-console/src/features/finance/presentation/finance-screen.tsx`
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

- Finance rows are fixture-backed.
- Filters and exports are local UI affordances.
- There is no live finance backend or reconciliation flow.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change finance table composition in `finance-screen.tsx`.
- Change finance data shape in query/repository files.

## What Not to Change Casually

- Do not treat finance exports as live integrations.
- Do not bypass `adminQueryServices`.
- Do not add persistence claims without real runtime support.

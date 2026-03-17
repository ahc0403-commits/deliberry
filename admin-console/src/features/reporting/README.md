# Admin Reporting

Status: Active
Authority: Operational
Surface: admin-console
Domains: reporting, exports, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin reporting route
- checking whether reporting actions are live or presentation-only
Related files:
- admin-console/src/app/(platform)/reporting/page.tsx
- admin-console/src/features/reporting/presentation/reporting-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform reporting route and its fixture-backed report catalog and export-style controls.

## Primary Routes and Screens

- `/(platform)/reporting` -> `admin-console/src/app/(platform)/reporting/page.tsx`
- Screen component -> `admin-console/src/features/reporting/presentation/reporting-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/reporting/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Report definitions are fixture-backed and export controls are local UI only.

## Key Files to Read First

- `admin-console/src/app/(platform)/reporting/page.tsx`
- `admin-console/src/features/reporting/presentation/reporting-screen.tsx`
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

- Report entries are fixture-backed and now flow through the reporting repository/query read model.
- Export and schedule controls are local UI affordances.
- There is no live reporting/export backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change report layout and local controls in `reporting-screen.tsx`.
- Change report data shape in query/repository files.

## What Not to Change Casually

- Do not present export controls as live integrations.
- Do not bypass `adminQueryServices`.
- Do not add persistence claims without real runtime support.

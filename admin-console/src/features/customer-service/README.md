# Admin Customer Service

Status: Active
Authority: Operational
Surface: admin-console
Domains: customer-service, support-tickets, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin customer-service route
- checking whether ticket actions or summaries are live or display-only
Related files:
- admin-console/src/app/(platform)/customer-service/page.tsx
- admin-console/src/features/customer-service/presentation/customer-service-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform customer-service route and its read-only support-ticket overview.

## Primary Routes and Screens

- `/(platform)/customer-service` -> `admin-console/src/app/(platform)/customer-service/page.tsx`
- Screen component -> `admin-console/src/features/customer-service/presentation/customer-service-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/customer-service/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

## Key Files to Read First

- `admin-console/src/app/(platform)/customer-service/page.tsx`
- `admin-console/src/features/customer-service/presentation/customer-service-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-disputes-truth.md`

## Known Limitations

- Ticket data is fixture-backed through the repository.
- Ticket summaries are derived in the screen from repository data.
- `Assign` and `View` are display-only actions today, not persisted ticket workflows.

## Safe Modification Guidance

- Start at the route page to confirm route ownership.
- Change summary and table presentation in `customer-service-screen.tsx`.
- Change ticket data shape or read behavior in query/repository files.

## What Not to Change Casually

- Do not treat ticket actions as live mutation paths.
- Do not bypass `adminQueryServices` and read fixture files directly from the screen.
- Do not infer support workflow completeness from the screen polish alone.

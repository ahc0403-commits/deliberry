# Admin System Management

Status: Active
Authority: Operational
Surface: admin-console
Domains: system-management, platform-config, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin system-management route
- checking whether system controls are local only or backed by platform truth
Related files:
- admin-console/src/app/(platform)/system-management/page.tsx
- admin-console/src/features/system-management/presentation/system-management-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform system-management route and its fixture-backed operational control panels.

## Primary Routes and Screens

- `/(platform)/system-management` -> `admin-console/src/app/(platform)/system-management/page.tsx`
- Screen component -> `admin-console/src/features/system-management/presentation/system-management-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/system-management/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. System-management values are fixture-backed and action controls are local UI only.

## Key Files to Read First

- `admin-console/src/app/(platform)/system-management/page.tsx`
- `admin-console/src/features/system-management/presentation/system-management-screen.tsx`
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

- System-management values are fixture-backed.
- Toggles and action buttons are local UI affordances.
- There is no live platform configuration backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change control-panel composition and local controls in `system-management-screen.tsx`.
- Change data shape in query/repository files.

## What Not to Change Casually

- Do not represent local controls as live infrastructure mutations.
- Do not bypass `adminQueryServices`.
- Do not change platform access assumptions without checking admin auth docs first.

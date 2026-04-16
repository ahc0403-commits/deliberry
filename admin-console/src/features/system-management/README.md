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
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the platform system-management route and its mixed operational oversight surface: fixture-backed service-health and feature-flag panels plus a live read-only audit-log view.

## Primary Routes and Screens

- `/(platform)/system-management` -> `admin-console/src/app/(platform)/system-management/page.tsx`
- Screen component -> `admin-console/src/features/system-management/presentation/system-management-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/system-management/page.tsx`
- Fixture-backed read-path truth for health and feature flags flows through `admin-console/src/shared/data/admin-query-services.ts`
- Live audit-log read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Fixture repository truth for non-runtime-backed panels still lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Health and flag panels remain fixture-backed, while recent audit entries are read from the governed runtime store. Action controls remain local UI only.

## Key Files to Read First

- `admin-console/src/app/(platform)/system-management/page.tsx`
- `admin-console/src/features/system-management/presentation/system-management-screen.tsx`
- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Service-health and feature-flag values are still fixture-backed.
- Audit visibility is read-only and limited to recent entries.
- Toggles and action buttons are local UI affordances.
- There is no live platform configuration backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change control-panel composition and local controls in `system-management-screen.tsx`.
- Change fixture snapshot data in query/repository files.
- Change audit read behavior in `supabase-admin-runtime-repository.ts`.

## What Not to Change Casually

- Do not represent local controls as live infrastructure mutations.
- Do not route audit visibility back through in-memory `adminQueryServices`.
- Do not change platform access assumptions without checking admin auth docs first.

# Admin Announcements

Status: Active
Authority: Operational
Surface: admin-console
Domains: announcements, communications, admin
Last updated: 2026-03-17
Retrieve when:
- editing the admin announcements route
- checking whether announcement actions are local or backed by platform truth
Related files:
- admin-console/src/app/(platform)/announcements/page.tsx
- admin-console/src/features/announcements/presentation/announcements-screen.tsx
- admin-console/src/shared/data/admin-query-services.ts
- admin-console/src/shared/data/admin-repository.ts

## Purpose

Owns the platform announcements route and its fixture-backed message cards and composer-like sections.

## Primary Routes and Screens

- `/(platform)/announcements` -> `admin-console/src/app/(platform)/announcements/page.tsx`
- Screen component -> `admin-console/src/features/announcements/presentation/announcements-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/announcements/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/admin-query-services.ts`
- Repository truth lives in `admin-console/src/shared/data/admin-repository.ts`

The route is access-enforced. Announcement data is fixture-backed and action controls are local UI only.

## Key Files to Read First

- `admin-console/src/app/(platform)/announcements/page.tsx`
- `admin-console/src/features/announcements/presentation/announcements-screen.tsx`
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

- Announcement content is fixture-backed.
- Compose, publish, and dismiss controls are local UI affordances.
- There is no live messaging backend.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change announcement composition and local controls in `announcements-screen.tsx`.
- Change announcement data shape in query/repository files.

## What Not to Change Casually

- Do not present compose actions as live outbound sends.
- Do not bypass `adminQueryServices`.
- Do not treat local screen state as platform message truth.

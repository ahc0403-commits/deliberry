# Admin Merchants

Status: Active
Authority: Operational
Surface: admin-console
Domains: merchants, platform-oversight, admin
Last updated: 2026-04-24
Retrieve when:
- editing the admin merchants route
- tracing how merchant list data reaches the screen
Related files:
- admin-console/src/app/(platform)/merchants/page.tsx
- admin-console/src/features/merchants/presentation/merchants-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts
- admin-console/src/features/stores/server/provisioning-actions.ts

## Purpose

Owns the platform merchants route, runtime-backed merchant oversight table, and row-level runtime inspection pane.

## Primary Routes and Screens

- `/(platform)/merchants` -> `admin-console/src/app/(platform)/merchants/page.tsx`
- Screen component -> `admin-console/src/features/merchants/presentation/merchants-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/merchants/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Row inspection combines merchant identity, store footprint, order pressure, and store provisioning evidence from runtime-backed reads
- Merchant creation currently happens from the Stores route provisioning action so merchant identity and first store are created together.

The route is access-enforced. Merchant list data is runtime-backed, and row selection opens a read-only runtime detail pane from this screen.

## Key Files to Read First

- `admin-console/src/app/(platform)/merchants/page.tsx`
- `admin-console/src/features/merchants/presentation/merchants-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- `admin-console/src/features/stores/server/provisioning-actions.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Merchant data is runtime-backed.
- Row inspection is runtime-backed but intentionally non-mutating.
- Merchant creation is live through store provisioning; standalone merchant-only management writes are not implemented on this route.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change table composition, local selection state, and detail presentation in `merchants-screen.tsx`.
- Change merchant list data shape in `supabase-admin-runtime-repository.ts`.

## What Not to Change Casually

- Do not treat row actions as persisted platform mutations.
- Do not change access assumptions without checking admin auth and permissions docs.

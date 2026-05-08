# Admin Stores

Status: Active
Authority: Operational
Surface: admin-console
Domains: stores, platform-oversight, admin
Last updated: 2026-04-24
Retrieve when:
- editing the admin stores route
- tracing how store list data reaches the screen
Related files:
- admin-console/src/app/(platform)/stores/page.tsx
- admin-console/src/features/stores/presentation/stores-screen.tsx
- admin-console/src/features/stores/presentation/provision-merchant-store-form.tsx
- admin-console/src/features/stores/server/provisioning-actions.ts
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the platform stores route, runtime-backed store oversight table, row-level runtime inspection pane, and admin-created merchant store provisioning entry point.

## Primary Routes and Screens

- `/(platform)/stores` -> `admin-console/src/app/(platform)/stores/page.tsx`
- Screen component -> `admin-console/src/features/stores/presentation/stores-screen.tsx`
- Provisioning form -> `admin-console/src/features/stores/presentation/provision-merchant-store-form.tsx`
- Provisioning server action -> `admin-console/src/features/stores/server/provisioning-actions.ts`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/stores/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Row inspection reads store posture from `stores`, order-count summaries from `orders`, and provisioning evidence from `audit_logs`
- Provisioning creates Supabase Auth user, `actor_profiles`, `merchant_profiles`, `stores`, `merchant_memberships`, and `audit_logs`

The route is access-enforced. Store rows are runtime-backed. Row-level inspect actions open a read-only runtime detail pane, while the provisioning form is a real platform mutation path.

## Key Files to Read First

- `admin-console/src/app/(platform)/stores/page.tsx`
- `admin-console/src/features/stores/presentation/stores-screen.tsx`
- `admin-console/src/features/stores/server/provisioning-actions.ts`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Store list records are runtime-backed.
- Provisioning is live, and row-level inspect actions are runtime-backed but intentionally read-only.
- Provisioned stores default to `status = open` and `accepting_orders = false` so the merchant can add menu data before customer exposure.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change table composition, selection state, and read-only detail presentation in `stores-screen.tsx`.
- Change store data shape in `supabase-admin-runtime-repository.ts`.
- Keep provisioning mutations in server actions; do not move service-role writes to client code.

## What Not to Change Casually

- Do not treat screen-local selection as runtime truth.
- Do not bypass admin access checks.
- Do not expose or persist generated temporary passwords after the one-time provisioning result.

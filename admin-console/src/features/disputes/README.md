# Admin Disputes

Status: Active
Authority: Operational
Surface: admin-console
Domains: disputes, platform-oversight, audited-status-mutations
Last updated: 2026-05-04
Retrieve when:
- editing dispute oversight UI or case summary behavior
- checking where admin dispute data comes from
- verifying whether dispute actions are governed audited transitions or read-only
Related files:
- admin-console/src/app/(platform)/disputes/page.tsx
- admin-console/src/features/disputes/presentation/disputes-screen.tsx
- admin-console/src/features/disputes/presentation/dispute-action-cell.tsx
- admin-console/src/features/disputes/server/dispute-actions.ts
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the admin platform-wide disputes oversight screen, runtime-backed case queue, and row-level runtime inspection pane.

## Primary Routes and Screens

- `/(platform)/disputes` -> `admin-console/src/app/(platform)/disputes/page.tsx`
- Screen component -> `admin-console/src/features/disputes/presentation/disputes-screen.tsx`

## Source of Truth

- Page-level read-model entry: `admin-console/src/app/(platform)/disputes/page.tsx`
- Runtime data owner: `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

The disputes screen is a presentation layer over persisted runtime repository data plus a narrow audited mutation path for status transitions.
Row selection now opens a read-only runtime detail pane while the audited status-transition path remains unchanged.

## Key Files to Read First

- `admin-console/src/app/(platform)/disputes/page.tsx`
- `admin-console/src/features/disputes/presentation/disputes-screen.tsx`
- `admin-console/src/features/disputes/server/dispute-actions.ts`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`
- `shared/api/dispute.contract.json`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Disputes are persisted and read from Supabase.
- Summary metrics are derived directly from the current persisted read set.
- Row inspection is runtime-backed but intentionally contextual only.
- Approved writes are limited to audited status transitions: `open -> investigating`, `open -> escalated`, `investigating -> escalated`, `investigating -> resolved`, and `escalated -> resolved`.
- Assignment, reopen, refund, and payout-side dispute control remain outside the admin console.
- The route is gated before the page renders, and the server action only accepts `platform_admin`, `operations_admin`, and `support_admin`.

## Safe Modification Guidance

- Change dispute data shape in `supabase-admin-runtime-repository.ts` before changing the table or summary cards.
- Keep summary calculations aligned with the dispute fixture structure.
- Treat any future assignment, reopen, or settlement-side flow as new runtime work, not as a quick screen-only edit.

## What Not to Change Casually

- Do not imply assignment ownership, refund powers, or payout control from this screen.
- Do not bypass the audited RPC path for dispute status changes.
- Do not bypass `admin-console/src/shared/domain.ts` for repo-level shared imports.

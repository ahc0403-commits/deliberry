# Admin Settlements

Status: Active
Authority: Operational
Surface: admin-console
Domains: settlements, finance-oversight, admin, audited-received-acknowledgment
Last updated: 2026-05-04
Retrieve when:
- editing the admin settlements route
- tracing how settlement records reach the screen
- checking whether received acknowledgment is governed runtime behavior or still view-only
Related files:
- admin-console/src/app/(platform)/settlements/page.tsx
- admin-console/src/features/settlements/presentation/settlements-screen.tsx
- admin-console/src/features/settlements/presentation/settlement-action-cell.tsx
- admin-console/src/features/settlements/server/settlement-actions.ts
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the platform settlements route and its runtime-backed payout oversight tables and summaries.

## Primary Routes and Screens

- `/(platform)/settlements` -> `admin-console/src/app/(platform)/settlements/page.tsx`
- Screen component -> `admin-console/src/features/settlements/presentation/settlements-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/settlements/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Repository truth lives in `delivery_settlements`, `delivery_settlement_items`, and related store lookups exposed by `supabase-admin-runtime-repository.ts`

The route is access-enforced. Settlement data is runtime-backed. Mutation is limited to audited manual acknowledgment of `calculated` settlements as `received`. Table timestamps are rendered in an operator-friendly local display format rather than raw UTC strings.

## Key Files to Read First

- `admin-console/src/app/(platform)/settlements/page.tsx`
- `admin-console/src/features/settlements/presentation/settlements-screen.tsx`
- `admin-console/src/features/settlements/server/settlement-actions.ts`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Settlement records are runtime-backed from landed settlement tables.
- Export and detail actions are local UI affordances.
- Mutation is limited to received acknowledgment only.
- Payout execution, dispute adjustment, refund handling, and payment verification remain intentionally absent.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change summaries and table composition in `settlements-screen.tsx`.
- Change settlement data shape in query/repository files.
- Treat any future adjustment, dispute, or payout-control flow as new runtime work, not a small extension of the current action cell.

## What Not to Change Casually

- Do not describe the acknowledgment action as payout execution or payment verification.
- Do not widen the action path beyond `calculated -> received` without a new contract and evidence pass.
- Do not bypass `supabase-admin-runtime-repository.ts`.
- Do not describe read-only settlement visibility as live payout control.

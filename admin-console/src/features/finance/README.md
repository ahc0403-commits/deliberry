# Admin Finance

Status: Active
Authority: Operational
Surface: admin-console
Domains: finance, settlement-review, admin
Last updated: 2026-05-04
Retrieve when:
- editing the admin finance route
- checking whether finance behavior is runtime-backed or locally derived
Related files:
- admin-console/src/app/(platform)/finance/page.tsx
- admin-console/src/features/finance/presentation/finance-screen.tsx
- admin-console/src/shared/data/supabase-admin-runtime-repository.ts

## Purpose

Owns the platform finance route and its runtime-backed financial review tables and summaries.

## Primary Routes and Screens

- `/(platform)/finance` -> `admin-console/src/app/(platform)/finance/page.tsx`
- Screen component -> `admin-console/src/features/finance/presentation/finance-screen.tsx`

## Source of Truth

- Route ownership lives in `admin-console/src/app/(platform)/finance/page.tsx`
- Read-path truth flows through `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`
- Finance summary truth is derived from landed settlement rows plus store lookups in `supabase-admin-runtime-repository.ts`

The route is access-enforced. Finance data is runtime-backed. This route remains visibility-first; the only approved mutation is a narrow manual received acknowledgment on the separate settlement oversight route.

## Key Files to Read First

- `admin-console/src/app/(platform)/finance/page.tsx`
- `admin-console/src/features/finance/presentation/finance-screen.tsx`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/shared/data/admin-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Known Limitations

- Finance rows are derived from the current settlement read model.
- Filters and exports are local UI affordances.
- There is no live finance backend, payout execution flow, or automated reconciliation flow.
- Manual settlement acknowledgment is approved only through the settlement oversight route for `calculated -> received`.

## Safe Modification Guidance

- Start at the route page to confirm platform ownership.
- Change finance table composition in `finance-screen.tsx`.
- Change finance data shape in query/repository files.

## What Not to Change Casually

- Do not treat finance exports as live integrations.
- Do not bypass `supabase-admin-runtime-repository.ts` for finance summary truth.
- Do not add persistence claims without real runtime support.
- Do not describe settlement acknowledgment as payout execution or payment verification.

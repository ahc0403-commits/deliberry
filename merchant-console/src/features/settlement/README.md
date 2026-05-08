# Merchant Settlement

Status: Active
Authority: Operational
Surface: merchant-console
Domains: settlement, payouts, merchant
Last updated: 2026-05-06
Retrieve when:
- editing the merchant settlement route or payout tables
- tracing how store-scoped settlement records reach the screen
Related files:
- merchant-console/src/app/(console)/[storeId]/settlement/page.tsx
- merchant-console/src/features/settlement/presentation/settlement-screen.tsx
- merchant-console/src/shared/data/merchant-settlement-runtime-service.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts

## Purpose

Owns the store-scoped settlement route and its payout summaries and records.

## Primary Routes and Screens

- `/(console)/[storeId]/settlement` -> `merchant-console/src/app/(console)/[storeId]/settlement/page.tsx`
- Screen component -> `merchant-console/src/features/settlement/presentation/settlement-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/settlement/page.tsx`
- Read-path truth flows through `merchant-console/src/shared/data/merchant-settlement-runtime-service.ts`
- Repository truth lives in `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

The route is store-scoped. Under Supabase merchant auth it is runtime-backed and read-only; under local `demo-cookie` auth it falls back to a local read-only snapshot so store-scoped development flows remain usable. The screen surfaces that distinction directly so local preview data is not mistaken for live settlement data.
Status labels on the screen now resolve through the merchant locale layer instead of relying on raw persisted status casing.

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/settlement/page.tsx`
- `merchant-console/src/features/settlement/presentation/settlement-screen.tsx`
- `merchant-console/src/shared/data/merchant-settlement-runtime-service.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Settlement records are runtime-backed from `delivery_settlements`, `delivery_settlement_items`, and linked `external_sales` when merchant auth authority is `supabase`.
- Local `demo-cookie` auth intentionally falls back to a local read-only snapshot for settlement visibility.
- Settlement timestamps are rendered in an operator-friendly local display format rather than raw ISO strings.
- Export/download actions are presentation-only.
- Mutation and payout control are still intentionally absent.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change table composition and summaries in `settlement-screen.tsx`.
- Change settlement fixtures or store-scoped reads in query/repository files.

## What Not to Change Casually

- Do not treat settlement statuses as live payout truth.
- Do not bypass the settlement runtime service or repository path.
- Do not weaken store-scope validation.

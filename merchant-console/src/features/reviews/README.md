# Merchant Reviews

Status: Active
Authority: Operational
Surface: merchant-console
Domains: reviews, store-scoped-feedback, merchant
Last updated: 2026-04-15
Retrieve when:
- editing the merchant reviews route
- checking whether review filtering or response actions are live or local-only
Related files:
- merchant-console/src/app/(console)/[storeId]/reviews/page.tsx
- merchant-console/src/features/reviews/presentation/reviews-screen.tsx
- merchant-console/src/shared/data/merchant-review-runtime-service.ts

## Purpose

Owns the store-scoped merchant reviews route and its runtime-backed customer-feedback read path.

## Primary Routes and Screens

- `/(console)/[storeId]/reviews` -> `merchant-console/src/app/(console)/[storeId]/reviews/page.tsx`
- Screen component -> `merchant-console/src/features/reviews/presentation/reviews-screen.tsx`

## Source of Truth

- Route store scope comes from `merchant-console/src/app/(console)/[storeId]/reviews/page.tsx`
- Read and write runtime truth flow through `merchant-console/src/shared/data/merchant-review-runtime-service.ts`
- Filter tab state is local React state inside `reviews-screen.tsx`

## Key Files to Read First

- `merchant-console/src/app/(console)/[storeId]/reviews/page.tsx`
- `merchant-console/src/features/reviews/presentation/reviews-screen.tsx`
- `merchant-console/src/shared/data/merchant-review-runtime-service.ts`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/shared/data/merchant-mock-data.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Known Limitations

- Review data is runtime-backed.
- Response filtering is local UI state only.
- `Write Response` persists through the merchant review runtime service, but the rest of the screen remains a read-heavy oversight surface.

## Safe Modification Guidance

- Start at the route page to confirm storeId handoff.
- Change screen filtering and presentation in `reviews-screen.tsx`.
- Change review data shape or response behavior in `merchant-review-runtime-service.ts`.

## What Not to Change Casually

- Do not bypass the route-level runtime service and read fixtures directly in the screen.
- Do not break the storeId path between route page and repository reads.

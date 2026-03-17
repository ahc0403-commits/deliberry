# Customer Reviews

Status: Active
Authority: Operational
Surface: customer-app
Domains: reviews, post-order-feedback, customer
Last updated: 2026-03-17
Retrieve when:
- editing the customer reviews screen or review handoff
- checking whether reviews are owned by orders flow or by standalone local state
Related files:
- customer-app/lib/features/reviews/presentation/reviews_screen.dart
- customer-app/lib/features/orders/presentation/order_detail_screen.dart
- customer-app/lib/core/data/mock_data.dart
- customer-app/lib/app/router/app_router.dart

## Purpose

Owns the customer reviews screen and the post-order feedback handoff from order detail.

## Primary Routes and Screens

- `/reviews` -> `reviews_screen.dart`

## Source of Truth

- Route ownership lives in `customer-app/lib/app/router/app_router.dart`
- Entry from orders is triggered by `customer-app/lib/features/orders/presentation/order_detail_screen.dart`
- Review content is currently mock-backed through `customer-app/lib/core/data/mock_data.dart`

The route is real, but review data and submission behavior remain local/demo-safe. Order-linked review entry is the only real feedback path; profile no longer sends users straight into a fake standalone submission flow.

## Key Files to Read First

- `customer-app/lib/features/reviews/presentation/reviews_screen.dart`
- `customer-app/lib/features/orders/presentation/order_detail_screen.dart`
- `customer-app/lib/core/data/mock_data.dart`
- `customer-app/lib/app/router/app_router.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/orders/presentation/order_detail_screen.dart`

## Related Governance Docs

- `docs/flows/customer-checkout-orders-flow.md`
- `docs/flows/customer-profile-settings-flow.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`

## Known Limitations

- Reviews are mock-backed.
- Review save is local preview behavior, not backend-backed persistence.
- When `/reviews` is opened without a valid `orderId`, the screen degrades into an honest preview state and sends the user back to `/orders`.
- The primary review-entry path is now `order detail -> /reviews`.

## Safe Modification Guidance

- Change review composition and local behavior in `reviews_screen.dart`.
- Change order-detail handoff in `order_detail_screen.dart` only if review routing changes.
- Keep profile-side review discovery routed through orders unless a real review-history surface exists.
- Change seed review content in `mock_data.dart` only if the screen model changes.

## What Not to Change Casually

- Do not describe review state as persisted platform feedback truth.
- Do not break the order-detail to reviews handoff without checking the orders flow docs.
- Do not reintroduce direct profile-to-review submission without real order-linked context.
- Do not treat mock review data as mutable runtime source of truth.

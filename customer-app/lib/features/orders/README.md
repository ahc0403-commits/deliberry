# Customer Orders Feature

Status: active
Authority: operational
Surface: customer-app
Domains: orders, detail, status, reorder
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- editing order list/detail/status continuity
- changing reorder behavior or order-id route handling
Related files:
- customer-app/lib/features/orders/presentation/orders_screen.dart
- customer-app/lib/features/orders/presentation/order_detail_screen.dart
- customer-app/lib/features/orders/presentation/order_status_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart

## Purpose

Own persisted customer order history, order follow-up routes, and reorder handoff back into cart.

## Primary routes/screens

- `/orders` -> `OrdersListScreen`
- `/orders/detail` -> `OrderDetailScreen`
- `/orders/status` -> `OrderStatusScreen`

## Source of truth

- Runtime order list, order lookup, and reorder orchestration live in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- Persisted order reads and creation flow through [supabase_customer_runtime_gateway.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/supabase_customer_runtime_gateway.dart)
- Route ownership and auth gating live in [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- Canonical route names live in [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Key files to read first

- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)

## Related shared widgets/patterns

- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)
  - `OrderCard`
  - `PriceRow`
  - `EmptyState`
- Governed as `Order Tracking` and `Detail` screen types in [SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)

## Known limitations / partial-support truth

- Order records are persisted for authenticated customers and then mirrored into runtime state for the UI.
- `OrderStatusScreen` is route-real but intentionally shows a static timeline, not realtime tracking.
- Reorder is flow-connected through runtime truth, but it still reconstructs the cart from the current runtime order model instead of a new live fulfillment system.

## Safe modification guidance

- Preserve one order-id path across list, detail, status, reviews, and reorder.
- Change reorder in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) before changing button behavior in the screens.
- If you touch order presentation fields, verify both active and history tabs plus detail/status fallback states.

## What not to change casually

- Do not let `OrderDetailScreen` or `OrderStatusScreen` silently ignore route arguments.
- Do not split order truth across separate screen-local caches.
- Do not imply realtime delivery tracking unless the runtime actually supports it.

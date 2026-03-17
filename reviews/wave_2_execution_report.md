# Wave 2 Execution Report — Customer-App Data Model Compliance

Date: 2026-03-17
Source: reviews/governance_enforcement_gap_plan.md (Remediation Wave 2)
Contract: reviews/wave_2_execution_contract.md
Scope: GAP-C01, GAP-C02, GAP-C03
Status: **CLOSED**

---

## Wave 2 Gaps Resolved

### GAP-C01: Float dollars to integer centavos (CRITICAL) — RESOLVED
**Rules**: R-010, R-011
**Changes**:
- `mock_data.dart`: `MockStore.deliveryFee`, `MockMenuItem.price`, `MockOrder.total` types changed from `double` to `int`. All money literal values converted to centavos (e.g., `12.99` → `1299`, `2.99` → `299`).
- `mock_data.dart`: `MockCartItem.total` getter returns `int` (price × quantity).
- `mock_data.dart`: `MockData.cartSubtotal`/`cartDeliveryFee`/`cartServiceFee`/`cartTotal` changed from `double` to `int`.
- `customer_runtime_controller.dart`: All cart/fee/discount types changed from `double` to `int`. Promo discount `5.0` → `500`.
- `widgets.dart`: `StoreCard.deliveryFee`, `MenuItemCard.price`, `OrderCard.total` changed from `double` to `int`. Display uses `(value / 100).toStringAsFixed(2)`.
- Added `formatCentavos(int centavos)` helper in `mock_data.dart` for consistent presentation-layer formatting.
- Updated all presentation files: `cart_screen.dart`, `checkout_screen.dart`, `order_detail_screen.dart`, `order_status_screen.dart`, `store_screen.dart`, `menu_browsing_screen.dart`.

### GAP-C02: Display status strings to canonical enum values (CRITICAL) — RESOLVED
**Rules**: R-041, R-043
**Changes**:
- `mock_data.dart`: Status values changed: `'Preparing'` → `'preparing'`, `'On the way'` → `'in_transit'`, `'Delivered'` → `'delivered'`.
- `customer_runtime_controller.dart`: `submitOrder()` now uses `'preparing'` (canonical) instead of `'Preparing'` (display string).
- Added `formatOrderStatus(String canonicalStatus)` helper in `mock_data.dart` mapping canonical values to user-facing labels.
- `widgets.dart`: `OrderCard` passes status through `formatOrderStatus()` for display.
- `order_detail_screen.dart`: `StatusBadge` uses `formatOrderStatus()`.

### GAP-C03: Relative timestamps to UTC ISO 8601 (CRITICAL) — RESOLVED
**Rules**: R-050, DATE.md Laws 4, 6, 10, 11
**Changes**:
- `mock_data.dart`: `MockOrder.date` → `MockOrder.createdAt` (field rename per DATE.md Law 10). Values changed to UTC ISO 8601 (e.g., `'Today, 2:30 PM'` → `'2026-03-17T17:30:00Z'`).
- `mock_data.dart`: `MockNotification.time` → `MockNotification.createdAt` (field rename). Values changed to UTC ISO 8601 (e.g., `'2 min ago'` → `'2026-03-17T20:28:00Z'`).
- `customer_runtime_controller.dart`: `submitOrder()` now uses `DateTime.now().toUtc().toIso8601String()`. Removed unused `_formatNow()`.
- Added `formatOrderDate(String utcIso)` and `formatRelativeTime(String utcIso)` helpers in `mock_data.dart` for presentation-layer display.
- Updated: `widgets.dart` (OrderCard), `orders_screen.dart`, `order_detail_screen.dart`, `reviews_screen.dart`, `notifications_screen.dart`.

---

## Files Changed

| # | File | Gap(s) | Change Summary |
|---|------|--------|----------------|
| 1 | `customer-app/lib/core/data/mock_data.dart` | C01, C02, C03 | Types double→int; status to canonical; date/time→createdAt with UTC ISO 8601; added formatCentavos, formatOrderStatus, formatRelativeTime, formatOrderDate helpers |
| 2 | `customer-app/lib/core/data/customer_runtime_controller.dart` | C01, C02, C03 | Cart/fee/discount double→int; promo 5.0→500; submitOrder uses canonical status + UTC timestamp; removed _formatNow |
| 3 | `customer-app/lib/features/common/presentation/widgets.dart` | C01, C02, C03 | StoreCard/MenuItemCard/OrderCard types double→int; date→createdAt; display formatting via helpers |
| 4 | `customer-app/lib/features/cart/presentation/cart_screen.dart` | C01 | All toStringAsFixed(2) → formatCentavos() |
| 5 | `customer-app/lib/features/checkout/presentation/checkout_screen.dart` | C01 | All toStringAsFixed(2) → formatCentavos() |
| 6 | `customer-app/lib/features/orders/presentation/orders_screen.dart` | C03 | date: → createdAt: in OrderCard |
| 7 | `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | C01, C02, C03 | Added mock_data import; centavo/status/date formatting |
| 8 | `customer-app/lib/features/orders/presentation/order_status_screen.dart` | C01 | Added mock_data import; centavo formatting |
| 9 | `customer-app/lib/features/notifications/presentation/notifications_screen.dart` | C03 | time→createdAt; formatRelativeTime display |
| 10 | `customer-app/lib/features/reviews/presentation/reviews_screen.dart` | C03 | order.date→formatOrderDate(order.createdAt) |
| 11 | `customer-app/lib/features/store/presentation/store_screen.dart` | C01 | deliveryFee + cartTotal centavo formatting |
| 12 | `customer-app/lib/features/store/presentation/menu_browsing_screen.dart` | C01 | cartTotal centavo formatting |

**Total files changed**: 12 (within contract limit of customer-app only)

---

## Validation Summary

| Check | Result |
|-------|--------|
| `flutter analyze` (customer-app) | No issues found |
| `npm run typecheck` (merchant-console) | Pass — no errors (regression check) |
| `npm run typecheck` (admin-console) | Pass — no errors (regression check) |
| `npm run typecheck` (public-website) | Pass — no errors (regression check) |

---

## Contract Compliance

- **Surface boundary**: Only customer-app files modified. No shared/, merchant-console, admin-console, or public-website code changed.
- **Directory boundary**: All changes in `lib/core/data/` and `lib/features/*/presentation/`.
- **No new architecture**: Display helpers are simple functions in mock_data.dart, not new patterns.
- **No refactor beyond gaps**: Only money types, status strings, and timestamp fields changed.
- **MockStore.rating**: Correctly left as `double` (not a money field).
- **MockPromotion.discount**: Correctly left as `String` (display label, not money field).

---

## Remaining Unresolved Wave 2 Items

**None.** All 3 gaps (GAP-C01, GAP-C02, GAP-C03) are resolved.

---

## Cumulative Remediation Progress

| Wave | Gaps Resolved | Status |
|------|--------------|--------|
| Gap Plan Wave 1 | GAP-C06, GAP-H01, GAP-H02, GAP-H05, GAP-H06, GAP-H08 (6 gaps) | CLOSED |
| Gap Plan Wave 2 | GAP-C01, GAP-C02, GAP-C03 (3 gaps) | CLOSED |
| **Total resolved** | **9 of 26 gaps** | |
| **Remaining** | **17 gaps** (1 CRITICAL, 2 HIGH, 8 MEDIUM, 4 LOW + 2 HIGH from original) | |

---

*Report generated: 2026-03-17*
*Evidence basis: flutter analyze pass, npm run typecheck pass (3 surfaces), direct file inspection.*

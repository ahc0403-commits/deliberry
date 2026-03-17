# Wave 2 Execution Contract — Customer-App Data Model Compliance

Date: 2026-03-17
Source: reviews/governance_enforcement_gap_plan.md (Remediation Wave 2)
Prerequisite: Gap Plan Wave 1 (Shared Contract Alignment) — COMPLETE 2026-03-17
Status: READY FOR EXECUTION

---

## Scope

Wave 2 resolves 3 gaps, all in `customer-app`. These are the highest-severity remaining items (all CRITICAL priority). They target `customer-app/lib/core/data/mock_data.dart` and its downstream presentation consumers.

---

## Gaps to Resolve

### GAP-C01: Float dollars to integer centavos (CRITICAL)

**Rules violated**: R-010 (integer centavos), R-011 (no floats for money)
**Decay mode**: DECAY_PATH.md Mode 2 (Float Money)

**Current state**:
- `MockStore.deliveryFee` is `double` (values: 2.99, 3.49, 1.99, 2.49, 2.99, 1.49)
- `MockMenuItem.price` is `double` (values: 12.99, 7.49, 11.49, 9.99, 6.99, 14.99, 6.49, 4.49)
- `MockCartItem.total` getter computes `double` (menuItem.price * quantity)
- `MockOrder.total` is `double` (values: 33.47, 28.97, 22.98, 18.47, 12.48)
- `MockData.cartSubtotal` computes `double` via fold
- `MockData.cartDeliveryFee` is `double` (2.99)
- `MockData.cartServiceFee` is `double` (1.49)
- `MockData.cartTotal` computes `double`

**Required state**:
- All money fields change from `double` to `int`
- All values multiply by 100 to become centavos (e.g., 12.99 -> 1299)
- `MockCartItem.total` getter returns `int` (menuItem.price * quantity)
- `cartSubtotal`, `cartDeliveryFee`, `cartServiceFee`, `cartTotal` all return `int`

**In-scope files**:

| File | Changes Required |
|------|-----------------|
| `customer-app/lib/core/data/mock_data.dart` | Change `double` types to `int` for: `MockStore.deliveryFee`, `MockMenuItem.price`, `MockOrder.total`, `MockCartItem.total` getter, `cartSubtotal`, `cartDeliveryFee`, `cartServiceFee`, `cartTotal`. Convert all money literal values to centavos. |
| `customer-app/lib/features/cart/presentation/cart_screen.dart` | Update money display: divide centavos by 100 for user-facing text (e.g., `(item.total / 100).toStringAsFixed(2)`) |
| `customer-app/lib/features/checkout/presentation/checkout_screen.dart` | Update money display: divide centavos by 100 for user-facing text |
| `customer-app/lib/features/orders/presentation/orders_screen.dart` | Update money display if order totals are shown |
| `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | Update money display if order totals are shown |
| `customer-app/lib/features/home/presentation/home_screen.dart` | Update money display if store delivery fees are shown |
| `customer-app/lib/features/home/presentation/discovery_screen.dart` | Update money display if store delivery fees are shown |
| `customer-app/lib/features/store/presentation/store_screen.dart` | Update money display if delivery fees or item prices are shown |
| `customer-app/lib/features/store/presentation/menu_browsing_screen.dart` | Update money display if item prices are shown |

**Caution**: The `MockStore.rating` field is also `double` (4.8, 4.9, etc.) — this is NOT a money field. Do NOT convert ratings to integers. Only money-semantic fields are in scope.

---

### GAP-C02: Display status strings to canonical enum values (CRITICAL)

**Rules violated**: R-041 (surface-local must use canonical values), R-043 (no local invention)
**Decay mode**: DECAY_PATH.md Mode 1 (Status Enum Pollution)

**Current state**:
- `MockOrder.status` is `String` with display-formatted values: `'Preparing'`, `'On the way'`, `'Delivered'`

**Required state**:
- `MockOrder.status` uses canonical enum values from `DomainContractBridge.orderStatuses`: `'preparing'`, `'in_transit'`, `'delivered'`
- Display formatting (capitalization, "On the way" mapping) moves to the presentation layer

**In-scope files**:

| File | Changes Required |
|------|-----------------|
| `customer-app/lib/core/data/mock_data.dart` | Change status values: `'Preparing'` -> `'preparing'`, `'On the way'` -> `'in_transit'`, `'Delivered'` -> `'delivered'` |
| `customer-app/lib/features/orders/presentation/orders_screen.dart` | Add display-layer formatting: map canonical values to user-facing labels |
| `customer-app/lib/features/orders/presentation/order_status_screen.dart` | Add display-layer formatting if status is rendered |
| `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | Add display-layer formatting if status is rendered |

**Caution**: The `MockOrder.statusColor` field maps colors to statuses. After changing status values, verify that color assignments still work correctly. A helper map (canonical status -> Color) may be needed.

---

### GAP-C03: Relative/informal timestamps to UTC ISO 8601 (CRITICAL)

**Rules violated**: DATE.md Law 4 (no relative dates), Law 6 (UTC storage), Law 11 (forbidden patterns)
**Decay mode**: DECAY_PATH.md Mode 3 (Local Time Persistence)

**Current state**:
- `MockOrder.date` is `String` with values: `'Today, 2:30 PM'`, `'Today, 1:15 PM'`, `'Yesterday'`, `'Mar 12'`, `'Mar 10'`
- `MockNotification.time` is `String` with values: `'2 min ago'`, `'1 hour ago'`, `'3 hours ago'`, `'Yesterday'`

**Required state**:
- `MockOrder.date` field renamed to `createdAt` (DATE.md Law 10 field naming)
- All order timestamps become UTC ISO 8601 strings ending with `Z` (e.g., `'2026-03-17T17:30:00Z'`)
- `MockNotification.time` field renamed to `createdAt` (DATE.md Law 10)
- All notification timestamps become UTC ISO 8601 strings ending with `Z`
- Display formatting ("Yesterday", "2 min ago") moves to the presentation layer

**In-scope files**:

| File | Changes Required |
|------|-----------------|
| `customer-app/lib/core/data/mock_data.dart` | Rename `MockOrder.date` -> `createdAt`, `MockNotification.time` -> `createdAt`. Replace all relative/informal strings with UTC ISO 8601 timestamps. |
| `customer-app/lib/features/orders/presentation/orders_screen.dart` | Update field reference `date` -> `createdAt`; add display-layer date formatting |
| `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | Update field reference if used |
| `customer-app/lib/features/notifications/presentation/notifications_screen.dart` | Update field reference `time` -> `createdAt`; add display-layer relative time formatting |

**Caution**: Use realistic Buenos Aires-local times converted to UTC. For example, "Today, 2:30 PM" Buenos Aires (UTC-3) = `2026-03-17T17:30:00Z`. Use dates consistent with the current date context (2026-03-17).

---

## Out of Scope

The following items are explicitly NOT part of Wave 2:

| Item | Reason |
|------|--------|
| GAP-C04 (audit trail) | Gap Plan Wave 5 |
| GAP-C05 (payment method strings) | Gap Plan Wave 3 |
| GAP-H03, GAP-H04 (session types) | Gap Plan Wave 4 |
| GAP-H07 (state machine transitions) | Gap Plan Wave 5 |
| GAP-M01–M08 (medium priority) | Gap Plan Wave 3+ |
| GAP-L01–L04 (low priority) | Gap Plan Wave 6 |
| merchant-console changes | Not in Wave 2 scope |
| admin-console changes | Not in Wave 2 scope |
| public-website changes | Not in Wave 2 scope |
| shared/ contract changes | Completed in Wave 1 |
| Any new Dart package dependencies | Not authorized |
| Live backend wiring | Excluded per CLAUDE.md Section 7 |
| `MockStore.rating` double type | Not a money field — do not convert |
| `MockPromotion.discount` string type | Display-only discount label — not a money field |

---

## Validation Commands

After all changes, run in order:

```bash
# 1. Flutter static analysis (must pass with zero issues)
cd customer-app && flutter analyze

# 2. Web surface typechecks (must still pass — no changes expected but verify no regression)
npm run typecheck --prefix merchant-console
npm run typecheck --prefix admin-console
npm run typecheck --prefix public-website
```

---

## Completion Criteria

Wave 2 is complete when ALL of the following are true:

1. **GAP-C01**: Zero `double` types remain on money-semantic fields in `mock_data.dart`. All money values are integer centavos. All presentation code divides by 100 for display.
2. **GAP-C02**: Zero display-formatted status strings remain in `mock_data.dart`. All status values match canonical `DomainContractBridge.orderStatuses` values. Presentation layer handles display formatting.
3. **GAP-C03**: Zero relative or informal date strings remain in `mock_data.dart`. All timestamp fields are named `createdAt` and contain UTC ISO 8601 strings ending with `Z`. Presentation layer handles relative time display.
4. `flutter analyze` passes with no issues.
5. `npm run typecheck` passes for all 3 web surfaces (regression check).
6. No files outside `customer-app/` are modified (except `docs/governance/WAVE_TRACKER.md` and `reviews/`).

---

## Rollback / Caution Notes

- **Double-to-int conversion**: Dart's `const` context requires integer literals directly — `1299` not `12.99 * 100`. Verify all values are correctly converted (e.g., 12.99 -> 1299, not 1298 or 1300).
- **Field rename ripple**: Renaming `date` -> `createdAt` and `time` -> `createdAt` will break all downstream references. Search for `.date` and `.time` usage across the entire `customer-app/lib/` tree before renaming.
- **statusColor coupling**: `MockOrder.statusColor` is currently set per-instance alongside `status`. After changing status values, the color assignments must still correspond correctly. Consider whether a status-to-color map is cleaner.
- **const context**: `MockData.cartItems` is `static final` (not `const`) because it references other `const` items. After changing types, verify the `const`/`final` usage remains valid.
- **No presentation logic in data layer**: Display formatting helpers (relative time, status labels, money formatting) should be created in the presentation layer or a surface-local utility, NOT in `mock_data.dart`.

---

## Execution Deliverables

Upon completion, the executor must produce:

1. Updated `docs/governance/WAVE_TRACKER.md` with Gap Plan Wave 2 completion entry
2. New `reviews/wave_2_execution_report.md` with:
   - files changed and gap resolved per file
   - validation results
   - remaining unresolved items (expected: none)

---

*Contract prepared: 2026-03-17*
*Authority: reviews/governance_enforcement_gap_plan.md*
*Prerequisite: Gap Plan Wave 1 — CLOSED 2026-03-17*

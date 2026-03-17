# Runtime Reality Map

Status: active
Authority: operational
Surface: customer-app
Domains: runtime-truth, partial-support, mock-state
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- checking whether a customer screen is state-real, flow-connected, or still partially fake
- reviewing where the app currently over-promises runtime behavior
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/core/data/in_memory_customer_repository.dart
- docs/ui-governance/STABILIZATION_REPORT.md

## Purpose
- Classify each important customer screen by what it really is at runtime after stabilization.
- Make over-promising behavior explicit so future changes do not regress back into demo-only logic.

## Classifications
- `state-real`: route reads shared runtime truth and updates visible state coherently
- `mock-backed but flow-connected`: still uses local/mock data, but the route is connected to the correct app flow
- `visually complete but action-fake`: polished UI still contains actions that are intentionally incomplete
- `placeholder residue`: not part of the live flow, but still present in customer-app code paths
- `structurally duplicated`: live pattern is still implemented more than once in risky ways

## Screen Reality Map

| Screen | File | Classification | Reality notes |
| --- | --- | --- | --- |
| Entry | `customer-app/lib/app/entry/customer_entry_screen.dart` | mock-backed but flow-connected | session redirects are real; content is still static marketing UI |
| Auth landing | `customer-app/lib/features/auth/presentation/auth_screen.dart` | mock-backed but flow-connected | phone path works; social sign-in is explicitly unavailable instead of fake |
| Phone auth | `customer-app/lib/features/auth/presentation/auth_phone_screen.dart` | mock-backed but flow-connected | local validation + OTP handoff are coherent, but backend auth is excluded |
| OTP | `customer-app/lib/features/auth/presentation/auth_otp_screen.dart` | mock-backed but flow-connected | local OTP flow is coherent; verification remains mock-only by scope |
| Guest entry | `customer-app/lib/features/auth/presentation/guest_entry_screen.dart` | mock-backed but flow-connected | guest handoff is coherent |
| Onboarding | `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart` | mock-backed but flow-connected | completion handoff is real; onboarding content is still static |
| Home | `customer-app/lib/features/home/presentation/home_screen.dart` | mock-backed but flow-connected | browse entry points are coherent; merchandising remains mock data |
| Discovery | `customer-app/lib/features/home/presentation/discovery_screen.dart` | state-real | category + filter state now resolve through shared runtime filter truth |
| Search | `customer-app/lib/features/search/presentation/search_screen.dart` | state-real | query, recent searches, and filter-aware results are durable across expected navigation |
| Filter | `customer-app/lib/features/search/presentation/filter_screen.dart` | state-real | apply/reset now writes real shared filter state |
| Store detail | `customer-app/lib/features/store/presentation/store_screen.dart` | state-real | selected store, add-to-cart, and cart CTA now use shared flow state |
| Menu browsing | `customer-app/lib/features/store/presentation/menu_browsing_screen.dart` | state-real | same store/cart truth as store detail |
| Cart | `customer-app/lib/features/cart/presentation/cart_screen.dart` | state-real | quantity, removal, promo, totals, and add-more all resolve through shared cart state |
| Checkout | `customer-app/lib/features/checkout/presentation/checkout_screen.dart` | state-real | reads live cart snapshot and creates a local order record; payment remains placeholder by product rule |
| Orders list | `customer-app/lib/features/orders/presentation/orders_screen.dart` | state-real | active/history tabs now reflect the shared local order source |
| Order detail | `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | state-real | details, reorder, and review entry resolve from the same order record |
| Order status | `customer-app/lib/features/orders/presentation/order_status_screen.dart` | mock-backed but flow-connected | order identity is real; status timeline is explicitly static, not realtime |
| Profile | `customer-app/lib/features/profile/presentation/profile_screen.dart` | mock-backed but flow-connected | navigation is coherent; profile identity data is still static |
| Addresses | `customer-app/lib/features/addresses/presentation/addresses_screen.dart` | state-real | add/edit/delete/default operations wired through `CustomerRuntimeController` since Pass 2; changes are durable within the session (non-persisted to disk by design) |
| Notifications | `customer-app/lib/features/notifications/presentation/notifications_screen.dart` | mock-backed but flow-connected | local read-state behavior is coherent |
| Reviews | `customer-app/lib/features/reviews/presentation/reviews_screen.dart` | mock-backed but flow-connected | submission flow is coherent; review ownership/data remains mock-backed |
| Settings | `customer-app/lib/features/settings/presentation/settings_screen.dart` | mock-backed but flow-connected | fake rows were neutralized with honest unavailable messaging |
| Group order | `customer-app/lib/features/group_order/presentation/group_order_screen.dart` | visually complete but action-fake | create path is local-only; join remains explicitly unavailable |
| Group order share | `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart` | mock-backed but flow-connected | copy actions are real; shared room/member runtime remains stubbed |

## Placeholder Residue

All previously tracked placeholder residue files have been resolved.

| File | Status | Resolution |
| --- | --- | --- |
| `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart` | DELETED | Removed in Pass 3 — confirmed no re-imports |
| `customer-app/lib/features/common/presentation/customer_feature_scaffold.dart` | DELETED | Removed in Pass 3 — confirmed no re-imports |
| `customer-app/lib/features/auth/state/auth_placeholder_state.dart` | DELETED | Removed in Pass 3 — confirmed no re-imports |
| `customer-app/lib/features/group_order/state/group_order_placeholder_state.dart` | DELETED | Removed in Pass 3 — confirmed no re-imports |
| `customer-app/lib/core/data/in_memory_customer_repository.dart` | RESOLVED | Placeholder literal strings replaced with product-facing section names in B14 (Pass 6 audit confirmed) |

## Structural Duplication Status

### Reduced in this pass
- Store detail and menu browsing now share the same runtime store/cart truth and a shared menu section widget.
- Profile and settings now share a common account action-row pattern.

### Still present
- `home_screen.dart` reads delivery address from `MockData.addresses[0]` directly instead of `CustomerRuntimeController.instance.deliveryAddress` — stale binding inconsistent with all other address-reading screens (tracked as G22 / B21).

## Where the App Still Over-Promises
- `customer-app/lib/features/addresses/presentation/addresses_screen.dart`
  - visually implies durable address management, but changes are not persisted beyond the local surface behavior
- `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
  - visually implies joinable rooms, but join is still intentionally unavailable
- `customer-app/lib/features/orders/presentation/order_status_screen.dart`
  - visually resembles live tracking, but the screen is intentionally a static local timeline

## Runtime Truth Rules After Stabilization
- Core transaction truth now lives in `customer-app/lib/core/data/customer_runtime_controller.dart`.
- Route-owned detail screens must read route arguments first, then fall back only when needed for resilience.
- If an action is not safely available, the UI must say so explicitly instead of behaving like a finished product.

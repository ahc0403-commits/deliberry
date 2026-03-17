# Customer App Stabilization Report

Status: active
Authority: operational
Surface: customer-app
Domains: stabilization, routing, runtime, no-op-cleanup
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- checking what stabilization work has already been applied to the customer app
- tracing why routing, runtime continuity, or honesty fixes exist
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- docs/ui-governance/NAVIGATION_TRUTH_MAP.md
- docs/ui-governance/RUNTIME_REALITY_MAP.md

## Goal
- Stabilize the rebuilt customer app so the existing UI behaves like one coherent local product flow.
- Keep changes scoped to routing truth, local runtime continuity, no-op cleanup, and the highest-risk drift points.

---

## Pass 1: Core Flow Stabilization

### What Changed

**Navigation truth**
- Route arguments now own store and order detail/status identity.
- Shell ownership remains limited to `/home`, `/search`, `/orders`, and `/profile`.
- Store/cart/checkout/order detail/order status remain standalone flow routes outside the shell.

**Shared runtime truth**
- Added `customer-app/lib/core/data/customer_runtime_controller.dart`.
- Core flow state now lives in one local controller:
  - selected store
  - cart contents
  - promo state
  - search query
  - filter selections
  - active orders
  - past orders
  - reorder source

**Core flow stabilization**
- `Home -> Store -> Menu -> Cart -> Checkout -> Orders` now uses one coherent local runtime path.
- Cart mutations persist across store, menu, cart, and checkout.
- Checkout submits a local order record.
- Orders list, order detail, and order status all read the same order truth.
- Reorder now rebuilds the cart from an existing order record.

**Search and filter durability**
- Search query is now durable across expected route transitions.
- Filter apply/reset now writes shared filter state.
- Search results and discovery results both reflect current filter state.
- Returning from store/detail no longer loses search context by default.

**No-op cleanup**
- Silent no-op CTAs were removed or neutralized.
- Misleading route/label mismatches were corrected.
- Fake help/share/favorites/promotions flows were replaced with honest limited behavior where they could not be fully wired safely.

**Pattern drift reduction**
- Store detail and menu browsing now share a menu section composition path (`MenuSectionList`).
- Profile and settings now share one account action-row pattern (`AccountActionGroup` family).

### Files Added
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `docs/ui-governance/NAVIGATION_TRUTH_MAP.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

### Files Updated (Pass 1)
- `customer-app/lib/app/router/app_router.dart`
- `customer-app/lib/features/auth/presentation/auth_screen.dart`
- `customer-app/lib/features/cart/presentation/cart_screen.dart`
- `customer-app/lib/features/checkout/presentation/checkout_screen.dart`
- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
- `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`
- `customer-app/lib/features/home/presentation/discovery_screen.dart`
- `customer-app/lib/features/home/presentation/home_screen.dart`
- `customer-app/lib/features/orders/presentation/order_detail_screen.dart`
- `customer-app/lib/features/orders/presentation/order_status_screen.dart`
- `customer-app/lib/features/orders/presentation/orders_screen.dart`
- `customer-app/lib/features/profile/presentation/profile_screen.dart`
- `customer-app/lib/features/search/presentation/filter_screen.dart`
- `customer-app/lib/features/search/presentation/search_screen.dart`
- `customer-app/lib/features/settings/presentation/settings_screen.dart`
- `customer-app/lib/features/store/presentation/menu_browsing_screen.dart`
- `customer-app/lib/features/store/presentation/store_screen.dart`
- `docs/ui-governance/UI_GAP_AUDIT.md`
- `docs/ui-governance/UI_REFACTOR_BACKLOG.md`
- `reviews/customer_ui_change_log.md`
- `reviews/customer_ui_execution_plan.md`

---

## Pass 2: Address-Flow Stabilization

### What Changed
- Added mutable address state to `CustomerRuntimeController`:
  - `_addresses` list seeded from `MockData.addresses` via `_cloneAddresses`.
  - `addresses` getter (unmodifiable list).
  - `deliveryAddress` getter (returns default address or first; null-safe when list is empty).
  - `addAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress` — all call `notifyListeners()`.
  - `_nextAddressId` counter for runtime-created address IDs.
- Fixed `submitOrder` to read from `runtime.deliveryAddress` instead of `MockData.addresses`.
- Fixed `_seedOrders` to read from `_addresses` (runtime list) instead of `MockData.addresses.first`.
- Rewrote `addresses_screen.dart`:
  - Now wraps in `ListenableBuilder` on `CustomerRuntimeController.instance`.
  - Add/edit actions use `_AddressFormSheet` converted to `StatefulWidget` with proper `TextEditingController` lifecycle — form values are captured on save, not on build.
  - Delete action now calls `runtime.deleteAddress(id)` after confirmation.
  - Set-default action now calls `runtime.setDefaultAddress(id)`.
  - Empty-state shown when address list is empty.
- Updated `checkout_screen.dart`:
  - Removed `MockData` import.
  - Delivery address now reads `runtime.deliveryAddress` (nullable).
  - Null address state shows explicit "No delivery address" notice with Manage link instead of crashing or showing stale mock.

### Explicitly Limited
- Address save does not persist to disk or backend — acknowledged by design (non-live build).
- Geocoding / map-based address selection is excluded per project non-goals.
- Form validation is minimal (label + street required); no address normalization.

---

## Pass 3: Placeholder Residue Cleanup

### What Changed
- Deleted `customer-app/lib/features/common/presentation/customer_feature_scaffold.dart` — unused architecture-demo scaffold with no live importers.
- Deleted `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart` — unused architecture-demo scaffold with no live importers.
- Deleted `customer-app/lib/features/auth/state/auth_placeholder_state.dart` — unused placeholder-state constant class with no live importers.
- Deleted `customer-app/lib/features/group_order/state/group_order_placeholder_state.dart` — unused placeholder-state constant class with no live importers.

### Verification
- Grep confirmed zero imports of any of the four files across `customer-app/lib/` before deletion.
- `flutter analyze` run after deletion — passes clean.

---

## Pass 4: Token Drift Reduction (profile / settings / group_order)

### Goal
Reduce immediate ad-hoc token drift in the profile, settings, and group_order surfaces without any broad visual redesign or new abstractions.

### Files Changed
- `customer-app/lib/features/profile/presentation/profile_screen.dart`
- `customer-app/lib/features/settings/presentation/settings_screen.dart`
- `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
- `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`

### Token Drift Reductions Applied

**Color literals replaced with AppTheme / colorScheme tokens:**
- `Color(0xFFFF4B3A)` + `Color(0xFFFF8A65)` avatar gradient → `AppTheme.primaryColor` + `primaryColor.withValues(alpha: 0.65)`
- `Color(0xFFFFF0EE)` badge background → `Theme.of(context).colorScheme.primaryContainer`
- `Color(0xFF4FC3F7)` blue address icon → `AppTheme.secondaryColor`
- `Color(0xFF22C55E)` order history and help center icon → `AppTheme.successColor`
- `Color(0xFF6B7280)` room code label text color → `AppTheme.textSecondary` (via theme slot)
- `Color(0xFF7C4DFF)` / `Color(0xFFB388FF)` purple group order gradient → `AppTheme.primaryColor` gradient

**borderRadius unified:**
- Profile hero card: 20 → 16 (matches `cardTheme` and `AccountActionGroup`)
- Group order hero card: 20 → 16
- Group order share room code card: 20 → 16

**Padding aligned:**
- Profile hero card: `all(24)` → `all(20)` (aligns with 20 page padding used in group_order screens)

**Raw TextStyle replaced with textTheme slots:** all raw `fontSize`/`fontWeight` pairs in profile, settings, group_order, and group_order_share replaced with `textTheme` slot references. Full list in `UI_GAP_AUDIT.md` Token Drift Reduction Pass section.

### Intentionally Deferred From Pass 4
- `onboarding_screen.dart` off-palette accents — outside scope of this pass.
- `mock_data.dart` gradient accent literals — outside scope of this pass.
- Copy tone normalization (G12 / B13) — deferred to later wave.
- Accessibility / semantic tap surfaces (G04 / B12) — deferred to later wave.

### Validation
- `flutter analyze` passes clean (0 issues) after all four files updated.

---

## Pass 5: Token Drift Reduction (widgets.dart MenuItemCard / group_order_share_screen avatar)

### Goal
Remove the two remaining raw-literal token gaps in the declared pass-4 scope that were not yet resolved.

### Files Changed
- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`

### Token Drift Reductions Applied

**widgets.dart `MenuItemCard` "Popular" badge (L344):**
- `const Color(0xFFFFF0EE)` badge background → `Theme.of(context).colorScheme.primaryContainer`
- Raw `TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.primaryColor)` → `textTheme.labelSmall!.copyWith(fontWeight: FontWeight.w700, color: AppTheme.primaryColor)`
- Removed `const` from the `Container` (required to access `Theme.of(context)` at build time)

**group_order_share_screen.dart `_memberRow` CircleAvatar label (L168-174):**
- Raw `const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14)` → `textTheme.titleSmall!.copyWith(fontWeight: FontWeight.w700, color: Colors.white)`
- Removed `const` from the `Text` widget

### Intentionally Deferred From Pass 5
- All items outside the declared scope (profile / settings / group_order / group_order_share / widgets.dart).
- G03 off-palette literals in onboarding, order_status, reviews, cart, checkout — tracked in B11.
- G04 GestureDetector accessibility — tracked in B12.
- G05 ReviewsScreen orderId threading — tracked in B17.
- G12/G13/G15/G16/G17 — tracked in B13–B19.

### Validation
- `flutter analyze` passes clean (0 issues) after both files updated.

---

## Pass 6: Group Order Honesty Cleanup

### What Changed
- Removed the fake create delay from `group_order_screen.dart`.
- Switched the create action from a simulated room-creation state to an immediate local preview handoff.
- Replaced one fixed hardcoded room code with a route-provided local preview code.
- Labeled `group_order_share_screen.dart` as an invite preview instead of a live shared room.
- Replaced member-count and waiting copy with explicit preview-state language.
- Replaced join/share wording that implied backend availability with honest limited-scope copy.

### Still Intentionally Partial
- Group order does not support live participant joins.
- Group order does not support shared-cart syncing.
- Invite link/message actions copy preview text only.

### Validation
- `flutter analyze` passes clean after the honesty cleanup.

---

## Audit Refresh: 2026-03-16

### Audit scope
Full read of all files in:
- `customer-app/lib/app/`
- `customer-app/lib/core/theme/`
- `customer-app/lib/core/data/`
- `customer-app/lib/features/` (all screens and widgets)

### Current stabilization status
**Structurally complete and locally functional:**
- Core flow (home → store → menu → cart → checkout → orders) is continuously wired through `CustomerRuntimeController`.
- Route guards, session state, and redirect logic are coherent.
- Search/filter state is durable.
- Address management is locally durable with full CRUD and default promotion.
- Order creation, listing, detail, status, and reorder all read consistent runtime data.
- Notifications, reviews, and settings are structurally correct for the current non-live scope.
- `flutter analyze` passes clean.

**Remaining gaps after refresh (full detail in `UI_GAP_AUDIT.md`):**

| ID | Severity | Summary |
| --- | --- | --- |
| G03 | P1 | Off-palette color literals still in onboarding (purple/blue page gradients), order_status hero (raw orange literals instead of AppTheme), reviews success view, cart/checkout store context icons |
| G04 | P1 | `GestureDetector` used for primary tap surfaces across `widgets.dart` and several feature screens — tap targets, focus visibility, and semantics are weaker than required |
| G02 | P1 | Group order partial-state copy over-promises backend capability; hardcoded room code, member list, and fake delay are not disclosed as demo/preview |
| G05 | P1 | `reviews_screen.dart` always loads `MockData.pastOrders.first` regardless of which order the user navigated from — mismatched store name shown in context card |
| G12 | P2 | Settings unavailability copy leaks implementation language ("in this build"); profile shows hardcoded identity |
| G13 | P2 | Auth screens use `Color(0xFF1A1A2E)` raw literals for onSurface text instead of `colorScheme.onSurface` |
| G15 | P2 | `in_memory_customer_repository.dart` still contains placeholder/handoff literal strings |
| G16 | P2 | Checkout `_InfoNoticeCard` uses off-palette Tailwind blue (`Color(0xFF3B82F6)` etc.) — new finding |
| G17 | P2 | `widgets.dart` / `cart_screen.dart` / `checkout_screen.dart` use `Color(0xFFFFB74D)` for star/store icons instead of `AppTheme.secondaryColor` |

### New findings in this refresh
- **G16**: `_InfoNoticeCard` in `checkout_screen.dart` uses a Tailwind-style blue palette not in `AppTheme`. The honest-disclosure intent is correct and must be preserved; only the color treatment needs restyling.
- **G05**: `reviews_screen.dart` hardcodes `MockData.pastOrders.first` — the route argument path that works for `OrderDetailScreen` and `OrderStatusScreen` was not applied here.
- **G17**: `Color(0xFFFFB74D)` raw literals in `widgets.dart` (3×), `cart_screen.dart` (2×), `checkout_screen.dart` (2×) are all semantically `AppTheme.secondaryColor` and should reference it directly.
- **G13**: Auth screens consistently use `Color(0xFF1A1A2E)` raw literals for title text. This is the same value as `_onSurface` in `AppTheme` but bypasses the token system.

### Previously resolved findings confirmed still resolved
- G01: placeholder residue files deleted — confirmed, no re-imports found.
- G14: profile/settings/group_order token drift reduction — confirmed, all targeted literals replaced.
- B09: address durable state — confirmed, `addresses_screen.dart` reads/writes `CustomerRuntimeController`.
- Core flow no-op CTAs — confirmed, no silent handlers remain in the cart/checkout/orders path.

### Next smallest safe wave
See `UI_REFACTOR_BACKLOG.md` Fast Cleanup Candidates section. The next wave is a batch of ~28 mechanical line-level token replacements across 7 files followed by the `ReviewsScreen` orderId threading fix (B17). No new abstractions are needed for either step.

---

## Pass 6 Audit Refresh: Post-Stabilization Verification

### Audit scope
Full re-read of all files in:
- `customer-app/lib/app/`
- `customer-app/lib/core/theme/`
- `customer-app/lib/core/data/`
- `customer-app/lib/features/` (all 31 screens and shared widgets)
- `docs/ui-governance/` (all 16 governance documents)

### Items confirmed resolved since Pass 5

| ID | Confirmed resolution |
| --- | --- |
| G05 / B17 | `ReviewsScreen` now accepts `orderId` parameter; `app_router.dart` passes `settings.arguments as String?`; screen resolves order via `runtime.findOrderRecordById(widget.orderId)` with `MockData.pastOrders.first` fallback. Confirmed in source. |
| G15 / B14 | All 9 placeholder/handoff literal strings in `in_memory_customer_repository.dart` replaced with product-facing section names (`'search suggestions'`, `'ratings summary'`, `'item modifiers'`, `'price summary'`, `'review media'`, `'address entry'`, `'read state'`, `'privacy settings'`, `'support links'`). Confirmed in source. |
| G17 / B18 | `Color(0xFFFFB74D)` replaced with `AppTheme.secondaryColor` in all 7 locations: `widgets.dart` `StoreCard` / `CompactStoreCard` / `RatingStars`, `cart_screen.dart` `_StoreContextCard`, `checkout_screen.dart` order summary store icon. Confirmed in source. |
| G03-partial | `order_status_screen.dart` hero gradient replaced with `AppTheme.primaryColor` / `AppTheme.primaryColor.withValues(alpha:0.7)`. ETA card badge replaced with `AppTheme.successColor` tokens. Confirmed in source. |
| G03-partial | `reviews_screen.dart` `_SuccessView` success colors replaced with `AppTheme.successColor` tokens. Store context icon `Color(0xFFFFF0EE)` replaced with `colorScheme.primaryContainer`. Confirmed in source. |

### New findings discovered in Pass 6 audit

| ID | Severity | Summary |
| --- | --- | --- |
| G18 | P2 | `addresses_screen.dart` `_AddressCard`: `const Color(0xFFFFF0EE)` at default icon background (L212) and "Default" badge background (L241) — should be `colorScheme.primaryContainer` |
| G19 | P2 | `notifications_screen.dart` `_NotificationTile`: unread tile background `const Color(0xFFFFFAF9)` (L169) undocumented; unread icon background `const Color(0xFFFFF0EE)` (L191) — should be `colorScheme.primaryContainer` |
| G20 | P2 | `order_detail_screen.dart` store context icon background: `const Color(0xFFFFF0EE)` (L57) — should be `colorScheme.primaryContainer` |
| G21 | P2 | `order_status_screen.dart` ETA card icon background: `const Color(0xFFFFF0EE)` (L133) — missed in prior fast-cleanup pass; should be `colorScheme.primaryContainer` |
| G22 | P2 | `home_screen.dart` address pill reads `MockData.addresses[0]` directly (L14) instead of `CustomerRuntimeController.instance.deliveryAddress` — stale binding inconsistent with all other address-reading screens |

### Severity count after Pass 6
- `P0`: 0 — none blocking manual QA
- `P1`: 3 (G04, G02, G03 — down from 4; G05 closed)
- `P2`: 6 (G12, G13, G16, G18, G19, G20, G21, G22 — net: G15/G17 closed, 5 new added)

### Updated stabilization status
**Newly confirmed resolved:**
- OrderId threading for ReviewsScreen (B17/G05) is live in source.
- All repository placeholder literals (B14/G15) are replaced in source.
- All `Color(0xFFFFB74D)` star/store-icon raw literals (B18/G17) are replaced in source.
- Order status and reviews fast-cleanup token pass is complete in source.

**Still open:**
- `GestureDetector` overuse (G04/B12) — 11 locations in `widgets.dart` alone; auth text links added to scope.
- Group order partial-state honesty (G02/B10) — fake delay, hardcoded room code, implementation-language snackbar copy.
- Onboarding off-palette accent system (G03/B11/B19) — pages 2–3 purple/blue gradients; requires design decision before full resolution.
- Checkout `_InfoNoticeCard` off-palette blue (G03/B15) — restyling with AppTheme neutral tokens is mechanical once decided.
- Auth screen raw color literals (G13/B13b) — ~10 mechanical substitutions across 4 files.
- Copy tone ("in this build") in settings and profile (G12/B13) — copy-only pass.
- Four new `Color(0xFFFFF0EE)` raw literals in addresses, notifications, order_detail, order_status ETA card (G18–G21/B20).
- Home address pill reads `MockData` instead of runtime (G22/B21).

### `RUNTIME_REALITY_MAP.md` correction applied in this pass
- Removed four stale "placeholder residue" entries for files deleted in Pass 3:
  - `customer_flow_scaffold.dart` — deleted, entry removed.
  - `customer_feature_scaffold.dart` — deleted, entry removed.
  - `auth_placeholder_state.dart` — deleted, entry removed.
  - `group_order_placeholder_state.dart` — deleted, entry removed.
- `in_memory_customer_repository.dart` placeholder residue entry removed (placeholder literals resolved in B14).
- `addresses_screen.dart` runtime classification corrected: address add/edit/delete/default operations are durably wired through `CustomerRuntimeController` since Pass 2; classification updated from `visually complete but action-fake` to `state-real`.

### Next smallest safe wave
~~See `UI_REFACTOR_BACKLOG.md` Fast Cleanup Candidates section. The next wave is a batch of ~26 mechanical line-level changes across 6–7 files (B20 `Color(0xFFFFF0EE)` batch, B13b auth screen tokens, B15 checkout notice restyle, B21 home address binding) followed by copy-tone pass (B10/B13) and then the accessibility tap-surface pass (B12). No new abstractions are needed for any of these steps.~~

Fast cleanup batch completed in Pass 7 (see below).

---

## Pass 7: Fast Cleanup Batch (token drift + address binding)

### Goal
Apply the full fast-cleanup batch identified in the Pass 6 audit refresh: `Color(0xFFFFF0EE)` batch (B20), auth screen token alignment (B13b partial), checkout `_InfoNoticeCard` restyle (B15), home address binding (B21), onboarding title literal (B11/B19 mechanical part).

### Files Changed
- `customer-app/lib/features/addresses/presentation/addresses_screen.dart`
- `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
- `customer-app/lib/features/orders/presentation/order_detail_screen.dart`
- `customer-app/lib/features/orders/presentation/order_status_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
- `customer-app/lib/features/checkout/presentation/checkout_screen.dart`
- `customer-app/lib/features/home/presentation/home_screen.dart`
- `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`
- `docs/ui-governance/UI_GAP_AUDIT.md`
- `docs/ui-governance/UI_REFACTOR_BACKLOG.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

### Changes Applied

**B20 — `Color(0xFFFFF0EE)` batch:**
- `addresses_screen.dart` `_AddressCard` default icon background and "Default" badge background: `const Color(0xFFFFF0EE)` → `Theme.of(context).colorScheme.primaryContainer` (×2)
- `notifications_screen.dart` unread banner background and `_NotificationTile` unread icon background: `const Color(0xFFFFF0EE)` → `Theme.of(context).colorScheme.primaryContainer` (×2)
- `order_detail_screen.dart` store context icon background: `const Color(0xFFFFF0EE)` → `Theme.of(context).colorScheme.primaryContainer` (×1)
- `order_status_screen.dart` ETA card icon background: `const Color(0xFFFFF0EE)` → `Theme.of(context).colorScheme.primaryContainer` (×1)
- `Color(0xFFFFFAF9)` notification tile tint retained as acceptable screen-specific warm-white expression

**B13b (partial) — Auth screen token alignment:**
- `auth_screen.dart`: logo container `Color(0xFFFFF0EE)` → `colorScheme.primaryContainer`; title `Color(0xFF1A1A2E)` → `colorScheme.onSurface`; Apple icon and `_SocialLoginButton` label `Color(0xFF1A1A2E)` → `colorScheme.onSurface`
- `auth_otp_screen.dart`: title `Color(0xFF1A1A2E)` → `colorScheme.onSurface`; masked phone RichText `Color(0xFF1A1A2E)` → `colorScheme.onSurface`; OTP box filled `Color(0xFFFFF0EE)` → `colorScheme.primaryContainer`
- `auth_phone_screen.dart`: title `Color(0xFF1A1A2E)` → `colorScheme.onSurface`; country code label `Color(0xFF1A1A2E)` → `colorScheme.onSurface`; phone input text `Color(0xFF1A1A2E)` → `colorScheme.onSurface`
- `guest_entry_screen.dart` — deferred to next wave (3 remaining literals)

**B15 — Checkout `_InfoNoticeCard` restyle:**
- `checkout_screen.dart` `_InfoNoticeCard`: off-palette blue (`Color(0xFFEFF6FF)`, `Color(0xFFBFDBFE)`, `Color(0xFF3B82F6)`, `Color(0xFF1D4ED8)`) replaced with `AppTheme.backgroundGrey` fill, `AppTheme.borderColor` border, `AppTheme.textSecondary` icon and text

**B21 — Home address binding:**
- `home_screen.dart`: `MockData.addresses[0]` removed; wrapped in `ListenableBuilder` on `CustomerRuntimeController.instance`; address pill reads `runtime.deliveryAddress` with null-guard (shows "Add address" / "Tap to add a delivery address" when null); notification icon `Color(0xFF1A1A2E)` → `colorScheme.onSurface`

**B11/B19 (mechanical) — Onboarding title literal:**
- `onboarding_screen.dart` `_OnboardingPageView` title `const Color(0xFF1A1A2E)` → `Theme.of(context).colorScheme.onSurface`
- Per-page accent gradients (pages 2–3 purple/blue) deferred pending design decision

### Intentionally Deferred From Pass 7
- `guest_entry_screen.dart` remaining 3 raw literals — next wave, tracked in B13b
- Onboarding per-page accent gradient system (pages 2–3) — requires design decision (B19)
- `mock_data.dart` promo gradient off-palette literals — visual-only, low priority
- Copy tone pass (B10/B13) — copy-only, next wave
- Accessibility tap-surface pass (B12/G04) — larger change, next wave

### Validation
- `flutter analyze` passes clean (0 issues) after all changes applied.

---

## Pass 8: Copy Tone Cleanup (profile / settings)

### Goal
Remove implementation-language copy and hardcoded demo identity from profile and settings screens. Resolves G12 / B13.

### Files Changed
- `customer-app/lib/features/profile/presentation/profile_screen.dart`
- `customer-app/lib/features/settings/presentation/settings_screen.dart`
- `docs/ui-governance/UI_GAP_AUDIT.md`
- `docs/ui-governance/UI_REFACTOR_BACKLOG.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

### Changes Applied

**profile_screen.dart:**
- `_showUnavailable`: `'$label is not available yet in this build.'` → `'$label is not available yet.'`
- Avatar initials: `'JD'` → `'?'`
- Name: `'John Doe'` → `'Your Name'`
- Email: `'john@example.com'` → `'your@email.com'`
- Badge label: `'Regular customer'` → `'Demo account'`

**settings_screen.dart:**
- `_showUnavailable`: `'$label is not available yet in this build.'` → `'$label is not available yet.'`
- Delete account confirm button: replaced `_showUnavailable('Account deletion')` with an inline `SnackBar` showing `'Account deletion is not available yet.'` — avoids the awkward interpolation pattern when the label is a noun phrase not a feature name.

### Intentionally Unchanged
- All row labels (e.g. `'Help Center'`, `'Contact Us'`, `'Rate the App'`, `'Privacy Policy'`, `'Terms of Service'`) — these are accurate and action-clear; no change needed.
- Delete account dialog body copy — already explicit, calm, and correct: "This action is permanent. All your data, orders, and addresses will be deleted and cannot be recovered."
- Sign out dialog copy — already direct and appropriate.
- `'Promotions & Offers'` row label — accurate label for the feature; `_showUnavailable` message will now correctly read "Promotions & Offers is not available yet."

### Validation
- `flutter analyze` passes clean (0 issues).

---

## Pass 9: Semantic Tap Surface Cleanup — widgets.dart, auth_screen.dart, notifications_screen.dart (G04/B12 partial)

### Goal
Convert all remaining `GestureDetector` uses in `widgets.dart`, `auth_screen.dart`, and `notifications_screen.dart` to semantically correct tap surfaces (`InkWell`, `Material`+`InkWell`, `TextButton`, or `IconButton`). Partially resolves G04/B12.

### Files Changed
- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/auth/presentation/auth_screen.dart`
- `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
- `docs/ui-governance/UI_GAP_AUDIT.md`
- `docs/ui-governance/UI_REFACTOR_BACKLOG.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

### Changes Applied

**widgets.dart — confirmed already resolved in prior passes (no changes needed):**
- `SectionHeader` "See all" — already `TextButton` with `minimumSize: Size(48, 44)`.
- `StoreCard` — already `Material`+`InkWell`.
- `CompactStoreCard` — already `Material`+`InkWell`.
- `MenuItemCard` add button — already `Material`+`InkWell` with `CircleBorder`.
- `QuantityControl._button` — already `InkWell`.

**widgets.dart — converted in this pass:**
- `CategoryChipRow` chip items: `GestureDetector` → `Material`+`InkWell` with `borderRadius: BorderRadius.circular(24)`. Color moved from `Container` to `Material.color`.
- `PromoBanner`: `GestureDetector` → `Material`+`InkWell` with `borderRadius: BorderRadius.circular(18)`.
- `AppSearchBar`: `GestureDetector` with `onTap: readOnly ? onTap : null` → when `readOnly=true`: `Material`+`InkWell`; when `readOnly=false`: no-op wrapper removed entirely (TextField handles its own interaction).
- `AddressPill`: `GestureDetector` → `InkWell` with `borderRadius: BorderRadius.circular(8)` (parent AppBar provides Material context).
- `RatingStars`: `GestureDetector` (interactive) → `IconButton` per star with `visualDensity: VisualDensity.compact`; display mode (non-interactive) → plain `Padding`+`Icon` (no wrapper needed).
- `OrderCard`: `GestureDetector` → `Material`+`InkWell` with `borderRadius: BorderRadius.circular(14)`. Color moved from `Container` to `Material.color`.

**auth_screen.dart:**
- "Continue as Guest" link: `GestureDetector` wrapping `RichText` → `TextButton` with `minimumSize: Size(48, 44)` and `padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8)`. Visual appearance unchanged (RichText child preserved).

**notifications_screen.dart:**
- `_NotificationTile`: `GestureDetector` wrapping `Container` → `Material`+`InkWell` with `borderRadius: BorderRadius.circular(14)`. Background color moved from `Container` to `Material.color`. Ripple feedback now visible on tap.

### Intentionally Left Unchanged (deferred — later wave)
- `reviews_screen.dart` quick-tag chips — `GestureDetector` — deferred; not in the declared scope of this pass.
- `addresses_screen.dart` "Set as default" text link — `GestureDetector` — deferred; not in scope.
- `auth_otp_screen.dart` "Resend code" and "Wrong number? Change it" — `GestureDetector` — deferred; not in scope.
- `auth_phone_screen.dart` clear button — `GestureDetector` — deferred; not in scope.
- `home_screen.dart` `_CategoryCircle` — `GestureDetector` — deferred; not in scope.

### Validation
- `flutter analyze` passes clean (0 issues).

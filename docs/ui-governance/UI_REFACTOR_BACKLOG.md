# UI Refactor Backlog

Status: active
Authority: operational
Surface: customer-app
Domains: backlog, cleanup, refactor-priority
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- choosing the next safe customer UI cleanup wave
- checking which customer UI maintainability items remain open after stabilization
Related files:
- docs/ui-governance/UI_GAP_AUDIT.md
- docs/ui-governance/STABILIZATION_REPORT.md
- docs/ui-governance/UX_DECAY_PATH.md

## Objective
- Convert the current customer app from a strong UI sample set into a maintainable governed surface without broad rewrites.
- Prioritize the smallest safe changes that reduce future drift, duplicate work, and review cost.

---

## Completed In Stabilization Pass
- B01. Removed silent no-op CTAs from the core customer journey and replaced unsupported actions with explicit unavailable feedback.
- B02. Fixed route/data continuity for store, cart, checkout, and order routes with `customer_runtime_controller.dart`.
- B03. Closed the search/filter continuity gap with shared query/filter state and filter-aware results.
- B05. Reduced menu duplication by sharing runtime truth and a shared menu section composition (`MenuSectionList`).
- B06. Reduced account/settings duplication by moving profile and settings onto shared account action primitives (`AccountActionGroup`, `AccountActionTile`, `AccountActionDivider`, `AccountToggleTile`, `AccountSectionLabel`).
- B07. Repaired misleading order-detail and status actions.
- B09. Converted address management to durable runtime state with add/edit/delete/default operations wired through `CustomerRuntimeController`.

## Completed In Token Drift Reduction Pass (profile / settings / group_order)
- B16. Reduced immediate token drift across profile, settings, and group_order surfaces. Full detail in `UI_GAP_AUDIT.md` Token Drift Reduction Pass section.

## Completed In Token Drift Reduction Pass 2 (widgets.dart / group_order_share)
- B16b. `widgets.dart` `MenuItemCard` "Popular" badge: replaced `const Color(0xFFFFF0EE)` with `colorScheme.primaryContainer`; replaced raw `TextStyle(fontSize:10, fontWeight:w700)` with `textTheme.labelSmall!.copyWith(...)`.
- B16c. `group_order_share_screen.dart` `_memberRow` CircleAvatar label: replaced raw `const TextStyle(fontSize:14, fontWeight:w700, color:Colors.white)` with `textTheme.titleSmall!.copyWith(fontWeight: FontWeight.w700, color: Colors.white)`.

## Completed In Placeholder Residue Cleanup Pass
- B08 (partial). Deleted four obsolete placeholder files:
  - `customer_feature_scaffold.dart` — DELETED
  - `customer_flow_scaffold.dart` — DELETED
  - `auth_placeholder_state.dart` — DELETED
  - `group_order_placeholder_state.dart` — DELETED

## Completed After Pass 5 (confirmed in Pass 6 audit)
- B14. `in_memory_customer_repository.dart` placeholder literal strings: all 9 occurrences replaced with product-facing section names. Confirmed resolved in source. (Previously tracked as P2 remaining; now closed.)
- B17. Thread orderId through `ReviewsScreen` route argument: `ReviewsScreen` accepts `orderId` parameter; `app_router.dart` passes `settings.arguments as String?`; screen resolves order via `runtime.findOrderRecordById(widget.orderId)` with MockData fallback. Confirmed resolved in source. (Previously tracked as P1 remaining; now closed.)
- B18. Replace `Color(0xFFFFB74D)` raw literals with `AppTheme.secondaryColor`: all 7 occurrences replaced in `widgets.dart` (`StoreCard`, `CompactStoreCard`, `RatingStars`), `cart_screen.dart` (`_StoreContextCard`), and `checkout_screen.dart` (order summary icon). Confirmed resolved in source. (Previously tracked as P2 remaining; now closed.)
- B11 (partial). Fast-cleanup token replacements: `order_status_screen.dart` hero gradient (`Color(0xFFFF4B3A)`/`Color(0xFFFF8A65)` → `AppTheme.primaryColor` gradient) and ETA card badge (`Color(0xFFE8F5E9)`/`Color(0xFF22C55E)` → `AppTheme.successColor` tokens) confirmed resolved. `reviews_screen.dart` success view (`Color(0xFFE8F5E9)`/`Color(0xFF22C55E)` → `AppTheme.successColor` tokens) and store context icon (`Color(0xFFFFF0EE)` → `colorScheme.primaryContainer`) confirmed resolved. (Remaining B11 scope: onboarding per-page accent system — still open, tracked below.)

---

## P1 Next Cleanup

### B10. Tighten partial-state honesty in group order
- Severity: `P1`
- Affected files:
  - `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
  - `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`
- Status:
  - Completed in honesty pass on 2026-03-16.
- What changed:
  - Removed fake create delay.
  - Replaced one fixed hardcoded room code with a route-provided local preview code.
  - Labeled the share surface as a local preview.
  - Replaced join/share wording with explicit limited-scope copy.
- Remaining gap:
  - Group order is still intentionally partial because no live participants or shared-cart runtime exist.

### B11 (remaining). Normalize onboarding token drift
- Severity: `P1`
- Affected files:
  - `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart` — pages 2–3 use off-palette purple/pink/blue gradients (`Color(0xFF9C27B0)`, `Color(0xFFE91E63)`, `Color(0xFF2196F3)`, `Color(0xFF00BCD4)`) as per-page accent colors; title text uses `Color(0xFF1A1A2E)` raw literal.
- Note: fast-cleanup items for `order_status_screen.dart` and `reviews_screen.dart` are confirmed resolved. Only onboarding remains open.
- Approach:
  - Option A: Document the three-page progression as a deliberate screen-specific expression in `UI_SYSTEM.md` (`Screen-Specific` section), noting that onboarding pages may use a sequential palette that returns to orange at completion.
  - Option B: Convert all three pages to the orange-primary gradient and rely solely on emoji and copy for visual differentiation.
  - The `Color(0xFF1A1A2E)` raw title literal is a mechanical replacement regardless of which option is chosen.
- Acceptance criteria:
  - The onboarding accent system is either documented in `UI_SYSTEM.md` or replaced with on-palette colors.
  - `Color(0xFF1A1A2E)` raw title literal is replaced with `colorScheme.onSurface`.

### B12. Standardize semantic tap surfaces in shared widgets
- Severity: `P1` → PARTIALLY DONE (2026-03-16, Pass 9)
- Status:
  - `widgets.dart`: ALL `GestureDetector` uses resolved.
    - `SectionHeader` "See all" — was already `TextButton` (prior pass). Confirmed.
    - `StoreCard`, `CompactStoreCard`, `MenuItemCard` add button, `QuantityControl._button` — were already `InkWell` (prior passes). Confirmed.
    - `CategoryChipRow` items → `Material`+`InkWell`. DONE.
    - `PromoBanner` → `Material`+`InkWell`. DONE.
    - `AppSearchBar` readOnly path → `Material`+`InkWell`; non-readOnly no-op wrapper removed. DONE.
    - `AddressPill` → `InkWell` (parent provides Material context). DONE.
    - `RatingStars` interactive → `IconButton` per star with `visualDensity: compact`; display mode → plain `Padding`+`Icon`. DONE.
    - `OrderCard` → `Material`+`InkWell`. DONE.
  - `auth_screen.dart` "Continue as Guest" → `TextButton` with `minimumSize: Size(48, 44)`. DONE.
  - `notifications_screen.dart` tile → `Material`+`InkWell`. DONE.
- Remaining (deferred to later wave):
  - `reviews_screen.dart` — quick-tag chip tap.
  - `addresses_screen.dart` — "Set as default" text link.
  - `auth_otp_screen.dart` — "Resend code", "Wrong number? Change it".
  - `auth_phone_screen.dart` — clear button.
  - `home_screen.dart` — `_CategoryCircle`.
- Acceptance criteria (original — met for resolved locations):
  - `QuantityControl` and `MenuItemCard` add button hit targets reach 44×44. MET (prior passes).
  - Tapped containers show ink ripple. MET for all resolved locations.
  - No regressions to visual layout. Confirmed via `flutter analyze` (0 issues).

---

## P2 Later Wave

### ~~B13. Normalize copy tone across account/support/group-order surfaces~~ DONE (2026-03-16)
- `profile_screen.dart`: "is not available yet in this build" → "is not available yet". Hardcoded "John Doe" / "john@example.com" / "Regular customer" / "JD" replaced with "Your Name" / "your@email.com" / "Demo account" / "?".
- `settings_screen.dart`: "is not available yet in this build" → "is not available yet". Delete account confirm button uses inline snackbar message instead of `_showUnavailable`.
- No "in this build" implementation-language copy remains in either screen.

### ~~B15. Restyle checkout `_InfoNoticeCard` with existing AppTheme tokens~~ DONE (2026-03-16)
- `_InfoNoticeCard` in `checkout_screen.dart` restyled: `AppTheme.backgroundGrey` fill, `AppTheme.borderColor` border, `AppTheme.textSecondary` icon and text. No off-palette color literals remain.

### B19. Document or normalize onboarding per-page accent system
- Severity: `P2` (design decision required before mechanical fix)
- Affected files:
  - `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart` — page 1 uses `AppTheme.primaryColor`-aligned orange; pages 2–3 use purple and blue accents as per-page gradients and CTA colors.
- Decision required:
  - Option A: Document the three-page progression as a deliberate screen-specific expression in `UI_SYSTEM.md` (`Screen-Specific` section), noting that onboarding pages may use a sequential palette that returns to orange at completion.
  - Option B: Convert all three pages to the orange-primary gradient and rely solely on emoji and copy for visual differentiation.
- Acceptance criteria:
  - The onboarding accent system is either documented in governance or replaced with on-palette colors.
  - `Color(0xFF1A1A2E)` raw title literal is replaced with `colorScheme.onSurface` regardless of which option is chosen.
- Note: The mechanical title literal fix (`Color(0xFF1A1A2E)` → `colorScheme.onSurface`) is also tracked in B11 and can be done ahead of the design decision.

### ~~B20. Replace remaining `Color(0xFFFFF0EE)` raw literals with `colorScheme.primaryContainer`~~ DONE (2026-03-16)
- All four files addressed: `addresses_screen.dart` (×2), `notifications_screen.dart` unread icon background (×1, also unread banner background), `order_detail_screen.dart` (×1), `order_status_screen.dart` ETA card (×1). All replaced with `Theme.of(context).colorScheme.primaryContainer`.
- `Color(0xFFFFFAF9)` notification tile tint retained as acceptable screen-specific warm-white expression (not a primaryContainer alias).
- Zero `Color(0xFFFFF0EE)` raw literals remain in feature screens outside `mock_data.dart`.

### ~~B21. Fix `home_screen.dart` delivery address data binding~~ DONE (2026-03-16)
- `home_screen.dart` now wraps in `ListenableBuilder` on `CustomerRuntimeController.instance`. Address pill reads `runtime.deliveryAddress`. Null-guard shows "Add address" / "Tap to add a delivery address" when no address is set. Home screen pill now updates live after any address add/change/delete.

### B13b. Auth screen token alignment (split from B13 for tracking)
- Severity: `P2`
- Status: PARTIALLY DONE (2026-03-16)
  - `auth_screen.dart`: all `Color(0xFF1A1A2E)` and `Color(0xFFFFF0EE)` replaced. DONE.
  - `auth_otp_screen.dart`: all `Color(0xFF1A1A2E)` and `Color(0xFFFFF0EE)` replaced. DONE.
  - `auth_phone_screen.dart`: all `Color(0xFF1A1A2E)` replaced. DONE.
  - `guest_entry_screen.dart`: `Color(0xFF1A1A2E)` (×2) and `Color(0xFFFFF0EE)` (×1) — still remaining.
- Remaining fix:
  - Replace `Color(0xFF1A1A2E)` with `Theme.of(context).colorScheme.onSurface` and `Color(0xFFFFF0EE)` with `colorScheme.primaryContainer` in `guest_entry_screen.dart`. 3 lines.
- Acceptance criteria:
  - Zero `Color(0xFF1A1A2E)` raw literals remain in any auth screen.
  - Zero `Color(0xFFFFF0EE)` raw literals remain in any auth screen.

---

## Fast Cleanup Candidates (small, safe, high value, can be batched)
All items completed in fast-cleanup pass on 2026-03-16. `flutter analyze` passes clean.

1. ~~`addresses_screen.dart` `_AddressCard`: replace `Color(0xFFFFF0EE)` ×2 with `colorScheme.primaryContainer` — 2 lines (B20).~~ DONE
2. ~~`notifications_screen.dart` unread icon background: replace `Color(0xFFFFF0EE)` with `colorScheme.primaryContainer` — 1 line (B20).~~ DONE
3. ~~`order_detail_screen.dart` store context icon background: replace `Color(0xFFFFF0EE)` with `colorScheme.primaryContainer` — 1 line (B20).~~ DONE
4. ~~`order_status_screen.dart` ETA card icon background: replace `Color(0xFFFFF0EE)` with `colorScheme.primaryContainer` — 1 line (B20).~~ DONE
5. ~~Auth screens `Color(0xFF1A1A2E)` and `Color(0xFFFFF0EE)`: mechanical token replacement across 4 files — ~10 lines (B13b).~~ DONE for `auth_screen.dart`, `auth_otp_screen.dart`, `auth_phone_screen.dart`. `guest_entry_screen.dart` remaining (see B13b below).
6. ~~`checkout_screen.dart` `_InfoNoticeCard`: restyle with AppTheme neutral tokens — ~6 lines (B15).~~ DONE
7. ~~`home_screen.dart` address pill: replace `MockData.addresses[0]` with runtime controller — 1–3 lines + `ListenableBuilder` wrap (B21).~~ DONE
8. ~~`onboarding_screen.dart` title literal: replace `Color(0xFF1A1A2E)` with `colorScheme.onSurface` — 1 line (B11/B19, mechanical, no design decision needed).~~ DONE

---

## Recommended Order
1. Fast cleanup batch (items 1–8 above) — no design decisions required (except B21 which needs a null-address guard decision).
2. Tighten group order partial-state copy (B10) — copy-only, no wiring.
3. Normalize copy tone (B13) — profile/settings are the last "in this build" occurrences.
4. Normalize remaining token drift in onboarding (B11/B19) — requires one design decision first.
5. Standardize semantic tap surfaces (B12) — larger change, do after fast cleanup reduces noise.
6. Checkout info-notice restyling (B15) — low risk, included in fast batch.
7. Home address binding (B21) — small functional fix, unblocks honest address pill on home.

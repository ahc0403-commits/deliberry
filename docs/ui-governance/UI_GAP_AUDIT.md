# UI Governance Gap Audit

Status: active
Authority: operational
Surface: customer-app
Domains: ui-gaps, maintainability, cleanup
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- planning customer UI cleanup or checking current governed gaps
- deciding whether a customer UI issue is already known and prioritized
Related files:
- docs/ui-governance/UI_REFACTOR_BACKLOG.md
- docs/ui-governance/UX_DECAY_PATH.md
- docs/ui-governance/STABILIZATION_REPORT.md

## Scope
- Audited `customer-app/lib/app/`
- Audited `customer-app/lib/core/theme/`
- Audited `customer-app/lib/core/data/`
- Audited `customer-app/lib/features/`
- Evaluated only against the current governance set in `docs/ui-governance/`
- Refreshed: 2026-03-16 (Pass 9 — semantic tap surface cleanup, G04/B12 partial)

## Overall Verdict
The customer app is structurally coherent and locally functional as a non-live product demo. The core flow (home → store → menu → cart → checkout → orders) is continuously wired through `CustomerRuntimeController`. The G04/B12 semantic tap surface cleanup pass (Pass 9, 2026-03-16) resolved all `GestureDetector` usage in `widgets.dart`, `auth_screen.dart`, and `notifications_screen.dart`. Five `GestureDetector` locations remain in other feature screens (reviews quick-tags, addresses "Set as default", auth_otp text links, auth_phone clear button, home `_CategoryCircle`) and are deferred to a later wave. The remaining active gaps are: (1) residual `GestureDetector` locations in feature screens (G04 partial); (2) group order partial-state honesty (G02); (3) off-palette color literals in onboarding (G03); (4) `guest_entry_screen.dart` raw color literals (G13 partial).

## Severity Summary
- `P0`: 0 issues — none blocking manual QA
- `P1`: 2 issues — G02 (group order honesty), G03 (onboarding off-palette accents)
- `P2`: 3 issues — G04 partial (5 remaining GestureDetector locations), G03 (mock_data promo gradients), G13 partial (guest_entry_screen.dart)

---

## Resolved In All Previous Passes

| ID | What was resolved |
| --- | --- |
| G01 | Placeholder residue files deleted (`customer_feature_scaffold.dart`, `customer_flow_scaffold.dart`, `auth_placeholder_state.dart`, `group_order_placeholder_state.dart`) |
| G01b | Core flow no-op CTAs removed or replaced with explicit unavailable feedback |
| G01c | Route/data continuity fixed for store, cart, checkout, orders via `CustomerRuntimeController` |
| G01d | Search/filter state made durable across route transitions |
| G01e | Address management converted to durable runtime state with full add/edit/delete/default operations |
| G01f | Store detail and menu browsing share menu composition via `MenuSectionList` |
| G01g | Profile and settings share account-row primitives: `AccountSectionLabel`, `AccountActionGroup`, `AccountActionTile`, `AccountActionDivider`, `AccountToggleTile` |
| G14 | Profile/settings token drift reduced: borderRadius 20→16, raw TextStyles replaced with textTheme slots, off-palette literals replaced with AppTheme tokens |
| G14b | Group order and group order share token drift reduced: purple gradient replaced with `AppTheme.primaryColor` gradient, all raw TextStyles replaced with textTheme slots, borderRadius 20→16 |
| G14c | `widgets.dart` `MenuItemCard` "Popular" badge: `const Color(0xFFFFF0EE)` → `colorScheme.primaryContainer`; raw `TextStyle(fontSize:10)` → `textTheme.labelSmall!.copyWith(...)` |
| G14d | `group_order_share_screen.dart` `_memberRow` CircleAvatar label: raw `const TextStyle(fontSize:14, fontWeight:w700)` → `textTheme.titleSmall!.copyWith(fontWeight: w700, color: Colors.white)` |
| G05 | `reviews_screen.dart` orderId threading: `ReviewsScreen` now accepts `orderId` parameter; `app_router.dart` passes `settings.arguments as String?`; screen resolves order via `runtime.findOrderRecordById(widget.orderId)` with MockData fallback. Confirmed resolved in source. |
| G15 | `in_memory_customer_repository.dart` placeholder literal strings: all 9 occurrences replaced with product-facing section names (`'search suggestions'`, `'ratings summary'`, `'item modifiers'`, `'price summary'`, `'review media'`, `'address entry'`, `'read state'`, `'privacy settings'`, `'support links'`). Confirmed resolved in source. |
| G17 | `Color(0xFFFFB74D)` raw literals: replaced with `AppTheme.secondaryColor` in `widgets.dart` (`StoreCard` L159, `CompactStoreCard` L273, `RatingStars` L1071), `cart_screen.dart` `_StoreContextCard`, and `checkout_screen.dart` order summary store icon. Confirmed resolved in source. |
| G03-partial | `order_status_screen.dart` hero gradient: `Color(0xFFFF4B3A)`/`Color(0xFFFF8A65)` replaced with `AppTheme.primaryColor`/`AppTheme.primaryColor.withValues(alpha:0.7)`. ETA card static-timeline badge: `Color(0xFFE8F5E9)`/`Color(0xFF22C55E)` replaced with `AppTheme.successColor.withValues(alpha:0.12)`/`AppTheme.successColor`. Confirmed resolved in source. |
| G03-partial | `reviews_screen.dart` `_SuccessView`: `Color(0xFFE8F5E9)`/`Color(0xFF22C55E)` replaced with `AppTheme.successColor.withValues(alpha:0.12)`/`AppTheme.successColor`. Store context icon: `Color(0xFFFFF0EE)` replaced with `colorScheme.primaryContainer`. Confirmed resolved in source. |

---

## Active Findings

| ID | Severity | Category | Affected files | Violated governance rule | Why it hurts maintainability | Smallest safe fix | Wave |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G04 | ~~P1~~ PARTIAL | Accessibility — tap surface semantics | Resolved in Pass 9 (2026-03-16) for: `widgets.dart` (`CategoryChipRow` → `Material`+`InkWell`; `PromoBanner` → `Material`+`InkWell`; `AppSearchBar` readOnly → `Material`+`InkWell`, non-readOnly → no-op wrapper removed; `AddressPill` → `InkWell`; `RatingStars` interactive → `IconButton` per star, display → plain `Padding`+`Icon`; `OrderCard` → `Material`+`InkWell`). Note: `SectionHeader` "See all" was already `TextButton`; `StoreCard`, `CompactStoreCard`, `MenuItemCard` add button, `QuantityControl._button` were already `InkWell` — confirmed resolved in prior passes. `auth_screen.dart` "Continue as Guest" → `TextButton`. `notifications_screen.dart` tile → `Material`+`InkWell`. Remaining open: `reviews_screen.dart` quick-tag chips; `addresses_screen.dart` "Set as default" text link; `auth_otp_screen.dart` "Resend code" and "Wrong number?"; `auth_phone_screen.dart` clear button; `home_screen.dart` `_CategoryCircle`. | `ACCESSIBILITY_RULES.md` tap target rules (44×44 min); semantic rules for Flutter | Same as before for remaining locations. | Later wave |
| G02 | P2 | Screen type drift — group order remains intentionally partial | `customer-app/lib/features/group_order/presentation/group_order_screen.dart`; `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart` | `SCREEN_TYPES.md` form/edit and support/notification type boundaries; `STATE_MODELING_RULES.md` partial state rules | Honesty cleanup is now applied: fake create delay is gone, the share screen is explicitly labeled as a local preview, the room code is route-provided instead of one fixed hardcoded value, and unavailable actions use explicit limited-scope copy. The surface still remains partial because live participants and shared-cart syncing do not exist. | Keep preview-state language explicit if more UI is added before real group-order runtime exists. | Later wave |
| G03 | P1 | Token drift — off-palette color literals (remaining) | `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart` (pages 2–3 gradients: `Color(0xFF9C27B0)`, `Color(0xFFE91E63)`, `Color(0xFF2196F3)`, `Color(0xFF00BCD4)`); `customer-app/lib/core/data/mock_data.dart` (promo-2 gradient `Color(0xFF7C4DFF)`/`Color(0xFFB388FF)`, promo-3 gradient `Color(0xFF00BCD4)`/`Color(0xFF4DD0E1)`) | `UI_SYSTEM.md` global color rules; orange is the only strong universal action color | Partially resolved in fast-cleanup pass (2026-03-16): `Color(0xFF1A1A2E)` title literal in onboarding replaced with `colorScheme.onSurface`; `_InfoNoticeCard` in checkout restyled with `AppTheme.backgroundGrey`/`AppTheme.borderColor`/`AppTheme.textSecondary`. Remaining: onboarding pages 2–3 purple/blue per-page accent gradients and `mock_data.dart` promo gradients — these require a design decision (document as screen-specific or convert to on-palette). | Document the three-page onboarding progression as deliberate screen-specific expression in `UI_SYSTEM.md`, or convert pages 2–3 to orange-primary gradient. | Next wave |
| G12 | ~~P2~~ RESOLVED | Copy tone inconsistency | `customer-app/lib/features/profile/presentation/profile_screen.dart`; `customer-app/lib/features/settings/presentation/settings_screen.dart` | — | Resolved in copy-tone pass (2026-03-16): "is not available yet in this build" → "is not available yet" in both files. Hardcoded "John Doe" / "john@example.com" / "Regular customer" / "JD" replaced with "Your Name" / "your@email.com" / "Demo account" / "?". Delete account snackbar uses inline message instead of `_showUnavailable`. | — | Done |
| G13 | ~~P2~~ PARTIAL | Token drift — auth screens raw color literals | `customer-app/lib/features/auth/presentation/guest_entry_screen.dart` (`Color(0xFF1A1A2E)` L108, L222; `Color(0xFFFFF0EE)` L33) | `UI_SYSTEM.md` hard rule: do not create a new token layer disconnected from `AppTheme` | Resolved in fast-cleanup pass (2026-03-16) for `auth_screen.dart`, `auth_otp_screen.dart`, `auth_phone_screen.dart`: all `Color(0xFF1A1A2E)` replaced with `colorScheme.onSurface`; all `Color(0xFFFFF0EE)` replaced with `colorScheme.primaryContainer`. Remaining: `guest_entry_screen.dart` — 2× `Color(0xFF1A1A2E)` and 1× `Color(0xFFFFF0EE)` not yet addressed. | Replace remaining literals in `guest_entry_screen.dart`. 3 lines. | Next wave |
| G18 | ~~P2~~ RESOLVED | Token drift — `addresses_screen.dart` raw `Color(0xFFFFF0EE)` literals | `customer-app/lib/features/addresses/presentation/addresses_screen.dart` | — | Resolved in fast-cleanup pass (2026-03-16). Both `const Color(0xFFFFF0EE)` occurrences in `_AddressCard` replaced with `Theme.of(context).colorScheme.primaryContainer`. | — | Done |
| G19 | ~~P2~~ RESOLVED | Token drift — `notifications_screen.dart` raw color literals | `customer-app/lib/features/notifications/presentation/notifications_screen.dart` | — | Resolved in fast-cleanup pass (2026-03-16). Unread banner background and unread icon background `const Color(0xFFFFF0EE)` replaced with `Theme.of(context).colorScheme.primaryContainer`. Tile tint `Color(0xFFFFFAF9)` retained as screen-specific warm-white expression (acceptable — not a primaryContainer alias). | — | Done |
| G20 | ~~P2~~ RESOLVED | Token drift — `order_detail_screen.dart` raw `Color(0xFFFFF0EE)` literal | `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | — | Resolved in fast-cleanup pass (2026-03-16). Store context icon background replaced with `Theme.of(context).colorScheme.primaryContainer`. | — | Done |
| G21 | ~~P2~~ RESOLVED | Token drift — `order_status_screen.dart` ETA card icon background raw literal | `customer-app/lib/features/orders/presentation/order_status_screen.dart` | — | Resolved in fast-cleanup pass (2026-03-16). ETA card icon background replaced with `Theme.of(context).colorScheme.primaryContainer`. | — | Done |
| G22 | ~~P2~~ RESOLVED | State coverage — `home_screen.dart` reads delivery address from `MockData` not runtime | `customer-app/lib/features/home/presentation/home_screen.dart` | — | Resolved in fast-cleanup pass (2026-03-16). `MockData.addresses[0]` replaced with `CustomerRuntimeController.instance.deliveryAddress` inside a `ListenableBuilder`. Null-guard added: shows "Add address" / "Tap to add a delivery address" when no address is set. | — | Done |

---

## Category Notes

### Screen Type Drift
- `group_order_screen.dart` and `group_order_share_screen.dart` no longer fake a live create/join cycle. They are now clearly labeled as a local preview flow.
- `order_status_screen.dart` is correctly labeled with a visible "Static timeline" badge in the ETA card. This is adequate honesty for the current scope. ETA card icon background raw literal is a cosmetic token gap (G21), not a behavioral issue.
- `reviews_screen.dart` orderId threading is now resolved (G05 confirmed). Context card shows the correct store name when reached from an order detail.

### Token Drift
- Purple/blue/teal literals remain in onboarding per-page accent system (pages 2–3) and checkout `_InfoNoticeCard` (off-palette blue) — these are the two remaining structural token drift clusters (G03).
- Auth screens consistently use `Color(0xFF1A1A2E)` and `Color(0xFFFFF0EE)` raw literals (G13).
- New `Color(0xFFFFF0EE)` occurrences confirmed in: `addresses_screen.dart` (G18), `notifications_screen.dart` (G19), `order_detail_screen.dart` (G20), `order_status_screen.dart` ETA card (G21).
- `mock_data.dart` promotions 2 and 3 still use off-palette gradients. These are visual-only promo cards rendered in `home_screen.dart` and not surfaced in any critical transactional flow.
- All previously flagged `Color(0xFFFFB74D)` (G17) and `Color(0xFF22C55E)` / `Color(0xFFFF4B3A)` fast-cleanup items are confirmed resolved.

### Accessibility Gaps
- Pass 9 (2026-03-16): All `GestureDetector` usage in `widgets.dart` resolved. `CategoryChipRow`, `PromoBanner`, `AppSearchBar` (readOnly path), `AddressPill`, `RatingStars` (interactive), and `OrderCard` converted. `SectionHeader`, `StoreCard`, `CompactStoreCard`, `MenuItemCard` add button, and `QuantityControl._button` were already `InkWell`/`TextButton` from prior passes — confirmed.
- Pass 9 (2026-03-16): `auth_screen.dart` "Continue as Guest" converted from `GestureDetector` to `TextButton` with `minimumSize: Size(48, 44)`.
- Pass 9 (2026-03-16): `notifications_screen.dart` `_NotificationTile` converted from `GestureDetector` to `Material`+`InkWell` — ripple feedback now present.
- Remaining `GestureDetector` locations (deferred — later wave): `reviews_screen.dart` quick-tag chips; `addresses_screen.dart` "Set as default" text link; `auth_otp_screen.dart` "Resend code" and "Wrong number? Change it"; `auth_phone_screen.dart` clear button; `home_screen.dart` `_CategoryCircle`.

### State Coverage Gaps
- Home screen reads `MockData.addresses[0]` directly instead of `CustomerRuntimeController.instance.deliveryAddress` (G22). Address pill on home will show stale data after any address management operation.
- Group order partial state is visually complete but behaviorally shallow — member count and room code are static (G02).
- Reviews orderId threading is now resolved (G05). No mismatched store context card in QA walkthrough.
- Notifications state is locally managed and correct for its scope.

### Copy Tone
- G12 resolved (2026-03-16): "is not available yet in this build" replaced with "is not available yet" across profile and settings. Hardcoded profile identity replaced with demo placeholder copy ("Your Name", "your@email.com", "Demo account").

### Composition
- No new composition duplication found. `MenuSectionList` and `AccountActionGroup` family are in consistent use.
- `_SectionCard` in `checkout_screen.dart` and `_AddButton` / `_AddressCard` in `addresses_screen.dart` are screen-local widgets not yet in `widgets.dart`. These are fine at the current scope.

---

## Immediate Cleanup Candidates (fast, mechanical, low-risk)
All items below were resolved in the fast-cleanup pass on 2026-03-16.

1. ~~`addresses_screen.dart` `_AddressCard`: replace `const Color(0xFFFFF0EE)` (×2) with `colorScheme.primaryContainer` — 2 lines (G18).~~ DONE
2. ~~`notifications_screen.dart` unread icon background: replace `const Color(0xFFFFF0EE)` with `colorScheme.primaryContainer` — 1 line (G19).~~ DONE
3. ~~`order_detail_screen.dart` store context icon background: replace `const Color(0xFFFFF0EE)` with `colorScheme.primaryContainer` — 1 line (G20).~~ DONE
4. ~~`order_status_screen.dart` ETA card icon background: replace `const Color(0xFFFFF0EE)` with `colorScheme.primaryContainer` — 1 line (G21).~~ DONE
5. ~~Auth screens `Color(0xFF1A1A2E)` and `Color(0xFFFFF0EE)`: mechanical token replacement across 4 files — ~10 lines (G13).~~ DONE for `auth_screen.dart`, `auth_otp_screen.dart`, `auth_phone_screen.dart`. `guest_entry_screen.dart` deferred (next wave).
6. ~~`home_screen.dart` delivery address: replace `MockData.addresses[0]` with `CustomerRuntimeController.instance.deliveryAddress` — 1–3 lines (G22).~~ DONE
7. ~~`checkout_screen.dart` `_InfoNoticeCard`: restyle with AppTheme neutral tokens — ~6 lines (G03 / B15).~~ DONE
8. ~~`onboarding_screen.dart` title literal: replace `Color(0xFF1A1A2E)` with `colorScheme.onSurface` — 1 line (B11/B19, mechanical).~~ DONE

## Later-Wave Risks
- If the `GestureDetector`-heavy tap surface pattern in `widgets.dart` is not corrected before new screens reuse these widgets, every new screen inherits the accessibility debt.
- If `_InfoNoticeCard` off-palette blue stays, it creates a precedent for per-component palette invention in other informational banners.
- If the `Color(0xFFFFF0EE)` raw literal is not batched and eliminated across the remaining four screens now identified, the number of occurrences will grow with each new feature that copies from existing screens.
- If group order partial state is not disclosed more honestly, QA reviewers will flag it as broken rather than scope-limited.
- If `home_screen.dart` continues to read from `MockData` instead of the runtime controller, address management work (durable state from Pass 2) is silently invisible on the home screen.

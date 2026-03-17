# Customer UI Change Log

Status: historical
Authority: historical
Surface: customer-app
Domains: customer-ui, change-history
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- tracing the original customer UI rebuild sequence
- checking historical implementation context that predates stabilization governance
Superseded by: docs/ui-governance/STABILIZATION_REPORT.md
Related files:
- docs/ui-governance/STABILIZATION_REPORT.md
- docs/ui-governance/UI_GAP_AUDIT.md

Follow-on governance docs:
- `docs/ui-governance/README.md`
- `docs/ui-governance/UI_SYSTEM.md`
- `docs/ui-governance/SCREEN_TYPES.md`
- `docs/ui-governance/UX_DECAY_PATH.md`
- `docs/ui-governance/NAVIGATION_TRUTH_MAP.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

## Summary

- **Total files changed/created**: 27
- **Screens rebuilt from placeholder**: 25
- **New foundation files created**: 3
- **Configuration files updated**: 1
- **Unused placeholder files superseded**: 4
- **flutter analyze**: passes clean (0 issues)

## Stabilization Follow-Up

This rebuild has now been stabilized into a coherent local product flow.

Key stabilization outcomes:
- added shared runtime truth in `customer-app/lib/core/data/customer_runtime_controller.dart`
- fixed route-owned store and order identity
- made cart, checkout, order creation, order list/detail/status, and reorder coherent
- made search and filter state durable across expected route transitions
- removed silent no-op CTAs from the core customer journey
- reduced drift between store/menu and profile/settings patterns

See:
- `docs/ui-governance/NAVIGATION_TRUTH_MAP.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

## New Foundation Files

| File | Purpose |
| --- | --- |
| `customer-app/lib/core/theme/app_theme.dart` | Complete Material 3 theme with coral-red primary, custom typography, card/button/chip/nav/input themes |
| `customer-app/lib/core/data/mock_data.dart` | Rich mock data models (Store, MenuItem, CartItem, Order, Address, Notification, Category, Promotion) with realistic instances |
| `customer-app/lib/features/common/presentation/widgets.dart` | 15 reusable shared components (SectionHeader, StoreCard, CompactStoreCard, MenuItemCard, QuantityControl, PriceRow, CategoryChipRow, PromoBanner, StatusBadge, EmptyState, BottomCTABar, AppSearchBar, AddressPill, RatingStars, OrderCard) |

## Updated Configuration

| File | Change |
| --- | --- |
| `customer-app/lib/app/app.dart` | Switched from inline ThemeData to `AppTheme.theme` |

## Screens Rebuilt (Placeholder → Production UI)

### P0 — Entry + Auth (6 screens)
| File | Before | After |
| --- | --- | --- |
| `customer-app/lib/app/entry/customer_entry_screen.dart` | Session-state explainer with architecture text | Branded landing with gradient hero, logo, trust badges, Get Started / Guest CTAs, session-aware auto-redirect |
| `customer-app/lib/features/auth/presentation/auth_screen.dart` | Auth ownership notes + route buttons | Clean auth landing with phone primary, social login buttons, guest link, terms footer |
| `customer-app/lib/features/auth/presentation/auth_phone_screen.dart` | Bullet text + "Request OTP" button | Phone input with country code (+1), formatting mask, validation, loading state |
| `customer-app/lib/features/auth/presentation/auth_otp_screen.dart` | Explanatory copy + "Verify OTP" button | 6 animated digit boxes, auto-advance, masked phone, 30s countdown timer, auto-submit |
| `customer-app/lib/features/auth/presentation/guest_entry_screen.dart` | Guest policy explanation | Guest welcome with illustration, feature comparison table (Guest vs Account), dual CTAs |
| `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart` | Placeholder bullets + completion button | 3-page PageView (Discover/Preferences/Location), animated dot indicators, skip, per-page accent colors |

### P0 — Shell + Home + Search (5 screens)
| File | Before | After |
| --- | --- | --- |
| `customer-app/lib/app/shells/main_shell.dart` | Generic AppBar + padded body + basic nav | Streamlined Scaffold with NavigationBar only, no global AppBar, child owns its own layout |
| `customer-app/lib/features/home/presentation/home_screen.dart` | Text-only section list from string data | Full home feed: address pill, search bar, promo carousel, category grid, featured stores, nearby restaurants |
| `customer-app/lib/features/home/presentation/discovery_screen.dart` | Section cards for trending/nearby | Browsable store list with category filter chips, store cards |
| `customer-app/lib/features/search/presentation/search_screen.dart` | No search field or results | Live search: input, recent search chips, popular categories, filtered store results, empty state |
| `customer-app/lib/features/search/presentation/filter_screen.dart` | Bullet strings, no controls | Multi-section filter chips (Sort, Cuisine, Price, Dietary), apply/reset buttons |

### P0 — Store + Cart (4 screens)
| File | Before | After |
| --- | --- | --- |
| `customer-app/lib/features/store/presentation/store_screen.dart` | Store ownership text, "ratings placeholder" | SliverAppBar hero, store metadata, rating stars, category tabs, menu item cards, View Cart CTA |
| `customer-app/lib/features/store/presentation/menu_browsing_screen.dart` | String labels for menu groups | Sticky category chips, filtered MenuItemCard list, cart summary bottom bar |
| `customer-app/lib/features/cart/presentation/cart_screen.dart` | Cart sections as text | Item rows with QuantityControl, modifiers, notes, promo input, PriceRow breakdown, Checkout CTA |
| `customer-app/lib/features/checkout/presentation/checkout_screen.dart` | Explanatory sections + notice card | Address selector, delivery instructions, payment cards, order summary, price breakdown, Place Order CTA |

### P1 — Orders (3 screens)
| File | Before | After |
| --- | --- | --- |
| `customer-app/lib/features/orders/presentation/orders_screen.dart` | Text-only order sections | Tabbed Active/History with OrderCard widgets, status badges, reorder rows, empty states |
| `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | Single section list of labels | Receipt header, itemized list, PriceRow totals, delivery info, Reorder/Get Help actions |
| `customer-app/lib/features/orders/presentation/order_status_screen.dart` | Milestone strings in generic list | Gradient status hero, milestone stepper (done/current/pending), ETA card, Need Help button |

### P1 — Profile + Account (4 screens)
| File | Before | After |
| --- | --- | --- |
| `customer-app/lib/features/profile/presentation/profile_screen.dart` | Labels and route buttons | Avatar with initials, user info, grouped navigation tiles with colored icons, sign out with confirmation |
| `customer-app/lib/features/reviews/presentation/reviews_screen.dart` | String labels for rating/feedback | Interactive large RatingStars, text area, quick-tag chips, submit with success view |
| `customer-app/lib/features/addresses/presentation/addresses_screen.dart` | Text list of address strings | Address cards with default badge, PopupMenu (edit/delete/set-default), add form bottom sheet |
| `customer-app/lib/features/notifications/presentation/notifications_screen.dart` | Inbox skeleton as bullets | Notification tiles with icons, unread accent borders, mark-all-read action, read-on-tap |

### P1 — Settings (1 screen)
| File | Before | After |
| --- | --- | --- |
| `customer-app/lib/features/settings/presentation/settings_screen.dart` | Generic settings strings | Grouped sections (Account, Preferences, Support, Legal), toggle switches, app version, delete account |

### P2 — Group Order (2 screens)
| File | Before | After |
| --- | --- | --- |
| `customer-app/lib/features/group_order/presentation/group_order_screen.dart` | Bare scaffold with placeholder states | Create/join room UI, room code input, how-it-works stepper, loading state |
| `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart` | One sentence + placeholder outputs | Room code display, copy-to-clipboard, share actions, member list with host badge |

## Superseded Placeholder Files (No Longer Imported)

These files are no longer imported by any screen but remain in the codebase for reference:

| File | Reason |
| --- | --- |
| `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart` | Replaced by real screen compositions and shared widgets |
| `customer-app/lib/features/common/presentation/customer_feature_scaffold.dart` | Replaced by real screen compositions |
| `customer-app/lib/features/auth/state/auth_placeholder_state.dart` | Auth screens now use inline UI, not placeholder state strings |
| `customer-app/lib/features/group_order/state/group_order_placeholder_state.dart` | Group order screens now use inline UI |

## Remaining Gaps

| Gap | Status | Notes |
| --- | --- | --- |
| Store list results screen | NOT ADDED | Discovery and search cover this use case with filtered StoreCard lists |
| Order confirmation screen | NOT ADDED | Checkout routes to orders list; a dedicated confirmation screen can be added as a future enhancement |
| Live backend integration | INTENTIONALLY EXCLUDED | All screens use mock data per project scope |
| Payment verification | INTENTIONALLY EXCLUDED | Checkout payment is placeholder-only per project rules |
| Real-time order tracking | INTENTIONALLY EXCLUDED | Order status uses static milestone timeline per project rules |
| Map/address autocomplete | INTENTIONALLY EXCLUDED | Address management uses form-based input per project exclusions |

## Validation

- `flutter analyze`: **0 issues** (passes clean)
- All route names preserved (no routing changes)
- All screen class names preserved (router compatibility maintained)
- Session controller integration preserved (auth flow works end-to-end)
- Surface boundaries respected (no shared runtime logic introduced)

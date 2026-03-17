# Navigation Truth Map

Status: active
Authority: operational
Surface: customer-app
Domains: navigation, routes, shell-ownership
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing customer route ownership, shell boundaries, or back-navigation expectations
- checking whether a screen is shell-owned or flow-owned
Related files:
- customer-app/lib/app/router/app_router.dart
- customer-app/lib/app/router/route_names.dart
- customer-app/lib/app/shells/main_shell.dart

## Purpose
- Define the actual customer-app navigation ownership after stabilization.
- Separate shell-owned tab destinations from flow-owned standalone screens.
- Record safe back-navigation expectations and route-entry rules.

## Shell-Owned Routes

| Route | Screen | Why it belongs in shell | Valid entry points | Back behavior |
| --- | --- | --- | --- | --- |
| `/home` | `HomeScreen` | Primary browse tab | entry redirect, auth/onboarding completion, bottom nav | system back exits app/web history |
| `/search` | `SearchScreen` | Primary intent/search tab | bottom nav, home search bar, home category taps | system back exits app/web history or returns browser history |
| `/orders` | `OrdersListScreen` | Authenticated account tab | bottom nav, checkout/order-status completion, profile row | system back exits tab context |
| `/profile` | `ProfileScreen` | Authenticated account hub tab | bottom nav | system back exits tab context |

Rules:
- Only the four primary destinations above are `MainShell` routes.
- The shell owns bottom navigation only. It does not own detail-flow app bars or transactional progression.

## Standalone Flow Routes

| Route | Screen | Ownership | Valid entry points | Back expectation |
| --- | --- | --- | --- | --- |
| `/entry` | `CustomerEntryScreen` | app entry | app launch, signed-out redirects | no back target inside app |
| `/auth/login` | `AuthScreen` | auth flow | entry CTA, auth redirects | back to entry |
| `/auth/phone` | `AuthPhoneScreen` | auth flow | auth primary CTA, guest create-account CTA | back to auth/login |
| `/auth/otp` | `AuthOtpScreen` | auth flow | phone submit, otp-pending redirect | back to auth/phone |
| `/guest` | `GuestEntryScreen` | auth branch | auth tertiary CTA | back to auth/login |
| `/onboarding` | `OnboardingScreen` | onboarding flow | OTP verification, onboarding-required redirect | finish into `/home` |
| `/home/discovery` | `DiscoveryScreen` | browse child flow | home see-all, home browse CTA | back to prior browse screen |
| `/search/filter` | `FilterScreen` | search/discovery child flow | search results, discovery filter CTA | close back to prior search/discovery context |
| `/store` | `StoreDetailScreen` | transaction discovery child | home, discovery, search results | back to caller (`/home`, `/search`, `/home/discovery`) |
| `/store/menu` | `MenuBrowsingScreen` | store child flow | store detail | back to store detail |
| `/cart` | `CartScreen` | transaction flow | store detail, menu browsing, reorder | back to prior browse/detail screen |
| `/checkout` | `CheckoutScreen` | transaction flow | cart | back to cart |
| `/orders/status` | `OrderStatusScreen` | order child flow | active orders tap, checkout submit | back goes to `/orders` |
| `/orders/detail` | `OrderDetailScreen` | order child flow | history orders tap, order-status detail CTA | back to previous route; intended parent is `/orders` |
| `/reviews` | `ReviewsScreen` | post-order child flow | order detail review CTA, profile row | back to caller |
| `/addresses` | `AddressesScreen` | account child flow | profile row, checkout manage CTA | back to caller |
| `/notifications` | `NotificationsScreen` | account child flow | home bell, profile row | back to caller |
| `/settings` | `SettingsScreen` | account child flow | profile row | back to profile |
| `/group-order` | `GroupOrderRoomScreen` | secondary feature flow | direct route only today | back to caller |
| `/group-order/share` | `GroupOrderShareScreen` | group-order child flow | group-order create room | back to group-order |

## Detail Children vs Top-Level Tabs

### Top-Level Tabs
- `/home`
- `/search`
- `/orders`
- `/profile`

### Detail / Child Flows
- `/home/discovery`
- `/search/filter`
- `/store`
- `/store/menu`
- `/cart`
- `/checkout`
- `/orders/status`
- `/orders/detail`
- `/reviews`
- `/addresses`
- `/notifications`
- `/settings`
- `/group-order`
- `/group-order/share`

Rule:
- Store, cart, checkout, order detail, and order status are flow-owned, not shell-owned.
- They must not render the shell bottom navigation.

## Valid Entry Truth

### Customer browse flow
- `/home` -> `/store` -> `/store/menu` -> `/cart` -> `/checkout` -> `/orders/status`

### Search flow
- `/home` or shell tab -> `/search` -> `/search/filter` -> `/store`

### Order follow-up flow
- `/orders` -> `/orders/status`
- `/orders` -> `/orders/detail`
- `/orders/detail` -> `/reviews`

### Account flow
- `/profile` -> `/addresses`
- `/profile` -> `/notifications`
- `/profile` -> `/settings`

## Current Routing Incoherence Status

### Fixed in this stabilization pass
- Store detail now accepts route-owned store identity instead of hardcoding one store.
- Menu browsing now follows the same selected-store truth as store detail.
- Order detail and order status now accept route-owned order identity.
- Checkout now submits into the same runtime order source used by `/orders`, `/orders/detail`, and `/orders/status`.
- Order-status back navigation now returns to `/orders` instead of falling back into checkout.

### Still limited but explicit
- Settings, addresses, notifications, and reviews are standalone account children outside the shell. This is coherent, but still visually separate from the tab shell by design.
- Group order remains a secondary standalone flow with partial runtime behavior.

## Safe Navigation Rules
- Do not put `/store`, `/cart`, `/checkout`, `/orders/detail`, or `/orders/status` inside `MainShell`.
- Do not let child-flow routes silently ignore route arguments.
- Search/filter must preserve context when the user returns from store/detail.
- Order routes must resolve one order id across list, detail, status, and reorder.

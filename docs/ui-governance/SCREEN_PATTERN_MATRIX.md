# Screen Pattern Matrix

Status: active
Authority: operational
Surface: customer-app
Domains: screen-mapping, patterns, routes
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- mapping a concrete customer screen to its approved screen type and interaction model
- checking whether a new change matches an existing governed pattern
Related files:
- docs/ui-governance/SCREEN_TYPES.md
- docs/ui-governance/INTERACTION_PATTERNS.md
- customer-app/lib/app/router/app_router.dart

| Route | Screen Class | Screen Type | Primary User Goal | Main Composition Pattern | Core Interactive Pattern | Required States | CTA Model | Risks / Cleanup Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/entry` | `CustomerEntryScreen` | Entry / Landing | start or resume the customer journey | split hero + bottom action panel | session-aware redirect + primary/secondary CTA | loading, signed-out, redirect | one filled + one outlined | keep redirect logic and hero clarity aligned |
| `/auth/login` | `AuthScreen` | Auth | choose a sign-in path | centered identity block + action stack | primary phone auth, secondary social, tertiary guest | idle, redirect | one filled, outlined alternatives | social actions are still non-functional |
| `/auth/phone` | `AuthPhoneScreen` | Form / Auth | enter valid phone number | focused single-form screen | inline validation + loading CTA | idle, invalid, submitting | sticky primary CTA | current implementation is US-only |
| `/auth/otp` | `AuthOtpScreen` | Auth | verify phone number | focused code-entry form | auto-advance boxes + resend countdown | idle, incomplete, submitting | sticky primary CTA + tertiary correction link | still mock verification |
| `/guest` | `GuestEntryScreen` | Auth | continue without account | comparison / branch selection | guest/account comparison | idle | primary guest continuation | ensure restrictions stay honest |
| `/onboarding` | `OnboardingScreen` | Onboarding | finish first-run setup | pager with progress + bottom CTA | page progression, skip, finish | per-page, completion | one bottom CTA | current content is instructional more than data capture |
| `/home` | `HomeScreen` | Feed / Discovery | browse quickly | sliver feed with search, promos, categories, rails | navigation taps into search/discovery/store | populated | card taps, inline route actions | preserve feed hierarchy |
| `/home/discovery` | `DiscoveryScreen` | Feed / Discovery | browse filtered restaurant grid | pinned chips + count row + grid | chip filter + store card navigation | populated, empty | item tap | filter state now round-trips through shared runtime truth; keep discovery/search parity aligned |
| `/search` | `SearchScreen` | Search / Filter | find restaurants by intent | two-state search screen | typing, recent tap, clear recent, result tap | idle, results, empty | result tap | recent searches and current query are runtime-real; preserve return context when leaving search |
| `/search/filter` | `FilterScreen` | Search / Filter | refine discovery | section cards + sticky apply bar | single-select chips + reset/apply | default, selected | sticky apply CTA + reset text action | temporary sheet state must stay aligned with shared filter truth on apply/reset |
| `/store` | `StoreDetailScreen` | Detail / Menu Browsing | inspect a store and start building an order | hero sliver + metadata + pinned categories + menu list | category switching + add buttons + cart CTA | populated, empty category | sticky cart CTA | route-owned store identity is now required; favorite is honestly unavailable and share copies store name |
| `/store/menu` | `MenuBrowsingScreen` | Menu Browsing | browse menu fast | flat app bar + pinned chips + list + sticky bar | category switching + add buttons | populated, empty | sticky cart CTA | duplicates store-menu pattern |
| `/cart` | `CartScreen` | Cart / Checkout | review and edit the basket | stacked cards + sticky total CTA | dismiss item, promo apply, quantity control, add-more | empty, populated | sticky checkout CTA | cart mutations are runtime-real; demo promo handling remains intentionally limited |
| `/checkout` | `CheckoutScreen` | Cart / Checkout | confirm order details | stacked section cards + sticky submit | payment selection, notes entry, place order | populated, submitting, success, error | sticky place-order CTA | payment remains placeholder-only by scope |
| `/orders` | `OrdersListScreen` | Order Tracking | inspect active and past orders | app bar + tabs + cards | tab switch, order tap, reorder | empty, active populated, history populated | row tap, reorder secondary | reorder now rebuilds the cart from the shared order source |
| `/orders/detail` | `OrderDetailScreen` | Detail | review one completed order | stacked context, items, totals, delivery cards | leave-review + reorder actions | populated, missing-order | secondary review + primary reorder | must resolve route-owned order id from shared runtime truth; fee rows remain local summary presentation |
| `/orders/status` | `OrderStatusScreen` | Order Tracking | understand current order progress | gradient hero + ETA + milestone timeline + details | detail navigation from static status timeline | populated, missing-order | secondary detail CTA | must stay clearly non-realtime; the screen explicitly presents a static timeline |
| `/profile` | `ProfileScreen` | Profile Hub | access account areas | summary card + grouped nav rows + isolated sign-out | row navigation + sign-out confirm | populated | navigational rows | hardcoded identity data |
| `/reviews` | `ReviewsScreen` | Form / Edit | leave feedback | context card + rating card + text card + tag card + submit | star rating + text entry + tags + success | idle, validation error, success | primary submit CTA | preserve success state; wire to real review ownership later |
| `/addresses` | `AddressesScreen` | Form / Edit | manage saved addresses | card list + add action + bottom bar + sheet form | add/edit/delete/default actions | populated, empty, form sheet state, destructive confirm | bottom add CTA | runtime-real within the session only; not persisted to disk or backend |
| `/notifications` | `NotificationsScreen` | Support / Notification | process inbox items | summary banner + notification list or empty view | mark read, mark all read | populated, empty | secondary text action | strong baseline pattern; keep unread semantics stable |
| `/settings` | `SettingsScreen` | Settings | manage preferences and support/legal access | uppercase section labels + grouped rows + destructive group | toggles, honest unavailable messaging, confirm destructive | populated, destructive confirm | row-based, destructive isolated | toggles are local-only and most support/legal rows intentionally show unavailable feedback |
| `/group-order` | `GroupOrderRoomScreen` | Form / Edit | preview or join a group order concept | hero + local preview flow + join form + how-it-works | open invite preview, limited join feedback | idle, partial | one primary preview CTA | create path is preview-only and join remains explicitly unavailable |
| `/group-order/share` | `GroupOrderShareScreen` | Support / Notification | distribute a group order invite preview | room code card + share buttons + member card | copy/share preview actions | idle, copied | primary share CTA | member list and participant updates remain preview-only, not live shared-room state |

# Surface Access Flow Audit

## Executive summary

Phase A audit result:

- `customer-app` has the clearest route-level access matrix, but its session restore truth is weak because route state is backed only by an in-memory store in [customer_session_store.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_store.dart).
- `merchant-console` and `admin-console` have stronger server-side redirect enforcement than `customer-app`, but both still use demo-cookie route auth rather than a fully runtime-real identity boundary for page access.
- `admin-console` has one confirmed structural access leak: `/access-boundary` is reachable without an admin session because [layout.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx) explicitly bypasses `ensureAdminPlatformAccess(...)` for that pathname.
- Public site routes are access-truthful: all are public, and their copy is generally honest about manual handoff, coming-soon state, and repository-backed content boundaries.
- The highest-value next hardening work is not visual. It is route/session truth hardening:
  - make session restore durable where the surface claims continuity
  - remove or fence unauthenticated access-boundary reachability
  - align stale preview-only wording with the routes that now have persisted writes

## Evidence standard used

This audit is grounded in runtime code, not planning docs.

Priority order used:

1. router/page/layout/guard code
2. session restore and auth adapter code
3. server actions and redirect code
4. screen/page wording that describes runtime truth
5. README and phase reports only as supporting context

## Surface findings

### Customer app

Primary route owner:
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)

Session owner:
- [customer_session_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_controller.dart)
- [customer_session_store.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_store.dart)

Confirmed current truth:
- Access decisions are explicit and centralized in `AppRouter`.
- `home`, `search`, `discovery`, `filter`, `store`, `store menu`, `group order`, `cart`, and `checkout` are `customerFlow`.
- `orders`, `order detail`, `order status`, `reviews`, `profile`, `settings`, `addresses`, and `notifications` are authenticated-only.
- `onboarding` is onboarding-only.
- `guest` and `auth` entry routes redirect away once signed in, guest, onboarding-pending, or OTP-pending.

Weaknesses:
- Session restore is not real restore. [main.dart](/Users/andremacmini/Deliberry/customer-app/lib/main.dart) calls `restore()`, but the store is `MemoryCustomerSessionStore`, so app restarts lose session state.
- Several customer account screens still describe session-local truth, which is accurate for the current code, but the surface can give a stronger continuity impression than the actual in-memory session model supports.
- [profile_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/profile/presentation/profile_screen.dart) still contains guest/demo presentation branches even though the router never allows guests onto `/profile`.

Route-truth conclusion:
- Access boundary: present
- Session continuity: weak
- Identity truth: local/in-memory only
- Runtime truth: mixed
  - route guards are runtime-real
  - session durability is not
  - many account/order surfaces remain session-local

### Merchant console

Primary route owners:
- [page.tsx](/Users/andremacmini/Deliberry/merchant-console/src/app/page.tsx)
- [layout.tsx](/Users/andremacmini/Deliberry/merchant-console/src/app/(console)/layout.tsx)
- [layout.tsx](/Users/andremacmini/Deliberry/merchant-console/src/app/(console)/[storeId]/layout.tsx)

Guard/session owners:
- [access.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/server/access.ts)
- [merchant-session.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/auth/merchant-session.ts)
- [auth-actions.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/server/auth-actions.ts)

Confirmed current truth:
- `/login` redirects away when a merchant session exists.
- `/onboarding` requires a merchant session and unfinished onboarding.
- `/select-store` requires a merchant session and completed onboarding.
- every store-scoped route under `/(console)/[storeId]` requires session, completed onboarding, and matching store scope.

Weaknesses:
- Route access is server-enforced, but it is still demo-cookie auth by default through [auth-actions.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/server/auth-actions.ts), not a fully runtime-real identity flow.
- The codebase now contains a Supabase merchant auth adapter in [supabase-merchant-auth-adapter.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/auth/supabase-merchant-auth-adapter.ts), but page access truth still depends on cookie session helpers. That is a dual-truth seam.
- [settings-screen.tsx](/Users/andremacmini/Deliberry/merchant-console/src/features/settings/presentation/settings-screen.tsx) still says `Local preview only, no persisted settings backend`, but [settings-actions.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/settings/server/settings-actions.ts) now writes through `updateMerchantSettingsRuntimeData(...)`.

Route-truth conclusion:
- Access boundary: strong at route level
- Session continuity: cookie-backed
- Identity truth: partially real, partially demo-cookie
- Runtime truth: mixed
  - orders/store/settings routes are guarded and store-scoped
  - some route copy is stale and under-claims live persisted behavior

### Admin console

Primary route owners:
- [page.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/page.tsx)
- [layout.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx)

Guard/session owners:
- [access.ts](/Users/andremacmini/Deliberry/admin-console/src/features/auth/server/access.ts)
- [admin-session.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-session.ts)
- [admin-access.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-access.ts)
- [permission-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/server/permission-actions.ts)

Confirmed current truth:
- `/login` is public.
- most `/platform/*` pages require an admin session and an allowed role.
- role-based navigation filtering and role-path enforcement are real within the current admin session model.
- admin data surfaces are openly snapshot/fixture/read-only in the screens inspected.

Confirmed structural issue:
- `/access-boundary` is reachable without an admin session.
- [layout.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx) bypasses `ensureAdminPlatformAccess(...)` when pathname is `/access-boundary`.
- [setAdminRoleAction](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/server/permission-actions.ts) can set an `admin_role` cookie even if no `admin_session` cookie exists.
- That does not grant platform data access, because protected routes still redirect to `/login`, but it is still the wrong reachability shape for a session role-selection route.

Weaknesses:
- Admin sign-in is still demo-cookie auth via [auth-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/auth/server/auth-actions.ts).
- The access system is runtime-enforced inside the app, but not runtime-real identity in the commercial sense.

Route-truth conclusion:
- Access boundary: mostly strong
- Session continuity: cookie-backed
- Identity truth: demo-cookie
- Data truth: mostly snapshot/read-only and honestly labeled
- Confirmed reachability bug: unauthenticated `/access-boundary`

### Public website

Primary route owners:
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)
- [layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx)

Confirmed current truth:
- all routes are public
- no auth gate or hidden protected path was found
- landing, service, merchant, support, download, privacy, terms, and refund-policy all align with public-website ownership
- route copy is generally honest about manual partner handoff, support-by-email, and coming-soon app availability

Weaknesses:
- content loading remains repository-backed placeholder/snapshot truth through [public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)
- that is not an access bug, but it does mean content management is not live

Route-truth conclusion:
- Access boundary: correct
- Session continuity: not applicable
- Runtime truth: honest public-content boundary, but not CMS-backed

## Top structural findings

### P0

1. Admin `/access-boundary` is reachable without a valid admin session.
2. Customer session restore is in-memory only, so route continuity is weaker than the customer surface suggests.
3. Merchant route access still depends on demo-cookie auth even though a Supabase merchant auth adapter exists.

### P1

1. Merchant settings route copy is stale and mislabels a now-persisted write path as preview-only.
2. Customer profile route contains guest/demo presentation states that are unreachable under the actual router.
3. Route truth across surfaces is documented inconsistently in UI copy, especially where persisted-first work happened later.

### P2

1. Public website content remains repository-backed rather than CMS-backed.
2. Admin role/session truth is runtime-enforced in-app but still not identity-real beyond the demo-cookie model.

## Recommended fix plan

### P0

1. Require an admin session before `/access-boundary` can render or mutate role state.
2. Replace or harden customer session restore so route continuity survives app restart in a real storage layer.
3. Choose one merchant auth truth for route access:
   either keep demo-cookie and clearly mark it as such everywhere,
   or move route access onto the Supabase-backed adapter and retire the parallel path.

### P1

1. Update merchant settings route wording to match persisted write truth.
2. Remove or realign unreachable guest/demo branches in authenticated-only customer screens like `/profile`.
3. Create a maintained route-truth registry derived from actual route/guard ownership.

### P2

1. Align public content repository copy with any future CMS plans only when that workstream starts.
2. Expand role/access audit coverage to mutation endpoints after the route-truth fixes land.

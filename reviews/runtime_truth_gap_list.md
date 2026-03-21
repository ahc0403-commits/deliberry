# Runtime Truth Gap List

## P0

### 1. Admin access-boundary is reachable without session

Confirmed current state:
- [PlatformLayout](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx) skips `ensureAdminPlatformAccess(...)` for `/access-boundary`.
- [setAdminRoleAction](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/server/permission-actions.ts) can still set `ADMIN_ROLE_COOKIE` even when `ADMIN_SESSION_COOKIE` is absent.

Why it matters:
- `/access-boundary` is presented as a session role-selection flow, not a public route.
- This creates a structural mismatch between intended role-required access and actual unauthenticated reachability.

Recommended fix:
- require a valid admin session before rendering or mutating `/access-boundary`
- reject role writes when no admin session exists

### 2. Customer session restore is not real restore

Confirmed current state:
- [main.dart](/Users/andremacmini/Deliberry/customer-app/lib/main.dart) calls `CustomerSessionController.instance.restore()`
- [customer_session_store.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_store.dart) uses `MemoryCustomerSessionStore`

Why it matters:
- route continuity is only valid for the current process lifetime
- guest/auth/onboarding state does not survive actual app restart
- customer route truth looks stronger than the persistence of the session model

Recommended fix:
- replace the memory store with real local persistence before any stronger continuity claims are made

### 3. Merchant route auth truth is split between demo cookies and Supabase adapters

Confirmed current state:
- route access uses [merchant-session.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/auth/merchant-session.ts) cookie helpers and demo sign-in actions in [auth-actions.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/server/auth-actions.ts)
- a Supabase auth path also exists in [supabase-merchant-auth-adapter.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/auth/supabase-merchant-auth-adapter.ts)

Why it matters:
- route/session truth is harder to reason about
- future access bugs are more likely when one path is demo-cookie and another is backend-derived

Recommended fix:
- choose one route-access authority and retire or clearly fence the parallel path

## P1

### 4. Merchant settings screen copy is stale against runtime truth

Confirmed current state:
- [settings-screen.tsx](/Users/andremacmini/Deliberry/merchant-console/src/features/settings/presentation/settings-screen.tsx) still says:
  - `Local preview only, no persisted settings backend`
  - `Preview-only`
  - `Read-only and demo-safe`
- [settings-actions.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/settings/server/settings-actions.ts) now calls `updateMerchantSettingsRuntimeData(...)`

Why it matters:
- UI wording now under-claims a live persisted write path
- this creates route-truth drift even though the access boundary itself is correct

Recommended fix:
- update the route copy to describe persisted store-scoped settings truth accurately

### 5. Customer profile contains guest/demo states that the router cannot reach

Confirmed current state:
- [profile_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/profile/presentation/profile_screen.dart) renders guest/demo labels
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart) guards `/profile` as authenticated-only

Why it matters:
- it leaves dead state assumptions in the screen
- it weakens confidence that screen wording matches the actual access boundary

Recommended fix:
- remove unreachable guest/demo branches or move them to a route that guests can actually reach

### 6. Customer account area uses session-local wording, but route continuity depends on a weaker store than the user might infer

Confirmed current state:
- [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)
- [profile_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/profile/presentation/profile_screen.dart)
- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)

Why it matters:
- wording is honest about “current session”, but the session implementation is still too weak to support durable continuity

Recommended fix:
- fix the session store first, then revisit the surface wording only if needed

## P2

### 7. Public site content is public and honest, but still repository-backed rather than live content-managed

Confirmed current state:
- [public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

Why it matters:
- not an access bug
- still important when someone assumes the public website is runtime-live beyond code snapshots

Recommended fix:
- defer until a real content-management workstream starts

### 8. Admin role access is runtime-enforced, but still demo-safe identity truth

Confirmed current state:
- [auth-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/auth/server/auth-actions.ts)
- [admin-session.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-session.ts)

Why it matters:
- route protection is good enough for internal surface structure
- identity and permission truth are still not commercial-grade auth

Recommended fix:
- defer until auth hardening is prioritized after route-truth cleanup

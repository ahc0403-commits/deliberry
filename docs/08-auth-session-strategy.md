# Deliberry Auth and Session Strategy

Status: active
Authority: operational
Surface: cross-surface
Domains: auth, session, permissions
Last updated: 2026-04-11
Last verified: 2026-04-11
Retrieve when:
- changing auth or session behavior across surfaces
- checking approved non-live auth/session direction before runtime work
Related files:
- docs/02-surface-ownership.md
- docs/03-navigation-ia.md
- customer-app/lib/core/session/customer_session_controller.dart
- merchant-console/src/shared/auth/merchant-session.ts
- admin-console/src/shared/auth/admin-session.ts

## Purpose

This document defines the current approved auth, session, and permission runtime direction after the customer, merchant, and admin runtime closures completed.

It does not rewrite phases 1 through 8.
It does not introduce data-layer work that belongs to later tracks.
It does not allow `shared` to become a runtime auth layer.

## Current State

The repository currently has:

- customer auth entry with Kakao, Zalo, guest, and phone fallback branches
- customer session restoration and Supabase-backed authenticated runtime
- merchant auth, onboarding, and store-selection routes with merchant-local cookie/session enforcement
- admin auth and permission-boundary routes with admin-local cookie/session and route enforcement
- public website that remains public-only

The repository still does **not** currently have:

- completed live backend identity integration for merchant auth
- completed live backend identity integration for admin auth
- fully verified end-to-end live provider closure for all customer auth providers

## Customer App Strategy

### Approved auth mechanism

- customer auth is customer-local and provider-split at launch time
- Kakao and Zalo are the active primary provider branches
- guest mode remains explicit
- phone/OTP remains fallback only
- onboarding remains a separate branch after auth decision

### Login handling direction

- login entry, callback handling, and guest branching stay inside `customer-app`
- provider launch behavior stays inside provider adapters only
- callback detection uses a single normalized contract inside `customer-app/lib/core/session/customer_auth_adapter.dart`
- callback completion returns one normalized completion result contract, regardless of provider
- `CustomerSessionController` is the only owner allowed to adopt an authenticated customer session into runtime state
- Supabase-backed session restoration remains customer-local
- no shared runtime auth helpers may be introduced

### Customer callback contract (approved)

The app accepts one normalized callback contract:

- `provider`
- `code`
- `state`
- `error`
- `error_description`
- Supabase web fragment/session tokens when present

The app uses one detector for both startup and restore:

- `detectCustomerAuthCallback(Uri uri)`

### Customer callback completion result contract (approved)

Provider adapters must return one normalized completion result contract:

- `provider`
- `callback`
- `sessionTransport`
- optional `refreshToken`
- optional `accessToken`
- optional `expiresInSeconds`

Current session transport values:

- `existingSupabaseSession`
  - used by Kakao when the provider callback already created a usable Supabase session
- `refreshTokenExchange`
  - used by Zalo when the public exchange route returns a refresh token that `CustomerSessionController` must adopt

### Zalo OAuth flow (live)

- PKCE with S256 code challenge protects the authorization flow
- code_verifier is stored in `CustomerAuthAttemptStore` with a 10-minute TTL and never exposed in URL state
- web state parameter encodes nonce and return_to (no secrets)
- GET callback lands on `public-website` at `go.deli-berry.com/customer-zalo-auth-exchange`
- exchange endpoint on `public-website` performs token exchange, profile fetch via Cloudflare proxy at `proxy.deli-berry.com`, and Supabase identity resolution
- GET redirect from `public-website` returns the normalized app callback query contract with `provider=zalo`
- POST exchange returns the normalized completion payload contract:
  - `contract_version=customer_auth_completion_v1`
  - `provider=zalo`
  - `result=authenticated`
  - `session.transport=refresh_token_exchange`
  - `session.refresh_token`
  - optional `session.access_token`
  - optional `session.expires_in`
  - `identity.actor_id`
  - `identity.actor_type`
  - `identity.is_new_customer`
  - `identity.needs_onboarding`
  - `identity.display_name`
- `CustomerSessionController` performs the final `setSession()` adoption using that refresh token
- `completeOnboarding()` clears the remote `needs_onboarding` flag best-effort
- local session snapshot prevents stale remote `needs_onboarding` from re-triggering onboarding

### Redirect URI authority chain (approved)

Redirect authority is explicit and singular by layer:

1. `customer-app/scripts/vercel-build.sh`
   - validates `AUTH_CALLBACK_SCHEME`, `AUTH_CALLBACK_HOST`, and `AUTH_CALLBACK_PATH` as the app callback authority
   - validates `ZALO_REDIRECT_URI` as an absolute http(s) URL for `/customer-zalo-auth-exchange`
2. `public-website/src/app/customer-zalo-auth-exchange/route.ts`
   - validates runtime `ZALO_REDIRECT_URI`
   - rejects exchange requests whose `redirect_uri` does not exactly match runtime authority
3. provider dashboard configuration
   - must match the same `ZALO_REDIRECT_URI`

This means the callback chain is:

- provider callback -> `ZALO_REDIRECT_URI`
- public exchange route -> normalized app callback contract
- `customer-app` detector -> normalized completion result
- `CustomerSessionController` -> session adoption and route handoff

### Local persistence and session handling direction

- use a customer-local session controller
- keep session state inside `customer-app/lib/core` or `customer-app/lib/shared`
- session restoration must remain customer-local
- `CustomerSessionSnapshot` persisted via `FlutterSecureStorage` (localStorage on web)
- `allowSupabaseRestore` flag gates whether Supabase session is restored on cold start
- direct TypeScript imports from `shared` are not allowed

### Guest mode handling

- guest mode remains a real route branch
- guest access must stay explicit, not hidden as an alias
- guest restrictions remain customer-local policy

### Remaining auth blockers

- Kakao live login still requires final browser-credential verification against the hosted project
- Zalo live login is functional; operator must rotate secrets (ZALO_APP_SECRET, SUPABASE_SERVICE_ROLE_KEY, VIETNAM_ZALO_PROXY_SHARED_SECRET) in Vercel dashboard
- rate limiting on POST exchange endpoint is not yet configured (recommended: Vercel WAF rule)
- review and payment flows remain separate scope and must not be used as auth proxies

## Merchant Console Strategy

### Approved auth mechanism

- merchant auth remains merchant-local
- merchant login, onboarding, and store selection remain distinct steps

### Session persistence pattern

- use merchant-local web session persistence
- keep merchant session ownership inside `merchant-console`
- session runtime must not be shared with admin

### Store-context gate approach

- store selection remains part of the merchant access boundary
- selected store context must be enforced locally in merchant runtime
- merchant onboarding completion and selected-store state must be separated

### Route protection approach

- no merchant session -> `/login`
- session but onboarding incomplete -> `/onboarding`
- onboarding complete but no store selected -> `/select-store`
- valid session and selected store -> store-scoped console routes

### Remaining auth blockers

- backend merchant identity integration is still not complete
- merchant auth remains merchant-local and demo-safe
- payment verification and settlement finalization remain out of scope

## Admin Console Strategy

### Approved auth mechanism

- admin auth remains admin-local
- admin login remains separate from merchant auth

### Session persistence pattern

- use admin-local web session persistence
- admin session must not reuse merchant session logic

### Admin-only route protection

- no admin session -> `/login`
- session without resolved permission scope -> `/access-boundary`
- session with valid role/scope -> platform routes

### Permission enforcement approach

- permissions remain admin-local runtime logic
- route gating must enforce access, not only hide navigation links
- high-risk routes such as finance, settlements, marketing, and system management must be guarded explicitly

### Role and permission boundary direction

- role and scope evaluation belongs in `admin-console`
- permission runtime must not move into `shared`
- permission contracts may live in `shared`, but not permission engines

### Remaining auth blockers

- backend admin identity integration is still not complete
- admin auth remains admin-local and demo-safe
- live policy-source loading remains deferred

## Public Website Rule

- `public-website` stays public-only
- no authenticated merchant/admin/customer console behavior belongs there
- merchant onboarding and inquiry remain public entry only
- `public-website` hosts the customer Zalo auth exchange endpoint at `/customer-zalo-auth-exchange` (GET redirect + POST token exchange) — this is a stateless API route, not authenticated console behavior

## Shared Boundary Rule

`shared` remains contract-only because:

- runtime models differ across Flutter and Next.js
- auth/session behavior is surface-specific
- permission enforcement is ownership-specific
- placing runtime auth/session logic in `shared` would collapse product boundaries

`shared` may define:

- auth-related contracts
- roles, statuses, and constants
- validation schemas
- pure utilities

`shared` must never define:

- session storage
- route guards
- auth providers
- permission engines
- runtime orchestration

## Guardrails That Still Apply

Codex may continue to implement:

- customer-local auth/session controller work
- merchant-local session and store-context gating
- admin-local session and permission enforcement
- route guards and access boundaries within each surface
- surface-owned runtime persistence/session handling

Codex must still not implement:

- payment verification
- shared runtime auth/session logic
- cross-surface auth/session coupling

## Decision Summary

### Approved strategy by surface

- `customer-app`: customer-local provider auth with Kakao/Zalo branches, explicit guest, phone fallback, and Supabase-backed customer runtime session
- `merchant-console`: merchant-local session with onboarding and selected-store gates
- `admin-console`: admin-local session with role/scope enforcement
- `public-website`: remains public-only
- `shared`: contract-only, never runtime auth

### Prerequisite checklist for starting Track B implementation

1. customer-local auth/session controller location agreed
2. merchant session persistence and selected-store gate agreed
3. admin session persistence and permission gate model agreed
4. public website confirmed as public-only during Track B
5. shared confirmed as contract-only during Track B
6. explicit list of Track C deferrals accepted

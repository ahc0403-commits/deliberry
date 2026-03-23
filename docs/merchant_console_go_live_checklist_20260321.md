# Merchant Console — Go-Live Operational Verification Checklist

**Date:** 2026-03-21
**Commit:** ed6bf22
**Surface:** merchant-console
**Status:** Operational verification — not a release signoff

---

## Build / Deploy

| Item | Status | Evidence |
|---|---|---|
| `next build` passes locally | PROVEN | Exit code 0, all 14 routes compiled, 7 static pages generated |
| `vercel-build` script defined | PROVEN | `package.json` line 8: `NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS='--max_old_space_size=4096' next build --no-lint` |
| `outputFileTracingRoot` set for monorepo | PROVEN | `next.config.ts` line 9: `path.join(__dirname, "..")` — required for Vercel serverless to bundle `shared/` imports |
| No `vercel.json` for merchant-console | PROVEN | Only `customer-app/vercel.json` exists. Merchant-console relies on Vercel auto-detection or project-level settings |
| `tsconfig.json` production-safe | PROVEN | `strict: true`, `isolatedModules: true`, `moduleResolution: "bundler"` — no dev-only overrides |
| No dev-only hardcoded URLs in supabase config | PROVEN | `config.ts` reads all values from `process.env` at runtime — `.env.example` has localhost defaults but those are not compiled in |

**Vercel deployment risk:** No `vercel.json` means Vercel project settings (root directory, build command, env vars) must be configured in the Vercel dashboard. If the Vercel project root is not set to `merchant-console/`, the build will fail.

---

## Auth / Session

| Item | Status | Evidence |
|---|---|---|
| Dual authority model works | PROVEN | `config.ts:readMerchantAuthAuthority()` returns `"supabase"` when env vars present, `"demo-cookie"` when absent |
| Supabase auth path: sign-in | PROVEN | `supabase-merchant-auth-adapter.ts:162-183` — `signInWithPassword` via Supabase Auth |
| Supabase auth path: session read | PROVEN | `supabase-merchant-auth-adapter.ts:150-160` — reads user, then merchant snapshot from DB |
| Supabase auth path: sign-out | PROVEN | `supabase-merchant-auth-adapter.ts:206-213` — calls `supabase.auth.signOut()` |
| Supabase auth path: onboarding complete | PROVEN | `supabase-merchant-auth-adapter.ts:185-203` — updates `merchant_profiles.onboarding_complete` |
| Demo-cookie fallback exists | PROVEN | `merchant-session.ts:33-52,138-163` — uses plain cookies with hardcoded demo IDs |
| Cookie-based server client handles read-only stores | PROVEN | `client.ts:45-48` — `setAll` catches silently for server component read-only contexts |
| Service role client disables session persistence | PROVEN | `client.ts:23-28` — `persistSession: false, autoRefreshToken: false` |

**Production risk:** If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set in Vercel env vars, the app silently falls back to `demo-cookie` mode. There is no startup-time warning or health check that catches this. In production, demo-cookie mode means **no real authentication** — any visitor can set a cookie and become "authenticated."

**Risk severity:** HIGH — must set env vars and verify authority is `"supabase"` in production.

---

## Store Selection Scope

| Item | Status | Evidence |
|---|---|---|
| `ensureMerchantStoreScope(storeId)` gates all store routes | PROVEN | `access.ts:38-64` — checks session → onboarding → store match, redirects on mismatch |
| Store selection persisted via Supabase RPC | PROVEN | `supabase-merchant-auth-adapter.ts:231` — calls `set_merchant_default_store` RPC |
| RPC exists in migrations | PROVEN | `20260319113000_phase_p0_merchant_auth_hardening.sql` defines `set_merchant_default_store` |
| Membership validation before store select | PROVEN | `supabase-merchant-auth-adapter.ts:221-225` — checks `memberships.some(m => m.storeId === storeId)` |
| Access path routing is deterministic | PROVEN | `merchant-session.ts:253-276` — no session → `/login`, no onboarding → `/onboarding`, no store → `/select-store`, else → `/{storeId}/dashboard` |

**No unproven items.**

---

## Orders Runtime

| Item | Status | Evidence |
|---|---|---|
| Read: `getOrdersData` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:326` — queries `orders` table with store scope |
| Mutation: `updateOrderStatus` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:374` — updates `orders.status` column |
| `orders.status` column exists in migrations | PROVEN | `20260319122900_add_orders_status.sql` — `ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'` |
| Server action calls `ensureMerchantStoreScope` | PROVEN | `order-actions.ts` uses `ensureMerchantStoreScope(storeId)` before data access |
| `revalidatePath` after mutation | PROVEN | Action calls `revalidatePath` to refresh server-rendered page |
| Build output: route compiles | PROVEN | `[storeId]/orders` — 4.44 kB |

---

## Reviews Runtime

| Item | Status | Evidence |
|---|---|---|
| Read: `getReviewsData` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:498` — queries reviews with store scope |
| Mutation: `replyToReview` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:541` — writes review reply |
| Server action calls `ensureMerchantStoreScope` | PROVEN | `review-actions.ts` uses `ensureMerchantStoreScope(storeId)` |
| Observability instrumented | PROVEN | `merchant-review-runtime-service.ts` — full traceId + observability events for read and write |
| Build output: route compiles | PROVEN | `[storeId]/reviews` — 3.62 kB |

---

## Settings / Store Runtime

| Item | Status | Evidence |
|---|---|---|
| Settings read: `getSettingsData` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:611` |
| Settings mutation: `updateSettingsData` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:631` |
| Store read: `getStoreManagementData` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:493` |
| Store mutation: `updateStoreManagementData` via supabase | PROVEN | `supabase-merchant-runtime-repository.ts:760` |
| Both server actions call `ensureMerchantStoreScope` | PROVEN | `settings-actions.ts`, `store-management-actions.ts` |
| Build output: both routes compile | PROVEN | `[storeId]/settings` — 3.28 kB, `[storeId]/store` — 3.16 kB |

---

## Secret Hygiene

| Item | Status | Evidence |
|---|---|---|
| `.env.local` not tracked | PROVEN | Not in `git ls-files` output |
| `.env.*.local` excluded | PROVEN | `.gitignore` contains `.env.*.local` |
| `.omc/` excluded | PROVEN | `.gitignore` contains `.omc/` |
| `supabase/.temp/` excluded | PROVEN | `.gitignore` contains `supabase/.temp/` |
| Only `.env.example` files tracked | PROVEN | `git ls-files | grep -i env` returns only `.env.example` files (no secrets) |
| `SUPABASE_SERVICE_ROLE_KEY` read from env only | PROVEN | `config.ts:27` — `readEnv("SUPABASE_SERVICE_ROLE_KEY")`, never hardcoded |

**Risk:** `SUPABASE_SERVICE_ROLE_KEY` is used by the service client (`client.ts:19-21`). If set in Vercel, it is available to all serverless functions. Ensure it is not exposed to client bundles — it is not prefixed with `NEXT_PUBLIC_`, so Next.js will not include it in client JS. **SAFE.**

---

## Migration / Rollforward / Rollback

| Item | Status | Evidence |
|---|---|---|
| Active migration count | PROVEN | 5 active files, sequentially ordered |
| Foundation (20260317150000) | PROVEN | Creates: `actor_profiles`, `merchant_profiles`, `admin_profiles`, `stores`, `merchant_store_memberships`, `orders`, `audit_logs` |
| Auth state (20260319110000) | PROVEN | Renames `merchant_store_memberships` → `merchant_memberships`, renames columns, adds role check constraint |
| Auth hardening (20260319113000) | PROVEN | Adds `set_merchant_default_store` RPC |
| Orders status (20260319122900) | PROVEN | Adds `orders.status` column |
| Runtime screen backing (20260319123000) | PROVEN | Extends `stores`, `orders`, `reviews` with runtime columns |
| Skipped migration present but inactive | PROVEN | `_skip_20260318160000` — prefix excludes from active set |
| No forward references in chain | PROVEN | Every ALTER targets a table created in prior or same migration |
| No rollback scripts exist | UNVERIFIED | No `down` migrations found. Rollback would require manual SQL |

**Risk:** No rollback migrations exist. If a production migration fails partway, manual intervention is required. All migrations use `IF EXISTS` / `IF NOT EXISTS` guards, which reduces partial-failure risk but does not eliminate it.

---

## Production Smoke Steps

These steps must be performed manually against the live deployment:

1. **Load `/login`** — verify login form renders
2. **Sign in with a seeded merchant account** — verify redirect to `/onboarding` or `/select-store` or `/{storeId}/dashboard`
3. **Verify authority is `"supabase"`** — check browser cookies; should NOT see `merchant_session` plain-text cookie (that indicates demo-cookie mode)
4. **Navigate to `/{storeId}/orders`** — verify orders load from DB
5. **Update an order status** — verify mutation persists after page reload
6. **Navigate to `/{storeId}/reviews`** — verify reviews load from DB
7. **Reply to a review** — verify reply persists after page reload
8. **Navigate to `/{storeId}/settings`** — verify settings load from DB
9. **Update a setting** — verify mutation persists after page reload
10. **Navigate to `/{storeId}/store`** — verify store data loads from DB
11. **Update store info** — verify mutation persists after page reload
12. **Sign out** — verify redirect to `/login`
13. **Access `/{storeId}/orders` directly while signed out** — verify redirect to `/login`
14. **Access `/{storeId}/orders` with wrong storeId while signed in** — verify redirect to correct store or `/select-store`

---

## Known Non-Claims

The following are explicitly **not claimed** as production-ready:

- Payment processing — placeholder only
- Real-time order tracking — not implemented
- Map/address autocomplete — not implemented
- QR generation/scanning — not implemented
- Email/SMS notifications — not implemented
- Multi-tenant RLS policies — not verified against cross-tenant access
- Rate limiting — not implemented at application layer
- Session refresh/rotation — server component cookie writes are caught-and-ignored (`client.ts:45-48`)
- Analytics, promotions, settlement, menu routes — not verified in this checklist (build compiles but runtime not DB-backed for all)

---

## Remaining Risks

| # | Risk | Severity | Detail |
|---|---|---|---|
| 1 | Silent demo-cookie fallback in production | **HIGH** | If Supabase env vars are missing, auth degrades to unsigned cookies with no warning. Any visitor can forge a session. |
| 2 | No `vercel.json` for merchant-console | **MEDIUM** | Deployment depends on Vercel dashboard config. Misconfigured root directory will fail the build silently. |
| 3 | No rollback migrations | **MEDIUM** | All migrations are forward-only. Partial failure requires manual DB intervention. |
| 4 | Session cookie refresh silently swallowed | **LOW** | `client.ts:45-48` catches `setAll` errors. If Supabase rotates the session token during a server component render, the new token is lost. User must re-authenticate. |
| 5 | `SUPABASE_SERVICE_ROLE_KEY` optional in config | **LOW** | `assertMerchantSupabaseConfig()` only requires URL + anon key. If service role key is missing, service client calls will throw at runtime, not at startup. |
| 6 | No health check endpoint | **LOW** | No `/api/health` or equivalent to verify DB connectivity post-deploy. |

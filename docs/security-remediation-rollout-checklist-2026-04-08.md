# Security Remediation Rollout Checklist

Date: 2026-04-08

Scope:
- secret rotation follow-up
- live Supabase migration application
- public-website redeploy
- post-apply verification

This checklist is for operational rollout only. It assumes the source-side remediation is already present in the repository.

## 1. Pre-Flight

- Confirm the target workspace is clean enough to deploy from.
- Confirm the target Supabase project is the Deliberry project referenced by `SUPABASE_URL`.
- Confirm the public-website deployment target is the production site that serves `go.deli-berry.com`.

## 2. Secret Rotation

### 2.1 Rotate the VN proxy shared secret

Systems that must receive the same new value:
- public-website runtime env: `VIETNAM_ZALO_PROXY_SHARED_SECRET`
- VN proxy runtime env: `VIETNAM_ZALO_PROXY_SHARED_SECRET`

Required order:
1. Generate a new secret value outside the repo.
2. Update the VN proxy runtime to accept the new secret.
3. Update the public-website production env to the same new secret.
4. Redeploy the public website after the env update.

Fact-only note:
- The repo does not contain the live replacement value and this checklist does not generate one.

### 2.2 Rotate the exposed local Vercel CLI auth token

Required operator action:
1. Invalidate or replace the previously exposed local Vercel auth session on the operator machine.
2. Re-authenticate the Vercel CLI as needed.
3. Re-pull env files only after rotation is complete.

Fact-only note:
- The exposed `VERCEL_OIDC_TOKEN` was in local exported env files, not in application source code.

## 3. Live Supabase Migration Apply

Repository root:

```bash
cd /Users/andremacmini/Deliberry
supabase db push
```

Expected source migrations to apply:
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql`

What migration `20260408113000` changes:
- creates `customer_addresses` if missing
- adds `preferences_json` to `actor_profiles` if missing
- adds `service_fee_centavos` to `orders` if missing
- enables RLS on customer-reachable tables
- adds customer ownership policies
- adds hardened customer RPCs
- drops legacy customer RPC signatures that trusted caller-supplied actor ids

What migration `20260408140000` changes:
- enables RLS on `merchant_profiles`, `admin_profiles`, `merchant_memberships`, `audit_logs`, `disputes`, `support_tickets`
- adds merchant/admin ownership policies
- replaces 5 merchant RPCs to use `auth.uid()` instead of caller-supplied actor_id
- adds authorization check to `get_merchant_dashboard_kpi_snapshot`
- adds merchant-scoped order read policy
- drops old function signatures that accepted caller-supplied identity

## 4. Public Website Production Redeploy

Production env values that must be present before deploy:
- `SUPABASE_SERVICE_ROLE_KEY`
- `ZALO_APP_SECRET`
- `VIETNAM_ZALO_PROFILE_PROXY_URL`
- `VIETNAM_ZALO_PROXY_SHARED_SECRET`
- `CUSTOMER_AUTH_ALLOWED_ORIGINS`

Public-website workspace:

```bash
cd /Users/andremacmini/Deliberry/public-website
npm run typecheck
vercel deploy --prod
```

Fact-only note:
- The hardened route uses `CUSTOMER_AUTH_ALLOWED_ORIGINS` when set, otherwise it falls back to Deliberry/local defaults.

## 5. Post-Apply Verification

### 5.1 Public auth route header checks

Allowed origin preflight should succeed and must not return `Access-Control-Allow-Origin: *`:

```bash
curl -i -X OPTIONS 'https://go.deli-berry.com/customer-zalo-auth-exchange' \
  -H 'Origin: https://go.deli-berry.com'
```

Disallowed origin preflight should return `403`:

```bash
curl -i -X OPTIONS 'https://go.deli-berry.com/customer-zalo-auth-exchange' \
  -H 'Origin: https://evil.example'
```

Callback endpoint without `code` or `error` should return a controlled `400` JSON error:

```bash
curl -i 'https://go.deli-berry.com/customer-zalo-auth-exchange'
```

### 5.2 Legacy Supabase auth path disablement

The legacy function should return `410`:

```bash
curl -i 'https://gjcwxsezrovxcrpdnazc.supabase.co/functions/v1/customer-zalo-auth-exchange'
```

### 5.3 Database state verification

Run in Supabase SQL editor or equivalent SQL client:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'actor_profiles',
    'orders',
    'customer_reviews',
    'customer_addresses',
    'stores',
    'store_menu_items',
    'merchant_profiles',
    'admin_profiles',
    'merchant_memberships',
    'audit_logs',
    'disputes',
    'support_tickets'
  )
order by tablename;
```

```sql
select
  schemaname,
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'actor_profiles',
    'orders',
    'customer_reviews',
    'customer_addresses',
    'stores',
    'store_menu_items',
    'merchant_profiles',
    'admin_profiles',
    'merchant_memberships',
    'audit_logs',
    'disputes',
    'support_tickets'
  )
order by tablename, policyname;
```

```sql
select
  p.proname,
  pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'create_customer_order',
    'set_customer_default_address',
    'delete_customer_address_with_default_ensure',
    'upsert_customer_review_with_store_projection',
    'assert_merchant_store_membership',
    'get_merchant_dashboard_kpi_snapshot',
    'update_order_status_with_audit',
    'update_store_settings_with_audit',
    'update_store_profile_with_audit',
    'set_merchant_default_store'
  )
order by p.proname, args;
```

### 5.4 Application smoke checks after migration + redeploy

1. Customer sign-in still reaches the hardened exchange route.
2. Signed-in customer can load own orders.
3. Signed-in customer can create a new order from valid menu items.
4. Tampered order payloads from a modified client are no longer trusted server-side.
5. Signed-in customer can write a review only for an owned order.
6. Address save, delete, and default switching still work.

## 6. Rollback Notes

If the public-website deploy regresses auth routing:
- restore the prior production deployment in Vercel
- do not remove the new source changes from git without a separate decision

If the Supabase migration causes runtime failure:
- stop customer rollout
- inspect failing policy/function calls first
- do not bypass by removing RLS in production without a reviewed replacement migration

# Supabase Security Verification Queries — 2026-04-08

Run each query in the Supabase Dashboard SQL Editor.
Migrations verified: `20260408113000` (customer) and `20260408140000` (merchant/admin).

---

## Query 1: RLS Enabled on All 12 Target Tables

```sql
select
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

### PASS criteria

All 12 rows returned. Every row has `rowsecurity = true`.

| tablename | rowsecurity (expected) |
|---|---|
| actor_profiles | true |
| admin_profiles | true |
| audit_logs | true |
| customer_addresses | true |
| customer_reviews | true |
| disputes | true |
| merchant_memberships | true |
| merchant_profiles | true |
| orders | true |
| store_menu_items | true |
| stores | true |
| support_tickets | true |

### FAIL conditions

- Any row shows `rowsecurity = false` → RLS not enabled on that table.
- Fewer than 12 rows → table does not exist (migration may not have run).

---

## Query 2: All Expected RLS Policies Exist

```sql
select
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

### PASS criteria

All 18 policies below must appear (exact `policyname` and `cmd` match):

| tablename | policyname | cmd |
|---|---|---|
| actor_profiles | actor_profiles_self_insert_customer | INSERT |
| actor_profiles | actor_profiles_self_select | SELECT |
| actor_profiles | actor_profiles_self_update_customer | UPDATE |
| admin_profiles | admin_profiles_self_read | SELECT |
| audit_logs | audit_logs_service_role_all | ALL |
| customer_addresses | customer_addresses_delete_own | DELETE |
| customer_addresses | customer_addresses_insert_own | INSERT |
| customer_addresses | customer_addresses_read_own | SELECT |
| customer_addresses | customer_addresses_update_own | UPDATE |
| customer_reviews | customer_reviews_read_own | SELECT |
| disputes | disputes_service_role_all | ALL |
| merchant_memberships | merchant_memberships_self_read | SELECT |
| merchant_profiles | merchant_profiles_self_read | SELECT |
| merchant_profiles | merchant_profiles_self_update | UPDATE |
| orders | customer_orders_read_own | SELECT |
| orders | merchant_orders_read_store | SELECT |
| stores | customer_store_catalog_public_read | SELECT |
| store_menu_items | customer_store_menu_public_read | SELECT |
| support_tickets | support_tickets_service_role_all | ALL |

### FAIL conditions

- Any row from the table above is missing → policy was not created.
- Extra unknown policies → not necessarily a failure, but investigate origin.
- `cmd` value differs from expected → policy was created with wrong operation scope.

---

## Query 3: Hardened Function Signatures Present (No Legacy Signatures)

```sql
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as signature
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
order by p.proname, signature;
```

### PASS criteria

Exactly 10 rows. Each function appears once with the hardened signature below (no `uuid` actor_id parameter):

| function_name | signature (expected) |
|---|---|
| assert_merchant_store_membership | `p_store_id text, p_required_role text` |
| create_customer_order | `p_store_id text, p_payment_method text, p_delivery_address text, p_notes text, p_line_items jsonb, p_promo_code text, p_estimated_delivery_at timestamp with time zone` |
| delete_customer_address_with_default_ensure | `p_address_id text` |
| get_merchant_dashboard_kpi_snapshot | `p_store_id text` |
| set_customer_default_address | `p_address_id text` |
| set_merchant_default_store | `p_store_id text` |
| update_order_status_with_audit | `p_order_id text, p_store_id text, p_next_status text` |
| update_store_profile_with_audit | `p_store_id text, p_name text, p_cuisine_type text, p_phone text, p_email text, p_address text, p_delivery_radius text, p_avg_prep_time text, p_accepting_orders boolean, p_hours_json jsonb` |
| update_store_settings_with_audit | `p_store_id text, p_settings_json jsonb` |
| upsert_customer_review_with_store_projection | `p_order_id text, p_rating integer, p_review_text text, p_tags_json jsonb` |

### FAIL conditions

- More than 10 rows → a legacy signature still exists (the old overload was not dropped).
- Any signature contains a leading `uuid` parameter (e.g. `p_actor_id uuid`) → legacy function not replaced.
- Fewer than 10 rows → a hardened function was not created.

---

## Query 4: Legacy Function Overloads Are Gone

```sql
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as signature
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (
    (p.proname = 'set_customer_default_address' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
    or (p.proname = 'delete_customer_address_with_default_ensure' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
    or (p.proname = 'upsert_customer_review_with_store_projection' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
    or (p.proname = 'assert_merchant_store_membership' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
    or (p.proname = 'update_order_status_with_audit' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
    or (p.proname = 'update_store_settings_with_audit' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
    or (p.proname = 'update_store_profile_with_audit' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
    or (p.proname = 'set_merchant_default_store' and pg_get_function_identity_arguments(p.oid) like '%uuid%')
  )
order by p.proname;
```

### PASS criteria

**Zero rows returned.** All legacy overloads accepting a `uuid` actor_id have been dropped.

### FAIL conditions

- Any row returned → that legacy function signature still exists. The corresponding `DROP FUNCTION` in the migration did not execute or matched a different overload.

---

## Query 5: Function Execute Grants Are Correct

```sql
select
  routine_name,
  grantee,
  privilege_type
from information_schema.routine_privileges
where routine_schema = 'public'
  and routine_name in (
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
order by routine_name, grantee;
```

### PASS criteria

Each of the 10 functions has exactly two EXECUTE grants: `authenticated` and `service_role`.
No grant to `public` or `anon` should appear for any of these functions.

Expected: 20 rows total (10 functions x 2 grantees), all with `privilege_type = EXECUTE`.

### FAIL conditions

- A function has a grant to `public` → `REVOKE ALL ... FROM public` did not execute.
- A function has a grant to `anon` → unexpected grant exists.
- A function is missing `authenticated` or `service_role` grant → `GRANT EXECUTE` did not execute.

---

## Query 6: Functions Use SECURITY DEFINER with search_path = public

```sql
select
  p.proname as function_name,
  p.prosecdef as is_security_definer,
  array_to_string(p.proconfig, ', ') as config
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
order by p.proname;
```

### PASS criteria

All 10 rows show:
- `is_security_definer = true`
- `config` contains `search_path=public`

### FAIL conditions

- `is_security_definer = false` → function runs as INVOKER, not DEFINER. RLS bypass for internal writes will not work correctly.
- `config` is null or does not contain `search_path=public` → search_path injection risk.

---

## Consolidated Verdict Logic

| Query | PASS condition | Result |
|---|---|---|
| Q1 RLS enabled | 12 rows, all `rowsecurity = true` | ☐ PASS / ☐ FAIL |
| Q2 Policies exist | All 18 policies present with correct `cmd` | ☐ PASS / ☐ FAIL |
| Q3 Hardened signatures | Exactly 10 rows, no `uuid` in signatures | ☐ PASS / ☐ FAIL |
| Q4 Legacy signatures gone | Zero rows | ☐ PASS / ☐ FAIL |
| Q5 Execute grants correct | 20 rows, only `authenticated` + `service_role` | ☐ PASS / ☐ FAIL |
| Q6 SECURITY DEFINER + search_path | 10 rows, all `true` + `search_path=public` | ☐ PASS / ☐ FAIL |

**Overall: PASS only if all 6 queries pass.**

---

## Remaining Blockers (fact-only, from audit)

These are NOT verified by the queries above — they are separate items:

1. **F3 FIXED** (commit `4e69adc`): Deterministic password bridge removed. Admin `generateLink` + OTP verify replaces `deterministicPasswordFor()`.
2. **F6 FIXED** (commit `7fb8181`): PKCE/session storage migrated to `flutter_secure_storage`. iOS Keychain / Android EncryptedSharedPreferences.
3. **Secret rotation**: VN proxy shared secret and Vercel CLI token rotation are operator actions, not verifiable via SQL.
4. **Public-website redeploy**: CORS hardening is live only after redeployment with `CUSTOMER_AUTH_ALLOWED_ORIGINS`.
5. **Settlement edge function fixes**: Source-fixed but redeployment status not confirmed from SQL.

-- Phase 1 RLS Verification Queries -- 2026-04-28
--
-- Purpose:
-- Verify the source-of-truth production boundaries for customer, merchant,
-- admin, settlement, audit, and idempotency tables before Phase 1 schema
-- hardening proceeds.
--
-- Scope:
-- These queries are read-only verification queries. They do not change data.
-- Run them against local/staging/production Supabase as appropriate.

-- 1. Core table RLS state.
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'actor_profiles',
    'merchant_profiles',
    'admin_profiles',
    'stores',
    'merchant_store_memberships',
    'merchant_memberships',
    'orders',
    'audit_logs',
    'customer_addresses',
    'customer_reviews',
    'store_menu_items',
    'disputes',
    'support_tickets',
    'order_mutation_idempotency',
    'delivery_settlements',
    'delivery_settlement_items',
    'external_sales'
  )
order by tablename;

-- Expected:
-- Every listed production-critical table should exist and have rowsecurity = true.

-- 2. RLS policy inventory for production-critical tables.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'actor_profiles',
    'merchant_profiles',
    'admin_profiles',
    'stores',
    'merchant_store_memberships',
    'merchant_memberships',
    'orders',
    'audit_logs',
    'customer_addresses',
    'customer_reviews',
    'store_menu_items',
    'disputes',
    'support_tickets',
    'order_mutation_idempotency',
    'delivery_settlements',
    'delivery_settlement_items',
    'external_sales'
  )
order by tablename, policyname;

-- Expected highlights:
-- - customer rows are scoped by auth.uid()
-- - merchant rows are scoped by merchant membership
-- - audit_logs direct table access is service_role only
-- - disputes and support_tickets direct table access is service_role only
-- - settlement visibility is merchant-store or admin scoped

-- 3. RPC signature inventory.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as args,
  pg_get_function_result(p.oid) as result_type
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

-- Expected:
-- - create_customer_order has p_idempotency_key
-- - update_order_status_with_audit has p_idempotency_key
-- - legacy signatures that trust caller-supplied actor ids are absent

-- 4. RPC execute grant inventory.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as args,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute,
  has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_can_execute
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

-- Expected:
-- - anon_can_execute should be false for hardened RPCs
-- - authenticated_can_execute should be true where client/session RPC access is approved
-- - service_role_can_execute should be true for server-side verification and admin jobs

-- 5. Critical index inventory.
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'orders',
    'customer_addresses',
    'customer_reviews',
    'store_menu_items',
    'order_mutation_idempotency',
    'delivery_settlements',
    'delivery_settlement_items',
    'external_sales',
    'disputes',
    'support_tickets'
  )
order by tablename, indexname;

-- Expected:
-- - order_mutation_idempotency has a unique index on actor_id, operation, idempotency_key
-- - store_menu_items has store/category or store/availability indexes
-- - settlement tables have period and settlement lookup indexes
-- - support/dispute tables have created-at lookup indexes

-- 6. Audit log direct-access guard.
select
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'audit_logs'
order by policyname;

-- Expected:
-- Only service_role direct table access is allowed. Production surfaces should
-- create audit rows through approved server/RPC paths.

-- 7. Idempotency table guard.
select
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'order_mutation_idempotency'
order by policyname;

-- Expected:
-- Direct authenticated table access should not be broadly open. Idempotency
-- rows should be written by the hardened RPCs.

-- 8. Settlement visibility guard.
select
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'delivery_settlements',
    'delivery_settlement_items',
    'external_sales'
  )
order by tablename, policyname;

-- Expected:
-- Merchant visibility is scoped to store membership. Admin visibility is
-- platform-scoped. Payout-control behavior is not approved by this query.

-- 9. Storage policy inventory for menu item images.
select
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and (
    policyname ilike '%menu_item%'
    or policyname ilike '%menu-item%'
    or qual::text ilike '%menu-item-images%'
    or with_check::text ilike '%menu-item-images%'
  )
order by policyname;

-- Expected:
-- Public read is allowed for menu item images. Merchant write policies must be
-- scoped by store membership and must not grant broad object mutation.

-- 10. Legacy unsafe RPC signature check.
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (
    pg_get_function_identity_arguments(p.oid) ilike '%actor_id%'
    or pg_get_function_identity_arguments(p.oid) ilike '%actor_type%'
  )
  and p.proname in (
    'create_customer_order',
    'set_customer_default_address',
    'delete_customer_address_with_default_ensure',
    'upsert_customer_review_with_store_projection',
    'update_order_status_with_audit',
    'update_store_settings_with_audit',
    'update_store_profile_with_audit'
  )
order by p.proname, args;

-- Expected:
-- No rows for legacy hardened RPCs that previously trusted caller-supplied
-- actor_id or actor_type.

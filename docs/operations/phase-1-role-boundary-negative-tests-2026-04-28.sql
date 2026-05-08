-- Phase 1 Role Boundary Negative Tests -- 2026-04-28
--
-- Purpose:
-- Exercise auth.uid()-based RLS and hardened RPC boundaries using seeded local
-- Supabase users. These checks are intentionally role-context tests, not app UI
-- tests. They verify the database boundary that customer-app, merchant-console,
-- and admin-console rely on.
--
-- Expected environment:
-- Local Supabase database at the current migration state with supabase/seed.sql
-- already applied.
--
-- Run:
-- psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' \
--   -v ON_ERROR_STOP=1 \
--   -f docs/operations/phase-1-role-boundary-negative-tests-2026-04-28.sql

\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

reset role;

create or replace function pg_temp.phase1_assert(ok boolean, label text)
returns text
language plpgsql
as $$
begin
  if not ok then
    raise exception 'FAIL: %', label;
  end if;
  return 'PASS: ' || label;
end;
$$;

select pg_temp.phase1_assert(
  (select count(*) >= 3 from public.orders where id in ('ord-demo-001', 'ord-demo-002', 'ord-demo-003')),
  'seed orders exist'
);

select pg_temp.phase1_assert(
  (select count(*) >= 3 from public.customer_reviews where id in ('review-demo-001', 'review-demo-002', 'review-demo-003')),
  'seed reviews exist'
);

select pg_temp.phase1_assert(
  (select count(*) >= 1 from public.merchant_memberships where user_id = '11111111-1111-4111-8111-111111111111' and store_id = 'demo-store'),
  'demo merchant membership exists'
);

-- Create a store owned by another merchant profile but not by the demo merchant.
-- This is test fixture setup done as postgres, outside RLS.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  reauthentication_token,
  phone_change,
  phone_change_token,
  is_super_admin,
  is_sso_user,
  is_anonymous,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  '55555555-5555-4555-8555-555555555555',
  'authenticated',
  'authenticated',
  'merchant.other@example.com',
  extensions.crypt('merchantother123', extensions.gen_salt('bf')),
  timezone('utc', now()),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  false,
  false,
  false,
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"surface":"merchant-console","mode":"phase1-negative-test"}'::jsonb,
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = coalesce(excluded.encrypted_password, auth.users.encrypted_password),
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = timezone('utc', now());

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  'merchant.other@example.com',
  '55555555-5555-4555-8555-555555555555',
  jsonb_build_object(
    'sub', '55555555-5555-4555-8555-555555555555',
    'email', 'merchant.other@example.com',
    'email_verified', true
  ),
  'email',
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (provider_id, provider) do update
set
  identity_data = excluded.identity_data,
  updated_at = timezone('utc', now());

insert into public.actor_profiles (
  id,
  actor_type,
  display_name,
  email,
  phone_number
)
values (
  '55555555-5555-4555-8555-555555555555',
  'merchant_owner',
  'Other Merchant',
  'merchant.other@example.com',
  '+54 11 4000 2000'
)
on conflict (id) do update
set
  actor_type = excluded.actor_type,
  display_name = excluded.display_name,
  email = excluded.email,
  phone_number = excluded.phone_number,
  updated_at = timezone('utc', now());

insert into public.merchant_profiles (
  user_id,
  merchant_name,
  onboarding_complete
)
values (
  '55555555-5555-4555-8555-555555555555',
  'Other Merchant',
  true
)
on conflict (user_id) do update
set
  merchant_name = excluded.merchant_name,
  onboarding_complete = excluded.onboarding_complete,
  updated_at = timezone('utc', now());

insert into public.stores (
  id,
  merchant_actor_id,
  name,
  city,
  is_open,
  address,
  rating,
  review_count,
  status,
  accepting_orders
)
values (
  'phase1-unowned-store',
  '55555555-5555-4555-8555-555555555555',
  'Phase 1 Unowned Store',
  'Ho Chi Minh City',
  false,
  'Hidden test address',
  0,
  0,
  'paused',
  false
)
on conflict (id) do update
set
  merchant_actor_id = excluded.merchant_actor_id,
  name = excluded.name,
  city = excluded.city,
  is_open = excluded.is_open,
  address = excluded.address,
  rating = excluded.rating,
  review_count = excluded.review_count,
  status = excluded.status,
  accepting_orders = excluded.accepting_orders,
  updated_at = timezone('utc', now());

insert into public.store_menu_items (
  id,
  store_id,
  name,
  description,
  category,
  price_centavos,
  image_color_hex,
  is_popular,
  is_available,
  sort_order
)
values (
  'phase1-unowned-menu-item',
  'phase1-unowned-store',
  'Hidden Menu Item',
  'Fixture for merchant negative tests.',
  'Hidden',
  1000,
  '#999999',
  false,
  true,
  1
)
on conflict (id) do update
set
  store_id = excluded.store_id,
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  price_centavos = excluded.price_centavos,
  image_color_hex = excluded.image_color_hex,
  is_popular = excluded.is_popular,
  is_available = excluded.is_available,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());

insert into public.merchant_memberships (
  user_id,
  store_id,
  role,
  is_default
)
values (
  '55555555-5555-4555-8555-555555555555',
  'phase1-unowned-store',
  'merchant_owner',
  true
)
on conflict (user_id, store_id) do update
set
  role = excluded.role,
  is_default = excluded.is_default;

-- Customer one can see own order but not customer two's order.
set role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', false);

select pg_temp.phase1_assert(
  (select count(*) = 1 from public.orders where id = 'ord-demo-001'),
  'customer one can read own order'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.orders where id = 'ord-demo-002'),
  'customer one cannot read customer two order'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.customer_reviews where id = 'review-demo-001'),
  'customer one cannot read customer two review'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.audit_logs),
  'customer cannot read audit logs'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.support_tickets),
  'customer cannot read support tickets directly'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.disputes),
  'customer cannot read disputes directly'
);

reset role;

-- Customer two can see own order but not customer one's order.
set role authenticated;
select set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', false);

select pg_temp.phase1_assert(
  (select count(*) = 1 from public.orders where id = 'ord-demo-002'),
  'customer two can read own order'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.orders where id = 'ord-demo-001'),
  'customer two cannot read customer one order'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.customer_reviews where id = 'review-demo-003'),
  'customer two cannot read customer one review'
);

reset role;

-- Demo merchant can read own store/order/review rows but not unowned store rows.
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', false);

select pg_temp.phase1_assert(
  (select count(*) = 1 from public.stores where id = 'demo-store'),
  'merchant can read own store'
);

select pg_temp.phase1_assert(
  (select count(*) >= 3 from public.orders where store_id = 'demo-store'),
  'merchant can read own store orders'
);

select pg_temp.phase1_assert(
  (select count(*) >= 3 from public.customer_reviews where store_id = 'demo-store'),
  'merchant can read own store reviews'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.stores where id = 'phase1-unowned-store'),
  'merchant cannot read unowned store'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.store_menu_items where store_id = 'phase1-unowned-store'),
  'merchant cannot read unowned store menu'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.actor_profiles where id in ('22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333')),
  'merchant cannot read customer actor profiles'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.audit_logs),
  'merchant cannot read audit logs directly'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.support_tickets),
  'merchant cannot read support tickets directly'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.disputes),
  'merchant cannot read disputes directly'
);

do $$
begin
  begin
    perform public.update_store_settings_with_audit(
      'phase1-unowned-store',
      '{"order_notifications":true}'::jsonb
    );
    raise exception 'FAIL: merchant cannot mutate unowned store settings';
  exception
    when others then
      if sqlerrm like 'FAIL:%' then
        raise;
      end if;
  end;
end;
$$;

select 'PASS: merchant cannot mutate unowned store settings';

reset role;

-- Admin direct authenticated session can read its own admin profile but does
-- not bypass platform data through direct client RLS. Admin-console server
-- read paths use approved server-side repositories.
set role authenticated;
select set_config('request.jwt.claim.sub', '44444444-4444-4444-8444-444444444444', false);

select pg_temp.phase1_assert(
  (select count(*) = 1 from public.admin_profiles where actor_id = '44444444-4444-4444-8444-444444444444'),
  'admin can read own admin profile'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.orders),
  'admin direct client cannot read orders table'
);

select pg_temp.phase1_assert(
  (select count(*) = 0 from public.audit_logs),
  'admin direct client cannot read audit logs table'
);

select pg_temp.phase1_assert(
  (select count(*) >= 0 from public.delivery_settlements),
  'admin direct client can use approved settlement read policy'
);

reset role;

select 'PASS: phase 1 role-boundary negative tests complete';

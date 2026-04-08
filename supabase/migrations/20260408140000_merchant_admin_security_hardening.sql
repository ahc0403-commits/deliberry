-- Merchant/Admin Security Hardening Migration
-- Date: 2026-04-08
-- Addresses: audit items F1, F2 (merchant RPCs trust caller-supplied actor_id)
-- Pattern: same as customer hardening migration 20260408113000

-- ============================================================
-- 1. Enable RLS on remaining unprotected tables
-- ============================================================

alter table if exists public.merchant_profiles enable row level security;
alter table if exists public.admin_profiles enable row level security;
alter table if exists public.merchant_memberships enable row level security;
alter table if exists public.audit_logs enable row level security;
alter table if exists public.disputes enable row level security;
alter table if exists public.support_tickets enable row level security;

-- merchant_profiles: merchants can read/update own profile
drop policy if exists merchant_profiles_self_read on public.merchant_profiles;
create policy merchant_profiles_self_read
on public.merchant_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists merchant_profiles_self_update on public.merchant_profiles;
create policy merchant_profiles_self_update
on public.merchant_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- admin_profiles: admins can read own profile
drop policy if exists admin_profiles_self_read on public.admin_profiles;
create policy admin_profiles_self_read
on public.admin_profiles
for select
to authenticated
using (actor_id = auth.uid());

-- merchant_memberships: merchants can read own memberships
drop policy if exists merchant_memberships_self_read on public.merchant_memberships;
create policy merchant_memberships_self_read
on public.merchant_memberships
for select
to authenticated
using (user_id = auth.uid());

-- audit_logs: service_role only (no direct authenticated access)
drop policy if exists audit_logs_service_role_all on public.audit_logs;
create policy audit_logs_service_role_all
on public.audit_logs
for all
to service_role
using (true)
with check (true);

-- disputes: service_role only for now
drop policy if exists disputes_service_role_all on public.disputes;
create policy disputes_service_role_all
on public.disputes
for all
to service_role
using (true)
with check (true);

-- support_tickets: service_role only for now
drop policy if exists support_tickets_service_role_all on public.support_tickets;
create policy support_tickets_service_role_all
on public.support_tickets
for all
to service_role
using (true)
with check (true);

-- merchant-scoped order reads: merchants can read orders for their stores
drop policy if exists merchant_orders_read_store on public.orders;
create policy merchant_orders_read_store
on public.orders
for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = orders.store_id
  )
);

-- ============================================================
-- 2. Hardened assert_merchant_store_membership (auth.uid())
-- ============================================================

create or replace function public.assert_merchant_store_membership(
  p_store_id text,
  p_required_role text default null
)
returns record
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_membership record;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  select user_id, store_id, role
  into v_membership
  from public.merchant_memberships
  where user_id = v_actor_id
    and store_id = p_store_id;

  if not found then
    raise exception 'Merchant % does not have access to store %', v_actor_id, p_store_id;
  end if;

  if p_required_role is not null and v_membership.role <> p_required_role then
    raise exception 'Merchant % does not have % access to store %', v_actor_id, p_required_role, p_store_id;
  end if;

  return v_membership;
end;
$$;

-- ============================================================
-- 3. Hardened get_merchant_dashboard_kpi_snapshot (with auth check)
-- ============================================================

create or replace function public.get_merchant_dashboard_kpi_snapshot(
  p_store_id text
)
returns table (
  active_order_count integer,
  ready_order_count integer,
  gross_revenue_centavos bigint,
  non_cancelled_order_count integer,
  review_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  if not exists (
    select 1
    from public.merchant_memberships
    where user_id = v_actor_id
      and store_id = p_store_id
  ) then
    raise exception 'Merchant % does not have access to store %', v_actor_id, p_store_id;
  end if;

  return query
  with scoped_orders as (
    select *
    from public.orders
    where orders.store_id = p_store_id
  )
  select
    count(*) filter (
      where status in ('pending', 'confirmed', 'preparing', 'ready', 'in_transit')
    )::integer as active_order_count,
    count(*) filter (
      where status = 'ready'
    )::integer as ready_order_count,
    coalesce(
      sum(total_centavos) filter (
        where status <> 'cancelled'
      ),
      0
    )::bigint as gross_revenue_centavos,
    count(*) filter (
      where status <> 'cancelled'
    )::integer as non_cancelled_order_count,
    (
      select count(*)::integer
      from public.customer_reviews
      where customer_reviews.store_id = p_store_id
    ) as review_count
  from scoped_orders;
end;
$$;

-- ============================================================
-- 4. Hardened update_order_status_with_audit (auth.uid())
-- ============================================================

create or replace function public.update_order_status_with_audit(
  p_order_id text,
  p_store_id text,
  p_next_status text
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_membership record;
  v_before_state public.orders%rowtype;
  v_after_state public.orders%rowtype;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  select user_id, store_id, role
  into v_membership
  from public.merchant_memberships
  where user_id = v_actor_id
    and store_id = p_store_id;

  if not found then
    raise exception 'Merchant % does not have access to store %', v_actor_id, p_store_id;
  end if;

  select *
  into v_before_state
  from public.orders
  where id = p_order_id
    and store_id = p_store_id
  for update;

  if not found then
    raise exception 'Order % was not found for store %', p_order_id, p_store_id;
  end if;

  if not (
    (v_before_state.status = 'pending' and p_next_status in ('confirmed', 'preparing', 'cancelled'))
    or (v_before_state.status = 'confirmed' and p_next_status = 'preparing')
    or (v_before_state.status = 'preparing' and p_next_status = 'ready')
    or (v_before_state.status = 'ready' and p_next_status = 'in_transit')
    or (v_before_state.status = 'in_transit' and p_next_status = 'delivered')
    or (v_before_state.status = p_next_status)
  ) then
    raise exception 'Invalid merchant order transition from % to %', v_before_state.status, p_next_status;
  end if;

  update public.orders
  set
    status = p_next_status,
    confirmed_at = case when p_next_status = 'confirmed' then timezone('utc', now()) else confirmed_at end,
    preparing_at = case when p_next_status = 'preparing' then timezone('utc', now()) else preparing_at end,
    ready_at = case when p_next_status = 'ready' then timezone('utc', now()) else ready_at end,
    picked_up_at = case when p_next_status = 'in_transit' then timezone('utc', now()) else picked_up_at end,
    delivered_at = case when p_next_status = 'delivered' then timezone('utc', now()) else delivered_at end,
    cancelled_at = case when p_next_status = 'cancelled' then timezone('utc', now()) else cancelled_at end
  where id = p_order_id
    and store_id = p_store_id
  returning *
  into v_after_state;

  insert into public.audit_logs (
    id, actor_id, actor_type, action, resource_type, resource_id,
    timestamp_utc, before_state, after_state
  )
  values (
    gen_random_uuid()::text,
    v_actor_id,
    v_membership.role,
    'merchant_order_status_updated',
    'Order',
    p_order_id,
    timezone('utc', now()),
    to_jsonb(v_before_state),
    to_jsonb(v_after_state)
  );

  return v_after_state;
end;
$$;

-- ============================================================
-- 5. Hardened update_store_settings_with_audit (auth.uid())
-- ============================================================

create or replace function public.update_store_settings_with_audit(
  p_store_id text,
  p_settings_json jsonb
)
returns public.stores
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_membership record;
  v_before_state public.stores%rowtype;
  v_after_state public.stores%rowtype;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  select user_id, store_id, role
  into v_membership
  from public.merchant_memberships
  where user_id = v_actor_id
    and store_id = p_store_id;

  if not found then
    raise exception 'Merchant % does not have access to store %', v_actor_id, p_store_id;
  end if;

  select *
  into v_before_state
  from public.stores
  where id = p_store_id
  for update;

  if not found then
    raise exception 'Store % was not found.', p_store_id;
  end if;

  update public.stores
  set settings_json = coalesce(p_settings_json, '{}'::jsonb)
  where id = p_store_id
  returning *
  into v_after_state;

  insert into public.audit_logs (
    id, actor_id, actor_type, action, resource_type, resource_id,
    timestamp_utc, before_state, after_state
  )
  values (
    gen_random_uuid()::text,
    v_actor_id,
    v_membership.role,
    'merchant_store_settings_updated',
    'Store',
    p_store_id,
    timezone('utc', now()),
    to_jsonb(v_before_state),
    to_jsonb(v_after_state)
  );

  return v_after_state;
end;
$$;

-- ============================================================
-- 6. Hardened update_store_profile_with_audit (auth.uid())
-- ============================================================

create or replace function public.update_store_profile_with_audit(
  p_store_id text,
  p_name text,
  p_cuisine_type text,
  p_phone text,
  p_email text,
  p_address text,
  p_delivery_radius text,
  p_avg_prep_time text,
  p_accepting_orders boolean,
  p_hours_json jsonb
)
returns public.stores
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_membership record;
  v_before_state public.stores%rowtype;
  v_after_state public.stores%rowtype;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  select user_id, store_id, role
  into v_membership
  from public.merchant_memberships
  where user_id = v_actor_id
    and store_id = p_store_id;

  if not found then
    raise exception 'Merchant % does not have access to store %', v_actor_id, p_store_id;
  end if;

  select *
  into v_before_state
  from public.stores
  where id = p_store_id
  for update;

  if not found then
    raise exception 'Store % was not found.', p_store_id;
  end if;

  update public.stores
  set
    name = p_name,
    cuisine_type = p_cuisine_type,
    phone = p_phone,
    email = p_email,
    address = p_address,
    delivery_radius = p_delivery_radius,
    avg_prep_time = p_avg_prep_time,
    accepting_orders = p_accepting_orders,
    status = case when p_accepting_orders then status else 'paused' end,
    hours_json = coalesce(p_hours_json, '[]'::jsonb)
  where id = p_store_id
  returning *
  into v_after_state;

  insert into public.audit_logs (
    id, actor_id, actor_type, action, resource_type, resource_id,
    timestamp_utc, before_state, after_state
  )
  values (
    gen_random_uuid()::text,
    v_actor_id,
    v_membership.role,
    'merchant_store_profile_updated',
    'Store',
    p_store_id,
    timezone('utc', now()),
    to_jsonb(v_before_state),
    to_jsonb(v_after_state)
  );

  return v_after_state;
end;
$$;

-- ============================================================
-- 7. Hardened set_merchant_default_store (auth.uid())
-- ============================================================

create or replace function public.set_merchant_default_store(
  p_store_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  if not exists (
    select 1
    from public.merchant_memberships
    where user_id = v_actor_id
      and store_id = p_store_id
  ) then
    raise exception 'Store % is not available to merchant %', p_store_id, v_actor_id;
  end if;

  update public.merchant_memberships
  set is_default = false
  where user_id = v_actor_id
    and is_default = true;

  update public.merchant_memberships
  set is_default = true
  where user_id = v_actor_id
    and store_id = p_store_id;

  if not found then
    raise exception 'Failed to assign default store % to merchant %', p_store_id, v_actor_id;
  end if;
end;
$$;

-- ============================================================
-- 8. Revoke public grants + re-grant to authenticated/service_role
-- ============================================================

revoke all on function public.assert_merchant_store_membership(text, text) from public;
revoke all on function public.get_merchant_dashboard_kpi_snapshot(text) from public;
revoke all on function public.update_order_status_with_audit(text, text, text) from public;
revoke all on function public.update_store_settings_with_audit(text, jsonb) from public;
revoke all on function public.update_store_profile_with_audit(text, text, text, text, text, text, text, text, boolean, jsonb) from public;
revoke all on function public.set_merchant_default_store(text) from public;

grant execute on function public.assert_merchant_store_membership(text, text) to authenticated, service_role;
grant execute on function public.get_merchant_dashboard_kpi_snapshot(text) to authenticated, service_role;
grant execute on function public.update_order_status_with_audit(text, text, text) to authenticated, service_role;
grant execute on function public.update_store_settings_with_audit(text, jsonb) to authenticated, service_role;
grant execute on function public.update_store_profile_with_audit(text, text, text, text, text, text, text, text, boolean, jsonb) to authenticated, service_role;
grant execute on function public.set_merchant_default_store(text) to authenticated, service_role;

-- ============================================================
-- 9. Drop old function signatures that accepted caller-supplied identity
-- ============================================================

drop function if exists public.assert_merchant_store_membership(uuid, text, text);
drop function if exists public.update_order_status_with_audit(text, text, text, uuid, text);
drop function if exists public.update_store_settings_with_audit(text, uuid, text, jsonb);
drop function if exists public.update_store_profile_with_audit(text, uuid, text, text, text, text, text, text, text, text, boolean, jsonb);
drop function if exists public.set_merchant_default_store(uuid, text);

alter table if exists public.stores
  add column if not exists address text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists rating numeric(3,2),
  add column if not exists review_count integer not null default 0,
  add column if not exists status text not null default 'open'
    check (status in ('open', 'closed', 'paused')),
  add column if not exists cuisine_type text,
  add column if not exists hours_json jsonb not null default '[]'::jsonb,
  add column if not exists delivery_radius text,
  add column if not exists avg_prep_time text,
  add column if not exists accepting_orders boolean not null default true,
  add column if not exists settings_json jsonb not null default '{}'::jsonb;

update public.stores
set address = coalesce(address, city)
where address is null;

update public.stores
set status = case when is_open then 'open' else 'closed' end
where status is null;

update public.stores
set accepting_orders = coalesce(accepting_orders, is_open)
where accepting_orders is distinct from coalesce(accepting_orders, is_open);

alter table if exists public.orders
  add column if not exists order_number text,
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists delivery_address text,
  add column if not exists notes text,
  add column if not exists subtotal_centavos integer not null default 0,
  add column if not exists delivery_fee_centavos integer not null default 0,
  add column if not exists estimated_delivery_at timestamptz,
  add column if not exists line_items_summary jsonb not null default '[]'::jsonb;

update public.orders
set order_number = coalesce(order_number, id)
where order_number is null;

update public.orders
set customer_name = coalesce(customer_name, 'Customer')
where customer_name is null;

update public.orders
set delivery_address = coalesce(delivery_address, 'Address unavailable')
where delivery_address is null;

update public.orders
set estimated_delivery_at = coalesce(estimated_delivery_at, created_at + interval '30 minutes')
where estimated_delivery_at is null;

create table if not exists public.customer_reviews (
  id text primary key,
  order_id text not null references public.orders (id) on delete restrict,
  store_id text not null references public.stores (id) on delete restrict,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  response_text text,
  response_created_at timestamptz,
  response_actor_id uuid references public.actor_profiles (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_customer_reviews_updated_at on public.customer_reviews;
create trigger set_customer_reviews_updated_at
before update on public.customer_reviews
for each row execute function public.set_updated_at();

create index if not exists customer_reviews_store_created_idx
on public.customer_reviews (store_id, created_at desc, id desc);

create or replace function public.assert_merchant_store_membership(
  p_actor_id uuid,
  p_store_id text,
  p_actor_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.merchant_memberships
    where user_id = p_actor_id
      and store_id = p_store_id
      and role = p_actor_type
  ) then
    raise exception 'Merchant % does not have % access to store %', p_actor_id, p_actor_type, p_store_id;
  end if;
end;
$$;

alter table public.orders
add column if not exists status text default 'pending';

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
language sql
security definer
set search_path = public
as $$
  with scoped_orders as (
    select *
    from public.orders
    where store_id = p_store_id
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
      where store_id = p_store_id
    ) as review_count
  from scoped_orders

$$;

create or replace function public.update_order_status_with_audit(
  p_order_id text,
  p_store_id text,
  p_next_status text,
  p_actor_id uuid,
  p_actor_type text
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before_state public.orders%rowtype;
  v_after_state public.orders%rowtype;
begin
  perform public.assert_merchant_store_membership(p_actor_id, p_store_id, p_actor_type);

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
    id,
    actor_id,
    actor_type,
    action,
    resource_type,
    resource_id,
    timestamp_utc,
    before_state,
    after_state
  )
  values (
    gen_random_uuid()::text,
    p_actor_id,
    p_actor_type,
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

create or replace function public.update_store_settings_with_audit(
  p_store_id text,
  p_actor_id uuid,
  p_actor_type text,
  p_settings_json jsonb
)
returns public.stores
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before_state public.stores%rowtype;
  v_after_state public.stores%rowtype;
begin
  perform public.assert_merchant_store_membership(p_actor_id, p_store_id, p_actor_type);

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
    id,
    actor_id,
    actor_type,
    action,
    resource_type,
    resource_id,
    timestamp_utc,
    before_state,
    after_state
  )
  values (
    gen_random_uuid()::text,
    p_actor_id,
    p_actor_type,
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

create or replace function public.update_store_profile_with_audit(
  p_store_id text,
  p_actor_id uuid,
  p_actor_type text,
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
  v_before_state public.stores%rowtype;
  v_after_state public.stores%rowtype;
begin
  perform public.assert_merchant_store_membership(p_actor_id, p_store_id, p_actor_type);

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
    id,
    actor_id,
    actor_type,
    action,
    resource_type,
    resource_id,
    timestamp_utc,
    before_state,
    after_state
  )
  values (
    gen_random_uuid()::text,
    p_actor_id,
    p_actor_type,
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

grant execute on function public.get_merchant_dashboard_kpi_snapshot(text) to authenticated, service_role;
grant execute on function public.update_order_status_with_audit(text, text, text, uuid, text) to authenticated, service_role;
grant execute on function public.update_store_settings_with_audit(text, uuid, text, jsonb) to authenticated, service_role;
grant execute on function public.update_store_profile_with_audit(text, uuid, text, text, text, text, text, text, text, text, boolean, jsonb) to authenticated, service_role;

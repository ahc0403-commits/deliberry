alter table if exists public.actor_profiles
  add column if not exists preferences_json jsonb not null default '{}'::jsonb;

create table if not exists public.customer_addresses (
  id text primary key,
  customer_actor_id uuid not null references public.actor_profiles (id) on delete restrict,
  label text not null,
  street text not null,
  detail text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_customer_addresses_updated_at on public.customer_addresses;
create trigger set_customer_addresses_updated_at
before update on public.customer_addresses
for each row execute function public.set_updated_at();

create index if not exists customer_addresses_actor_created_idx
on public.customer_addresses (customer_actor_id, created_at asc, id asc);

create unique index if not exists customer_addresses_single_default_idx
on public.customer_addresses (customer_actor_id)
where is_default = true;

alter table if exists public.orders
  add column if not exists service_fee_centavos integer not null default 149;

update public.orders
set service_fee_centavos = 149
where service_fee_centavos is null;

alter table if exists public.actor_profiles enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.customer_reviews enable row level security;
alter table if exists public.customer_addresses enable row level security;
alter table if exists public.stores enable row level security;
alter table if exists public.store_menu_items enable row level security;

drop policy if exists actor_profiles_self_select on public.actor_profiles;
create policy actor_profiles_self_select
on public.actor_profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists actor_profiles_self_insert_customer on public.actor_profiles;
create policy actor_profiles_self_insert_customer
on public.actor_profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and actor_type = 'customer'
);

drop policy if exists actor_profiles_self_update_customer on public.actor_profiles;
create policy actor_profiles_self_update_customer
on public.actor_profiles
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and actor_type = 'customer'
);

drop policy if exists customer_orders_read_own on public.orders;
create policy customer_orders_read_own
on public.orders
for select
to authenticated
using (customer_actor_id = auth.uid());

drop policy if exists customer_reviews_read_own on public.customer_reviews;
create policy customer_reviews_read_own
on public.customer_reviews
for select
to authenticated
using (customer_actor_id = auth.uid());

drop policy if exists customer_addresses_read_own on public.customer_addresses;
create policy customer_addresses_read_own
on public.customer_addresses
for select
to authenticated
using (customer_actor_id = auth.uid());

drop policy if exists customer_addresses_insert_own on public.customer_addresses;
create policy customer_addresses_insert_own
on public.customer_addresses
for insert
to authenticated
with check (customer_actor_id = auth.uid());

drop policy if exists customer_addresses_update_own on public.customer_addresses;
create policy customer_addresses_update_own
on public.customer_addresses
for update
to authenticated
using (customer_actor_id = auth.uid())
with check (customer_actor_id = auth.uid());

drop policy if exists customer_addresses_delete_own on public.customer_addresses;
create policy customer_addresses_delete_own
on public.customer_addresses
for delete
to authenticated
using (customer_actor_id = auth.uid());

drop policy if exists customer_store_catalog_public_read on public.stores;
create policy customer_store_catalog_public_read
on public.stores
for select
to anon, authenticated
using (accepting_orders = true and status = 'open');

drop policy if exists customer_store_menu_public_read on public.store_menu_items;
create policy customer_store_menu_public_read
on public.store_menu_items
for select
to anon, authenticated
using (
  is_available = true
  and exists (
    select 1
    from public.stores
    where public.stores.id = public.store_menu_items.store_id
      and public.stores.accepting_orders = true
      and public.stores.status = 'open'
  )
);

create or replace function public.set_customer_default_address(
  p_address_id text
)
returns setof public.customer_addresses
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

  update public.customer_addresses
  set is_default = false, updated_at = timezone('utc', now())
  where customer_actor_id = v_actor_id
    and is_default = true
    and id <> p_address_id;

  update public.customer_addresses
  set is_default = true, updated_at = timezone('utc', now())
  where customer_actor_id = v_actor_id
    and id = p_address_id;

  return query
    select *
    from public.customer_addresses
    where customer_actor_id = v_actor_id
    order by is_default desc, created_at asc, id asc
    limit 20;
end;
$$;

create or replace function public.delete_customer_address_with_default_ensure(
  p_address_id text
)
returns setof public.customer_addresses
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

  delete from public.customer_addresses
  where customer_actor_id = v_actor_id
    and id = p_address_id;

  if not exists (
    select 1
    from public.customer_addresses
    where customer_actor_id = v_actor_id
      and is_default = true
  ) then
    update public.customer_addresses
    set is_default = true, updated_at = timezone('utc', now())
    where id = (
      select id
      from public.customer_addresses
      where customer_actor_id = v_actor_id
      order by created_at asc, id asc
      limit 1
    );
  end if;

  return query
    select *
    from public.customer_addresses
    where customer_actor_id = v_actor_id
    order by is_default desc, created_at asc, id asc
    limit 20;
end;
$$;

create or replace function public.upsert_customer_review_with_store_projection(
  p_order_id text,
  p_rating integer,
  p_review_text text,
  p_tags_json jsonb
)
returns public.customer_reviews
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_store_id text;
  v_existing_id text;
  v_row public.customer_reviews%rowtype;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  select store_id
  into v_store_id
  from public.orders
  where id = p_order_id
    and customer_actor_id = v_actor_id;

  if v_store_id is null then
    raise exception 'Order % was not found for the authenticated customer', p_order_id;
  end if;

  select id
  into v_existing_id
  from public.customer_reviews
  where order_id = p_order_id
    and customer_actor_id = v_actor_id;

  if v_existing_id is null then
    insert into public.customer_reviews (
      id,
      order_id,
      store_id,
      customer_actor_id,
      rating,
      review_text,
      tags_json
    )
    values (
      gen_random_uuid()::text,
      p_order_id,
      v_store_id,
      v_actor_id,
      p_rating,
      p_review_text,
      coalesce(p_tags_json, '[]'::jsonb)
    )
    returning *
    into v_row;
  else
    update public.customer_reviews
    set
      rating = p_rating,
      review_text = p_review_text,
      tags_json = coalesce(p_tags_json, '[]'::jsonb)
    where id = v_existing_id
    returning *
    into v_row;
  end if;

  update public.stores
  set
    review_count = (
      select count(*)::integer
      from public.customer_reviews
      where store_id = v_store_id
    ),
    rating = (
      select round(avg(rating)::numeric, 2)
      from public.customer_reviews
      where store_id = v_store_id
    )
  where id = v_store_id;

  return v_row;
end;
$$;

create or replace function public.create_customer_order(
  p_store_id text,
  p_payment_method text,
  p_delivery_address text,
  p_notes text,
  p_line_items jsonb,
  p_promo_code text default null,
  p_estimated_delivery_at timestamptz default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_profile public.actor_profiles%rowtype;
  v_order public.orders%rowtype;
  v_subtotal_centavos integer := 0;
  v_item_count integer := 0;
  v_delivery_fee_centavos integer := 299;
  v_service_fee_centavos integer := 149;
  v_discount_centavos integer := 0;
  v_total_centavos integer := 0;
  v_order_number text;
  v_requested_count integer := 0;
  v_validated_count integer := 0;
  v_line_items_summary jsonb := '[]'::jsonb;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  if p_payment_method not in ('cash', 'card', 'digital_wallet') then
    raise exception 'Unsupported payment method %', p_payment_method;
  end if;

  if p_delivery_address is null or btrim(p_delivery_address) = '' then
    raise exception 'Delivery address is required';
  end if;

  if jsonb_typeof(coalesce(p_line_items, '[]'::jsonb)) <> 'array' then
    raise exception 'Line items payload must be a JSON array';
  end if;

  if not exists (
    select 1
    from public.stores
    where id = p_store_id
      and accepting_orders = true
      and status = 'open'
  ) then
    raise exception 'Store % is not accepting orders', p_store_id;
  end if;

  insert into public.actor_profiles (
    id,
    actor_type,
    display_name,
    email,
    phone_number
  )
  values (
    v_actor_id,
    'customer',
    coalesce(nullif(auth.jwt() ->> 'display_name', ''), 'Customer'),
    nullif(auth.jwt() ->> 'email', ''),
    nullif(auth.jwt() ->> 'phone', '')
  )
  on conflict (id) do nothing;

  select *
  into v_actor_profile
  from public.actor_profiles
  where id = v_actor_id;

  with requested as (
    select
      btrim(coalesce(line.menu_item_id, '')) as menu_item_id,
      greatest(coalesce(line.quantity, 0), 0)::integer as quantity,
      case
        when jsonb_typeof(coalesce(line.modifiers, '[]'::jsonb)) = 'array'
          then coalesce(line.modifiers, '[]'::jsonb)
        else '[]'::jsonb
      end as modifiers
    from jsonb_to_recordset(coalesce(p_line_items, '[]'::jsonb)) as line(
      menu_item_id text,
      quantity integer,
      modifiers jsonb
    )
  ),
  filtered as (
    select *
    from requested
    where menu_item_id <> ''
      and quantity > 0
  ),
  validated as (
    select
      filtered.menu_item_id,
      filtered.quantity,
      filtered.modifiers,
      public.store_menu_items.name,
      public.store_menu_items.price_centavos
    from filtered
    join public.store_menu_items
      on public.store_menu_items.id = filtered.menu_item_id
     and public.store_menu_items.store_id = p_store_id
     and public.store_menu_items.is_available = true
  )
  select
    (select count(*)::integer from filtered),
    (select count(*)::integer from validated),
    coalesce(
      (select sum(validated.price_centavos * validated.quantity)::integer from validated),
      0
    ),
    coalesce(
      (select sum(validated.quantity)::integer from validated),
      0
    ),
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'menu_item_id', validated.menu_item_id,
            'name', validated.name,
            'quantity', validated.quantity,
            'unit_price_centavos', validated.price_centavos,
            'modifiers', validated.modifiers
          )
          order by validated.menu_item_id
        )
        from validated
      ),
      '[]'::jsonb
    )
  into
    v_requested_count,
    v_validated_count,
    v_subtotal_centavos,
    v_item_count,
    v_line_items_summary;

  if v_requested_count = 0 then
    raise exception 'At least one valid line item is required';
  end if;

  if v_validated_count <> v_requested_count then
    raise exception 'One or more requested line items are unavailable';
  end if;

  if upper(coalesce(p_promo_code, '')) = 'SAVE5' then
    v_discount_centavos := least(500, v_subtotal_centavos);
  end if;

  v_total_centavos :=
    v_subtotal_centavos
    + v_delivery_fee_centavos
    + v_service_fee_centavos
    - v_discount_centavos;

  v_order_number :=
    '#' || lpad(((extract(epoch from timezone('utc', now()))::bigint) % 100000)::text, 5, '0');

  insert into public.orders (
    id,
    order_number,
    customer_actor_id,
    store_id,
    customer_name,
    customer_phone,
    status,
    payment_status,
    payment_method,
    total_centavos,
    currency,
    subtotal_centavos,
    delivery_fee_centavos,
    service_fee_centavos,
    delivery_address,
    notes,
    estimated_delivery_at,
    line_items_summary
  )
  values (
    gen_random_uuid()::text,
    v_order_number,
    v_actor_id,
    p_store_id,
    coalesce(nullif(v_actor_profile.display_name, ''), 'Customer'),
    coalesce(v_actor_profile.phone_number, nullif(auth.jwt() ->> 'phone', '')),
    'pending',
    'pending',
    p_payment_method,
    v_total_centavos,
    'ARS',
    v_subtotal_centavos,
    v_delivery_fee_centavos,
    v_service_fee_centavos,
    btrim(p_delivery_address),
    btrim(coalesce(p_notes, '')),
    coalesce(p_estimated_delivery_at, timezone('utc', now()) + interval '30 minutes'),
    v_line_items_summary
  )
  returning *
  into v_order;

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
    v_actor_id,
    'customer',
    'customer_order_created',
    'Order',
    v_order.id,
    timezone('utc', now()),
    null,
    to_jsonb(v_order)
  );

  return v_order;
end;
$$;

revoke all on function public.set_customer_default_address(text) from public;
revoke all on function public.delete_customer_address_with_default_ensure(text) from public;
revoke all on function public.upsert_customer_review_with_store_projection(text, integer, text, jsonb) from public;
revoke all on function public.create_customer_order(text, text, text, text, jsonb, text, timestamptz) from public;

grant execute on function public.set_customer_default_address(text) to authenticated, service_role;
grant execute on function public.delete_customer_address_with_default_ensure(text) to authenticated, service_role;
grant execute on function public.upsert_customer_review_with_store_projection(text, integer, text, jsonb) to authenticated, service_role;
grant execute on function public.create_customer_order(text, text, text, text, jsonb, text, timestamptz) to authenticated, service_role;

drop function if exists public.set_customer_default_address(uuid, text);
drop function if exists public.delete_customer_address_with_default_ensure(uuid, text);
drop function if exists public.upsert_customer_review_with_store_projection(text, uuid, integer, text, jsonb);

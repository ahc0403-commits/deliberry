-- ============================================================
-- Order mutation idempotency for customer create and merchant updates
-- ============================================================

create table if not exists public.order_mutation_idempotency (
  id text primary key default gen_random_uuid()::text,
  actor_id uuid not null references public.actor_profiles (id) on delete restrict,
  actor_type text not null check (
    actor_type in (
      'guest',
      'customer',
      'merchant_owner',
      'merchant_staff',
      'rider',
      'admin',
      'system'
    )
  ),
  operation text not null check (
    operation in (
      'customer_order_create',
      'merchant_order_status_update'
    )
  ),
  resource_scope text not null,
  idempotency_key uuid not null,
  request_fingerprint text not null,
  order_id text references public.orders (id) on delete restrict,
  response_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  check (
    (completed_at is null and response_snapshot is null)
    or (completed_at is not null and response_snapshot is not null)
  )
);

create unique index if not exists order_mutation_idempotency_actor_operation_key_idx
  on public.order_mutation_idempotency (actor_id, operation, idempotency_key);

create index if not exists order_mutation_idempotency_created_at_idx
  on public.order_mutation_idempotency (created_at desc);

alter table public.order_mutation_idempotency enable row level security;

drop function if exists public.create_customer_order(text, text, text, text, jsonb, text, timestamptz);

create or replace function public.create_customer_order(
  p_store_id text,
  p_payment_method text,
  p_delivery_address text,
  p_notes text,
  p_line_items jsonb,
  p_promo_code text default null,
  p_estimated_delivery_at timestamptz default null,
  p_idempotency_key text default null
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
  v_replayed_order public.orders%rowtype;
  v_existing_key_row public.order_mutation_idempotency%rowtype;
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
  v_request_fingerprint text;
  v_idempotency_key uuid;
  v_effective_estimated_delivery_at timestamptz;
  v_inserted_count integer := 0;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  if p_idempotency_key is null or btrim(p_idempotency_key) = '' then
    raise exception 'Idempotency key is required';
  end if;

  begin
    v_idempotency_key := btrim(p_idempotency_key)::uuid;
  exception
    when invalid_text_representation then
      raise exception 'Idempotency key must be a valid UUID';
  end;

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
          order by validated.menu_item_id, validated.quantity, validated.name
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

  v_effective_estimated_delivery_at :=
    coalesce(p_estimated_delivery_at, timezone('utc', now()) + interval '30 minutes');

  v_total_centavos :=
    v_subtotal_centavos
    + v_delivery_fee_centavos
    + v_service_fee_centavos
    - v_discount_centavos;

  v_request_fingerprint := md5(
    jsonb_build_object(
      'actor_id', v_actor_id,
      'store_id', p_store_id,
      'payment_method', p_payment_method,
      'delivery_address', btrim(p_delivery_address),
      'notes', btrim(coalesce(p_notes, '')),
      'promo_code', coalesce(p_promo_code, ''),
      'item_count', v_item_count,
      'estimated_delivery_at',
        case
          when p_estimated_delivery_at is null then to_jsonb('default'::text)
          else to_jsonb(p_estimated_delivery_at)
        end,
      'line_items', v_line_items_summary
    )::text
  );

  insert into public.order_mutation_idempotency (
    actor_id,
    actor_type,
    operation,
    resource_scope,
    idempotency_key,
    request_fingerprint
  )
  values (
    v_actor_id,
    'customer',
    'customer_order_create',
    p_store_id,
    v_idempotency_key,
    v_request_fingerprint
  )
  on conflict (actor_id, operation, idempotency_key) do nothing;

  get diagnostics v_inserted_count = row_count;

  if v_inserted_count = 0 then
    select *
    into v_existing_key_row
    from public.order_mutation_idempotency
    where actor_id = v_actor_id
      and operation = 'customer_order_create'
      and idempotency_key = v_idempotency_key;

    if not found then
      raise exception 'Idempotent mutation could not be loaded';
    end if;

    if v_existing_key_row.request_fingerprint <> v_request_fingerprint then
      raise exception 'Idempotency key was already used for a different order request';
    end if;

    if v_existing_key_row.completed_at is null or v_existing_key_row.response_snapshot is null then
      raise exception 'Idempotent mutation is already in progress';
    end if;

    select *
    into v_replayed_order
    from jsonb_populate_record(null::public.orders, v_existing_key_row.response_snapshot);

    return v_replayed_order;
  end if;

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
    v_effective_estimated_delivery_at,
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

  update public.order_mutation_idempotency
  set
    order_id = v_order.id,
    response_snapshot = to_jsonb(v_order),
    completed_at = timezone('utc', now())
  where actor_id = v_actor_id
    and operation = 'customer_order_create'
    and idempotency_key = v_idempotency_key;

  return v_order;
end;
$$;

drop function if exists public.update_order_status_with_audit(text, text, text);

create or replace function public.update_order_status_with_audit(
  p_order_id text,
  p_store_id text,
  p_next_status text,
  p_idempotency_key text
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
  v_replayed_order public.orders%rowtype;
  v_existing_key_row public.order_mutation_idempotency%rowtype;
  v_request_fingerprint text;
  v_idempotency_key uuid;
  v_inserted_count integer := 0;
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  if p_idempotency_key is null or btrim(p_idempotency_key) = '' then
    raise exception 'Idempotency key is required';
  end if;

  begin
    v_idempotency_key := btrim(p_idempotency_key)::uuid;
  exception
    when invalid_text_representation then
      raise exception 'Idempotency key must be a valid UUID';
  end;

  select user_id, store_id, role
  into v_membership
  from public.merchant_memberships
  where user_id = v_actor_id
    and store_id = p_store_id;

  if not found then
    raise exception 'Merchant % does not have access to store %', v_actor_id, p_store_id;
  end if;

  v_request_fingerprint := md5(
    jsonb_build_object(
      'actor_id', v_actor_id,
      'store_id', p_store_id,
      'order_id', p_order_id,
      'next_status', p_next_status
    )::text
  );

  insert into public.order_mutation_idempotency (
    actor_id,
    actor_type,
    operation,
    resource_scope,
    idempotency_key,
    request_fingerprint
  )
  values (
    v_actor_id,
    v_membership.role,
    'merchant_order_status_update',
    p_order_id,
    v_idempotency_key,
    v_request_fingerprint
  )
  on conflict (actor_id, operation, idempotency_key) do nothing;

  get diagnostics v_inserted_count = row_count;

  if v_inserted_count = 0 then
    select *
    into v_existing_key_row
    from public.order_mutation_idempotency
    where actor_id = v_actor_id
      and operation = 'merchant_order_status_update'
      and idempotency_key = v_idempotency_key;

    if not found then
      raise exception 'Idempotent mutation could not be loaded';
    end if;

    if v_existing_key_row.request_fingerprint <> v_request_fingerprint then
      raise exception 'Idempotency key was already used for a different order status request';
    end if;

    if v_existing_key_row.completed_at is null or v_existing_key_row.response_snapshot is null then
      raise exception 'Idempotent mutation is already in progress';
    end if;

    select *
    into v_replayed_order
    from jsonb_populate_record(null::public.orders, v_existing_key_row.response_snapshot);

    return v_replayed_order;
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

  update public.order_mutation_idempotency
  set
    order_id = p_order_id,
    response_snapshot = to_jsonb(v_after_state),
    completed_at = timezone('utc', now())
  where actor_id = v_actor_id
    and operation = 'merchant_order_status_update'
    and idempotency_key = v_idempotency_key;

  return v_after_state;
end;
$$;

revoke all on function public.create_customer_order(text, text, text, text, jsonb, text, timestamptz, text) from public;
grant execute on function public.create_customer_order(text, text, text, text, jsonb, text, timestamptz, text) to authenticated, service_role;

revoke all on function public.update_order_status_with_audit(text, text, text, text) from public;
grant execute on function public.update_order_status_with_audit(text, text, text, text) to authenticated, service_role;

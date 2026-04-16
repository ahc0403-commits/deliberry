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
  v_existing_key_row public.order_mutation_idempotency%rowtype;
  v_request_fingerprint text;
  v_replayed_order public.orders%rowtype;
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
    request_fingerprint,
    order_id
  )
  values (
    v_actor_id,
    v_membership.role,
    'merchant_order_status_update',
    p_order_id,
    v_idempotency_key,
    v_request_fingerprint,
    p_order_id
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
    or (v_before_state.status = 'confirmed' and p_next_status in ('preparing', 'cancelled'))
    or (v_before_state.status = 'preparing' and p_next_status in ('ready', 'cancelled'))
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

revoke all on function public.update_order_status_with_audit(text, text, text, text) from public;
grant execute on function public.update_order_status_with_audit(text, text, text, text) to authenticated, service_role;

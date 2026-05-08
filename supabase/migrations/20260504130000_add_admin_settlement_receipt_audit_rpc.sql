create table if not exists public.admin_settlement_receipt_idempotency (
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
  settlement_id uuid not null references public.delivery_settlements (id) on delete restrict,
  request_fingerprint text not null,
  settlement_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  check (
    (completed_at is null and settlement_snapshot is null)
    or (completed_at is not null and settlement_snapshot is not null)
  )
);

create unique index if not exists admin_settlement_receipt_idempotency_actor_settlement_fingerprint_idx
  on public.admin_settlement_receipt_idempotency (actor_id, settlement_id, request_fingerprint);

create index if not exists admin_settlement_receipt_idempotency_created_at_idx
  on public.admin_settlement_receipt_idempotency (created_at desc);

alter table public.admin_settlement_receipt_idempotency enable row level security;

create or replace function public.acknowledge_settlement_received_with_audit(
  p_settlement_id uuid
)
returns public.delivery_settlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_profile public.actor_profiles%rowtype;
  v_admin_profile public.admin_profiles%rowtype;
  v_before_state public.delivery_settlements%rowtype;
  v_after_state public.delivery_settlements%rowtype;
  v_existing_row public.admin_settlement_receipt_idempotency%rowtype;
  v_replayed_row public.delivery_settlements%rowtype;
  v_request_fingerprint text;
  v_inserted_count integer := 0;
begin
  if v_actor_id is null then
    raise exception 'Authenticated admin session is required';
  end if;

  select *
  into v_actor_profile
  from public.actor_profiles
  where id = v_actor_id
    and actor_type = 'admin';

  if not found then
    raise exception 'Actor % is not an admin profile', v_actor_id;
  end if;

  select *
  into v_admin_profile
  from public.admin_profiles
  where actor_id = v_actor_id;

  if not found then
    raise exception 'Admin profile % was not found', v_actor_id;
  end if;

  if v_admin_profile.role not in ('finance_admin', 'platform_admin') then
    raise exception 'Admin role % cannot acknowledge settlements', v_admin_profile.role;
  end if;

  v_request_fingerprint := md5(
    jsonb_build_object(
      'actor_id', v_actor_id,
      'admin_role', v_admin_profile.role,
      'settlement_id', p_settlement_id,
      'action', 'acknowledge_received'
    )::text
  );

  insert into public.admin_settlement_receipt_idempotency (
    actor_id,
    actor_type,
    settlement_id,
    request_fingerprint
  )
  values (
    v_actor_id,
    'admin',
    p_settlement_id,
    v_request_fingerprint
  )
  on conflict (actor_id, settlement_id, request_fingerprint) do nothing;

  get diagnostics v_inserted_count = row_count;

  if v_inserted_count = 0 then
    select *
    into v_existing_row
    from public.admin_settlement_receipt_idempotency
    where actor_id = v_actor_id
      and settlement_id = p_settlement_id
      and request_fingerprint = v_request_fingerprint;

    if not found then
      raise exception 'Idempotent settlement acknowledgment could not be loaded';
    end if;

    if v_existing_row.completed_at is null or v_existing_row.settlement_snapshot is null then
      raise exception 'Idempotent settlement acknowledgment is already in progress';
    end if;

    select *
    into v_replayed_row
    from jsonb_populate_record(null::public.delivery_settlements, v_existing_row.settlement_snapshot);

    return v_replayed_row;
  end if;

  select *
  into v_before_state
  from public.delivery_settlements
  where id = p_settlement_id
  for update;

  if not found then
    raise exception 'Settlement % was not found', p_settlement_id;
  end if;

  if v_before_state.status <> 'calculated' then
    raise exception 'Settlement % must be calculated before it can be acknowledged as received', p_settlement_id;
  end if;

  update public.delivery_settlements
  set
    status = 'received',
    received_at = coalesce(received_at, timezone('utc', now()))
  where id = p_settlement_id
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
    v_actor_id,
    'admin',
    'admin_settlement_received_acknowledged',
    'Settlement',
    p_settlement_id::text,
    timezone('utc', now()),
    to_jsonb(v_before_state),
    to_jsonb(v_after_state)
  );

  update public.admin_settlement_receipt_idempotency
  set
    settlement_snapshot = to_jsonb(v_after_state),
    completed_at = timezone('utc', now())
  where actor_id = v_actor_id
    and settlement_id = p_settlement_id
    and request_fingerprint = v_request_fingerprint;

  return v_after_state;
end;
$$;

revoke all on function public.acknowledge_settlement_received_with_audit(uuid) from public;
grant execute on function public.acknowledge_settlement_received_with_audit(uuid) to authenticated, service_role;

create table if not exists public.admin_dispute_status_idempotency (
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
  dispute_id text not null references public.disputes (id) on delete restrict,
  request_fingerprint text not null,
  dispute_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  check (
    (completed_at is null and dispute_snapshot is null)
    or (completed_at is not null and dispute_snapshot is not null)
  )
);

create unique index if not exists admin_dispute_status_idempotency_actor_dispute_fingerprint_idx
  on public.admin_dispute_status_idempotency (actor_id, dispute_id, request_fingerprint);

create index if not exists admin_dispute_status_idempotency_created_at_idx
  on public.admin_dispute_status_idempotency (created_at desc);

alter table public.admin_dispute_status_idempotency enable row level security;

create or replace function public.update_dispute_status_with_audit(
  p_dispute_id text,
  p_next_status text,
  p_admin_role text
)
returns public.disputes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_profile public.actor_profiles%rowtype;
  v_before_state public.disputes%rowtype;
  v_after_state public.disputes%rowtype;
  v_existing_row public.admin_dispute_status_idempotency%rowtype;
  v_replayed_row public.disputes%rowtype;
  v_request_fingerprint text;
  v_inserted_count integer := 0;
  v_normalized_status text := btrim(coalesce(p_next_status, ''));
  v_normalized_role text := btrim(coalesce(p_admin_role, ''));
begin
  if v_actor_id is null then
    raise exception 'Authenticated admin session is required';
  end if;

  if v_normalized_role not in ('platform_admin', 'operations_admin', 'support_admin') then
    raise exception 'Admin role % cannot mutate disputes', v_normalized_role;
  end if;

  if v_normalized_status not in ('open', 'investigating', 'escalated', 'resolved') then
    raise exception 'Dispute status % is not supported', v_normalized_status;
  end if;

  select *
  into v_actor_profile
  from public.actor_profiles
  where id = v_actor_id
    and actor_type = 'admin';

  if not found then
    raise exception 'Actor % is not an admin profile', v_actor_id;
  end if;

  v_request_fingerprint := md5(
    jsonb_build_object(
      'actor_id', v_actor_id,
      'actor_role', v_normalized_role,
      'dispute_id', p_dispute_id,
      'next_status', v_normalized_status
    )::text
  );

  insert into public.admin_dispute_status_idempotency (
    actor_id,
    actor_type,
    dispute_id,
    request_fingerprint
  )
  values (
    v_actor_id,
    'admin',
    p_dispute_id,
    v_request_fingerprint
  )
  on conflict (actor_id, dispute_id, request_fingerprint) do nothing;

  get diagnostics v_inserted_count = row_count;

  if v_inserted_count = 0 then
    select *
    into v_existing_row
    from public.admin_dispute_status_idempotency
    where actor_id = v_actor_id
      and dispute_id = p_dispute_id
      and request_fingerprint = v_request_fingerprint;

    if not found then
      raise exception 'Idempotent dispute transition could not be loaded';
    end if;

    if v_existing_row.completed_at is null or v_existing_row.dispute_snapshot is null then
      raise exception 'Idempotent dispute transition is already in progress';
    end if;

    select *
    into v_replayed_row
    from jsonb_populate_record(null::public.disputes, v_existing_row.dispute_snapshot);

    return v_replayed_row;
  end if;

  select *
  into v_before_state
  from public.disputes
  where id = p_dispute_id
  for update;

  if not found then
    raise exception 'Dispute % was not found', p_dispute_id;
  end if;

  if not (
    (v_before_state.status = 'open' and v_normalized_status in ('investigating', 'escalated'))
    or (v_before_state.status = 'investigating' and v_normalized_status in ('escalated', 'resolved'))
    or (v_before_state.status = 'escalated' and v_normalized_status = 'resolved')
  ) then
    raise exception 'Dispute transition % -> % is not allowed', v_before_state.status, v_normalized_status;
  end if;

  update public.disputes
  set status = v_normalized_status
  where id = p_dispute_id
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
    'admin_dispute_status_updated',
    'Dispute',
    p_dispute_id,
    timezone('utc', now()),
    to_jsonb(v_before_state),
    to_jsonb(v_after_state)
  );

  update public.admin_dispute_status_idempotency
  set
    dispute_snapshot = to_jsonb(v_after_state),
    completed_at = timezone('utc', now())
  where actor_id = v_actor_id
    and dispute_id = p_dispute_id
    and request_fingerprint = v_request_fingerprint;

  return v_after_state;
end;
$$;

revoke all on function public.update_dispute_status_with_audit(text, text, text) from public;
grant execute on function public.update_dispute_status_with_audit(text, text, text) to authenticated, service_role;

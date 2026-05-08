create table if not exists public.admin_support_ticket_status_idempotency (
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
  ticket_id text not null references public.support_tickets (id) on delete restrict,
  request_fingerprint text not null,
  ticket_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  check (
    (completed_at is null and ticket_snapshot is null)
    or (completed_at is not null and ticket_snapshot is not null)
  )
);

create unique index if not exists admin_support_ticket_status_idempotency_actor_ticket_fingerprint_idx
  on public.admin_support_ticket_status_idempotency (actor_id, ticket_id, request_fingerprint);

create index if not exists admin_support_ticket_status_idempotency_created_at_idx
  on public.admin_support_ticket_status_idempotency (created_at desc);

alter table public.admin_support_ticket_status_idempotency enable row level security;

create or replace function public.update_support_ticket_status_with_audit(
  p_ticket_id text,
  p_next_status text,
  p_admin_role text
)
returns public.support_tickets
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_profile public.actor_profiles%rowtype;
  v_before_state public.support_tickets%rowtype;
  v_after_state public.support_tickets%rowtype;
  v_existing_row public.admin_support_ticket_status_idempotency%rowtype;
  v_replayed_row public.support_tickets%rowtype;
  v_request_fingerprint text;
  v_inserted_count integer := 0;
  v_normalized_status text := btrim(coalesce(p_next_status, ''));
  v_normalized_role text := btrim(coalesce(p_admin_role, ''));
begin
  if v_actor_id is null then
    raise exception 'Authenticated admin session is required';
  end if;

  if v_normalized_role not in ('platform_admin', 'operations_admin', 'support_admin') then
    raise exception 'Admin role % cannot mutate support tickets', v_normalized_role;
  end if;

  if v_normalized_status not in ('open', 'in_progress', 'awaiting_reply', 'resolved', 'closed') then
    raise exception 'Support ticket status % is not supported', v_normalized_status;
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
      'ticket_id', p_ticket_id,
      'next_status', v_normalized_status
    )::text
  );

  insert into public.admin_support_ticket_status_idempotency (
    actor_id,
    actor_type,
    ticket_id,
    request_fingerprint
  )
  values (
    v_actor_id,
    'admin',
    p_ticket_id,
    v_request_fingerprint
  )
  on conflict (actor_id, ticket_id, request_fingerprint) do nothing;

  get diagnostics v_inserted_count = row_count;

  if v_inserted_count = 0 then
    select *
    into v_existing_row
    from public.admin_support_ticket_status_idempotency
    where actor_id = v_actor_id
      and ticket_id = p_ticket_id
      and request_fingerprint = v_request_fingerprint;

    if not found then
      raise exception 'Idempotent support ticket transition could not be loaded';
    end if;

    if v_existing_row.completed_at is null or v_existing_row.ticket_snapshot is null then
      raise exception 'Idempotent support ticket transition is already in progress';
    end if;

    select *
    into v_replayed_row
    from jsonb_populate_record(null::public.support_tickets, v_existing_row.ticket_snapshot);

    return v_replayed_row;
  end if;

  select *
  into v_before_state
  from public.support_tickets
  where id = p_ticket_id
  for update;

  if not found then
    raise exception 'Support ticket % was not found', p_ticket_id;
  end if;

  if not (
    (v_before_state.status = 'open' and v_normalized_status in ('in_progress', 'closed'))
    or (v_before_state.status = 'in_progress' and v_normalized_status in ('awaiting_reply', 'resolved', 'closed'))
    or (v_before_state.status = 'awaiting_reply' and v_normalized_status in ('in_progress', 'resolved', 'closed'))
    or (v_before_state.status = 'resolved' and v_normalized_status = 'closed')
  ) then
    raise exception 'Support ticket transition % -> % is not allowed', v_before_state.status, v_normalized_status;
  end if;

  update public.support_tickets
  set status = v_normalized_status
  where id = p_ticket_id
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
    'admin_support_ticket_status_updated',
    'SupportTicket',
    p_ticket_id,
    timezone('utc', now()),
    to_jsonb(v_before_state),
    to_jsonb(v_after_state)
  );

  update public.admin_support_ticket_status_idempotency
  set
    ticket_snapshot = to_jsonb(v_after_state),
    completed_at = timezone('utc', now())
  where actor_id = v_actor_id
    and ticket_id = p_ticket_id
    and request_fingerprint = v_request_fingerprint;

  return v_after_state;
end;
$$;

revoke all on function public.update_support_ticket_status_with_audit(text, text, text) from public;
grant execute on function public.update_support_ticket_status_with_audit(text, text, text) to authenticated, service_role;

alter table public.audit_logs
  drop constraint if exists audit_logs_resource_type_check;

alter table public.audit_logs
  add constraint audit_logs_resource_type_check check (
    resource_type in (
      'Order',
      'Payment',
      'Settlement',
      'User',
      'Merchant',
      'Store',
      'Review',
      'Dispute',
      'SupportTicket'
    )
  );

create table if not exists public.merchant_review_response_idempotency (
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
  review_id text not null references public.customer_reviews (id) on delete restrict,
  store_id text not null references public.stores (id) on delete restrict,
  request_fingerprint text not null,
  response_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  check (
    (completed_at is null and response_snapshot is null)
    or (completed_at is not null and response_snapshot is not null)
  )
);

create unique index if not exists merchant_review_response_idempotency_actor_review_fingerprint_idx
  on public.merchant_review_response_idempotency (actor_id, review_id, request_fingerprint);

create index if not exists merchant_review_response_idempotency_created_at_idx
  on public.merchant_review_response_idempotency (created_at desc);

alter table public.merchant_review_response_idempotency enable row level security;

create or replace function public.respond_to_customer_review_with_audit(
  p_review_id text,
  p_store_id text,
  p_response_text text
)
returns public.customer_reviews
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_membership record;
  v_before_state public.customer_reviews%rowtype;
  v_after_state public.customer_reviews%rowtype;
  v_existing_row public.merchant_review_response_idempotency%rowtype;
  v_replayed_row public.customer_reviews%rowtype;
  v_request_fingerprint text;
  v_inserted_count integer := 0;
  v_normalized_response text := btrim(coalesce(p_response_text, ''));
begin
  if v_actor_id is null then
    raise exception 'Authenticated session is required';
  end if;

  if v_normalized_response = '' then
    raise exception 'Review response cannot be empty';
  end if;

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
      'review_id', p_review_id,
      'response_text', v_normalized_response
    )::text
  );

  insert into public.merchant_review_response_idempotency (
    actor_id,
    actor_type,
    review_id,
    store_id,
    request_fingerprint
  )
  values (
    v_actor_id,
    v_membership.role,
    p_review_id,
    p_store_id,
    v_request_fingerprint
  )
  on conflict (actor_id, review_id, request_fingerprint) do nothing;

  get diagnostics v_inserted_count = row_count;

  if v_inserted_count = 0 then
    select *
    into v_existing_row
    from public.merchant_review_response_idempotency
    where actor_id = v_actor_id
      and review_id = p_review_id
      and request_fingerprint = v_request_fingerprint;

    if not found then
      raise exception 'Idempotent review response could not be loaded';
    end if;

    if v_existing_row.completed_at is null or v_existing_row.response_snapshot is null then
      raise exception 'Idempotent review response is already in progress';
    end if;

    select *
    into v_replayed_row
    from jsonb_populate_record(null::public.customer_reviews, v_existing_row.response_snapshot);

    return v_replayed_row;
  end if;

  select *
  into v_before_state
  from public.customer_reviews
  where id = p_review_id
    and store_id = p_store_id
  for update;

  if not found then
    raise exception 'Review % was not found for store %', p_review_id, p_store_id;
  end if;

  update public.customer_reviews
  set
    response_text = v_normalized_response,
    response_created_at = timezone('utc', now()),
    response_actor_id = v_actor_id
  where id = p_review_id
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
    v_actor_id,
    v_membership.role,
    'merchant_review_response_updated',
    'Review',
    p_review_id,
    timezone('utc', now()),
    to_jsonb(v_before_state),
    to_jsonb(v_after_state)
  );

  update public.merchant_review_response_idempotency
  set
    response_snapshot = to_jsonb(v_after_state),
    completed_at = timezone('utc', now())
  where actor_id = v_actor_id
    and review_id = p_review_id
    and request_fingerprint = v_request_fingerprint;

  return v_after_state;
end;
$$;

revoke all on function public.respond_to_customer_review_with_audit(text, text, text) from public;
grant execute on function public.respond_to_customer_review_with_audit(text, text, text) to authenticated, service_role;

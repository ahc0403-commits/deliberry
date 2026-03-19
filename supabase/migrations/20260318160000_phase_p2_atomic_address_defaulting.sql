-- Phase P2: Atomic address defaulting RPCs
-- Replaces multi-step client-side default switching with single atomic DB operations.

-- Atomic set-default: clears all defaults, sets the target, returns refreshed list.
create or replace function set_customer_default_address(
  p_actor_id uuid,
  p_address_id text
)
returns setof public.customer_addresses
language plpgsql
security definer
as $$
begin
  -- Clear all defaults for this customer in one statement.
  update public.customer_addresses
  set is_default = false, updated_at = timezone('utc', now())
  where customer_actor_id = p_actor_id
    and is_default = true
    and id <> p_address_id;

  -- Set the target address as default.
  update public.customer_addresses
  set is_default = true, updated_at = timezone('utc', now())
  where customer_actor_id = p_actor_id
    and id = p_address_id;

  -- Return refreshed address list in canonical order.
  return query
    select *
    from public.customer_addresses
    where customer_actor_id = p_actor_id
    order by is_default desc, created_at asc, id asc
    limit 20;
end;
$$;

-- Atomic delete with default repair: deletes address, ensures one default remains, returns refreshed list.
create or replace function delete_customer_address_with_default_ensure(
  p_actor_id uuid,
  p_address_id text
)
returns setof public.customer_addresses
language plpgsql
security definer
as $$
begin
  -- Delete the target address.
  delete from public.customer_addresses
  where customer_actor_id = p_actor_id
    and id = p_address_id;

  -- If no default exists, promote the oldest remaining address.
  if not exists (
    select 1 from public.customer_addresses
    where customer_actor_id = p_actor_id
      and is_default = true
  ) then
    update public.customer_addresses
    set is_default = true, updated_at = timezone('utc', now())
    where id = (
      select id from public.customer_addresses
      where customer_actor_id = p_actor_id
      order by created_at asc, id asc
      limit 1
    );
  end if;

  -- Return refreshed address list in canonical order.
  return query
    select *
    from public.customer_addresses
    where customer_actor_id = p_actor_id
    order by is_default desc, created_at asc, id asc
    limit 20;
end;
$$;

comment on function public.set_customer_default_address(uuid, text) is
  'Phase P2 atomic default-address switch. Clears all other defaults and sets the target in one transaction.';

comment on function public.delete_customer_address_with_default_ensure(uuid, text) is
  'Phase P2 atomic address delete with default repair. Deletes the address and ensures exactly one default remains.';

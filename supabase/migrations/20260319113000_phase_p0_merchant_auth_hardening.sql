create or replace function public.set_merchant_default_store(
  p_user_id uuid,
  p_store_id text
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
    where user_id = p_user_id
      and store_id = p_store_id
  ) then
    raise exception 'Store % is not available to merchant %', p_store_id, p_user_id;
  end if;

  update public.merchant_memberships
  set is_default = false
  where user_id = p_user_id
    and is_default = true;

  update public.merchant_memberships
  set is_default = true
  where user_id = p_user_id
    and store_id = p_store_id;

  if not found then
    raise exception 'Failed to assign default store % to merchant %', p_store_id, p_user_id;
  end if;
end;
$$;

grant execute on function public.set_merchant_default_store(uuid, text) to service_role;

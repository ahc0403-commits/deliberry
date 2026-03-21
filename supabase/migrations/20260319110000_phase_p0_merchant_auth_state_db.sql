alter table if exists public.merchant_profiles
  rename column actor_id to user_id;

alter table if exists public.merchant_profiles
  rename column onboarding_completed to onboarding_complete;

alter table if exists public.merchant_store_memberships
  rename to merchant_memberships;

alter table if exists public.merchant_memberships
  rename column actor_id to user_id;

alter table if exists public.merchant_memberships
  rename column actor_type to role;

alter table if exists public.merchant_memberships
  add column if not exists is_default boolean not null default false;

alter table if exists public.merchant_memberships
  drop constraint if exists merchant_store_memberships_actor_type_check;

alter table if exists public.merchant_memberships
  add constraint merchant_memberships_role_check
  check (role in ('merchant_owner', 'merchant_staff'));

update public.merchant_memberships memberships
set is_default = true
from (
  select user_id
  from public.merchant_memberships
  group by user_id
  having count(*) = 1
) singles
where memberships.user_id = singles.user_id;

create unique index if not exists merchant_memberships_single_default_idx
on public.merchant_memberships (user_id)
where is_default = true;

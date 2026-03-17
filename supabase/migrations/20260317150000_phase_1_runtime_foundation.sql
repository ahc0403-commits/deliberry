create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.prevent_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Deletes are not allowed on %', tg_table_name;
end;
$$;

create or replace function public.prevent_update_or_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception '% is immutable', tg_table_name;
end;
$$;

create table if not exists public.actor_profiles (
  id uuid primary key references auth.users (id) on delete restrict,
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
  display_name text not null,
  email text,
  phone_number text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_actor_profiles_updated_at
before update on public.actor_profiles
for each row execute function public.set_updated_at();

create table if not exists public.merchant_profiles (
  actor_id uuid primary key references public.actor_profiles (id) on delete restrict,
  merchant_name text not null,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_merchant_profiles_updated_at
before update on public.merchant_profiles
for each row execute function public.set_updated_at();

create table if not exists public.admin_profiles (
  actor_id uuid primary key references public.actor_profiles (id) on delete restrict,
  role text not null check (
    role in (
      'platform_admin',
      'operations_admin',
      'support_admin',
      'finance_admin',
      'marketing_admin'
    )
  ),
  mfa_required boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

create table if not exists public.stores (
  id text primary key,
  merchant_actor_id uuid not null references public.merchant_profiles (actor_id) on delete restrict,
  name text not null,
  city text not null,
  is_open boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_stores_updated_at
before update on public.stores
for each row execute function public.set_updated_at();

create table if not exists public.merchant_store_memberships (
  actor_id uuid not null references public.merchant_profiles (actor_id) on delete restrict,
  store_id text not null references public.stores (id) on delete restrict,
  actor_type text not null check (actor_type in ('merchant_owner', 'merchant_staff')),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (actor_id, store_id)
);

create table if not exists public.orders (
  id text primary key,
  customer_actor_id uuid not null references public.actor_profiles (id) on delete restrict,
  store_id text not null references public.stores (id) on delete restrict,
  status text not null check (
    status in (
      'draft',
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'in_transit',
      'delivered',
      'cancelled',
      'disputed'
    )
  ),
  payment_method text not null check (
    payment_method in ('cash', 'card', 'digital_wallet')
  ),
  total_centavos integer not null check (total_centavos >= 0),
  currency text not null check (currency in ('ARS', 'USD')),
  created_at timestamptz not null default timezone('utc', now()),
  confirmed_at timestamptz,
  preparing_at timestamptz,
  ready_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  disputed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger prevent_orders_delete
before delete on public.orders
for each row execute function public.prevent_delete();

create table if not exists public.audit_logs (
  id text primary key,
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
  action text not null,
  resource_type text not null check (
    resource_type in (
      'Order',
      'Payment',
      'Settlement',
      'User',
      'Merchant',
      'Store',
      'Dispute',
      'SupportTicket'
    )
  ),
  resource_id text not null,
  timestamp_utc timestamptz not null,
  before_state jsonb,
  after_state jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create trigger prevent_audit_logs_update
before update on public.audit_logs
for each row execute function public.prevent_update_or_delete();

create trigger prevent_audit_logs_delete
before delete on public.audit_logs
for each row execute function public.prevent_update_or_delete();

comment on table public.actor_profiles is
  'Phase 1 runtime identity baseline mapped to auth.users for customer, merchant, admin, guest, and system actors.';

comment on table public.orders is
  'Phase 1 order lifecycle baseline aligned to shared/validation/order.schema.json and per-status timestamp requirements.';

comment on table public.audit_logs is
  'Phase 1 immutable audit trail baseline aligned to shared/types/audit.types.ts and shared/validation/audit.schema.json.';

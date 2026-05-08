-- Settlement runtime schema landing
-- Adds the shared external_sales table expected by write-side replication,
-- plus settlement headers and line items consumed by settlement edge functions.

create table if not exists public.delivery_settlements (
  id uuid primary key default gen_random_uuid(),
  restaurant_id text not null,
  source_system text not null check (source_system in ('deliberry')),
  period_start date not null,
  period_end date not null,
  period_label text not null,
  gross_total integer not null check (gross_total >= 0),
  total_deductions integer not null default 0 check (total_deductions >= 0),
  net_settlement integer not null check (net_settlement >= 0),
  status text not null default 'pending' check (
    status in ('pending', 'calculated', 'received', 'disputed', 'adjusted')
  ),
  received_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint delivery_settlements_period_order_check check (period_start <= period_end),
  constraint delivery_settlements_period_unique unique (restaurant_id, source_system, period_label)
);

create index if not exists delivery_settlements_restaurant_period_idx
on public.delivery_settlements (restaurant_id, period_start desc, period_end desc);

drop trigger if exists set_delivery_settlements_updated_at on public.delivery_settlements;
create trigger set_delivery_settlements_updated_at
before update on public.delivery_settlements
for each row execute function public.set_updated_at();

drop trigger if exists prevent_delivery_settlements_delete on public.delivery_settlements;
create trigger prevent_delivery_settlements_delete
before delete on public.delivery_settlements
for each row execute function public.prevent_delete();

create table if not exists public.delivery_settlement_items (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.delivery_settlements (id) on delete cascade,
  item_type text not null,
  amount integer not null check (amount >= 0),
  description text,
  reference_rate numeric(8,6),
  reference_base integer check (reference_base is null or reference_base >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists delivery_settlement_items_settlement_idx
on public.delivery_settlement_items (settlement_id, item_type);

drop trigger if exists prevent_delivery_settlement_items_update on public.delivery_settlement_items;
create trigger prevent_delivery_settlement_items_update
before update on public.delivery_settlement_items
for each row execute function public.prevent_update_or_delete();

drop trigger if exists prevent_delivery_settlement_items_delete on public.delivery_settlement_items;
create trigger prevent_delivery_settlement_items_delete
before delete on public.delivery_settlement_items
for each row execute function public.prevent_update_or_delete();

create table if not exists public.external_sales (
  id uuid primary key default gen_random_uuid(),
  restaurant_id text not null,
  source_system text not null,
  external_order_id text not null,
  sales_channel text not null default 'delivery',
  gross_amount integer not null check (gross_amount >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  net_amount integer not null check (net_amount >= 0),
  currency text not null,
  order_status text not null check (
    order_status in ('completed', 'cancelled', 'refunded', 'partially_refunded')
  ),
  is_revenue boolean not null,
  completed_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  settlement_id uuid references public.delivery_settlements (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table if exists public.external_sales
  add column if not exists restaurant_id text,
  add column if not exists source_system text,
  add column if not exists external_order_id text,
  add column if not exists sales_channel text not null default 'delivery',
  add column if not exists gross_amount integer,
  add column if not exists discount_amount integer not null default 0,
  add column if not exists delivery_fee integer not null default 0,
  add column if not exists net_amount integer,
  add column if not exists currency text,
  add column if not exists order_status text,
  add column if not exists is_revenue boolean,
  add column if not exists completed_at timestamptz,
  add column if not exists payload jsonb not null default '{}'::jsonb,
  add column if not exists settlement_id uuid references public.delivery_settlements (id) on delete set null,
  add column if not exists created_at timestamptz not null default timezone('utc', now());

create unique index if not exists external_sales_source_order_unique_idx
on public.external_sales (source_system, external_order_id);

create index if not exists external_sales_restaurant_completed_idx
on public.external_sales (restaurant_id, completed_at desc, id desc);

create index if not exists external_sales_unsettled_revenue_idx
on public.external_sales (restaurant_id, completed_at desc)
where settlement_id is null and is_revenue = true and order_status = 'completed';

drop trigger if exists prevent_external_sales_delete on public.external_sales;
create trigger prevent_external_sales_delete
before delete on public.external_sales
for each row execute function public.prevent_delete();

alter table if exists public.delivery_settlements enable row level security;
alter table if exists public.delivery_settlement_items enable row level security;
alter table if exists public.external_sales enable row level security;

drop policy if exists delivery_settlements_merchant_read_store on public.delivery_settlements;
create policy delivery_settlements_merchant_read_store
on public.delivery_settlements
for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = delivery_settlements.restaurant_id
  )
);

drop policy if exists delivery_settlements_admin_read_all on public.delivery_settlements;
create policy delivery_settlements_admin_read_all
on public.delivery_settlements
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.actor_id = auth.uid()
  )
);

drop policy if exists delivery_settlement_items_merchant_read_store on public.delivery_settlement_items;
create policy delivery_settlement_items_merchant_read_store
on public.delivery_settlement_items
for select
to authenticated
using (
  exists (
    select 1
    from public.delivery_settlements
    join public.merchant_memberships
      on merchant_memberships.store_id = delivery_settlements.restaurant_id
    where delivery_settlements.id = delivery_settlement_items.settlement_id
      and merchant_memberships.user_id = auth.uid()
  )
);

drop policy if exists delivery_settlement_items_admin_read_all on public.delivery_settlement_items;
create policy delivery_settlement_items_admin_read_all
on public.delivery_settlement_items
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.actor_id = auth.uid()
  )
);

drop policy if exists external_sales_merchant_read_store on public.external_sales;
create policy external_sales_merchant_read_store
on public.external_sales
for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = external_sales.restaurant_id
  )
);

drop policy if exists external_sales_merchant_insert_store on public.external_sales;
create policy external_sales_merchant_insert_store
on public.external_sales
for insert
to authenticated
with check (
  source_system = 'deliberry'
  and exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = external_sales.restaurant_id
  )
);

drop policy if exists external_sales_admin_read_all on public.external_sales;
create policy external_sales_admin_read_all
on public.external_sales
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.actor_id = auth.uid()
  )
);

comment on table public.delivery_settlements is
  'Deliberry settlement header records for store-scoped payout windows. Write-side remains Deliberry-controlled; merchant/admin access is read-only.';

comment on table public.delivery_settlement_items is
  'Immutable line items attached to a settlement header so new deduction types can be added without schema changes.';

comment on table public.external_sales is
  'Shared delivery sales ledger used for Deliberry order replication and settlement window aggregation.';

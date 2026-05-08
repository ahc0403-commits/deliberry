create table if not exists public.vnpay_sandbox_payment_attempts (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references public.orders (id) on delete restrict,
  customer_actor_id uuid not null references public.actor_profiles (id) on delete restrict,
  payment_reference text not null unique,
  payment_method text not null check (
    payment_method in ('card', 'digital_wallet')
  ),
  expected_amount_vnd integer not null check (expected_amount_vnd > 0),
  expected_currency text not null check (expected_currency = 'VND'),
  expected_bank_code text,
  environment text not null check (environment = 'sandbox'),
  return_url text not null,
  payment_url text not null,
  created_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null,
  last_return_at timestamptz,
  last_ipn_at timestamptz
);

create index if not exists vnpay_sandbox_payment_attempts_order_created_idx
  on public.vnpay_sandbox_payment_attempts (order_id, created_at desc);

create index if not exists vnpay_sandbox_payment_attempts_customer_created_idx
  on public.vnpay_sandbox_payment_attempts (customer_actor_id, created_at desc);

alter table public.vnpay_sandbox_payment_attempts enable row level security;

drop policy if exists vnpay_sandbox_payment_attempts_service_role_all on public.vnpay_sandbox_payment_attempts;
create policy vnpay_sandbox_payment_attempts_service_role_all
on public.vnpay_sandbox_payment_attempts
for all
to service_role
using (true)
with check (true);

create table if not exists public.vnpay_sandbox_callback_receipts (
  id text primary key default gen_random_uuid()::text,
  payment_reference text not null references public.vnpay_sandbox_payment_attempts (payment_reference) on delete restrict,
  callback_kind text not null check (
    callback_kind in ('return', 'ipn')
  ),
  callback_fingerprint text not null,
  secure_hash text not null,
  checksum_valid boolean not null,
  validation_result text not null check (
    validation_result in ('accepted', 'rejected', 'duplicate')
  ),
  validation_reason text,
  provider_amount_minor integer,
  provider_currency text,
  provider_response_code text,
  provider_transaction_status text,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists vnpay_sandbox_callback_receipts_kind_fingerprint_idx
  on public.vnpay_sandbox_callback_receipts (callback_kind, callback_fingerprint);

create index if not exists vnpay_sandbox_callback_receipts_reference_created_idx
  on public.vnpay_sandbox_callback_receipts (payment_reference, created_at desc);

alter table public.vnpay_sandbox_callback_receipts enable row level security;

drop policy if exists vnpay_sandbox_callback_receipts_service_role_all on public.vnpay_sandbox_callback_receipts;
create policy vnpay_sandbox_callback_receipts_service_role_all
on public.vnpay_sandbox_callback_receipts
for all
to service_role
using (true)
with check (true);

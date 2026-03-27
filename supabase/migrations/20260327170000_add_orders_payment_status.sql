alter table public.orders
add column if not exists payment_status text;

update public.orders
set payment_status = 'pending'
where payment_status is null;

alter table public.orders
alter column payment_status set default 'pending';

alter table public.orders
alter column payment_status set not null;

alter table public.orders
drop constraint if exists orders_payment_status_check;

alter table public.orders
add constraint orders_payment_status_check
check (
  payment_status in (
    'pending',
    'captured',
    'settled',
    'failed',
    'refunded',
    'partially_refunded'
  )
);

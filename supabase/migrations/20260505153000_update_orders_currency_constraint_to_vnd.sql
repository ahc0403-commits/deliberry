alter table public.orders
  drop constraint if exists orders_currency_check;

update public.orders
set currency = 'VND'
where currency is null
   or currency not in ('VND', 'USD');

alter table public.orders
  add constraint orders_currency_check
  check (currency in ('VND', 'USD'));

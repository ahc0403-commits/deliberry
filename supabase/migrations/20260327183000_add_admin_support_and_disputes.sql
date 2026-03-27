create table if not exists public.disputes (
  id text primary key,
  case_number text not null unique,
  order_id text not null references public.orders (id) on delete restrict,
  store_id text not null references public.stores (id) on delete restrict,
  customer_actor_id uuid not null references public.actor_profiles (id) on delete restrict,
  category text not null check (
    category in ('quality', 'missing_items', 'delivery', 'billing', 'other')
  ),
  priority text not null check (
    priority in ('high', 'medium', 'low')
  ),
  status text not null check (
    status in ('open', 'investigating', 'escalated', 'resolved')
  ),
  description text not null,
  amount_centavos integer not null check (amount_centavos >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_disputes_updated_at
before update on public.disputes
for each row execute function public.set_updated_at();

create table if not exists public.support_tickets (
  id text primary key,
  ticket_number text not null unique,
  actor_id uuid not null references public.actor_profiles (id) on delete restrict,
  order_id text references public.orders (id) on delete restrict,
  store_id text references public.stores (id) on delete restrict,
  subject text not null,
  category text not null check (
    category in ('order_issue', 'account', 'payment', 'general', 'merchant_complaint')
  ),
  priority text not null check (
    priority in ('high', 'medium', 'low')
  ),
  status text not null check (
    status in ('open', 'in_progress', 'awaiting_reply', 'resolved', 'closed')
  ),
  assignee_name text not null default 'Unassigned',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

create index if not exists disputes_created_idx
on public.disputes (created_at desc, id desc);

create index if not exists support_tickets_created_idx
on public.support_tickets (created_at desc, id desc);

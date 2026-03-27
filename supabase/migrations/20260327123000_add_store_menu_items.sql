create table if not exists public.store_menu_items (
  id text primary key,
  store_id text not null references public.stores (id) on delete restrict,
  name text not null,
  description text not null default '',
  category text not null,
  price_centavos integer not null check (price_centavos >= 0),
  image_color_hex text not null default '#FF6B6B',
  is_popular boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_store_menu_items_updated_at
before update on public.store_menu_items
for each row execute function public.set_updated_at();

create index if not exists store_menu_items_store_available_sort_idx
on public.store_menu_items (store_id, is_available, sort_order, id);

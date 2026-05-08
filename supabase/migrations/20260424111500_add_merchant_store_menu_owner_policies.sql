drop policy if exists merchant_stores_read_own on public.stores;
create policy merchant_stores_read_own
on public.stores
for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = stores.id
  )
);

drop policy if exists merchant_store_menu_items_read_own on public.store_menu_items;
create policy merchant_store_menu_items_read_own
on public.store_menu_items
for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = store_menu_items.store_id
  )
);

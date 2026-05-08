alter table if exists public.store_menu_items
  add column if not exists image_storage_path text;

create index if not exists store_menu_items_store_category_sort_idx
on public.store_menu_items (store_id, category, sort_order, id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-item-images',
  'menu-item-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists menu_item_images_public_read on storage.objects;
create policy menu_item_images_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'menu-item-images');

drop policy if exists menu_item_images_merchant_insert on storage.objects;
create policy menu_item_images_merchant_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'menu-item-images'
  and exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = (storage.foldername(name))[1]
  )
);

drop policy if exists menu_item_images_merchant_update on storage.objects;
create policy menu_item_images_merchant_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'menu-item-images'
  and exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = (storage.foldername(name))[1]
  )
)
with check (
  bucket_id = 'menu-item-images'
  and exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = (storage.foldername(name))[1]
  )
);

drop policy if exists menu_item_images_merchant_delete on storage.objects;
create policy menu_item_images_merchant_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'menu-item-images'
  and exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = (storage.foldername(name))[1]
  )
);

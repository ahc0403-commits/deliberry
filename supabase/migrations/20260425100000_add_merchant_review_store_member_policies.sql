-- Allow merchant store members to read and reply to reviews for their own store.
-- Customer users keep their own customer_reviews_read_own policy from 20260408113000.

drop policy if exists merchant_reviews_read_store_memberships on public.customer_reviews;
create policy merchant_reviews_read_store_memberships
on public.customer_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = customer_reviews.store_id
  )
);

drop policy if exists merchant_reviews_reply_store_memberships on public.customer_reviews;
create policy merchant_reviews_reply_store_memberships
on public.customer_reviews
for update
to authenticated
using (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = customer_reviews.store_id
  )
)
with check (
  exists (
    select 1
    from public.merchant_memberships
    where merchant_memberships.user_id = auth.uid()
      and merchant_memberships.store_id = customer_reviews.store_id
  )
);

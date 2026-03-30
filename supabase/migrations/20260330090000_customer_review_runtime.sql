alter table if exists public.customer_reviews
  add column if not exists customer_actor_id uuid references public.actor_profiles (id) on delete restrict,
  add column if not exists tags_json jsonb not null default '[]'::jsonb;

update public.customer_reviews
set customer_actor_id = orders.customer_actor_id
from public.orders
where public.customer_reviews.customer_actor_id is null
  and public.customer_reviews.order_id = orders.id;

update public.customer_reviews
set tags_json = coalesce(tags_json, '[]'::jsonb)
where tags_json is null;

create unique index if not exists customer_reviews_order_actor_idx
on public.customer_reviews (order_id, customer_actor_id);

create or replace function public.upsert_customer_review_with_store_projection(
  p_order_id text,
  p_actor_id uuid,
  p_rating integer,
  p_review_text text,
  p_tags_json jsonb
)
returns public.customer_reviews
language plpgsql
security definer
set search_path = public
as $$
declare
  v_store_id text;
  v_existing_id text;
  v_row public.customer_reviews%rowtype;
begin
  select store_id
  into v_store_id
  from public.orders
  where id = p_order_id;

  if v_store_id is null then
    raise exception 'Order % was not found', p_order_id;
  end if;

  select id
  into v_existing_id
  from public.customer_reviews
  where order_id = p_order_id
    and customer_actor_id = p_actor_id;

  if v_existing_id is null then
    insert into public.customer_reviews (
      id,
      order_id,
      store_id,
      customer_actor_id,
      rating,
      review_text,
      tags_json
    )
    values (
      gen_random_uuid()::text,
      p_order_id,
      v_store_id,
      p_actor_id,
      p_rating,
      p_review_text,
      coalesce(p_tags_json, '[]'::jsonb)
    )
    returning *
    into v_row;
  else
    update public.customer_reviews
    set
      rating = p_rating,
      review_text = p_review_text,
      tags_json = coalesce(p_tags_json, '[]'::jsonb)
    where id = v_existing_id
    returning *
    into v_row;
  end if;

  update public.stores
  set
    review_count = (
      select count(*)::integer
      from public.customer_reviews
      where store_id = v_store_id
    ),
    rating = (
      select round(avg(rating)::numeric, 2)
      from public.customer_reviews
      where store_id = v_store_id
    )
  where id = v_store_id;

  return v_row;
end;
$$;

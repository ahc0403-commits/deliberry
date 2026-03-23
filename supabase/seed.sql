-- Deliberry local demo runtime seed
-- This seed populates the merchant demo path with real DB-backed rows so
-- store-scoped routes can exercise persisted reads and writes in local runs.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'demo@saborcriollo.com',
    extensions.crypt('demo1234', extensions.gen_salt('bf')),
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"surface":"merchant-console","mode":"demo-cookie"}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated',
    'authenticated',
    'customer.one@example.com',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"surface":"customer-app","mode":"seed"}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated',
    'authenticated',
    'customer.two@example.com',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"surface":"customer-app","mode":"seed"}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = coalesce(excluded.encrypted_password, auth.users.encrypted_password),
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = timezone('utc', now());

insert into public.actor_profiles (
  id,
  actor_type,
  display_name,
  email,
  phone_number
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'merchant_owner',
    'Demo Merchant',
    'demo@saborcriollo.com',
    '+54 11 4000 1000'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'customer',
    'Maria Gomez',
    'customer.one@example.com',
    '+54 11 5000 1000'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'customer',
    'Carlos Ruiz',
    'customer.two@example.com',
    '+54 11 5000 2000'
  )
on conflict (id) do update
set
  actor_type = excluded.actor_type,
  display_name = excluded.display_name,
  email = excluded.email,
  phone_number = excluded.phone_number,
  updated_at = timezone('utc', now());

insert into public.merchant_profiles (
  user_id,
  merchant_name,
  onboarding_complete
)
values (
  '11111111-1111-4111-8111-111111111111',
  'Demo Merchant',
  true
)
on conflict (user_id) do update
set
  merchant_name = excluded.merchant_name,
  onboarding_complete = excluded.onboarding_complete,
  updated_at = timezone('utc', now());

insert into public.stores (
  id,
  merchant_actor_id,
  name,
  city,
  is_open,
  address,
  phone,
  email,
  rating,
  review_count,
  status,
  cuisine_type,
  hours_json,
  delivery_radius,
  avg_prep_time,
  accepting_orders,
  settings_json
)
values (
  'demo-store',
  '11111111-1111-4111-8111-111111111111',
  'Sabor Criollo Kitchen',
  'Buenos Aires',
  true,
  'Av. Corrientes 1234, Buenos Aires',
  '+54 11 4567-8900',
  'info@saborcriollo.com',
  4.6,
  2,
  'open',
  'Argentine / Latin American',
  '[
    {"day":"Monday","open":"10:00","close":"23:00"},
    {"day":"Tuesday","open":"10:00","close":"23:00"},
    {"day":"Wednesday","open":"10:00","close":"23:00"},
    {"day":"Thursday","open":"10:00","close":"23:30"},
    {"day":"Friday","open":"10:00","close":"00:00"},
    {"day":"Saturday","open":"11:00","close":"00:00"},
    {"day":"Sunday","open":"11:00","close":"22:00"}
  ]'::jsonb,
  '5 km',
  '25-35 min',
  true,
  '{
    "auto_accept_orders": false,
    "order_notifications": true,
    "rush_hour_mode": false,
    "allow_special_instructions": true,
    "email_reports": true,
    "review_alerts": true,
    "settlement_notifications": true,
    "low_stock_alerts": false
  }'::jsonb
)
on conflict (id) do update
set
  merchant_actor_id = excluded.merchant_actor_id,
  name = excluded.name,
  city = excluded.city,
  is_open = excluded.is_open,
  address = excluded.address,
  phone = excluded.phone,
  email = excluded.email,
  rating = excluded.rating,
  review_count = excluded.review_count,
  status = excluded.status,
  cuisine_type = excluded.cuisine_type,
  hours_json = excluded.hours_json,
  delivery_radius = excluded.delivery_radius,
  avg_prep_time = excluded.avg_prep_time,
  accepting_orders = excluded.accepting_orders,
  settings_json = excluded.settings_json,
  updated_at = timezone('utc', now());

insert into public.merchant_memberships (
  user_id,
  store_id,
  role,
  is_default
)
values (
  '11111111-1111-4111-8111-111111111111',
  'demo-store',
  'merchant_owner',
  true
)
on conflict (user_id, store_id) do update
set
  role = excluded.role,
  is_default = excluded.is_default;

insert into public.orders (
  id,
  customer_actor_id,
  store_id,
  status,
  payment_method,
  total_centavos,
  currency,
  created_at,
  confirmed_at,
  preparing_at,
  ready_at,
  customer_name,
  customer_phone,
  delivery_address,
  notes,
  subtotal_centavos,
  delivery_fee_centavos,
  estimated_delivery_at,
  line_items_summary,
  order_number
)
values
  (
    'ord-demo-001',
    '22222222-2222-4222-8222-222222222222',
    'demo-store',
    'pending',
    'card',
    560000,
    'ARS',
    timezone('utc', now()) - interval '20 minutes',
    null,
    null,
    null,
    'Maria Gomez',
    '+54 11 5000 1000',
    'Av. Santa Fe 2100, 3B',
    'Ring doorbell twice please',
    525000,
    35000,
    timezone('utc', now()) + interval '25 minutes',
    '[
      {"name":"Milanesa Napolitana","quantity":2,"unit_price_centavos":185000,"modifiers":["Extra cheese"]},
      {"name":"Ensalada Mixta","quantity":1,"unit_price_centavos":80000},
      {"name":"Flan con Dulce de Leche","quantity":2,"unit_price_centavos":75000}
    ]'::jsonb,
    '#1247'
  ),
  (
    'ord-demo-002',
    '33333333-3333-4333-8333-333333333333',
    'demo-store',
    'preparing',
    'cash',
    365000,
    'ARS',
    timezone('utc', now()) - interval '45 minutes',
    timezone('utc', now()) - interval '40 minutes',
    timezone('utc', now()) - interval '30 minutes',
    null,
    'Carlos Ruiz',
    '+54 11 5000 2000',
    'Calle Florida 450, PB',
    null,
    330000,
    35000,
    timezone('utc', now()) + interval '10 minutes',
    '[
      {"name":"Empanadas Surtidas x6","quantity":1,"unit_price_centavos":150000},
      {"name":"Choripan Completo","quantity":2,"unit_price_centavos":90000}
    ]'::jsonb,
    '#1246'
  ),
  (
    'ord-demo-003',
    '22222222-2222-4222-8222-222222222222',
    'demo-store',
    'ready',
    'card',
    710000,
    'ARS',
    timezone('utc', now()) - interval '70 minutes',
    timezone('utc', now()) - interval '65 minutes',
    timezone('utc', now()) - interval '55 minutes',
    timezone('utc', now()) - interval '5 minutes',
    'Maria Gomez',
    '+54 11 5000 1000',
    'Av. Callao 890, 5A',
    'Free delivery promo applied',
    710000,
    0,
    timezone('utc', now()) + interval '5 minutes',
    '[
      {"name":"Asado para 2","quantity":1,"unit_price_centavos":420000},
      {"name":"Provoleta","quantity":1,"unit_price_centavos":120000},
      {"name":"Vino Malbec Copa","quantity":2,"unit_price_centavos":85000}
    ]'::jsonb,
    '#1245'
  )
on conflict (id) do update
set
  customer_actor_id = excluded.customer_actor_id,
  store_id = excluded.store_id,
  status = excluded.status,
  payment_method = excluded.payment_method,
  total_centavos = excluded.total_centavos,
  currency = excluded.currency,
  created_at = excluded.created_at,
  confirmed_at = excluded.confirmed_at,
  preparing_at = excluded.preparing_at,
  ready_at = excluded.ready_at,
  customer_name = excluded.customer_name,
  customer_phone = excluded.customer_phone,
  delivery_address = excluded.delivery_address,
  notes = excluded.notes,
  subtotal_centavos = excluded.subtotal_centavos,
  delivery_fee_centavos = excluded.delivery_fee_centavos,
  estimated_delivery_at = excluded.estimated_delivery_at,
  line_items_summary = excluded.line_items_summary,
  order_number = excluded.order_number,
  updated_at = timezone('utc', now());

insert into public.customer_reviews (
  id,
  order_id,
  store_id,
  rating,
  review_text,
  response_text,
  response_created_at,
  response_actor_id,
  created_at
)
values
  (
    'review-demo-001',
    'ord-demo-002',
    'demo-store',
    5,
    'Great empanadas and fast prep time.',
    null,
    null,
    null,
    timezone('utc', now()) - interval '12 hours'
  ),
  (
    'review-demo-002',
    'ord-demo-003',
    'demo-store',
    4,
    'Food was excellent, but pickup was slightly delayed.',
    'Thanks for the feedback. We tightened the pickup handoff timing for tonight.',
    timezone('utc', now()) - interval '6 hours',
    '11111111-1111-4111-8111-111111111111',
    timezone('utc', now()) - interval '1 day'
  ),
  (
    'review-demo-003',
    'ord-demo-001',
    'demo-store',
    3,
    'Tasty, but packaging could be improved.',
    null,
    null,
    null,
    timezone('utc', now()) - interval '1 hour'
  )
on conflict (id) do update
set
  order_id = excluded.order_id,
  store_id = excluded.store_id,
  rating = excluded.rating,
  review_text = excluded.review_text,
  response_text = excluded.response_text,
  response_created_at = excluded.response_created_at,
  response_actor_id = excluded.response_actor_id,
  created_at = excluded.created_at,
  updated_at = timezone('utc', now());

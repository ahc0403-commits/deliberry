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
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  reauthentication_token,
  phone_change,
  phone_change_token,
  is_super_admin,
  is_sso_user,
  is_anonymous,
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
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false,
    false,
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
    extensions.crypt('customerpass123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false,
    false,
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
    extensions.crypt('customerpass456', extensions.gen_salt('bf')),
    timezone('utc', now()),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false,
    false,
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
  confirmation_token = excluded.confirmation_token,
  recovery_token = excluded.recovery_token,
  email_change_token_new = excluded.email_change_token_new,
  email_change = excluded.email_change,
  email_change_token_current = excluded.email_change_token_current,
  reauthentication_token = excluded.reauthentication_token,
  phone_change = excluded.phone_change,
  phone_change_token = excluded.phone_change_token,
  is_super_admin = excluded.is_super_admin,
  is_sso_user = excluded.is_sso_user,
  is_anonymous = excluded.is_anonymous,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = timezone('utc', now());

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    'demo@saborcriollo.com',
    '11111111-1111-4111-8111-111111111111',
    jsonb_build_object(
      'sub', '11111111-1111-4111-8111-111111111111',
      'email', 'demo@saborcriollo.com',
      'email_verified', true
    ),
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    'customer.one@example.com',
    '22222222-2222-4222-8222-222222222222',
    jsonb_build_object(
      'sub', '22222222-2222-4222-8222-222222222222',
      'email', 'customer.one@example.com',
      'email_verified', true
    ),
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    'customer.two@example.com',
    '33333333-3333-4333-8333-333333333333',
    jsonb_build_object(
      'sub', '33333333-3333-4333-8333-333333333333',
      'email', 'customer.two@example.com',
      'email_verified', true
    ),
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  )
on conflict (provider_id, provider) do update
set
  identity_data = excluded.identity_data,
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

insert into public.store_menu_items (
  id,
  store_id,
  name,
  description,
  category,
  price_centavos,
  image_color_hex,
  is_popular,
  is_available,
  sort_order
)
values
  (
    'menu-demo-001',
    'demo-store',
    'Asado para 2',
    'Traditional grilled beef platter with chimichurri and roasted vegetables.',
    'Popular',
    420000,
    '#FFB74D',
    true,
    true,
    1
  ),
  (
    'menu-demo-002',
    'demo-store',
    'Milanesa Napolitana',
    'Breaded beef topped with tomato sauce, ham, and melted mozzarella.',
    'Popular',
    185000,
    '#FF8A65',
    true,
    true,
    2
  ),
  (
    'menu-demo-003',
    'demo-store',
    'Empanadas Surtidas x6',
    'Six assorted empanadas with beef, chicken, and cheese fillings.',
    'Popular',
    150000,
    '#E57373',
    true,
    true,
    3
  ),
  (
    'menu-demo-004',
    'demo-store',
    'Choripan Completo',
    'Grilled chorizo sandwich with criolla salsa and chimichurri.',
    'Sandwiches',
    90000,
    '#FFCC80',
    false,
    true,
    4
  ),
  (
    'menu-demo-005',
    'demo-store',
    'Ensalada Mixta',
    'Tomato, lettuce, onion, and olives with house dressing.',
    'Sides',
    80000,
    '#81C784',
    false,
    true,
    5
  ),
  (
    'menu-demo-006',
    'demo-store',
    'Provoleta',
    'Grilled provolone cheese finished with oregano and olive oil.',
    'Sides',
    120000,
    '#FFD54F',
    false,
    true,
    6
  ),
  (
    'menu-demo-007',
    'demo-store',
    'Flan con Dulce de Leche',
    'Classic flan topped with dulce de leche and whipped cream.',
    'Desserts',
    75000,
    '#CE93D8',
    false,
    true,
    7
  ),
  (
    'menu-demo-008',
    'demo-store',
    'Vino Malbec Copa',
    'Glass of Mendoza Malbec served slightly chilled.',
    'Drinks',
    85000,
    '#A1887F',
    false,
    true,
    8
  )
on conflict (id) do update
set
  store_id = excluded.store_id,
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  price_centavos = excluded.price_centavos,
  image_color_hex = excluded.image_color_hex,
  is_popular = excluded.is_popular,
  is_available = excluded.is_available,
  sort_order = excluded.sort_order,
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
  payment_status,
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
    'pending',
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
    'pending',
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
  payment_status = excluded.payment_status,
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
  customer_actor_id,
  rating,
  review_text,
  tags_json,
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
    '33333333-3333-4333-8333-333333333333',
    5,
    'Great empanadas and fast prep time.',
    '["Great food","Fast delivery"]'::jsonb,
    null,
    null,
    null,
    timezone('utc', now()) - interval '12 hours'
  ),
  (
    'review-demo-002',
    'ord-demo-003',
    'demo-store',
    '22222222-2222-4222-8222-222222222222',
    4,
    'Food was excellent, but pickup was slightly delayed.',
    '["Accurate order","Worth the price"]'::jsonb,
    'Thanks for the feedback. We tightened the pickup handoff timing for tonight.',
    timezone('utc', now()) - interval '6 hours',
    '11111111-1111-4111-8111-111111111111',
    timezone('utc', now()) - interval '1 day'
  ),
  (
    'review-demo-003',
    'ord-demo-001',
    'demo-store',
    '22222222-2222-4222-8222-222222222222',
    3,
    'Tasty, but packaging could be improved.',
    '["Good packaging"]'::jsonb,
    null,
    null,
    null,
    timezone('utc', now()) - interval '1 hour'
  )
on conflict (id) do update
set
  order_id = excluded.order_id,
  store_id = excluded.store_id,
  customer_actor_id = excluded.customer_actor_id,
  rating = excluded.rating,
  review_text = excluded.review_text,
  tags_json = excluded.tags_json,
  response_text = excluded.response_text,
  response_created_at = excluded.response_created_at,
  response_actor_id = excluded.response_actor_id,
  created_at = excluded.created_at,
  updated_at = timezone('utc', now());

insert into public.disputes (
  id,
  case_number,
  order_id,
  store_id,
  customer_actor_id,
  category,
  priority,
  status,
  description,
  amount_centavos,
  created_at
)
values
  (
    'disp-demo-001',
    'DSP-401',
    'ord-demo-001',
    'demo-store',
    '22222222-2222-4222-8222-222222222222',
    'quality',
    'high',
    'open',
    'Received the wrong main dish for the order.',
    560000,
    timezone('utc', now()) - interval '30 minutes'
  ),
  (
    'disp-demo-002',
    'DSP-400',
    'ord-demo-002',
    'demo-store',
    '33333333-3333-4333-8333-333333333333',
    'missing_items',
    'medium',
    'investigating',
    'One side item was missing from the bag.',
    90000,
    timezone('utc', now()) - interval '1 day'
  ),
  (
    'disp-demo-003',
    'DSP-399',
    'ord-demo-003',
    'demo-store',
    '22222222-2222-4222-8222-222222222222',
    'delivery',
    'low',
    'resolved',
    'Delivery ETA slipped significantly during peak hour.',
    710000,
    timezone('utc', now()) - interval '2 days'
  )
on conflict (id) do update
set
  case_number = excluded.case_number,
  order_id = excluded.order_id,
  store_id = excluded.store_id,
  customer_actor_id = excluded.customer_actor_id,
  category = excluded.category,
  priority = excluded.priority,
  status = excluded.status,
  description = excluded.description,
  amount_centavos = excluded.amount_centavos,
  created_at = excluded.created_at,
  updated_at = timezone('utc', now());

insert into public.support_tickets (
  id,
  ticket_number,
  actor_id,
  order_id,
  store_id,
  subject,
  category,
  priority,
  status,
  assignee_name,
  created_at
)
values
  (
    'ticket-demo-001',
    'TKT-1892',
    '22222222-2222-4222-8222-222222222222',
    'ord-demo-001',
    'demo-store',
    'Need help with the order contents',
    'order_issue',
    'high',
    'open',
    'Unassigned',
    timezone('utc', now()) - interval '20 minutes'
  ),
  (
    'ticket-demo-002',
    'TKT-1891',
    '11111111-1111-4111-8111-111111111111',
    null,
    'demo-store',
    'Store hours need updating',
    'merchant_complaint',
    'medium',
    'in_progress',
    'Agent Rosa',
    timezone('utc', now()) - interval '5 hours'
  ),
  (
    'ticket-demo-003',
    'TKT-1890',
    '33333333-3333-4333-8333-333333333333',
    'ord-demo-002',
    'demo-store',
    'Account phone number needs correction',
    'account',
    'low',
    'awaiting_reply',
    'Agent Marco',
    timezone('utc', now()) - interval '1 day'
  )
on conflict (id) do update
set
  ticket_number = excluded.ticket_number,
  actor_id = excluded.actor_id,
  order_id = excluded.order_id,
  store_id = excluded.store_id,
  subject = excluded.subject,
  category = excluded.category,
  priority = excluded.priority,
  status = excluded.status,
  assignee_name = excluded.assignee_name,
  created_at = excluded.created_at,
  updated_at = timezone('utc', now());

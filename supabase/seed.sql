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
    'demo@saigonhome.vn',
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
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-8444-444444444444',
    'authenticated',
    'authenticated',
    'admin@deliberry.local',
    extensions.crypt('admin1234', extensions.gen_salt('bf')),
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
    '{"surface":"admin-console","mode":"seed","role":"platform_admin"}'::jsonb,
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
    'demo@saigonhome.vn',
    '11111111-1111-4111-8111-111111111111',
    jsonb_build_object(
      'sub', '11111111-1111-4111-8111-111111111111',
      'email', 'demo@saigonhome.vn',
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
  ),
  (
    'admin@deliberry.local',
    '44444444-4444-4444-8444-444444444444',
    jsonb_build_object(
      'sub', '44444444-4444-4444-8444-444444444444',
      'email', 'admin@deliberry.local',
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
    'Saigon Home Kitchen',
    'demo@saigonhome.vn',
    '+84 28 7300 1000'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'customer',
    'Maria Gomez',
    'customer.one@example.com',
    '+84 28 7300 2001'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'customer',
    'Carlos Ruiz',
    'customer.two@example.com',
    '+84 28 7300 2002'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'admin',
    'Local Platform Admin',
    'admin@deliberry.local',
    null
  )
on conflict (id) do update
set
  actor_type = excluded.actor_type,
  display_name = excluded.display_name,
  email = excluded.email,
  phone_number = excluded.phone_number,
  updated_at = timezone('utc', now());

insert into public.admin_profiles (
  actor_id,
  role,
  mfa_required
)
values (
  '44444444-4444-4444-8444-444444444444',
  'platform_admin',
  false
)
on conflict (actor_id) do update
set
  role = excluded.role,
  mfa_required = excluded.mfa_required,
  updated_at = timezone('utc', now());

insert into public.merchant_profiles (
  user_id,
  merchant_name,
  onboarding_complete
)
values (
  '11111111-1111-4111-8111-111111111111',
  'Saigon Home Kitchen',
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
  'Saigon Home Kitchen',
  'Ho Chi Minh City',
  true,
  '12 Nguyen Hue, Ben Nghe Ward, District 1, Ho Chi Minh City',
  '+84 28 7300 1100',
  'info@saigonhome.vn',
  4.6,
  2,
  'open',
  'Vietnamese Home Kitchen',
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
    'Com Tam Suon Nuong',
    'Com tam suon nuong kem mo hanh, do chua va rau an kem.',
    'Rice bowls',
    185000,
    '#FFB74D',
    true,
    true,
    1
  ),
  (
    'menu-demo-002',
    'demo-store',
    'Bun Thit Nuong',
    'Bun thit nuong voi rau song, lac rang va nuoc mam chua ngot.',
    'Rice bowls',
    150000,
    '#FF8A65',
    true,
    true,
    2
  ),
  (
    'menu-demo-003',
    'demo-store',
    'Cha Gio Tom Cua',
    'Cha gio tom cua gion, an kem rau song va nuoc cham.',
    'Popular',
    90000,
    '#E57373',
    true,
    true,
    3
  ),
  (
    'menu-demo-004',
    'demo-store',
    'Goi Cuon',
    'Goi cuon tom tuoi voi bun, rau thom va sot cham nha lam.',
    'Sides',
    80000,
    '#FFCC80',
    false,
    true,
    4
  ),
  (
    'menu-demo-005',
    'demo-store',
    'Bo La Lot',
    'Bo la lot nuong than, them muoi lac rang va mo hanh.',
    'Sides',
    120000,
    '#81C784',
    false,
    true,
    5
  ),
  (
    'menu-demo-006',
    'demo-store',
    'Tra Dao',
    'Tra dao voi nha dam va trai cay tuoi cat lat.',
    'Drinks',
    85000,
    '#FFD54F',
    false,
    true,
    6
  ),
  (
    'menu-demo-007',
    'demo-store',
    'Che Ba Mau',
    'Che ba mau voi dau, thach va nuoc cot dua.',
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
    'Ca Phe Sua Da',
    'Ca phe sua da dam vi voi sua dac.',
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

-- Smoke runtime stores for multi-store concurrent order verification.
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
values
  (
    'smoke-store-01',
    '11111111-1111-4111-8111-111111111111',
    'Smoke Test Arepa Bar',
    'Ho Chi Minh City',
    true,
    '101 Le Thanh Ton, Ben Thanh Ward, District 1, Ho Chi Minh City',
    '+84 28 7300 3001',
    'smoke-store-01@deliberry.local',
    4.5,
    0,
    'open',
    'Latin Bowls',
    '[{"day":"Everyday","open":"10:00","close":"22:00"}]'::jsonb,
    '4 km',
    '20-30 min',
    true,
    '{"auto_accept_orders":false,"order_notifications":true,"allow_special_instructions":true}'::jsonb
  ),
  (
    'smoke-store-02',
    '11111111-1111-4111-8111-111111111111',
    'Smoke Test Noodle Lab',
    'Ho Chi Minh City',
    true,
    '102 Hai Ba Trung, Ben Nghe Ward, District 1, Ho Chi Minh City',
    '+84 28 7300 3002',
    'smoke-store-02@deliberry.local',
    4.4,
    0,
    'open',
    'Noodles',
    '[{"day":"Everyday","open":"10:00","close":"22:00"}]'::jsonb,
    '4 km',
    '18-28 min',
    true,
    '{"auto_accept_orders":false,"order_notifications":true,"allow_special_instructions":true}'::jsonb
  ),
  (
    'smoke-store-03',
    '11111111-1111-4111-8111-111111111111',
    'Smoke Test Pizza Bench',
    'Ho Chi Minh City',
    true,
    '103 Vo Van Tan, Ward 6, District 3, Ho Chi Minh City',
    '+84 28 7300 3003',
    'smoke-store-03@deliberry.local',
    4.3,
    0,
    'open',
    'Pizza',
    '[{"day":"Everyday","open":"10:00","close":"22:00"}]'::jsonb,
    '5 km',
    '25-35 min',
    true,
    '{"auto_accept_orders":false,"order_notifications":true,"allow_special_instructions":true}'::jsonb
  ),
  (
    'smoke-store-04',
    '11111111-1111-4111-8111-111111111111',
    'Smoke Test Curry Desk',
    'Ho Chi Minh City',
    true,
    '104 Nguyen Dinh Chieu, Da Kao Ward, District 1, Ho Chi Minh City',
    '+84 28 7300 3004',
    'smoke-store-04@deliberry.local',
    4.6,
    0,
    'open',
    'Curry',
    '[{"day":"Everyday","open":"10:00","close":"22:00"}]'::jsonb,
    '5 km',
    '22-32 min',
    true,
    '{"auto_accept_orders":false,"order_notifications":true,"allow_special_instructions":true}'::jsonb
  ),
  (
    'smoke-store-05',
    '11111111-1111-4111-8111-111111111111',
    'Smoke Test Salad Works',
    'Ho Chi Minh City',
    true,
    '105 Tran Hung Dao, Co Giang Ward, District 1, Ho Chi Minh City',
    '+84 28 7300 3005',
    'smoke-store-05@deliberry.local',
    4.2,
    0,
    'open',
    'Salads',
    '[{"day":"Everyday","open":"10:00","close":"22:00"}]'::jsonb,
    '3 km',
    '15-25 min',
    true,
    '{"auto_accept_orders":false,"order_notifications":true,"allow_special_instructions":true}'::jsonb
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
    'menu-smoke-01-001',
    'smoke-store-01',
    'Smoke Arepa Combo',
    'Arepa, beans, plantain, and avocado for concurrent order smoke testing.',
    'Smoke Orders',
    129000,
    '#F6A15A',
    true,
    true,
    1
  ),
  (
    'menu-smoke-01-002',
    'smoke-store-01',
    'Smoke Guava Juice',
    'Seeded drink item used by the smoke order harness.',
    'Smoke Orders',
    32000,
    '#F47B80',
    false,
    true,
    2
  ),
  (
    'menu-smoke-02-001',
    'smoke-store-02',
    'Smoke Noodle Bowl',
    'Noodle bowl with vegetables and broth for concurrent order smoke testing.',
    'Smoke Orders',
    118000,
    '#F0C75E',
    true,
    true,
    1
  ),
  (
    'menu-smoke-02-002',
    'smoke-store-02',
    'Smoke Spring Rolls',
    'Seeded side item used by the smoke order harness.',
    'Smoke Orders',
    45000,
    '#79BF84',
    false,
    true,
    2
  ),
  (
    'menu-smoke-03-001',
    'smoke-store-03',
    'Smoke Margherita Pizza',
    'Personal pizza for concurrent order smoke testing.',
    'Smoke Orders',
    135000,
    '#E97764',
    true,
    true,
    1
  ),
  (
    'menu-smoke-03-002',
    'smoke-store-03',
    'Smoke Garlic Knots',
    'Seeded side item used by the smoke order harness.',
    'Smoke Orders',
    39000,
    '#D9A657',
    false,
    true,
    2
  ),
  (
    'menu-smoke-04-001',
    'smoke-store-04',
    'Smoke Curry Rice',
    'Curry rice bowl for concurrent order smoke testing.',
    'Smoke Orders',
    122000,
    '#C98D44',
    true,
    true,
    1
  ),
  (
    'menu-smoke-04-002',
    'smoke-store-04',
    'Smoke Cucumber Raita',
    'Seeded side item used by the smoke order harness.',
    'Smoke Orders',
    28000,
    '#8BC6A3',
    false,
    true,
    2
  ),
  (
    'menu-smoke-05-001',
    'smoke-store-05',
    'Smoke Harvest Salad',
    'Salad bowl for concurrent order smoke testing.',
    'Smoke Orders',
    99000,
    '#76B86C',
    true,
    true,
    1
  ),
  (
    'menu-smoke-05-002',
    'smoke-store-05',
    'Smoke Berry Tea',
    'Seeded drink item used by the smoke order harness.',
    'Smoke Orders',
    26000,
    '#B46FA9',
    false,
    true,
    2
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

insert into public.merchant_memberships (
  user_id,
  store_id,
  role,
  is_default
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'smoke-store-01',
    'merchant_owner',
    false
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'smoke-store-02',
    'merchant_owner',
    false
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'smoke-store-03',
    'merchant_owner',
    false
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'smoke-store-04',
    'merchant_owner',
    false
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'smoke-store-05',
    'merchant_owner',
    false
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
  'VND',
    timezone('utc', now()) - interval '20 minutes',
    null,
    null,
    null,
    'Maria Gomez',
    '+84 28 7300 2001',
    '210 Nguyen Thai Hoc, Co Giang Ward, District 1, Ho Chi Minh City',
    'Ring doorbell twice please',
    525000,
    35000,
    timezone('utc', now()) + interval '25 minutes',
    '[
      {"name":"Com Tam Suon Nuong","quantity":2,"unit_price_centavos":185000,"modifiers":["Extra fried egg"]},
      {"name":"Goi Cuon","quantity":1,"unit_price_centavos":80000},
      {"name":"Che Ba Mau","quantity":2,"unit_price_centavos":75000}
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
    'VND',
    timezone('utc', now()) - interval '45 minutes',
    timezone('utc', now()) - interval '40 minutes',
    timezone('utc', now()) - interval '30 minutes',
    null,
    'Carlos Ruiz',
    '+84 28 7300 2002',
    '450 Cach Mang Thang Tam, Ward 11, District 3, Ho Chi Minh City',
    null,
    330000,
    35000,
    timezone('utc', now()) + interval '10 minutes',
    '[
      {"name":"Bun Thit Nuong","quantity":1,"unit_price_centavos":150000},
      {"name":"Cha Gio Tom Cua","quantity":2,"unit_price_centavos":90000}
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
    'VND',
    timezone('utc', now()) - interval '70 minutes',
    timezone('utc', now()) - interval '65 minutes',
    timezone('utc', now()) - interval '55 minutes',
    timezone('utc', now()) - interval '5 minutes',
    'Maria Gomez',
    '+84 28 7300 2001',
    '890 Dien Bien Phu, Ward 10, District 10, Ho Chi Minh City',
    'Free delivery promo applied',
    710000,
    0,
    timezone('utc', now()) + interval '5 minutes',
    '[
      {"name":"Lau Ga La E","quantity":1,"unit_price_centavos":420000},
      {"name":"Bo La Lot","quantity":1,"unit_price_centavos":120000},
      {"name":"Tra Dao","quantity":2,"unit_price_centavos":85000}
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
    'Goi cuon va thit nuong rat vua mieng. Ben cua hang chuan bi cung kha nhanh.',
    '["Fresh food","Fast prep"]'::jsonb,
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
    'Mon an ngon, nhung luc lay don hoi tre hon du kien mot chut.',
    '["Accurate order","Worth the price"]'::jsonb,
    'Cam on ban da gop y. Toi nay ben minh da siet lai quy trinh giao don tai diem lay hang.',
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
    'Mon an ngon, nhung ly nuoc va hop trang mieng van nen dong chac hon.',
    '["Needs packaging work"]'::jsonb,
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

with settlement_seed (
  settlement_id,
  restaurant_id,
  source_system,
  period_start,
  period_end,
  period_label,
  gross_total,
  total_deductions,
  net_settlement,
  status,
  received_at,
  order_count
) as (
  values
    (
      '90000000-0000-4000-8000-000000000001'::uuid,
      'demo-store',
      'deliberry',
      date '2026-03-08',
      date '2026-03-14',
      '2026-03-08_to_2026-03-14',
      845650,
      131348,
      714302,
      'pending',
      null::timestamptz,
      187
    ),
    (
      '90000000-0000-4000-8000-000000000002'::uuid,
      'demo-store',
      'deliberry',
      date '2026-03-01',
      date '2026-03-07',
      '2026-03-01_to_2026-03-07',
      723400,
      108510,
      614890,
      'calculated',
      null::timestamptz,
      162
    ),
    (
      '90000000-0000-4000-8000-000000000003'::uuid,
      'demo-store',
      'deliberry',
      date '2026-02-22',
      date '2026-02-28',
      '2026-02-22_to_2026-02-28',
      789050,
      120608,
      668442,
      'received',
      '2026-03-03T12:00:00Z'::timestamptz,
      174
    ),
    (
      '90000000-0000-4000-8000-000000000004'::uuid,
      'demo-store',
      'deliberry',
      date '2026-02-15',
      date '2026-02-21',
      '2026-02-15_to_2026-02-21',
      699800,
      104970,
      594830,
      'adjusted',
      null::timestamptz,
      156
    ),
    (
      '90000000-0000-4000-8000-000000000005'::uuid,
      'demo-store',
      'deliberry',
      date '2026-02-08',
      date '2026-02-14',
      '2026-02-08_to_2026-02-14',
      654200,
      99630,
      554570,
      'received',
      '2026-02-17T12:00:00Z'::timestamptz,
      148
    )
)
insert into public.delivery_settlements (
  id,
  restaurant_id,
  source_system,
  period_start,
  period_end,
  period_label,
  gross_total,
  total_deductions,
  net_settlement,
  status,
  received_at,
  notes
)
select
  settlement_id,
  restaurant_id,
  source_system,
  period_start,
  period_end,
  period_label,
  gross_total,
  total_deductions,
  net_settlement,
  status,
  received_at,
  'Local settlement visibility seed for demo-store'
from settlement_seed
on conflict (id) do update
set
  restaurant_id = excluded.restaurant_id,
  source_system = excluded.source_system,
  period_start = excluded.period_start,
  period_end = excluded.period_end,
  period_label = excluded.period_label,
  gross_total = excluded.gross_total,
  total_deductions = excluded.total_deductions,
  net_settlement = excluded.net_settlement,
  status = excluded.status,
  received_at = excluded.received_at,
  notes = excluded.notes,
  updated_at = timezone('utc', now());

insert into public.delivery_settlement_items (
  id,
  settlement_id,
  item_type,
  amount,
  description
)
values
  (
    '91000000-0000-4000-8000-000000000001'::uuid,
    '90000000-0000-4000-8000-000000000001'::uuid,
    'platform_commission',
    126848,
    'Platform commission at seeded demo rate'
  ),
  (
    '91000000-0000-4000-8000-000000000002'::uuid,
    '90000000-0000-4000-8000-000000000001'::uuid,
    'manual_adjustment',
    4500,
    'Packaging quality goodwill adjustment'
  ),
  (
    '91000000-0000-4000-8000-000000000003'::uuid,
    '90000000-0000-4000-8000-000000000002'::uuid,
    'platform_commission',
    108510,
    'Platform commission at seeded demo rate'
  ),
  (
    '91000000-0000-4000-8000-000000000004'::uuid,
    '90000000-0000-4000-8000-000000000003'::uuid,
    'platform_commission',
    118358,
    'Platform commission at seeded demo rate'
  ),
  (
    '91000000-0000-4000-8000-000000000005'::uuid,
    '90000000-0000-4000-8000-000000000003'::uuid,
    'manual_adjustment',
    2250,
    'Delivery delay recovery adjustment'
  ),
  (
    '91000000-0000-4000-8000-000000000006'::uuid,
    '90000000-0000-4000-8000-000000000004'::uuid,
    'platform_commission',
    104970,
    'Platform commission at seeded demo rate'
  ),
  (
    '91000000-0000-4000-8000-000000000007'::uuid,
    '90000000-0000-4000-8000-000000000005'::uuid,
    'platform_commission',
    98130,
    'Platform commission at seeded demo rate'
  ),
  (
    '91000000-0000-4000-8000-000000000008'::uuid,
    '90000000-0000-4000-8000-000000000005'::uuid,
    'manual_adjustment',
    1500,
    'Promo delivery cost recovery'
  )
on conflict (id) do nothing;

with settlement_seed (
  settlement_id,
  restaurant_id,
  source_system,
  period_end,
  period_label,
  gross_total,
  order_count
) as (
  values
    (
      '90000000-0000-4000-8000-000000000001'::uuid,
      'demo-store',
      'deliberry',
      date '2026-03-14',
      '2026-03-08_to_2026-03-14',
      845650,
      187
    ),
    (
      '90000000-0000-4000-8000-000000000002'::uuid,
      'demo-store',
      'deliberry',
      date '2026-03-07',
      '2026-03-01_to_2026-03-07',
      723400,
      162
    ),
    (
      '90000000-0000-4000-8000-000000000003'::uuid,
      'demo-store',
      'deliberry',
      date '2026-02-28',
      '2026-02-22_to_2026-02-28',
      789050,
      174
    ),
    (
      '90000000-0000-4000-8000-000000000004'::uuid,
      'demo-store',
      'deliberry',
      date '2026-02-21',
      '2026-02-15_to_2026-02-21',
      699800,
      156
    ),
    (
      '90000000-0000-4000-8000-000000000005'::uuid,
      'demo-store',
      'deliberry',
      date '2026-02-14',
      '2026-02-08_to_2026-02-14',
      654200,
      148
    )
)
insert into public.external_sales (
  restaurant_id,
  source_system,
  external_order_id,
  sales_channel,
  gross_amount,
  discount_amount,
  delivery_fee,
  net_amount,
  currency,
  order_status,
  is_revenue,
  completed_at,
  payload,
  settlement_id
)
select
  seed.restaurant_id,
  seed.source_system,
  format('%s-sale-%s', seed.period_label, series.n),
  'delivery',
  greatest(1, seed.gross_total / seed.order_count),
  0,
  0,
  greatest(1, seed.gross_total / seed.order_count),
    'VND',
  'completed',
  true,
  timezone('utc', seed.period_end::timestamp) + interval '12 hours',
  jsonb_build_object(
    'seed', 'settlement_demo',
    'period_label', seed.period_label,
    'sequence', series.n
  ),
  seed.settlement_id
from settlement_seed as seed
cross join lateral generate_series(1, seed.order_count) as series(n)
on conflict (source_system, external_order_id) do update
set
  restaurant_id = excluded.restaurant_id,
  sales_channel = excluded.sales_channel,
  gross_amount = excluded.gross_amount,
  discount_amount = excluded.discount_amount,
  delivery_fee = excluded.delivery_fee,
  net_amount = excluded.net_amount,
  currency = excluded.currency,
  order_status = excluded.order_status,
  is_revenue = excluded.is_revenue,
  completed_at = excluded.completed_at,
  payload = excluded.payload,
  settlement_id = excluded.settlement_id;

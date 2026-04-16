with target_store as (
  select id
  from public.stores
  where id = 'demo-store'
     or name = 'Sabor Criollo Kitchen'
  order by case when id = 'demo-store' then 0 else 1 end
  limit 1
)
update public.stores
set
  status = 'open',
  accepting_orders = true,
  is_open = true,
  updated_at = timezone('utc', now())
where id in (select id from target_store);

with target_store as (
  select id
  from public.stores
  where id = 'demo-store'
     or name = 'Sabor Criollo Kitchen'
  order by case when id = 'demo-store' then 0 else 1 end
  limit 1
),
menu_seed (
  seed_id,
  name,
  description,
  category,
  price_centavos,
  image_color_hex,
  is_popular,
  is_available,
  sort_order
) as (
  values
    (
      'menu-demo-001',
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
      'Vino Malbec Copa',
      'Glass of Mendoza Malbec served slightly chilled.',
      'Drinks',
      85000,
      '#A1887F',
      false,
      true,
      8
    )
)
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
select
  menu_seed.seed_id,
  target_store.id,
  menu_seed.name,
  menu_seed.description,
  menu_seed.category,
  menu_seed.price_centavos,
  menu_seed.image_color_hex,
  menu_seed.is_popular,
  menu_seed.is_available,
  menu_seed.sort_order
from menu_seed
cross join target_store
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

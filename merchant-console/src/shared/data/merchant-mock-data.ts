// ============================================================
// MERCHANT CONSOLE — MOCK DATA
// Realistic operational data for a food delivery merchant
// ============================================================

// R-040/R-041: Status types derived from canonical domain adapter (not local literals).
// R-010/R-011: Money fields are integer centavos.
// R-050/R-051: Timestamps are UTC ISO 8601 strings.
import type { OrderStatus, PaymentMethodPlaceholder, PromotionType, SettlementState } from "../domain";

// --- Types ---

export type MerchantStoreInfo = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  status: "open" | "closed" | "paused";
  cuisineType: string;
  hours: { day: string; open: string; close: string }[];
  deliveryRadius: string;
  avgPrepTime: string;
  acceptingOrders: boolean;
};

// R-013 note: KPI `value` is a pre-formatted display string, not a canonical money field.
// KPIs mix money, counts, percentages, and durations in a single display type.
// Money-semantic KPI values use inline formatting as a presentation-layer concern.
export type DashboardKPI = {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  icon: string;
};

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
};

export type MerchantOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  // R-040/R-041: Derived from canonical OrderStatus — not a local literal union.
  status: OrderStatus;
  // R-040/R-041: Derived from canonical PaymentMethodPlaceholder — not a local literal.
  paymentMethod: PaymentMethodPlaceholder;
  createdAt: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  notes?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  sortOrder: number;
  itemCount: number;
  active: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  available: boolean;
  popular: boolean;
  imageUrl: string;
  preparationTime: string;
};

export type MerchantReview = {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  orderId: string;
  responded: boolean;
  response?: string;
  responseDate?: string;
};

export type Promotion = {
  id: string;
  name: string;
  code: string;
  // R-040/R-041: Derived from canonical PromotionType — not a local literal union.
  type: PromotionType;
  value: number;
  minOrder: number;
  usageCount: number;
  maxUses: number;
  active: boolean;
  startsAt: string;
  expiresAt: string;
};

export type SettlementRecord = {
  id: string;
  periodStart: string; // ISO 8601 date (R-050, DATE.md)
  periodEnd: string;   // ISO 8601 date (R-050, DATE.md)
  orderCount: number;
  grossAmount: number;
  commission: number;
  adjustments: number;
  netAmount: number;
  // R-040/R-041: Derived from canonical SettlementState — not a local literal union.
  status: SettlementState;
  paidAt?: string;
};

// R-013 note: AnalyticsMetric `value` is a pre-formatted display string (same rationale as DashboardKPI).
export type AnalyticsMetric = {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down" | "neutral";
};

export type TopSellingItem = {
  name: string;
  orders: number;
  revenue: number;
};

export type DailyRevenue = {
  day: string;
  revenue: number;
  orders: number;
};

// --- Mock Data Instances ---

export const mockStore: MerchantStoreInfo = {
  id: "demo-store",
  name: "Sabor Criollo Kitchen",
  address: "Av. Corrientes 1234, Buenos Aires",
  phone: "+54 11 4567-8900",
  email: "info@saborcriollo.com",
  rating: 4.6,
  reviewCount: 847,
  status: "open",
  cuisineType: "Argentine / Latin American",
  hours: [
    { day: "Monday", open: "10:00", close: "23:00" },
    { day: "Tuesday", open: "10:00", close: "23:00" },
    { day: "Wednesday", open: "10:00", close: "23:00" },
    { day: "Thursday", open: "10:00", close: "23:30" },
    { day: "Friday", open: "10:00", close: "00:00" },
    { day: "Saturday", open: "11:00", close: "00:00" },
    { day: "Sunday", open: "11:00", close: "22:00" },
  ],
  deliveryRadius: "5 km",
  avgPrepTime: "25-35 min",
  acceptingOrders: true,
};

export const mockKPIs: DashboardKPI[] = [
  { label: "Today's Revenue", value: "$2,847", trend: "+12.3%", trendDirection: "up", icon: "revenue" },
  { label: "Active Orders", value: "8", trend: "+3", trendDirection: "up", icon: "orders" },
  { label: "Avg Prep Time", value: "28 min", trend: "-2 min", trendDirection: "down", icon: "time" },
  { label: "Today's Rating", value: "4.8", trend: "+0.2", trendDirection: "up", icon: "rating" },
];

export const mockOrders: MerchantOrder[] = [
  {
    id: "ord-001",
    orderNumber: "#1247",
    customerName: "Maria G.",
    customerPhone: "+54 11 2345-6789",
    items: [
      { name: "Milanesa Napolitana", quantity: 2, price: 185000, modifiers: ["Extra cheese"] },
      { name: "Ensalada Mixta", quantity: 1, price: 80000 },
      { name: "Flan con Dulce de Leche", quantity: 2, price: 75000 },
    ],
    subtotal: 525000,
    deliveryFee: 35000,
    total: 560000,
    status: "pending",
    paymentMethod: "card",
    createdAt: "2026-03-16T17:28:00Z",
    estimatedDelivery: "2026-03-16T18:03:00Z",
    deliveryAddress: "Av. Santa Fe 2100, 3B",
    notes: "Ring doorbell twice please",
  },
  {
    id: "ord-002",
    orderNumber: "#1246",
    customerName: "Carlos R.",
    customerPhone: "+54 11 3456-7890",
    items: [
      { name: "Empanadas Surtidas x6", quantity: 1, price: 150000 },
      { name: "Choripan Completo", quantity: 2, price: 90000 },
    ],
    subtotal: 330000,
    deliveryFee: 35000,
    total: 365000,
    status: "preparing",
    paymentMethod: "cash",
    createdAt: "2026-03-16T17:18:00Z",
    estimatedDelivery: "2026-03-16T17:43:00Z",
    deliveryAddress: "Calle Florida 450, PB",
  },
  {
    id: "ord-003",
    orderNumber: "#1245",
    customerName: "Laura P.",
    customerPhone: "+54 11 4567-8901",
    items: [
      { name: "Asado para 2", quantity: 1, price: 420000 },
      { name: "Provoleta", quantity: 1, price: 120000 },
      { name: "Vino Malbec Copa", quantity: 2, price: 85000 },
    ],
    subtotal: 710000,
    deliveryFee: 0,
    total: 710000,
    status: "ready",
    paymentMethod: "card",
    createdAt: "2026-03-16T17:02:00Z",
    estimatedDelivery: "2026-03-16T17:40:00Z",
    deliveryAddress: "Av. Callao 890, 5A",
    notes: "Free delivery promo applied",
  },
  {
    id: "ord-004",
    orderNumber: "#1244",
    customerName: "Diego M.",
    customerPhone: "+54 11 5678-9012",
    items: [
      { name: "Pizza Fugazzeta", quantity: 1, price: 160000 },
      { name: "Cerveza Artesanal", quantity: 2, price: 65000 },
    ],
    subtotal: 290000,
    deliveryFee: 35000,
    total: 325000,
    status: "in_transit",
    paymentMethod: "card",
    createdAt: "2026-03-16T16:45:00Z",
    estimatedDelivery: "2026-03-16T17:35:00Z",
    deliveryAddress: "Av. Rivadavia 3200",
  },
  {
    id: "ord-005",
    orderNumber: "#1243",
    customerName: "Sofia L.",
    customerPhone: "+54 11 6789-0123",
    items: [
      { name: "Lomo Saltado", quantity: 1, price: 220000 },
      { name: "Agua Mineral", quantity: 1, price: 30000 },
    ],
    subtotal: 250000,
    deliveryFee: 35000,
    total: 285000,
    status: "delivered",
    paymentMethod: "card",
    createdAt: "2026-03-16T16:30:00Z",
    estimatedDelivery: "2026-03-16T17:05:00Z",
    deliveryAddress: "Av. Libertador 1500, 2C",
  },
  {
    id: "ord-006",
    orderNumber: "#1242",
    customerName: "Pablo V.",
    customerPhone: "+54 11 7890-1234",
    items: [
      { name: "Empanadas Carne x12", quantity: 1, price: 280000 },
    ],
    subtotal: 280000,
    deliveryFee: 35000,
    total: 315000,
    status: "delivered",
    paymentMethod: "cash",
    createdAt: "2026-03-16T15:30:00Z",
    estimatedDelivery: "2026-03-16T16:05:00Z",
    deliveryAddress: "Calle Defensa 700",
  },
  {
    id: "ord-007",
    orderNumber: "#1241",
    customerName: "Ana B.",
    customerPhone: "+54 11 8901-2345",
    items: [
      { name: "Milanesa a Caballo", quantity: 1, price: 200000 },
      { name: "Papas Fritas", quantity: 1, price: 70000 },
      { name: "Helado 3 Gustos", quantity: 1, price: 90000 },
    ],
    subtotal: 360000,
    deliveryFee: 35000,
    total: 395000,
    status: "cancelled",
    paymentMethod: "card",
    createdAt: "2026-03-16T14:30:00Z",
    estimatedDelivery: "2026-03-16T15:05:00Z",
    deliveryAddress: "Av. Cabildo 2400, 8D",
    notes: "Customer requested cancellation",
  },
];

export const mockCategories: MenuCategory[] = [
  { id: "cat-1", name: "Empanadas", sortOrder: 1, itemCount: 6, active: true },
  { id: "cat-2", name: "Parrilla", sortOrder: 2, itemCount: 5, active: true },
  { id: "cat-3", name: "Milanesas", sortOrder: 3, itemCount: 4, active: true },
  { id: "cat-4", name: "Pizzas", sortOrder: 4, itemCount: 4, active: true },
  { id: "cat-5", name: "Ensaladas", sortOrder: 5, itemCount: 3, active: true },
  { id: "cat-6", name: "Postres", sortOrder: 6, itemCount: 5, active: true },
  { id: "cat-7", name: "Bebidas", sortOrder: 7, itemCount: 8, active: true },
  { id: "cat-8", name: "Especiales de Temporada", sortOrder: 8, itemCount: 2, active: false },
];

export const mockMenuItems: MenuItem[] = [
  { id: "item-1", name: "Empanadas de Carne", description: "Traditional beef empanadas with hand-crimped edges", price: 45000, categoryId: "cat-1", categoryName: "Empanadas", available: true, popular: true, imageUrl: "/menu/empanadas-carne.jpg", preparationTime: "15 min" },
  { id: "item-2", name: "Empanadas de Pollo", description: "Chicken empanadas with onion and bell pepper", price: 45000, categoryId: "cat-1", categoryName: "Empanadas", available: true, popular: false, imageUrl: "/menu/empanadas-pollo.jpg", preparationTime: "15 min" },
  { id: "item-3", name: "Empanadas de Jamón y Queso", description: "Ham and cheese empanadas, baked golden", price: 45000, categoryId: "cat-1", categoryName: "Empanadas", available: true, popular: false, imageUrl: "/menu/empanadas-jq.jpg", preparationTime: "15 min" },
  { id: "item-4", name: "Empanadas Surtidas x6", description: "Mixed half-dozen: 2 carne, 2 pollo, 2 jamón y queso", price: 150000, categoryId: "cat-1", categoryName: "Empanadas", available: true, popular: true, imageUrl: "/menu/empanadas-surtidas.jpg", preparationTime: "18 min" },
  { id: "item-5", name: "Asado para 2", description: "Mixed grill platter with chimichurri and grilled vegetables", price: 420000, categoryId: "cat-2", categoryName: "Parrilla", available: true, popular: true, imageUrl: "/menu/asado.jpg", preparationTime: "35 min" },
  { id: "item-6", name: "Choripan Completo", description: "Grilled chorizo on bread with chimichurri and criolla salsa", price: 90000, categoryId: "cat-2", categoryName: "Parrilla", available: true, popular: true, imageUrl: "/menu/choripan.jpg", preparationTime: "15 min" },
  { id: "item-7", name: "Provoleta", description: "Grilled provolone cheese with oregano and chili flakes", price: 120000, categoryId: "cat-2", categoryName: "Parrilla", available: true, popular: false, imageUrl: "/menu/provoleta.jpg", preparationTime: "12 min" },
  { id: "item-8", name: "Milanesa Napolitana", description: "Breaded beef cutlet with tomato sauce, ham, and melted cheese", price: 185000, categoryId: "cat-3", categoryName: "Milanesas", available: true, popular: true, imageUrl: "/menu/milanesa-napo.jpg", preparationTime: "25 min" },
  { id: "item-9", name: "Milanesa a Caballo", description: "Classic milanesa topped with two fried eggs", price: 200000, categoryId: "cat-3", categoryName: "Milanesas", available: true, popular: false, imageUrl: "/menu/milanesa-caballo.jpg", preparationTime: "25 min" },
  { id: "item-10", name: "Pizza Fugazzeta", description: "Double-crust pizza filled with mozzarella and onions", price: 160000, categoryId: "cat-4", categoryName: "Pizzas", available: true, popular: false, imageUrl: "/menu/fugazzeta.jpg", preparationTime: "20 min" },
  { id: "item-11", name: "Pizza Muzza", description: "Classic mozzarella pizza with oregano", price: 140000, categoryId: "cat-4", categoryName: "Pizzas", available: true, popular: false, imageUrl: "/menu/muzza.jpg", preparationTime: "18 min" },
  { id: "item-12", name: "Lomo Saltado", description: "Stir-fried beef tenderloin with tomatoes, onions, and fries", price: 220000, categoryId: "cat-2", categoryName: "Parrilla", available: true, popular: false, imageUrl: "/menu/lomo-saltado.jpg", preparationTime: "25 min" },
  { id: "item-13", name: "Ensalada Mixta", description: "Fresh mixed greens with tomato, onion, and olive oil dressing", price: 80000, categoryId: "cat-5", categoryName: "Ensaladas", available: true, popular: false, imageUrl: "/menu/ensalada.jpg", preparationTime: "8 min" },
  { id: "item-14", name: "Ensalada César", description: "Romaine, parmesan, croutons with Caesar dressing", price: 100000, categoryId: "cat-5", categoryName: "Ensaladas", available: false, popular: false, imageUrl: "/menu/cesar.jpg", preparationTime: "10 min" },
  { id: "item-15", name: "Flan con Dulce de Leche", description: "Homemade flan with dulce de leche and whipped cream", price: 75000, categoryId: "cat-6", categoryName: "Postres", available: true, popular: true, imageUrl: "/menu/flan.jpg", preparationTime: "5 min" },
  { id: "item-16", name: "Helado 3 Gustos", description: "Three scoops of artisan ice cream, choose your flavors", price: 90000, categoryId: "cat-6", categoryName: "Postres", available: true, popular: false, imageUrl: "/menu/helado.jpg", preparationTime: "5 min" },
  { id: "item-17", name: "Papas Fritas", description: "Crispy golden fries with chimichurri mayo", price: 70000, categoryId: "cat-5", categoryName: "Ensaladas", available: true, popular: false, imageUrl: "/menu/papas.jpg", preparationTime: "12 min" },
  { id: "item-18", name: "Cerveza Artesanal", description: "Local craft beer, IPA or Amber Ale", price: 65000, categoryId: "cat-7", categoryName: "Bebidas", available: true, popular: false, imageUrl: "/menu/cerveza.jpg", preparationTime: "1 min" },
  { id: "item-19", name: "Vino Malbec Copa", description: "Mendoza Malbec, served by the glass", price: 85000, categoryId: "cat-7", categoryName: "Bebidas", available: true, popular: false, imageUrl: "/menu/malbec.jpg", preparationTime: "1 min" },
  { id: "item-20", name: "Agua Mineral", description: "Still or sparkling mineral water 500ml", price: 30000, categoryId: "cat-7", categoryName: "Bebidas", available: true, popular: false, imageUrl: "/menu/agua.jpg", preparationTime: "1 min" },
];

export const mockReviews: MerchantReview[] = [
  {
    id: "rev-1",
    customerName: "Maria G.",
    rating: 5,
    text: "Incredible milanesa napolitana! Just like my grandmother used to make. The delivery was fast and everything arrived hot.",
    date: "2026-03-16T16:30:00Z",
    orderId: "#1240",
    responded: false,
  },
  {
    id: "rev-2",
    customerName: "Pablo V.",
    rating: 4,
    text: "Great empanadas, very authentic. Only knocked one star because the order took slightly longer than expected.",
    date: "2026-03-16T14:15:00Z",
    orderId: "#1238",
    responded: true,
    response: "Thank you Pablo! We're working on improving our prep times during peak hours. Glad you enjoyed the empanadas!",
    responseDate: "2026-03-16T14:45:00Z",
  },
  {
    id: "rev-3",
    customerName: "Sofia L.",
    rating: 5,
    text: "The asado para 2 was perfect. Generous portions and the chimichurri is the best I've had from a delivery.",
    date: "2026-03-15T23:45:00Z",
    orderId: "#1235",
    responded: true,
    response: "Thank you Sofia! Our chimichurri is made fresh daily. Hope to serve you again soon!",
    responseDate: "2026-03-16T00:00:00Z",
  },
  {
    id: "rev-4",
    customerName: "Lucas T.",
    rating: 3,
    text: "Food quality was good but the pizza arrived a bit cold. Packaging could be better for hot items.",
    date: "2026-03-15T17:00:00Z",
    orderId: "#1232",
    responded: false,
  },
  {
    id: "rev-5",
    customerName: "Ana B.",
    rating: 5,
    text: "Best flan in Buenos Aires! Ordering again this weekend for sure.",
    date: "2026-03-12T22:30:00Z",
    orderId: "#1228",
    responded: true,
    response: "You're too kind, Ana! Our chef will be thrilled. See you this weekend!",
    responseDate: "2026-03-12T23:00:00Z",
  },
  {
    id: "rev-6",
    customerName: "Roberto K.",
    rating: 4,
    text: "Solid choripanes and good craft beer selection. Will definitely order again.",
    date: "2026-03-12T00:15:00Z",
    orderId: "#1225",
    responded: false,
  },
];

export const mockPromotions: Promotion[] = [
  {
    id: "promo-1",
    name: "Welcome Discount",
    code: "BIENVENIDO15",
    type: "percentage",
    value: 15,
    minOrder: 200000,
    usageCount: 142,
    maxUses: 500,
    active: true,
    startsAt: "2026-03-01T03:00:00Z",
    expiresAt: "2026-04-01T02:59:59Z",
  },
  {
    id: "promo-2",
    name: "Free Delivery Weekend",
    code: "FREEDELIVERY",
    type: "free_delivery",
    value: 0,
    minOrder: 300000,
    usageCount: 89,
    maxUses: 200,
    active: true,
    startsAt: "2026-03-14T03:00:00Z",
    expiresAt: "2026-03-17T02:59:59Z",
  },
  {
    id: "promo-3",
    name: "Lunch Special",
    code: "ALMUERZO10",
    type: "fixed",
    value: 100000,
    minOrder: 250000,
    usageCount: 67,
    maxUses: 300,
    active: true,
    startsAt: "2026-03-01T03:00:00Z",
    expiresAt: "2026-05-01T02:59:59Z",
  },
  {
    id: "promo-4",
    name: "Holiday Bonus",
    code: "FIESTAS20",
    type: "percentage",
    value: 20,
    minOrder: 400000,
    usageCount: 200,
    maxUses: 200,
    active: false,
    startsAt: "2025-12-20T03:00:00Z",
    expiresAt: "2026-01-05T02:59:59Z",
  },
];

export const mockSettlements: SettlementRecord[] = [
  {
    id: "stl-1",
    periodStart: "2026-03-08",
    periodEnd: "2026-03-14",
    orderCount: 187,
    grossAmount: 845650,
    commission: 126848,
    adjustments: -4500,
    netAmount: 714302,
    status: "pending",
  },
  {
    id: "stl-2",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-07",
    orderCount: 162,
    grossAmount: 723400,
    commission: 108510,
    adjustments: 0,
    netAmount: 614890,
    status: "processing",
  },
  {
    id: "stl-3",
    periodStart: "2026-02-22",
    periodEnd: "2026-02-28",
    orderCount: 174,
    grossAmount: 789050,
    commission: 118358,
    adjustments: -2250,
    netAmount: 668442,
    status: "paid",
    paidAt: "2026-03-03T12:00:00Z",
  },
  {
    id: "stl-4",
    periodStart: "2026-02-15",
    periodEnd: "2026-02-21",
    orderCount: 156,
    grossAmount: 699800,
    commission: 104970,
    adjustments: 0,
    netAmount: 594830,
    status: "paid",
    paidAt: "2026-02-24T12:00:00Z",
  },
  {
    id: "stl-5",
    periodStart: "2026-02-08",
    periodEnd: "2026-02-14",
    orderCount: 148,
    grossAmount: 654200,
    commission: 98130,
    adjustments: -1500,
    netAmount: 554570,
    status: "paid",
    paidAt: "2026-02-17T12:00:00Z",
  },
];

export const mockAnalyticsMetrics: AnalyticsMetric[] = [
  { label: "This Week Revenue", value: "$8,456", change: "+18.2%", changeDirection: "up" },
  { label: "Total Orders", value: "187", change: "+15.4%", changeDirection: "up" },
  { label: "Avg Order Value", value: "$45.22", change: "+2.4%", changeDirection: "up" },
  { label: "Completion Rate", value: "96.8%", change: "+1.2%", changeDirection: "up" },
  { label: "Avg Delivery Time", value: "32 min", change: "-3 min", changeDirection: "down" },
  { label: "Customer Return Rate", value: "42%", change: "+5%", changeDirection: "up" },
];

export const mockTopSellingItems: TopSellingItem[] = [
  { name: "Empanadas Surtidas x6", orders: 48, revenue: 7200000 },
  { name: "Milanesa Napolitana", orders: 42, revenue: 7770000 },
  { name: "Asado para 2", orders: 28, revenue: 11760000 },
  { name: "Choripan Completo", orders: 35, revenue: 3150000 },
  { name: "Flan con Dulce de Leche", orders: 31, revenue: 2325000 },
];

export const mockDailyRevenue: DailyRevenue[] = [
  { day: "Mon", revenue: 98000, orders: 22 },
  { day: "Tue", revenue: 112000, orders: 25 },
  { day: "Wed", revenue: 105000, orders: 24 },
  { day: "Thu", revenue: 134000, orders: 30 },
  { day: "Fri", revenue: 158000, orders: 35 },
  { day: "Sat", revenue: 162000, orders: 36 },
  { day: "Sun", revenue: 76600, orders: 15 },
];

export const mockRecentAlerts = [
  { id: "alert-1", type: "warning" as const, message: "Low stock: Ensalada César marked unavailable", time: "2026-03-16T17:20:00Z" },
  { id: "alert-2", type: "info" as const, message: "New promotion FREEDELIVERY activated for this weekend", time: "2026-03-16T16:30:00Z" },
  { id: "alert-3", type: "success" as const, message: "Weekly settlement of $6,148.90 is being processed", time: "2026-03-16T14:30:00Z" },
  { id: "alert-4", type: "warning" as const, message: "2 reviews awaiting response", time: "2026-03-16T12:30:00Z" },
];

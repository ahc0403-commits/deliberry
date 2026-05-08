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
  receivedAt?: string;
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
  name: "Saigon Home Kitchen",
  address: "45 Nguyen Trai, District 1, Ho Chi Minh City",
  phone: "+84 28 3822 4567",
  email: "info@saigonhomekitchen.vn",
  rating: 4.6,
  reviewCount: 847,
  status: "open",
  cuisineType: "Vietnamese / Asian Fusion",
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
  { label: "Today's Revenue", value: "₫2,847,000", trend: "+12.3%", trendDirection: "up", icon: "revenue" },
  { label: "Active Orders", value: "8", trend: "+3", trendDirection: "up", icon: "orders" },
  { label: "Avg Prep Time", value: "28 min", trend: "-2 min", trendDirection: "down", icon: "time" },
  { label: "Today's Rating", value: "4.8", trend: "+0.2", trendDirection: "up", icon: "rating" },
];

export const mockOrders: MerchantOrder[] = [
  {
    id: "ord-001",
    orderNumber: "#1247",
    customerName: "Maria G.",
    customerPhone: "+84 912 345 678",
    items: [
      { name: "Bun Thit Nuong", quantity: 2, price: 185000, modifiers: ["Extra herbs"] },
      { name: "Bo La Lot", quantity: 1, price: 80000 },
      { name: "Che Ba Mau", quantity: 2, price: 75000 },
    ],
    subtotal: 525000,
    deliveryFee: 35000,
    total: 560000,
    status: "pending",
    paymentMethod: "card",
    createdAt: "2026-03-16T17:28:00Z",
    estimatedDelivery: "2026-03-16T18:03:00Z",
    deliveryAddress: "210 Nguyen Hue, District 1, Ho Chi Minh City",
    notes: "Ring doorbell twice please",
  },
  {
    id: "ord-002",
    orderNumber: "#1246",
    customerName: "Carlos R.",
    customerPhone: "+84 903 456 789",
    items: [
      { name: "Cha Gio Tom Cua", quantity: 1, price: 150000 },
      { name: "Goi Cuon", quantity: 2, price: 90000 },
    ],
    subtotal: 330000,
    deliveryFee: 35000,
    total: 365000,
    status: "preparing",
    paymentMethod: "cash",
    createdAt: "2026-03-16T17:18:00Z",
    estimatedDelivery: "2026-03-16T17:43:00Z",
    deliveryAddress: "45 Le Loi, District 1, Ho Chi Minh City",
  },
  {
    id: "ord-003",
    orderNumber: "#1245",
    customerName: "Linh T.",
    customerPhone: "+84 908 567 890",
    items: [
      { name: "Com Tam Suon Nuong", quantity: 1, price: 420000 },
      { name: "Bo La Lot", quantity: 1, price: 120000 },
      { name: "Ca Phe Sua Da", quantity: 2, price: 85000 },
    ],
    subtotal: 710000,
    deliveryFee: 0,
    total: 710000,
    status: "ready",
    paymentMethod: "card",
    createdAt: "2026-03-16T17:02:00Z",
    estimatedDelivery: "2026-03-16T17:40:00Z",
    deliveryAddress: "88 Nguyen Dinh Chieu, District 3, Ho Chi Minh City",
    notes: "Free delivery promo applied",
  },
  {
    id: "ord-004",
    orderNumber: "#1244",
    customerName: "An H.",
    customerPhone: "+84 905 678 901",
    items: [
      { name: "Pho Bo Tai", quantity: 1, price: 160000 },
      { name: "Tra Dao Cam Sa", quantity: 2, price: 65000 },
    ],
    subtotal: 290000,
    deliveryFee: 35000,
    total: 325000,
    status: "in_transit",
    paymentMethod: "card",
    createdAt: "2026-03-16T16:45:00Z",
    estimatedDelivery: "2026-03-16T17:35:00Z",
    deliveryAddress: "320 Dien Bien Phu, Binh Thanh, Ho Chi Minh City",
  },
  {
    id: "ord-005",
    orderNumber: "#1243",
    customerName: "Thao N.",
    customerPhone: "+84 907 678 012",
    items: [
      { name: "Bo Luc Lac", quantity: 1, price: 220000 },
      { name: "Nuoc Suoi", quantity: 1, price: 30000 },
    ],
    subtotal: 250000,
    deliveryFee: 35000,
    total: 285000,
    status: "delivered",
    paymentMethod: "card",
    createdAt: "2026-03-16T16:30:00Z",
    estimatedDelivery: "2026-03-16T17:05:00Z",
    deliveryAddress: "150 Vo Van Tan, District 3, Ho Chi Minh City",
  },
  {
    id: "ord-006",
    orderNumber: "#1242",
    customerName: "Bao P.",
    customerPhone: "+84 909 789 123",
    items: [
      { name: "Khai Vi Tong Hop x6", quantity: 1, price: 280000 },
    ],
    subtotal: 280000,
    deliveryFee: 35000,
    total: 315000,
    status: "delivered",
    paymentMethod: "cash",
    createdAt: "2026-03-16T15:30:00Z",
    estimatedDelivery: "2026-03-16T16:05:00Z",
    deliveryAddress: "700 Tran Hung Dao, District 5, Ho Chi Minh City",
  },
  {
    id: "ord-007",
    orderNumber: "#1241",
    customerName: "Mai B.",
    customerPhone: "+84 901 890 234",
    items: [
      { name: "Pho Bo Tai", quantity: 1, price: 200000 },
      { name: "Khoai Tay Chien", quantity: 1, price: 70000 },
      { name: "Che Ba Mau", quantity: 1, price: 90000 },
    ],
    subtotal: 360000,
    deliveryFee: 35000,
    total: 395000,
    status: "cancelled",
    paymentMethod: "card",
    createdAt: "2026-03-16T14:30:00Z",
    estimatedDelivery: "2026-03-16T15:05:00Z",
    deliveryAddress: "240 Phan Xich Long, Phu Nhuan, Ho Chi Minh City",
    notes: "Customer requested cancellation",
  },
];

export const mockCategories: MenuCategory[] = [
  { id: "cat-1", name: "Khai Vi", sortOrder: 1, itemCount: 4, active: true },
  { id: "cat-2", name: "Mon Chinh", sortOrder: 2, itemCount: 5, active: true },
  { id: "cat-3", name: "Mon Nuong", sortOrder: 3, itemCount: 3, active: true },
  { id: "cat-4", name: "Pho & Bun", sortOrder: 4, itemCount: 2, active: true },
  { id: "cat-5", name: "Mon Kem", sortOrder: 5, itemCount: 3, active: true },
  { id: "cat-6", name: "Trang Mieng", sortOrder: 6, itemCount: 2, active: true },
  { id: "cat-7", name: "Do Uong", sortOrder: 7, itemCount: 3, active: true },
  { id: "cat-8", name: "Mon Theo Mua", sortOrder: 8, itemCount: 1, active: false },
];

export const mockMenuItems: MenuItem[] = [
  { id: "item-1", name: "Goi Cuon Tom Thit", description: "Cuon tuoi voi tom, thit, rau song va sot dau phong nha lam.", price: 45000, categoryId: "cat-1", categoryName: "Khai Vi", available: true, popular: true, imageUrl: "/menu/empanadas-carne.jpg", preparationTime: "15 min" },
  { id: "item-2", name: "Cha Gio Tom Cua", description: "Cha gio gion voi tom, cua va mien, an kem rau thom.", price: 45000, categoryId: "cat-1", categoryName: "Khai Vi", available: true, popular: false, imageUrl: "/menu/empanadas-pollo.jpg", preparationTime: "15 min" },
  { id: "item-3", name: "Banh Xep Chien Hai San", description: "Banh xep chien nhan hai san va rau cu, vi dam va gion.", price: 45000, categoryId: "cat-1", categoryName: "Khai Vi", available: true, popular: false, imageUrl: "/menu/empanadas-jq.jpg", preparationTime: "15 min" },
  { id: "item-4", name: "Khai Vi Tong Hop x6", description: "Phan khai vi tong hop gom cuon, cha gio va banh xep cho nhom nho.", price: 150000, categoryId: "cat-1", categoryName: "Khai Vi", available: true, popular: true, imageUrl: "/menu/empanadas-surtidas.jpg", preparationTime: "18 min" },
  { id: "item-5", name: "Com Tam Suon Nuong", description: "Com tam suon nuong kem bi, cha va do chua nha lam.", price: 420000, categoryId: "cat-2", categoryName: "Mon Chinh", available: true, popular: true, imageUrl: "/menu/asado.jpg", preparationTime: "35 min" },
  { id: "item-6", name: "Bun Thit Nuong", description: "Bun thit nuong voi rau song, do chua va nuoc mam chua ngot.", price: 90000, categoryId: "cat-2", categoryName: "Mon Chinh", available: true, popular: true, imageUrl: "/menu/choripan.jpg", preparationTime: "15 min" },
  { id: "item-7", name: "Bo La Lot", description: "Bo la lot nuong than, them mo hanh va muoi dau phong.", price: 120000, categoryId: "cat-3", categoryName: "Mon Nuong", available: true, popular: false, imageUrl: "/menu/provoleta.jpg", preparationTime: "12 min" },
  { id: "item-8", name: "Pho Bo Tai", description: "Pho bo voi nuoc dung trong, thit tai mem va rau thom tuoi.", price: 185000, categoryId: "cat-4", categoryName: "Pho & Bun", available: true, popular: true, imageUrl: "/menu/milanesa-napo.jpg", preparationTime: "25 min" },
  { id: "item-9", name: "Pho Ga Xe", description: "Pho ga xe voi nuoc dung thanh, hanh la va rau song.", price: 200000, categoryId: "cat-4", categoryName: "Pho & Bun", available: true, popular: false, imageUrl: "/menu/milanesa-caballo.jpg", preparationTime: "25 min" },
  { id: "item-10", name: "Banh Mi Bo Nuong", description: "Banh mi bo nuong gion vo, them do chua, rau thom va sot nha lam.", price: 160000, categoryId: "cat-2", categoryName: "Mon Chinh", available: true, popular: false, imageUrl: "/menu/fugazzeta.jpg", preparationTime: "20 min" },
  { id: "item-11", name: "Mi Xao Hai San", description: "Mi xao hai san voi tom, muc va rau xanh, vi dam de an.", price: 140000, categoryId: "cat-2", categoryName: "Mon Chinh", available: true, popular: false, imageUrl: "/menu/muzza.jpg", preparationTime: "18 min" },
  { id: "item-12", name: "Bo Luc Lac", description: "Bo luc lac mem, sot tieu chanh va rau cu xao vua toi.", price: 220000, categoryId: "cat-3", categoryName: "Mon Nuong", available: true, popular: false, imageUrl: "/menu/lomo-saltado.jpg", preparationTime: "25 min" },
  { id: "item-13", name: "Nom Xoai Hai San", description: "Nom xoai xanh voi tom, rau thom va lac rang gion.", price: 80000, categoryId: "cat-5", categoryName: "Mon Kem", available: true, popular: false, imageUrl: "/menu/ensalada.jpg", preparationTime: "8 min" },
  { id: "item-14", name: "Khoai Tay Chien", description: "Khoai tay chien gion, an kem sot cay nhe va muoi hanh.", price: 100000, categoryId: "cat-5", categoryName: "Mon Kem", available: false, popular: false, imageUrl: "/menu/cesar.jpg", preparationTime: "10 min" },
  { id: "item-15", name: "Che Ba Mau", description: "Che ba mau voi nuoc cot dua, da bao va vi thanh mat.", price: 75000, categoryId: "cat-6", categoryName: "Trang Mieng", available: true, popular: true, imageUrl: "/menu/flan.jpg", preparationTime: "5 min" },
  { id: "item-16", name: "Pudding Dua", description: "Pudding dua mem min, them dua say gion nhe.", price: 90000, categoryId: "cat-6", categoryName: "Trang Mieng", available: true, popular: false, imageUrl: "/menu/helado.jpg", preparationTime: "5 min" },
  { id: "item-17", name: "Rau Cu Xao Toi", description: "Rau cu theo mua xao toi, don gian ma de an.", price: 70000, categoryId: "cat-5", categoryName: "Mon Kem", available: true, popular: false, imageUrl: "/menu/papas.jpg", preparationTime: "12 min" },
  { id: "item-18", name: "Tra Dao Cam Sa", description: "Tra dao voi sa va lat cam, thanh mat de uong.", price: 65000, categoryId: "cat-7", categoryName: "Do Uong", available: true, popular: false, imageUrl: "/menu/cerveza.jpg", preparationTime: "1 min" },
  { id: "item-19", name: "Ca Phe Sua Da", description: "Ca phe sua da dam vi, ngot nhe va rat hop sau bua an.", price: 85000, categoryId: "cat-7", categoryName: "Do Uong", available: true, popular: false, imageUrl: "/menu/malbec.jpg", preparationTime: "1 min" },
  { id: "item-20", name: "Nuoc Suoi", description: "Nuoc suoi chai 500ml, co loai co gas hoac khong gas.", price: 30000, categoryId: "cat-7", categoryName: "Do Uong", available: true, popular: false, imageUrl: "/menu/agua.jpg", preparationTime: "1 min" },
];

export const mockReviews: MerchantReview[] = [
  {
    id: "rev-1",
    customerName: "Maria G.",
    rating: 5,
    text: "Bun thit nuong ngon va rau van rat tuoi. Don giao nhanh, mon an toi van con am.",
    date: "2026-03-16T16:30:00Z",
    orderId: "#1240",
    responded: false,
  },
  {
    id: "rev-2",
    customerName: "Bao P.",
    rating: 4,
    text: "Goi cuon tuoi va vi rat can bang. Minh tru mot sao vi don den cham hon du kien mot chut.",
    date: "2026-03-16T14:15:00Z",
    orderId: "#1238",
    responded: true,
    response: "Cam on Bao! Ben minh dang siet lai thoi gian chuan bi gio cao diem va rat vui vi ban thay goi cuon hop khau vi.",
    responseDate: "2026-03-16T14:45:00Z",
  },
  {
    id: "rev-3",
    customerName: "Thao N.",
    rating: 5,
    text: "Phan com tam rat tron vi. Khau phan day dan va mon den van con nong.",
    date: "2026-03-15T23:45:00Z",
    orderId: "#1235",
    responded: true,
    response: "Cam on Thao! Ben minh rat vui khi phan com tam hop y ban. Hen som phuc vu ban lan tiep theo.",
    responseDate: "2026-03-16T00:00:00Z",
  },
  {
    id: "rev-4",
    customerName: "Duy T.",
    rating: 3,
    text: "Chat luong mon an on, nhung nuoc pho hoi giam do nong. Bao bi cho mon nuoc co the cai thien them.",
    date: "2026-03-15T17:00:00Z",
    orderId: "#1232",
    responded: false,
  },
  {
    id: "rev-5",
    customerName: "Mai B.",
    rating: 5,
    text: "Che ba mau rat ngon va thanh mat. Cuoi tuan nay minh se dat lai.",
    date: "2026-03-12T22:30:00Z",
    orderId: "#1228",
    responded: true,
    response: "Cam on Mai nhieu! Bep nha minh se rat vui khi nghe phan hoi nay. Hen gap lai ban vao cuoi tuan.",
    responseDate: "2026-03-12T23:00:00Z",
  },
  {
    id: "rev-6",
    customerName: "Quoc K.",
    rating: 4,
    text: "Banh mi va ca phe sua da deu on. Minh chac chan se dat lai.",
    date: "2026-03-12T00:15:00Z",
    orderId: "#1225",
    responded: false,
  },
];

export const mockPromotions: Promotion[] = [
  {
    id: "promo-1",
    name: "New Customer Bowl Deal",
    code: "BOWL50K",
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
    name: "Lunch Rush 50K Off",
    code: "LUNCH50K",
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
    name: "Tet Reunion Offer",
    code: "TET20",
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
    status: "calculated",
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
    status: "received",
    receivedAt: "2026-03-03T12:00:00Z",
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
    status: "adjusted",
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
    status: "received",
    receivedAt: "2026-02-17T12:00:00Z",
  },
];

export const mockAnalyticsMetrics: AnalyticsMetric[] = [
  { label: "This Week Revenue", value: "₫8,456,000", change: "+18.2%", changeDirection: "up" },
  { label: "Total Orders", value: "187", change: "+15.4%", changeDirection: "up" },
  { label: "Avg Order Value", value: "₫452,200", change: "+2.4%", changeDirection: "up" },
  { label: "Completion Rate", value: "96.8%", change: "+1.2%", changeDirection: "up" },
  { label: "Avg Delivery Time", value: "32 min", change: "-3 min", changeDirection: "down" },
  { label: "Customer Return Rate", value: "42%", change: "+5%", changeDirection: "up" },
];

export const mockTopSellingItems: TopSellingItem[] = [
  { name: "Khai Vi Tong Hop x6", orders: 48, revenue: 7200000 },
  { name: "Pho Bo Tai", orders: 42, revenue: 7770000 },
  { name: "Com Tam Suon Nuong", orders: 28, revenue: 11760000 },
  { name: "Bun Thit Nuong", orders: 35, revenue: 3150000 },
  { name: "Che Ba Mau", orders: 31, revenue: 2325000 },
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
  { id: "alert-1", type: "warning" as const, message: "Low stock: Tra Dao marked unavailable", time: "2026-03-16T17:20:00Z" },
  { id: "alert-2", type: "info" as const, message: "New promotion FREEDELIVERY activated for this weekend", time: "2026-03-16T16:30:00Z" },
  { id: "alert-3", type: "success" as const, message: "Weekly settlement of ₫6,148,900 is being processed", time: "2026-03-16T14:30:00Z" },
  { id: "alert-4", type: "warning" as const, message: "2 reviews awaiting response", time: "2026-03-16T12:30:00Z" },
];

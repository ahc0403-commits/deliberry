// ============================================================
// ADMIN CONSOLE — PLATFORM MOCK DATA
// Realistic governance/oversight data for a delivery platform
// ============================================================

// R-040/R-041: Status types derived from canonical domain adapter (not local literals).
// R-010/R-011: Money fields are integer centavos.
// R-050/R-051: Timestamps are UTC ISO 8601 strings.
import type { DisputeStatus, MoneyAmount, OrderStatus, PaymentMethodPlaceholder, SettlementState, SupportTicketStatus } from "../domain";

// --- Types ---

// R-013 note: PlatformKPI `value` is a pre-formatted display string, not a canonical money field.
// KPIs mix money, counts, percentages, and durations in a single display type.
// Money-semantic KPI values use inline formatting as a presentation-layer concern.
export type PlatformKPI = {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down" | "neutral";
  category: "primary" | "warning" | "success" | "info";
};

export type PlatformAlert = {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  time: string;
  source: string;
};

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  type: "customer" | "merchant" | "admin";
  status: "active" | "suspended" | "pending";
  registeredAt: string;
  lastActive: string;
  ordersCount: number;
};

export type PlatformMerchant = {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  storeCount: number;
  status: "active" | "pending_review" | "suspended" | "rejected";
  compliance: "compliant" | "review_needed" | "non_compliant";
  joinedAt: string;
  totalRevenue: number;
};

export type PlatformStore = {
  id: string;
  name: string;
  merchantName: string;
  address: string;
  status: "open" | "closed" | "paused" | "under_review";
  rating: number;
  totalOrders: number;
  lastActive: string;
};

export type PlatformOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  storeName: string;
  merchantName: string;
  // R-010/R-011: Integer centavos, typed as MoneyAmount.
  total: MoneyAmount;
  // R-040/R-041: Derived from canonical OrderStatus — not a local literal union.
  status: OrderStatus;
  createdAt: string;
  // R-040/R-041: Derived from canonical PaymentMethodPlaceholder — not a local literal.
  paymentMethod: PaymentMethodPlaceholder;
};

export type PlatformDispute = {
  id: string;
  caseNumber: string;
  customerName: string;
  storeName: string;
  orderId: string;
  category: "quality" | "missing_items" | "delivery" | "billing" | "other";
  priority: "high" | "medium" | "low";
  // R-040/R-041: Derived from canonical DisputeStatus — not a local literal union.
  status: DisputeStatus;
  createdAt: string;
  description: string;
  amount: number;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  customerName: string;
  subject: string;
  category: "order_issue" | "account" | "payment" | "general" | "merchant_complaint";
  priority: "high" | "medium" | "low";
  status: SupportTicketStatus;
  createdAt: string;
  assignee: string;
};

export type PlatformSettlement = {
  id: string;
  merchantName: string;
  storeName: string;
  periodStart: string; // ISO 8601 date (R-050, DATE.md)
  periodEnd: string;   // ISO 8601 date (R-050, DATE.md)
  grossAmount: number;
  commission: number;
  netAmount: number;
  // R-040/R-041: Derived from canonical SettlementState — not a local literal union.
  status: SettlementState;
  paidAt?: string;
};

// R-013 note: FinanceSummary `value` is a pre-formatted display string (same rationale as PlatformKPI).
export type FinanceSummary = {
  label: string;
  value: string;
  period: string;
};

export type MarketingCampaign = {
  id: string;
  name: string;
  type: "banner" | "push_notification" | "email" | "in_app";
  status: "active" | "draft" | "scheduled" | "ended";
  reach: number;
  conversions: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
};

export type PlatformAnnouncement = {
  id: string;
  title: string;
  audience: "all" | "merchants" | "customers" | "internal";
  status: "published" | "draft" | "scheduled";
  publishedAt?: string;
  scheduledAt?: string;
  author: string;
};

export type CatalogCategory = {
  id: string;
  name: string;
  storeCount: number;
  itemCount: number;
  status: "active" | "hidden" | "under_review";
};

export type B2BPartner = {
  id: string;
  companyName: string;
  type: "supplier" | "logistics" | "technology" | "payment";
  status: "active" | "inactive" | "pending";
  contractStart: string;
  contractEnd: string;
  contactEmail: string;
};

export type SystemHealth = {
  service: string;
  status: "healthy" | "degraded" | "down";
  uptime: string;
  latency: string;
  lastCheck: string;
};

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: "global" | "merchants" | "customers" | "internal";
};

// --- Mock Data ---

export const mockPlatformKPIs: PlatformKPI[] = [
  { label: "Total Users", value: "24,831", change: "+342", changeDirection: "up", category: "primary" },
  { label: "Active Merchants", value: "186", change: "+8", changeDirection: "up", category: "success" },
  { label: "Orders Today", value: "1,247", change: "+18.3%", changeDirection: "up", category: "info" },
  { label: "Platform Revenue", value: "$18,420", change: "+12.1%", changeDirection: "up", category: "success" },
  { label: "Open Disputes", value: "14", change: "+3", changeDirection: "up", category: "warning" },
  { label: "Avg Rating", value: "4.5", change: "+0.1", changeDirection: "up", category: "info" },
];

export const mockPlatformAlerts: PlatformAlert[] = [
  { id: "pa-1", type: "critical", message: "3 merchants flagged for compliance review", time: "2026-03-16T17:15:00Z", source: "Compliance" },
  { id: "pa-2", type: "warning", message: "Settlement processing delayed for 2 merchants", time: "2026-03-16T16:30:00Z", source: "Finance" },
  { id: "pa-3", type: "info", message: "New merchant application: Patagonia Grill", time: "2026-03-16T15:30:00Z", source: "Onboarding" },
  { id: "pa-4", type: "warning", message: "14 open disputes awaiting assignment", time: "2026-03-16T14:30:00Z", source: "Support" },
  { id: "pa-5", type: "info", message: "Weekly platform report ready for review", time: "2026-03-16T12:30:00Z", source: "Analytics" },
];

export const mockUsers: PlatformUser[] = [
  { id: "u-1", name: "Maria Garcia", email: "maria.g@email.com", type: "customer", status: "active", registeredAt: "2026-01-15T12:00:00Z", lastActive: "2026-03-16T17:28:00Z", ordersCount: 47 },
  { id: "u-2", name: "Carlos Rodriguez", email: "carlos.r@email.com", type: "customer", status: "active", registeredAt: "2026-02-03T12:00:00Z", lastActive: "2026-03-16T17:18:00Z", ordersCount: 23 },
  { id: "u-3", name: "Sofia Lopez", email: "sofia.l@email.com", type: "customer", status: "active", registeredAt: "2025-12-08T12:00:00Z", lastActive: "2026-03-15T20:00:00Z", ordersCount: 61 },
  { id: "u-4", name: "Pablo Vega", email: "pablo.v@saborcriollo.com", type: "merchant", status: "active", registeredAt: "2025-10-20T12:00:00Z", lastActive: "2026-03-16T17:00:00Z", ordersCount: 0 },
  { id: "u-5", name: "Ana Bermudez", email: "ana.b@email.com", type: "customer", status: "suspended", registeredAt: "2025-11-01T12:00:00Z", lastActive: "2026-03-10T15:00:00Z", ordersCount: 12 },
  { id: "u-6", name: "Diego Martinez", email: "diego.m@email.com", type: "customer", status: "active", registeredAt: "2026-01-28T12:00:00Z", lastActive: "2026-03-16T17:02:00Z", ordersCount: 34 },
  { id: "u-7", name: "Laura Fernandez", email: "laura.f@patgrill.com", type: "merchant", status: "pending", registeredAt: "2026-03-12T12:00:00Z", lastActive: "2026-03-16T16:00:00Z", ordersCount: 0 },
  { id: "u-8", name: "Roberto Kim", email: "r.kim@deliberry.com", type: "admin", status: "active", registeredAt: "2025-09-01T12:00:00Z", lastActive: "2026-03-16T17:30:00Z", ordersCount: 0 },
];

export const mockMerchants: PlatformMerchant[] = [
  { id: "m-1", businessName: "Sabor Criollo Kitchen", ownerName: "Pablo Vega", email: "pablo@saborcriollo.com", storeCount: 1, status: "active", compliance: "compliant", joinedAt: "2025-10-01T03:00:00Z", totalRevenue: 14280000 },
  { id: "m-2", businessName: "Buenos Aires Burgers", ownerName: "Martin Torres", email: "martin@baburgers.com", storeCount: 3, status: "active", compliance: "compliant", joinedAt: "2025-08-01T03:00:00Z", totalRevenue: 28740000 },
  { id: "m-3", businessName: "La Esquina Dulce", ownerName: "Valentina Ruiz", email: "val@esquinadulce.com", storeCount: 1, status: "active", compliance: "review_needed", joinedAt: "2025-12-01T03:00:00Z", totalRevenue: 5620000 },
  { id: "m-4", businessName: "Patagonia Grill", ownerName: "Laura Fernandez", email: "laura@patgrill.com", storeCount: 0, status: "pending_review", compliance: "review_needed", joinedAt: "2026-03-12T12:00:00Z", totalRevenue: 0 },
  { id: "m-5", businessName: "Sushi del Puerto", ownerName: "Kenji Yamamoto", email: "kenji@sushipuerto.com", storeCount: 2, status: "active", compliance: "compliant", joinedAt: "2025-07-01T03:00:00Z", totalRevenue: 19860000 },
  { id: "m-6", businessName: "El Rincón Vegano", ownerName: "Camila Herrera", email: "camila@rinconvegano.com", storeCount: 1, status: "suspended", compliance: "non_compliant", joinedAt: "2025-11-01T03:00:00Z", totalRevenue: 3410000 },
];

export const mockStores: PlatformStore[] = [
  { id: "s-1", name: "Sabor Criollo Kitchen", merchantName: "Sabor Criollo Kitchen", address: "Av. Corrientes 1234", status: "open", rating: 4.6, totalOrders: 3420, lastActive: "2026-03-16T17:30:00Z" },
  { id: "s-2", name: "BA Burgers - Palermo", merchantName: "Buenos Aires Burgers", address: "Honduras 5200", status: "open", rating: 4.3, totalOrders: 5890, lastActive: "2026-03-16T17:30:00Z" },
  { id: "s-3", name: "BA Burgers - Recoleta", merchantName: "Buenos Aires Burgers", address: "Av. Callao 1300", status: "open", rating: 4.4, totalOrders: 4210, lastActive: "2026-03-16T17:30:00Z" },
  { id: "s-4", name: "BA Burgers - Belgrano", merchantName: "Buenos Aires Burgers", address: "Av. Cabildo 2100", status: "closed", rating: 4.1, totalOrders: 2830, lastActive: "2026-03-15T20:00:00Z" },
  { id: "s-5", name: "La Esquina Dulce", merchantName: "La Esquina Dulce", address: "Defensa 890", status: "paused", rating: 4.7, totalOrders: 1580, lastActive: "2026-03-16T15:30:00Z" },
  { id: "s-6", name: "Sushi del Puerto - Centro", merchantName: "Sushi del Puerto", address: "Av. Madero 100", status: "open", rating: 4.5, totalOrders: 4670, lastActive: "2026-03-16T17:30:00Z" },
  { id: "s-7", name: "Sushi del Puerto - Norte", merchantName: "Sushi del Puerto", address: "Av. del Libertador 6200", status: "open", rating: 4.6, totalOrders: 3920, lastActive: "2026-03-16T17:30:00Z" },
  { id: "s-8", name: "El Rincón Vegano", merchantName: "El Rincón Vegano", address: "Thames 1600", status: "under_review", rating: 4.2, totalOrders: 890, lastActive: "2026-03-10T15:00:00Z" },
];

export const mockPlatformOrders: PlatformOrder[] = [
  { id: "po-1", orderNumber: "#P-8247", customerName: "Maria Garcia", storeName: "Sabor Criollo Kitchen", merchantName: "Sabor Criollo", total: 5600 as MoneyAmount, status: "pending", createdAt: "2026-03-16T17:28:00Z", paymentMethod: "card" },
  { id: "po-2", orderNumber: "#P-8246", customerName: "Carlos Rodriguez", storeName: "BA Burgers - Palermo", merchantName: "BA Burgers", total: 3250 as MoneyAmount, status: "preparing", createdAt: "2026-03-16T17:18:00Z", paymentMethod: "card" },
  { id: "po-3", orderNumber: "#P-8245", customerName: "Diego Martinez", storeName: "Sushi del Puerto - Centro", merchantName: "Sushi del Puerto", total: 7800 as MoneyAmount, status: "in_transit", createdAt: "2026-03-16T17:02:00Z", paymentMethod: "card" },
  { id: "po-4", orderNumber: "#P-8244", customerName: "Sofia Lopez", storeName: "Sabor Criollo Kitchen", merchantName: "Sabor Criollo", total: 4550 as MoneyAmount, status: "delivered", createdAt: "2026-03-16T16:30:00Z", paymentMethod: "cash" },
  { id: "po-5", orderNumber: "#P-8243", customerName: "Ana Bermudez", storeName: "La Esquina Dulce", merchantName: "La Esquina Dulce", total: 2800 as MoneyAmount, status: "cancelled", createdAt: "2026-03-16T15:30:00Z", paymentMethod: "card" },
  { id: "po-6", orderNumber: "#P-8242", customerName: "Roberto Kim", storeName: "BA Burgers - Recoleta", merchantName: "BA Burgers", total: 4100 as MoneyAmount, status: "disputed", createdAt: "2026-03-16T14:30:00Z", paymentMethod: "card" },
  { id: "po-7", orderNumber: "#P-8241", customerName: "Laura Perez", storeName: "Sushi del Puerto - Norte", merchantName: "Sushi del Puerto", total: 6250 as MoneyAmount, status: "delivered", createdAt: "2026-03-16T13:30:00Z", paymentMethod: "card" },
];

export const mockDisputes: PlatformDispute[] = [
  { id: "d-1", caseNumber: "DSP-401", customerName: "Roberto Kim", storeName: "BA Burgers - Recoleta", orderId: "#P-8242", category: "quality", priority: "high", status: "open", createdAt: "2026-03-16T14:30:00Z", description: "Received wrong order - got chicken instead of beef burger", amount: 4100 },
  { id: "d-2", caseNumber: "DSP-400", customerName: "Ana Bermudez", storeName: "La Esquina Dulce", orderId: "#P-8210", category: "missing_items", priority: "medium", status: "investigating", createdAt: "2026-03-15T17:30:00Z", description: "Missing 2 items from the order", amount: 1550 },
  { id: "d-3", caseNumber: "DSP-399", customerName: "Sofia Lopez", storeName: "Sushi del Puerto - Centro", orderId: "#P-8195", category: "delivery", priority: "low", status: "investigating", createdAt: "2026-03-14T17:30:00Z", description: "Order arrived 45 minutes late and cold", amount: 6250 },
  { id: "d-4", caseNumber: "DSP-398", customerName: "Diego Martinez", storeName: "Sabor Criollo Kitchen", orderId: "#P-8180", category: "billing", priority: "high", status: "escalated", createdAt: "2026-03-13T17:30:00Z", description: "Charged twice for the same order", amount: 5600 },
  { id: "d-5", caseNumber: "DSP-397", customerName: "Carlos Rodriguez", storeName: "BA Burgers - Palermo", orderId: "#P-8165", category: "quality", priority: "medium", status: "resolved", createdAt: "2026-03-11T17:30:00Z", description: "Food quality below expectations", amount: 3250 },
];

export const mockSupportTickets: SupportTicket[] = [
  { id: "t-1", ticketNumber: "TKT-1892", customerName: "Maria Garcia", subject: "Cannot apply promo code", category: "payment", priority: "low", status: "open", createdAt: "2026-03-16T17:00:00Z", assignee: "Unassigned" },
  { id: "t-2", ticketNumber: "TKT-1891", customerName: "Pablo Vega", subject: "Store hours not updating", category: "merchant_complaint", priority: "medium", status: "in_progress", createdAt: "2026-03-16T15:30:00Z", assignee: "Agent Rosa" },
  { id: "t-3", ticketNumber: "TKT-1890", customerName: "Carlos Rodriguez", subject: "Refund not received", category: "payment", priority: "high", status: "in_progress", createdAt: "2026-03-16T13:30:00Z", assignee: "Agent Marco" },
  { id: "t-4", ticketNumber: "TKT-1889", customerName: "Sofia Lopez", subject: "Account email change request", category: "account", priority: "low", status: "awaiting_reply", createdAt: "2026-03-15T17:30:00Z", assignee: "Agent Rosa" },
  { id: "t-5", ticketNumber: "TKT-1888", customerName: "Ana Bermudez", subject: "Order tracking not working", category: "order_issue", priority: "medium", status: "resolved", createdAt: "2026-03-14T17:30:00Z", assignee: "Agent Marco" },
  { id: "t-6", ticketNumber: "TKT-1887", customerName: "Diego Martinez", subject: "How to leave a review", category: "general", priority: "low", status: "closed", createdAt: "2026-03-13T17:30:00Z", assignee: "Agent Rosa" },
];

export const mockPlatformSettlements: PlatformSettlement[] = [
  { id: "ps-1", merchantName: "Sabor Criollo Kitchen", storeName: "Sabor Criollo Kitchen", periodStart: "2026-03-08", periodEnd: "2026-03-14", grossAmount: 845650, commission: 126848, netAmount: 718802, status: "pending" },
  { id: "ps-2", merchantName: "Buenos Aires Burgers", storeName: "BA Burgers - Palermo", periodStart: "2026-03-08", periodEnd: "2026-03-14", grossAmount: 1234000, commission: 185100, netAmount: 1048900, status: "processing" },
  { id: "ps-3", merchantName: "Buenos Aires Burgers", storeName: "BA Burgers - Recoleta", periodStart: "2026-03-08", periodEnd: "2026-03-14", grossAmount: 987000, commission: 148050, netAmount: 838950, status: "processing" },
  { id: "ps-4", merchantName: "Sushi del Puerto", storeName: "Sushi del Puerto - Centro", periodStart: "2026-03-08", periodEnd: "2026-03-14", grossAmount: 1420000, commission: 213000, netAmount: 1207000, status: "paid", paidAt: "2026-03-14T15:00:00Z" },
  { id: "ps-5", merchantName: "Sushi del Puerto", storeName: "Sushi del Puerto - Norte", periodStart: "2026-03-08", periodEnd: "2026-03-14", grossAmount: 1180000, commission: 177000, netAmount: 1003000, status: "paid", paidAt: "2026-03-14T15:00:00Z" },
  { id: "ps-6", merchantName: "La Esquina Dulce", storeName: "La Esquina Dulce", periodStart: "2026-03-08", periodEnd: "2026-03-14", grossAmount: 342000, commission: 51300, netAmount: 290700, status: "failed" },
];

export const mockFinanceSummary: FinanceSummary[] = [
  { label: "Gross Platform Revenue", value: "$284,600", period: "This Month" },
  { label: "Total Commission Earned", value: "$42,690", period: "This Month" },
  { label: "Pending Payouts", value: "$28,066", period: "Current Cycle" },
  { label: "Refunds Issued", value: "$3,240", period: "This Month" },
  { label: "Failed Settlements", value: "$2,907", period: "This Month" },
  { label: "Net Platform Income", value: "$39,450", period: "This Month" },
];

export const mockCampaigns: MarketingCampaign[] = [
  { id: "mc-1", name: "Weekend Free Delivery", type: "banner", status: "active", reach: 12400, conversions: 890, startDate: "2026-03-14T03:00:00Z", endDate: "2026-03-17T02:59:59Z", budget: 50000, spent: 32000 },
  { id: "mc-2", name: "New User Welcome Bonus", type: "push_notification", status: "active", reach: 3200, conversions: 480, startDate: "2026-03-01T03:00:00Z", endDate: "2026-04-01T02:59:59Z", budget: 100000, spent: 62000 },
  { id: "mc-3", name: "Merchant Spotlight: Sushi del Puerto", type: "in_app", status: "scheduled", reach: 0, conversions: 0, startDate: "2026-03-18T03:00:00Z", endDate: "2026-03-25T02:59:59Z", budget: 30000, spent: 0 },
  { id: "mc-4", name: "Valentine's Day Special", type: "email", status: "ended", reach: 18600, conversions: 1240, startDate: "2026-02-10T03:00:00Z", endDate: "2026-02-16T02:59:59Z", budget: 80000, spent: 78000 },
];

export const mockAnnouncements: PlatformAnnouncement[] = [
  { id: "a-1", title: "Platform maintenance scheduled for March 20", audience: "all", status: "published", publishedAt: "2026-03-13T15:00:00Z", author: "System" },
  { id: "a-2", title: "New delivery tracking feature available", audience: "customers", status: "published", publishedAt: "2026-03-10T15:00:00Z", author: "Product Team" },
  { id: "a-3", title: "Updated commission structure effective April 1", audience: "merchants", status: "scheduled", scheduledAt: "2026-03-25T03:00:00Z", author: "Finance Team" },
  { id: "a-4", title: "Holiday operating hours reminder", audience: "merchants", status: "draft", author: "Operations" },
  { id: "a-5", title: "Q1 performance report summary", audience: "internal", status: "draft", author: "Analytics" },
];

export const mockCatalogCategories: CatalogCategory[] = [
  { id: "cc-1", name: "Argentine Cuisine", storeCount: 42, itemCount: 380, status: "active" },
  { id: "cc-2", name: "Fast Food", storeCount: 38, itemCount: 290, status: "active" },
  { id: "cc-3", name: "Japanese", storeCount: 15, itemCount: 210, status: "active" },
  { id: "cc-4", name: "Italian", storeCount: 22, itemCount: 260, status: "active" },
  { id: "cc-5", name: "Bakery & Desserts", storeCount: 28, itemCount: 340, status: "active" },
  { id: "cc-6", name: "Vegan & Vegetarian", storeCount: 12, itemCount: 150, status: "active" },
  { id: "cc-7", name: "Beverages", storeCount: 45, itemCount: 180, status: "active" },
  { id: "cc-8", name: "Premium Dining", storeCount: 8, itemCount: 95, status: "under_review" },
];

export const mockB2BPartners: B2BPartner[] = [
  { id: "b-1", companyName: "RapidFleet Logistics", type: "logistics", status: "active", contractStart: "2025-01-01T03:00:00Z", contractEnd: "2027-01-01T02:59:59Z", contactEmail: "ops@rapidfleet.com" },
  { id: "b-2", companyName: "PaySur Payments", type: "payment", status: "active", contractStart: "2025-03-01T03:00:00Z", contractEnd: "2027-03-01T02:59:59Z", contactEmail: "partners@paysur.com" },
  { id: "b-3", companyName: "FreshSource Supplies", type: "supplier", status: "active", contractStart: "2025-06-01T03:00:00Z", contractEnd: "2026-06-01T02:59:59Z", contactEmail: "b2b@freshsource.com" },
  { id: "b-4", companyName: "CloudKitchen Tech", type: "technology", status: "inactive", contractStart: "2025-04-01T03:00:00Z", contractEnd: "2025-10-01T02:59:59Z", contactEmail: "info@cloudkitchen.tech" },
  { id: "b-5", companyName: "GreenPack Packaging", type: "supplier", status: "pending", contractStart: "2026-04-01T03:00:00Z", contractEnd: "2028-04-01T02:59:59Z", contactEmail: "sales@greenpack.co" },
];

export const mockSystemHealth: SystemHealth[] = [
  { service: "API Gateway", status: "healthy", uptime: "99.98%", latency: "42ms", lastCheck: "2026-03-16T17:29:00Z" },
  { service: "Order Processing", status: "healthy", uptime: "99.95%", latency: "85ms", lastCheck: "2026-03-16T17:29:00Z" },
  { service: "Payment Service", status: "healthy", uptime: "99.99%", latency: "120ms", lastCheck: "2026-03-16T17:29:00Z" },
  { service: "Notification Service", status: "degraded", uptime: "98.50%", latency: "340ms", lastCheck: "2026-03-16T17:29:00Z" },
  { service: "Search & Discovery", status: "healthy", uptime: "99.90%", latency: "65ms", lastCheck: "2026-03-16T17:29:00Z" },
  { service: "Analytics Pipeline", status: "healthy", uptime: "99.80%", latency: "200ms", lastCheck: "2026-03-16T17:28:00Z" },
  { service: "CDN / Static Assets", status: "healthy", uptime: "99.99%", latency: "15ms", lastCheck: "2026-03-16T17:29:00Z" },
];

export const mockFeatureFlags: FeatureFlag[] = [
  { id: "ff-1", name: "new_checkout_flow", description: "Enable redesigned checkout experience", enabled: true, scope: "customers" },
  { id: "ff-2", name: "merchant_analytics_v2", description: "New analytics dashboard for merchants", enabled: false, scope: "merchants" },
  { id: "ff-3", name: "multi_store_management", description: "Manage multiple stores from a single account", enabled: false, scope: "merchants" },
  { id: "ff-4", name: "ai_recommendations", description: "AI-powered menu recommendations", enabled: true, scope: "customers" },
  { id: "ff-5", name: "bulk_menu_upload", description: "CSV/Excel menu import for merchants", enabled: true, scope: "merchants" },
  { id: "ff-6", name: "admin_audit_log", description: "Detailed admin action audit trail", enabled: true, scope: "internal" },
];

export const mockAnalyticsMetrics = [
  { label: "Daily Active Users", value: "8,420", change: "+12%", changeDirection: "up" as const },
  { label: "Orders per Hour (peak)", value: "142", change: "+8%", changeDirection: "up" as const },
  { label: "Avg Order Value", value: "$42.30", change: "+3.2%", changeDirection: "up" as const },
  { label: "Customer Retention (30d)", value: "68%", change: "+2%", changeDirection: "up" as const },
  { label: "Merchant Churn Rate", value: "2.1%", change: "-0.5%", changeDirection: "down" as const },
  { label: "Support Resolution Time", value: "4.2 hrs", change: "-18%", changeDirection: "down" as const },
  { label: "Platform Uptime", value: "99.95%", change: "0%", changeDirection: "neutral" as const },
  { label: "Failed Payments", value: "0.8%", change: "-0.2%", changeDirection: "down" as const },
];

export const mockWeeklyOrders = [
  { day: "Mon", orders: 156, revenue: 658000 },
  { day: "Tue", orders: 172, revenue: 724000 },
  { day: "Wed", orders: 168, revenue: 710000 },
  { day: "Thu", orders: 198, revenue: 834000 },
  { day: "Fri", orders: 224, revenue: 945000 },
  { day: "Sat", orders: 245, revenue: 1032000 },
  { day: "Sun", orders: 184, revenue: 776000 },
];

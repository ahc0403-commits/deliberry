import {
  type PlatformKPI, type PlatformAlert, type PlatformUser,
  type PlatformMerchant, type PlatformStore, type PlatformOrder,
  type PlatformDispute, type SupportTicket, type PlatformSettlement,
  type FinanceSummary, type MarketingCampaign, type PlatformAnnouncement,
  type CatalogCategory, type B2BPartner, type SystemHealth, type FeatureFlag,
  mockPlatformKPIs, mockPlatformAlerts, mockUsers, mockMerchants,
  mockStores, mockPlatformOrders, mockDisputes, mockSupportTickets,
  mockPlatformSettlements, mockFinanceSummary, mockCampaigns,
  mockAnnouncements, mockCatalogCategories, mockB2BPartners,
  mockSystemHealth, mockFeatureFlags, mockAnalyticsMetrics, mockWeeklyOrders,
} from "./admin-mock-data";

export type DashboardData = {
  kpis: PlatformKPI[];
  alerts: PlatformAlert[];
  recentOrders: PlatformOrder[];
};

export type UsersData = { users: PlatformUser[] };
export type MerchantsData = { merchants: PlatformMerchant[] };
export type StoresData = { stores: PlatformStore[] };
export type OrdersData = { orders: PlatformOrder[] };
export type DisputesData = { disputes: PlatformDispute[] };
export type CustomerServiceData = { tickets: SupportTicket[] };
export type SettlementsData = { settlements: PlatformSettlement[] };
export type FinanceData = { summary: FinanceSummary[]; settlements: PlatformSettlement[] };
export type MarketingData = { campaigns: MarketingCampaign[] };
export type AnnouncementsData = { announcements: PlatformAnnouncement[] };
export type CatalogData = { categories: CatalogCategory[] };
export type B2BData = { partners: B2BPartner[] };
export type AnalyticsData = {
  metrics: { label: string; value: string; change: string; changeDirection: "up" | "down" | "neutral" }[];
  weeklyOrders: { day: string; orders: number; revenue: number }[];
};
export type ReportingData = {
  metrics: { label: string; value: string; change: string; changeDirection: "up" | "down" | "neutral" }[];
  reports: { name: string; desc: string; period: string }[];
  schedules: { name: string; frequency: string; recipients: string; active: boolean }[];
};
export type SystemManagementData = {
  health: SystemHealth[];
  featureFlags: FeatureFlag[];
};

export class InMemoryAdminRepository {
  getDashboardData(): DashboardData {
    return { kpis: mockPlatformKPIs, alerts: mockPlatformAlerts, recentOrders: mockPlatformOrders.slice(0, 5) };
  }
  getUsersData(): UsersData { return { users: mockUsers }; }
  getMerchantsData(): MerchantsData { return { merchants: mockMerchants }; }
  getStoresData(): StoresData { return { stores: mockStores }; }
  getOrdersData(): OrdersData { return { orders: mockPlatformOrders }; }
  getDisputesData(): DisputesData { return { disputes: mockDisputes }; }
  getCustomerServiceData(): CustomerServiceData { return { tickets: mockSupportTickets }; }
  getSettlementsData(): SettlementsData { return { settlements: mockPlatformSettlements }; }
  getFinanceData(): FinanceData { return { summary: mockFinanceSummary, settlements: mockPlatformSettlements }; }
  getMarketingData(): MarketingData { return { campaigns: mockCampaigns }; }
  getAnnouncementsData(): AnnouncementsData { return { announcements: mockAnnouncements }; }
  getCatalogData(): CatalogData { return { categories: mockCatalogCategories }; }
  getB2BData(): B2BData { return { partners: mockB2BPartners }; }
  getAnalyticsData(): AnalyticsData { return { metrics: mockAnalyticsMetrics, weeklyOrders: mockWeeklyOrders }; }
  getReportingData(): ReportingData {
    return {
      metrics: mockAnalyticsMetrics,
      reports: [
        { name: "Weekly Platform Summary", desc: "Orders, revenue, user growth", period: "Mar 8 – 14, 2026" },
        { name: "Monthly Financial Report", desc: "Revenue, commissions, payouts, refunds", period: "February 2026" },
        { name: "Merchant Performance", desc: "Per-merchant KPIs and compliance", period: "Q1 2026" },
        { name: "Customer Satisfaction", desc: "Ratings, disputes, resolution times", period: "Q1 2026" },
        { name: "Operational Audit", desc: "System health, uptime, incident log", period: "March 2026" },
      ],
      schedules: [
        { name: "Daily Order Summary", frequency: "Daily at 23:00", recipients: "ops@deliberry.com", active: true },
        { name: "Weekly Revenue Report", frequency: "Every Monday 09:00", recipients: "finance@deliberry.com", active: true },
        { name: "Monthly Compliance Audit", frequency: "1st of month", recipients: "legal@deliberry.com", active: true },
        { name: "Quarterly Business Review", frequency: "Q start", recipients: "exec@deliberry.com", active: false },
      ],
    };
  }
  getSystemManagementData(): SystemManagementData { return { health: mockSystemHealth, featureFlags: mockFeatureFlags }; }
}

export const adminRepository = new InMemoryAdminRepository();

import type {
  AnalyticsData,
  AnnouncementsData,
  B2BData,
  CatalogData,
  CustomerServiceData,
  DashboardData,
  DisputesData,
  FinanceData,
  MarketingData,
  MerchantsData,
  OrdersData,
  ReportingData,
  SettlementsData,
  StoresData,
  SystemManagementData,
  UsersData,
} from "./admin-repository";

export interface AdminRuntimeRepository {
  getDashboardData(): Promise<DashboardData>;
  getUsersData(): Promise<UsersData>;
  getMerchantsData(): Promise<MerchantsData>;
  getStoresData(): Promise<StoresData>;
  getOrdersData(): Promise<OrdersData>;
  getDisputesData(): Promise<DisputesData>;
  getCustomerServiceData(): Promise<CustomerServiceData>;
  getSettlementsData(): Promise<SettlementsData>;
  getFinanceData(): Promise<FinanceData>;
  getMarketingData(): Promise<MarketingData>;
  getAnnouncementsData(): Promise<AnnouncementsData>;
  getCatalogData(): Promise<CatalogData>;
  getB2BData(): Promise<B2BData>;
  getAnalyticsData(): Promise<AnalyticsData>;
  getReportingData(): Promise<ReportingData>;
  getSystemManagementData(): Promise<SystemManagementData>;
}

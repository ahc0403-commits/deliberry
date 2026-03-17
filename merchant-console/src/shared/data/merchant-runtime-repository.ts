import type {
  AnalyticsData,
  DashboardData,
  MenuData,
  OrdersData,
  PromotionsData,
  ReviewsData,
  SettlementData,
  SettingsData,
  StoreManagementData,
} from "./merchant-repository";

export interface MerchantRuntimeRepository {
  getDashboardData(storeId: string): Promise<DashboardData>;
  getOrdersData(storeId: string): Promise<OrdersData>;
  updateOrderStatus(input: {
    storeId: string;
    orderId: string;
    status: string;
    actorId: string;
  }): Promise<void>;
  getMenuData(storeId: string): Promise<MenuData>;
  getStoreManagementData(storeId: string): Promise<StoreManagementData>;
  getReviewsData(storeId: string): Promise<ReviewsData>;
  getPromotionsData(storeId: string): Promise<PromotionsData>;
  getSettlementData(storeId: string): Promise<SettlementData>;
  getAnalyticsData(storeId: string): Promise<AnalyticsData>;
  getSettingsData(storeId: string): Promise<SettingsData>;
}

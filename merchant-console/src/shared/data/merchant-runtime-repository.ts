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
import type { MerchantOrder } from "./merchant-mock-data";

export interface MerchantReadCursor {
  createdAt: string;
  id: string;
}

export interface MerchantOrdersQuery {
  storeId: string;
  limit: number;
  statuses?: string[];
  cursor?: MerchantReadCursor;
}

export interface MerchantReviewsQuery {
  storeId: string;
  limit: number;
  cursor?: MerchantReadCursor;
}

export interface MerchantDashboardKpiSnapshot {
  activeOrderCount: number;
  readyOrderCount: number;
  grossRevenueCentavos: number;
  nonCancelledOrderCount: number;
  reviewCount: number;
}

export interface MerchantRuntimeRepository {
  getDashboardData(storeId: string): Promise<DashboardData>;
  getDashboardKpiSnapshot(storeId: string): Promise<MerchantDashboardKpiSnapshot>;
  getOrdersData(query: MerchantOrdersQuery): Promise<OrdersData>;
  updateOrderStatus(input: {
    storeId: string;
    orderId: string;
    status: string;
    idempotencyKey: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    traceId?: string;
  }): Promise<MerchantOrder>;
  getMenuData(storeId: string): Promise<MenuData | never>;
  getStoreManagementData(storeId: string): Promise<StoreManagementData>;
  getReviewsData(query: MerchantReviewsQuery): Promise<ReviewsData>;
  replyToReview(input: {
    storeId: string;
    reviewId: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    responseText: string;
  }): Promise<import("./merchant-mock-data").MerchantReview>;
  getPromotionsData(storeId: string): Promise<PromotionsData>;
  getSettlementData(storeId: string): Promise<SettlementData>;
  getAnalyticsData(storeId: string): Promise<AnalyticsData>;
  getSettingsData(storeId: string): Promise<SettingsData>;
  updateSettingsData(input: {
    storeId: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    toggles: SettingsData["toggles"];
  }): Promise<SettingsData>;
  updateStoreManagementData(input: {
    storeId: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    store: StoreManagementData["store"];
  }): Promise<StoreManagementData>;
  exportMaskedStoreSnapshotForExternalLlm(input: {
    storeId: string;
    actorId: string;
    profile?: "external_llm_retrieval" | "external_llm_prompt";
  }): Promise<Record<string, unknown>>;
}

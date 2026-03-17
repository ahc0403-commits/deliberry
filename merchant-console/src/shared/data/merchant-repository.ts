import {
  type MerchantStoreInfo,
  type DashboardKPI,
  type MerchantOrder,
  type MenuCategory,
  type MenuItem,
  type MerchantReview,
  type Promotion,
  type SettlementRecord,
  type AnalyticsMetric,
  type TopSellingItem,
  type DailyRevenue,
  mockStore,
  mockKPIs,
  mockOrders,
  mockCategories,
  mockMenuItems,
  mockReviews,
  mockPromotions,
  mockSettlements,
  mockAnalyticsMetrics,
  mockTopSellingItems,
  mockDailyRevenue,
  mockRecentAlerts,
} from "./merchant-mock-data";

export type DashboardData = {
  kpis: DashboardKPI[];
  recentOrders: MerchantOrder[];
  alerts: { id: string; type: "warning" | "info" | "success"; message: string; time: string }[];
  store: MerchantStoreInfo;
};

export type OrdersData = {
  orders: MerchantOrder[];
  store: MerchantStoreInfo;
};

export type MenuData = {
  categories: MenuCategory[];
  items: MenuItem[];
  store: MerchantStoreInfo;
};

export type StoreManagementData = {
  store: MerchantStoreInfo;
};

export type ReviewsData = {
  reviews: MerchantReview[];
  store: MerchantStoreInfo;
};

export type PromotionsData = {
  promotions: Promotion[];
  store: MerchantStoreInfo;
};

export type SettlementData = {
  records: SettlementRecord[];
  store: MerchantStoreInfo;
};

export type AnalyticsData = {
  metrics: AnalyticsMetric[];
  topItems: TopSellingItem[];
  dailyRevenue: DailyRevenue[];
  store: MerchantStoreInfo;
};

export type SettingsData = {
  store: MerchantStoreInfo;
};

export class InMemoryMerchantRepository {
  private orders = mockOrders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      modifiers: item.modifiers ? [...item.modifiers] : undefined,
    })),
  }));

  private getScopedStore(storeId: string): MerchantStoreInfo {
    if (storeId !== mockStore.id) {
      throw new Error(`Unsupported merchant store scope: ${storeId}`);
    }

    return mockStore;
  }

  getDashboardData(storeId: string): DashboardData {
    const store = this.getScopedStore(storeId);
    const activeOrderCount = this.orders.filter((order) =>
      ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status),
    ).length;
    const unrespondedReviewCount = mockReviews.filter((review) => !review.responded).length;
    const kpis = mockKPIs.map((kpi) =>
      kpi.label === "Active Orders"
        ? {
            ...kpi,
            value: String(activeOrderCount),
            trend: `${activeOrderCount} active`,
            trendDirection: "neutral" as const,
          }
        : kpi,
    );
    const alerts = [
      ...(activeOrderCount > 0
        ? [
            {
              id: "merchant-active-orders",
              type: "info" as const,
              message: `${activeOrderCount} active order${activeOrderCount === 1 ? "" : "s"} in progress`,
              time: this.orders[0]?.createdAt ?? "",
            },
          ]
        : []),
      ...(unrespondedReviewCount > 0
        ? [
            {
              id: "merchant-unanswered-reviews",
              type: "warning" as const,
              message: `${unrespondedReviewCount} review${unrespondedReviewCount === 1 ? "" : "s"} awaiting response`,
              time: mockReviews.find((review) => !review.responded)?.date ?? "",
            },
          ]
        : []),
      ...mockRecentAlerts.filter((alert) => !alert.message.includes("reviews awaiting response")),
    ].slice(0, 4);

    return {
      kpis,
      recentOrders: this.orders.slice(0, 5),
      alerts,
      store,
    };
  }

  getOrdersData(storeId: string): OrdersData {
    const store = this.getScopedStore(storeId);
    return {
      orders: this.orders,
      store,
    };
  }

  updateOrderStatus(storeId: string, orderId: string, status: MerchantOrder["status"]): MerchantOrder {
    this.getScopedStore(storeId);

    const orderIndex = this.orders.findIndex((order) => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`Unsupported merchant order: ${orderId}`);
    }

    const updatedOrder = {
      ...this.orders[orderIndex],
      status,
    };
    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  getMenuData(storeId: string): MenuData {
    const store = this.getScopedStore(storeId);
    return {
      categories: mockCategories,
      items: mockMenuItems,
      store,
    };
  }

  getStoreManagementData(storeId: string): StoreManagementData {
    const store = this.getScopedStore(storeId);
    return {
      store,
    };
  }

  getReviewsData(storeId: string): ReviewsData {
    const store = this.getScopedStore(storeId);
    return {
      reviews: mockReviews,
      store,
    };
  }

  getPromotionsData(storeId: string): PromotionsData {
    const store = this.getScopedStore(storeId);
    return {
      promotions: mockPromotions,
      store,
    };
  }

  getSettlementData(storeId: string): SettlementData {
    const store = this.getScopedStore(storeId);
    return {
      records: mockSettlements,
      store,
    };
  }

  getAnalyticsData(storeId: string): AnalyticsData {
    const store = this.getScopedStore(storeId);
    return {
      metrics: mockAnalyticsMetrics,
      topItems: mockTopSellingItems,
      dailyRevenue: mockDailyRevenue,
      store,
    };
  }

  getSettingsData(storeId: string): SettingsData {
    const store = this.getScopedStore(storeId);
    return {
      store,
    };
  }
}

export const merchantRepository = new InMemoryMerchantRepository();

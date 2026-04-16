import { merchantRepository } from "./merchant-repository";

// Legacy fixture-backed read layer. Do not treat this as the live owner for
// routes already migrated to runtime services.
export class MerchantQueryServices {
  getDashboardData(storeId: string) {
    return merchantRepository.getDashboardData(storeId);
  }

  getOrdersData(storeId: string) {
    return merchantRepository.getOrdersData(storeId);
  }

  updateOrderStatus(storeId: string, orderId: string, status: "confirmed" | "preparing" | "ready" | "in_transit" | "cancelled") {
    return merchantRepository.updateOrderStatus(storeId, orderId, status);
  }

  getMenuData(storeId: string) {
    return merchantRepository.getMenuData(storeId);
  }

  getStoreManagementData(storeId: string) {
    return merchantRepository.getStoreManagementData(storeId);
  }

  getReviewsData(storeId: string) {
    return merchantRepository.getReviewsData(storeId);
  }

  getPromotionsData(storeId: string) {
    return merchantRepository.getPromotionsData(storeId);
  }

  getSettlementData(storeId: string) {
    return merchantRepository.getSettlementData(storeId);
  }

  getAnalyticsData(storeId: string) {
    return merchantRepository.getAnalyticsData(storeId);
  }

  getSettingsData(storeId: string) {
    return merchantRepository.getSettingsData(storeId);
  }
}

export const merchantQueryServices = new MerchantQueryServices();

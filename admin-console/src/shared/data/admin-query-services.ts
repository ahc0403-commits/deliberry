import { adminRepository } from "./admin-repository";

export class AdminQueryServices {
  getDashboardData() { return adminRepository.getDashboardData(); }
  getUsersData() { return adminRepository.getUsersData(); }
  getMerchantsData() { return adminRepository.getMerchantsData(); }
  getStoresData() { return adminRepository.getStoresData(); }
  getOrdersData() { return adminRepository.getOrdersData(); }
  getDisputesData() { return adminRepository.getDisputesData(); }
  getCustomerServiceData() { return adminRepository.getCustomerServiceData(); }
  getSettlementsData() { return adminRepository.getSettlementsData(); }
  getFinanceData() { return adminRepository.getFinanceData(); }
  getMarketingData() { return adminRepository.getMarketingData(); }
  getAnnouncementsData() { return adminRepository.getAnnouncementsData(); }
  getCatalogData() { return adminRepository.getCatalogData(); }
  getB2BData() { return adminRepository.getB2BData(); }
  getAnalyticsData() { return adminRepository.getAnalyticsData(); }
  getReportingData() { return adminRepository.getReportingData(); }
  getSystemManagementData() { return adminRepository.getSystemManagementData(); }
}

export const adminQueryServices = new AdminQueryServices();

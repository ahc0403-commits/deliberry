import Link from "next/link";
import type { ReactNode } from "react";

import { ensureMerchantStoreScope } from "../../../features/auth/server/access";
import { getMerchantOrdersRuntimeData } from "../../../shared/data/merchant-order-runtime-service";
import { getMerchantReviewsRuntimeData } from "../../../shared/data/merchant-review-runtime-service";

type StoreLayoutProps = {
  children: ReactNode;
  params: Promise<{ storeId: string }>;
};

export default async function StoreScopedLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { storeId } = await params;
  await ensureMerchantStoreScope(storeId);
  const [{ data: ordersData }, { data: reviewsData }] = await Promise.all([
    getMerchantOrdersRuntimeData(storeId),
    getMerchantReviewsRuntimeData(storeId),
  ]);
  const { orders, store } = ordersData;
  const { reviews } = reviewsData;
  const activeOrderCount = orders.filter((order) =>
    ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status),
  ).length;
  const pendingReviewCount = reviews.filter((review) => !review.responded).length;

  return (
    <div className="store-layout">
      <aside className="store-sidebar">
        <div className="store-sidebar-header">
          <span className="store-indicator">{store.name}</span>
          <span className="store-indicator-label">Active Store</span>
        </div>
        <nav className="store-nav" aria-label="Merchant store navigation">
          <span className="store-nav-section">Main</span>
          <Link href={`/${storeId}/dashboard`} className="store-nav-link">
            <span className="store-nav-icon">&#9633;</span>
            Dashboard
          </Link>
          <Link href={`/${storeId}/orders`} className="store-nav-link">
            <span className="store-nav-icon">&#9776;</span>
            Orders
            <span className="store-nav-badge">{activeOrderCount}</span>
          </Link>
          <Link href={`/${storeId}/menu`} className="store-nav-link">
            <span className="store-nav-icon">&#9782;</span>
            Menu
          </Link>

          <span className="store-nav-section">Store</span>
          <Link href={`/${storeId}/store`} className="store-nav-link">
            <span className="store-nav-icon">&#9750;</span>
            Store Info
          </Link>
          <Link href={`/${storeId}/reviews`} className="store-nav-link">
            <span className="store-nav-icon">&#9733;</span>
            Reviews
            <span className="store-nav-badge">{pendingReviewCount}</span>
          </Link>
          <Link href={`/${storeId}/promotions`} className="store-nav-link">
            <span className="store-nav-icon">&#9830;</span>
            Promotions
          </Link>

          <span className="store-nav-section">Finance</span>
          <Link href={`/${storeId}/settlement`} className="store-nav-link">
            <span className="store-nav-icon">&#9638;</span>
            Settlement
          </Link>
          <Link href={`/${storeId}/analytics`} className="store-nav-link">
            <span className="store-nav-icon">&#9652;</span>
            Analytics
          </Link>

          <span className="store-nav-section">Config</span>
          <Link href={`/${storeId}/settings`} className="store-nav-link">
            <span className="store-nav-icon">&#9881;</span>
            Settings
          </Link>
        </nav>
      </aside>
      <main className="store-main">{children}</main>
    </div>
  );
}

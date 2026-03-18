"use client";

import { startTransition, useMemo, useState } from "react";
import { ArrowRight, ClipboardList, Sparkles } from "lucide-react";
import { formatMoney } from "../../../shared/domain";
import type { OrdersData } from "../../../shared/data/merchant-repository";
import { updateMerchantOrderStatusAction, loadMoreMerchantOrdersAction } from "../server/order-actions";

type MerchantOrdersScreenProps = {
  storeId: string;
  initialData: OrdersData;
  initialSource: "persisted" | "fallback";
  initialHasMore: boolean;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  digital_wallet: "Digital Pay",
};

const TABS = [
  { key: "active", label: "Active", statuses: ["pending", "confirmed", "preparing", "ready", "in_transit"] },
  { key: "completed", label: "Completed", statuses: ["delivered"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
];

export function MerchantOrdersScreen({
  storeId,
  initialData,
  initialSource,
  initialHasMore,
}: MerchantOrdersScreenProps) {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState(initialData.orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [runtimeSource, setRuntimeSource] = useState(initialSource);
  const [actionError, setActionError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  const currentTab = TABS.find((t) => t.key === activeTab) ?? TABS[0];
  const filteredOrders = orders.filter((o) =>
    currentTab.statuses.includes(o.status)
  );
  const readyCount = orders.filter((order) => order.status === "ready").length;
  const inPrepCount = orders.filter((order) => ["confirmed", "preparing"].includes(order.status)).length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;

  function handleOrderStatusUpdate(
    nextStatus: "preparing" | "cancelled" | "ready" | "in_transit",
  ) {
    if (!selectedOrder) {
      return;
    }
    setActionError(null);

    startTransition(async () => {
      const result = await updateMerchantOrderStatusAction({
        storeId,
        orderId: selectedOrder.id,
        status: nextStatus,
      });

      if (!result.ok) {
        setActionError(result.error);
        return;
      }

      setRuntimeSource(result.source);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === result.order.id ? result.order : order,
        ),
      );
      setSelectedOrderId(result.order.id);
    });
  }

  function handleLoadMore() {
    if (!hasMore || isLoadingMore || orders.length === 0) return;
    setIsLoadingMore(true);
    const lastOrder = orders[orders.length - 1];
    startTransition(async () => {
      const result = await loadMoreMerchantOrdersAction({
        storeId,
        cursorCreatedAt: lastOrder.createdAt,
        cursorId: lastOrder.id,
      });
      if (result.ok) {
        setOrders((prev) => [...prev, ...result.orders]);
        setHasMore(result.hasMore);
      }
      setIsLoadingMore(false);
    });
  }

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-orders">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Order operations</span>
          <h1 className="merchant-hero-title">Orders</h1>
          <p className="merchant-hero-subtitle">
            Work the live demo queue for the current store and keep every order stage visible from intake to pickup.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <ClipboardList size={14} />
              {initialData.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              {runtimeSource === "persisted"
                ? "Status writes sync to persisted backend orders"
                : "Status writes use the demo-safe local fallback"}
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Queue focus</div>
          <div className="merchant-hero-panel-value">{filteredOrders.length} in {currentTab.label.toLowerCase()}</div>
          <div className="merchant-hero-panel-text">
            Pending orders can be accepted or rejected here. Ready orders can move to pickup without leaving this queue.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Awaiting response</div>
          <div className="merchant-summary-value">{pendingCount} new</div>
          <div className="merchant-summary-meta">Order intake still needs action</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">In kitchen</div>
          <div className="merchant-summary-value">{inPrepCount} preparing</div>
          <div className="merchant-summary-meta">Confirmed or currently being prepared</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Pickup queue</div>
          <div className="merchant-summary-value">{readyCount} ready</div>
          <div className="merchant-summary-meta">Can be marked picked up from the detail panel</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Order queue</div>
            <div className="card-subtitle">
              Store-scoped order list with canonical progression and safe fallback
            </div>
          </div>
          <div className="merchant-inline-note">
            Open an order to update the visible queue state
            <ArrowRight size={14} />
          </div>
        </div>

        <div className="tab-bar merchant-tab-bar">
        {TABS.map((tab) => {
          const count = orders.filter((o) =>
            tab.statuses.includes(o.status)
          ).length;
          return (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
        </div>

        <div className="data-table-wrapper">
          <table className="data-table merchant-data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-state-icon">&#9776;</div>
                      <div className="empty-state-title">No orders</div>
                      <div className="empty-state-desc">
                        No {activeTab} orders right now
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="primary">{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--color-text)" }}>
                        {order.customerName}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                        {order.deliveryAddress}
                      </div>
                    </td>
                    <td>
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="mono">{formatMoney(order.total)}</td>
                    <td>{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        <span className="status-dot" />
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td>{order.createdAt}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div style={{ padding: "16px", textAlign: "center" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading…" : "Load more orders"}
            </button>
          </div>
        )}
      </div>

      {selectedOrder ? (
        <div
          className="order-detail-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrderId(null);
          }}
        >
          <div className="order-detail-panel merchant-order-detail-panel">
            <div className="order-detail-header">
              <div>
                <div className="merchant-detail-eyebrow">Live queue detail</div>
                <div className="order-detail-title">
                  Order {selectedOrder.orderNumber}
                </div>
                <span className={`status-badge ${selectedOrder.status}`}>
                  <span className="status-dot" />
                  {STATUS_LABELS[selectedOrder.status] ?? selectedOrder.status}
                </span>
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedOrderId(null)}
              >
                &#10005;
              </button>
            </div>

            <div className="order-detail-body">
              <div className="merchant-detail-summary">
                <div className="merchant-detail-summary-card">
                  <span className="merchant-detail-summary-label">Customer</span>
                  <span className="merchant-detail-summary-value">{selectedOrder.customerName}</span>
                </div>
                <div className="merchant-detail-summary-card">
                  <span className="merchant-detail-summary-label">Total</span>
                  <span className="merchant-detail-summary-value">{formatMoney(selectedOrder.total)}</span>
                </div>
                <div className="merchant-detail-summary-card">
                  <span className="merchant-detail-summary-label">ETA</span>
                  <span className="merchant-detail-summary-value">{selectedOrder.estimatedDelivery}</span>
                </div>
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">Customer</div>
                <div className="order-info-grid">
                  <span className="order-info-label">Name</span>
                  <span className="order-info-value">{selectedOrder.customerName}</span>
                  <span className="order-info-label">Phone</span>
                  <span className="order-info-value">{selectedOrder.customerPhone}</span>
                  <span className="order-info-label">Address</span>
                  <span className="order-info-value">{selectedOrder.deliveryAddress}</span>
                  <span className="order-info-label">ETA</span>
                  <span className="order-info-value">{selectedOrder.estimatedDelivery}</span>
                  {selectedOrder.notes ? (
                    <>
                      <span className="order-info-label">Notes</span>
                      <span className="order-info-value" style={{ color: "var(--color-primary)" }}>
                        {selectedOrder.notes}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">Items</div>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <div>
                      <div className="order-item-name">
                        {item.quantity}x {item.name}
                      </div>
                      {item.modifiers?.length ? (
                        <div className="order-item-mods">
                          {item.modifiers.join(", ")}
                        </div>
                      ) : null}
                    </div>
                    <div className="order-item-price">
                      {formatMoney(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">Summary</div>
                <div className="order-total-row">
                  <span>Subtotal</span>
                  <span>{formatMoney(selectedOrder.subtotal)}</span>
                </div>
                <div className="order-total-row">
                  <span>Delivery fee</span>
                  <span>
                    {selectedOrder.deliveryFee === 0
                      ? "Free"
                      : formatMoney(selectedOrder.deliveryFee)}
                  </span>
                </div>
                <div className="order-total-row final">
                  <span>Total</span>
                  <span>{formatMoney(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">Payment</div>
                <div className="order-info-grid">
                  <span className="order-info-label">Method</span>
                  <span className="order-info-value">{PAYMENT_LABELS[selectedOrder.paymentMethod] ?? selectedOrder.paymentMethod}</span>
                  <span className="order-info-label">Placed</span>
                  <span className="order-info-value">{selectedOrder.createdAt}</span>
                </div>
              </div>
            </div>

            {selectedOrder.status === "pending" ? (
              <div className="order-detail-footer">
                <button className="btn btn-success" onClick={() => handleOrderStatusUpdate("preparing")}>Accept Order</button>
                <button className="btn btn-danger" onClick={() => handleOrderStatusUpdate("cancelled")}>Reject</button>
              </div>
            ) : selectedOrder.status === "preparing" ? (
              <div className="order-detail-footer">
                <button className="btn btn-primary" onClick={() => handleOrderStatusUpdate("ready")}>Mark Ready</button>
              </div>
            ) : selectedOrder.status === "ready" ? (
              <div className="order-detail-footer">
                <button className="btn btn-primary" onClick={() => handleOrderStatusUpdate("in_transit")}>Mark Picked Up</button>
              </div>
            ) : null}
            {actionError ? (
              <div className="order-detail-footer" style={{ justifyContent: "flex-start" }}>
                <span className="merchant-inline-note" style={{ color: "var(--color-danger)" }}>
                  {actionError}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

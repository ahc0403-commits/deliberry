"use client";

import { startTransition, useMemo, useState } from "react";
import { ArrowRight, Check, ClipboardList, Sparkles, X } from "lucide-react";
import { formatMoney, toDisplayTime } from "../../../shared/domain";
import type { OrdersData } from "../../../shared/data/merchant-repository";
import { updateMerchantOrderStatusAction, loadMoreMerchantOrdersAction } from "../server/order-actions";
import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantOrdersScreenProps = {
  storeId: string;
  initialData: OrdersData;
  initialHasMore: boolean;
};

type OrderActionTone = "primary" | "success" | "danger";
type OrderAction = {
  label: string;
  status:
    | "confirmed"
    | "preparing"
    | "ready"
    | "in_transit"
    | "delivered"
    | "cancelled";
  tone: OrderActionTone;
  icon: "advance" | "confirm" | "danger";
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

function getOrderActions(status: string): { label: string; actions: OrderAction[] } {
  if (status === "pending") {
    return {
      label: "Resolve intake decision",
      actions: [
        { label: "Accept Order", status: "confirmed", tone: "success", icon: "confirm" },
        { label: "Reject", status: "cancelled", tone: "danger", icon: "danger" },
      ],
    };
  }

  if (status === "confirmed") {
    return {
      label: "Move kitchen workflow forward",
      actions: [
        { label: "Start Preparing", status: "preparing", tone: "primary", icon: "advance" },
        { label: "Cancel Order", status: "cancelled", tone: "danger", icon: "danger" },
      ],
    };
  }

  if (status === "preparing") {
    return {
      label: "Confirm kitchen completion",
      actions: [
        { label: "Mark Ready", status: "ready", tone: "primary", icon: "advance" },
        { label: "Cancel Order", status: "cancelled", tone: "danger", icon: "danger" },
      ],
    };
  }

  if (status === "ready") {
    return {
      label: "Confirm courier pickup",
      actions: [
        { label: "Mark Picked Up", status: "in_transit", tone: "primary", icon: "advance" },
      ],
    };
  }

  if (status === "in_transit") {
    return {
      label: "Close delivery lifecycle",
      actions: [
        { label: "Mark Delivered", status: "delivered", tone: "success", icon: "confirm" },
      ],
    };
  }

  return { label: "", actions: [] };
}

export function MerchantOrdersScreen({
  storeId,
  initialData,
  initialHasMore,
}: MerchantOrdersScreenProps) {
  const { locale, raw } = useMerchantI18n();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState(initialData.orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [runtimeSource, setRuntimeSource] = useState<"persisted" | "fallback">(
    "persisted",
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const [pendingStatusMutation, setPendingStatusMutation] = useState<{
    orderId: string;
    status:
      | "confirmed"
      | "preparing"
      | "ready"
      | "in_transit"
      | "delivered"
      | "cancelled";
    key: string;
  } | null>(null);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
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
  const detailActions = selectedOrder ? getOrderActions(selectedOrder.status) : { label: "", actions: [] };
  const replaceCount = (value: string, count: number) => raw(value).replace("{count}", String(count));
  const statusLabel = (status: string) => raw(STATUS_LABELS[status] ?? status);
  const paymentLabel = (paymentMethod: string) => raw(PAYMENT_LABELS[paymentMethod] ?? paymentMethod);

  function handleOrderStatusUpdate(
    nextStatus:
      | "confirmed"
      | "preparing"
      | "ready"
      | "in_transit"
      | "delivered"
      | "cancelled",
  ) {
    if (!selectedOrder) {
      return;
    }
    const idempotencyKey =
      pendingStatusMutation &&
      pendingStatusMutation.orderId === selectedOrder.id &&
      pendingStatusMutation.status === nextStatus
        ? pendingStatusMutation.key
        : crypto.randomUUID();

    setActionError(null);
    setActionPending(true);
    setPendingStatusMutation({
      orderId: selectedOrder.id,
      status: nextStatus,
      key: idempotencyKey,
    });

    startTransition(async () => {
      const result = await updateMerchantOrderStatusAction({
        storeId,
        orderId: selectedOrder.id,
        status: nextStatus,
        idempotencyKey,
      });

      if (!result.ok) {
        setActionError(result.error);
        setActionPending(false);
        return;
      }

      setRuntimeSource(result.source);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === result.order.id ? result.order : order,
        ),
      );
      setSelectedOrderId(result.order.id);
      setPendingStatusMutation(null);
      setActionPending(false);
    });
  }

  function handleLoadMore() {
    if (!hasMore || isLoadingMore || orders.length === 0) return;
    setLoadMoreError(null);
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
      } else {
        setLoadMoreError(result.error);
      }
      setIsLoadingMore(false);
    });
  }

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-orders">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Order operations")}</span>
          <h1 className="merchant-hero-title">{raw("Orders")}</h1>
          <p className="merchant-hero-subtitle">
            {raw("Work the live queue for the current store and keep every order stage visible from intake to pickup.")}
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <ClipboardList size={14} />
              {initialData.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              {runtimeSource === "persisted"
                ? raw("Status writes sync to persisted backend orders")
                : raw("Status writes stay in the local preview session")}
            </span>
          </div>
        </div>
          <div className="merchant-hero-panel">
            <div className="merchant-hero-panel-label">{raw("Queue focus")}</div>
            <div className="merchant-hero-panel-value">
              {filteredOrders.length} · {raw(currentTab.label)}
            </div>
            <div className="merchant-hero-panel-text">
              {raw("Pending orders can be accepted or rejected here. In-transit orders can be completed without leaving this queue.")}
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Awaiting response")}</div>
          <div className="merchant-summary-value">{replaceCount("{count} new", pendingCount)}</div>
          <div className="merchant-summary-meta">{raw("Order intake still needs action")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("In kitchen")}</div>
          <div className="merchant-summary-value">{replaceCount("{count} preparing", inPrepCount)}</div>
          <div className="merchant-summary-meta">{raw("Confirmed or currently being prepared")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Pickup queue")}</div>
          <div className="merchant-summary-value">{replaceCount("{count} ready", readyCount)}</div>
          <div className="merchant-summary-meta">{raw("Can be marked picked up from the detail panel")}</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">{raw("Order queue")}</div>
            <div className="card-subtitle">
              {raw("Store-scoped order list with canonical progression")}
            </div>
          </div>
          <div className="merchant-inline-note">
            {raw("Open an order to update the visible queue state")}
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
              {raw(tab.label)}
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
        </div>

        <div className="data-table-wrapper">
          <table className="data-table merchant-data-table">
            <thead>
              <tr>
                  <th>{raw("Order")}</th>
                  <th>{raw("Customer")}</th>
                  <th>{raw("Items")}</th>
                  <th>{raw("Total")}</th>
                  <th>{raw("Payment")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Time")}</th>
                  <th>{raw("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-state-icon">&#9776;</div>
                      <div className="empty-state-title">{raw("No orders")}</div>
                      <div className="empty-state-desc">
                        {raw("No {tab} orders right now").replace("{tab}", raw(currentTab.label).toLowerCase())}
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
                      {replaceCount(
                        order.items.length === 1 ? "{count} item" : "{count} items",
                        order.items.length,
                      )}
                    </td>
                    <td className="mono">{formatMoney(order.total)}</td>
                    <td>{paymentLabel(order.paymentMethod)}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        <span className="status-dot" />
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td>{toDisplayTime(order.createdAt, locale)}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        {raw("View")}
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
              {isLoadingMore ? raw("Loading…") : raw("Load more orders")}
            </button>
          </div>
        )}
        {loadMoreError ? (
          <div className="merchant-settings-intro">
            <strong>{raw("Unable to load more orders")}</strong>
            <p>{raw(loadMoreError)}</p>
          </div>
        ) : null}
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
                <div className="merchant-detail-eyebrow">{raw("Live queue detail")}</div>
                <div className="order-detail-title">
                  {raw("Order {number}").replace("{number}", selectedOrder.orderNumber)}
                </div>
                <span className={`status-badge ${selectedOrder.status}`}>
                  <span className="status-dot" />
                  {statusLabel(selectedOrder.status)}
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
                  <span className="merchant-detail-summary-label">{raw("Customer")}</span>
                  <span className="merchant-detail-summary-value">{selectedOrder.customerName}</span>
                </div>
                <div className="merchant-detail-summary-card">
                  <span className="merchant-detail-summary-label">{raw("Total")}</span>
                  <span className="merchant-detail-summary-value">{formatMoney(selectedOrder.total)}</span>
                </div>
                <div className="merchant-detail-summary-card">
                  <span className="merchant-detail-summary-label">{raw("ETA")}</span>
                  <span className="merchant-detail-summary-value">{toDisplayTime(selectedOrder.estimatedDelivery, locale)}</span>
                </div>
              </div>

              <div className="merchant-detail-callout">
                <div className="merchant-detail-callout-label">{raw("Operator note")}</div>
                <div className="merchant-detail-callout-copy">
                  {raw("This drawer is the active store-side control point. Update the next visible queue stage here and keep customer timing expectations aligned with the kitchen pace.")}
                </div>
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">{raw("Customer")}</div>
                <div className="order-info-grid">
                  <span className="order-info-label">{raw("Name")}</span>
                  <span className="order-info-value">{selectedOrder.customerName}</span>
                  <span className="order-info-label">{raw("Phone")}</span>
                  <span className="order-info-value">{selectedOrder.customerPhone}</span>
                  <span className="order-info-label">{raw("Address")}</span>
                  <span className="order-info-value">{selectedOrder.deliveryAddress}</span>
                  <span className="order-info-label">{raw("ETA")}</span>
                  <span className="order-info-value">{toDisplayTime(selectedOrder.estimatedDelivery, locale)}</span>
                  {selectedOrder.notes ? (
                    <>
                      <span className="order-info-label">{raw("Notes")}</span>
                      <span className="order-info-value" style={{ color: "var(--color-primary)" }}>
                        {selectedOrder.notes}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">{raw("Items")}</div>
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
                <div className="order-detail-section-title">{raw("Summary")}</div>
                <div className="order-total-row">
                  <span>{raw("Subtotal")}</span>
                  <span>{formatMoney(selectedOrder.subtotal)}</span>
                </div>
                <div className="order-total-row">
                  <span>{raw("Delivery fee")}</span>
                  <span>
                    {selectedOrder.deliveryFee === 0
                      ? raw("Free")
                      : formatMoney(selectedOrder.deliveryFee)}
                  </span>
                </div>
                <div className="order-total-row final">
                  <span>{raw("Total")}</span>
                  <span>{formatMoney(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">{raw("Payment")}</div>
                <div className="order-info-grid">
                  <span className="order-info-label">{raw("Method")}</span>
                  <span className="order-info-value">{paymentLabel(selectedOrder.paymentMethod)}</span>
                  <span className="order-info-label">{raw("Placed")}</span>
                  <span className="order-info-value">{toDisplayTime(selectedOrder.createdAt, locale)}</span>
                </div>
              </div>
            </div>

            {detailActions.actions.length > 0 ? (
              <div className="order-detail-footer order-detail-footer-action">
                <div className="order-detail-footer-context">
                  <span className="order-detail-footer-label">{raw("Next action")}</span>
                  <span className="order-detail-footer-copy">{raw(detailActions.label)}</span>
                </div>
                <div className="order-detail-footer-actions">
                  {detailActions.actions.map((action) => (
                    <button
                      key={action.label}
                      className={`btn order-detail-action-btn order-detail-action-btn--${action.tone} ${
                        action.tone === "success"
                          ? "btn-success"
                          : action.tone === "danger"
                            ? "btn-danger"
                            : "btn-primary"
                      }`}
                      onClick={() => handleOrderStatusUpdate(action.status)}
                      disabled={actionPending}
                    >
                      {action.icon === "confirm" ? <Check size={14} /> : null}
                      {action.icon === "advance" ? <ArrowRight size={14} /> : null}
                      {action.icon === "danger" ? <X size={14} /> : null}
                      {raw(action.label)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {actionError ? (
              <div className="order-detail-footer order-detail-footer-note">
                <span className="merchant-inline-note merchant-inline-note-danger">
                  {raw(actionError)}
                </span>
              </div>
            ) : null}
            {actionPending ? (
              <div className="order-detail-footer order-detail-footer-note">
                <span className="merchant-inline-note">{raw("Updating persisted order status...")}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

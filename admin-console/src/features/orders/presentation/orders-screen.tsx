"use client";

import { useState } from "react";
import { ArrowRight, ClipboardList, Eye, FileSearch, ShieldAlert, ShoppingBag, Truck } from "lucide-react";
import { formatMoney } from "../../../shared/domain";
import type { PlatformOrder } from "../../../shared/data/admin-mock-data";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  digital_wallet: "Digital Pay",
};

type Tab = "all" | "active" | "delivered" | "disputed";

export function AdminOrdersScreen({ orders }: { orders: PlatformOrder[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedOrder, setSelectedOrder] = useState<PlatformOrder | null>(null);

  const filtered = orders.filter((o) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(o.status);
    if (activeTab === "delivered") return o.status === "delivered";
    if (activeTab === "disputed") return ["disputed", "cancelled"].includes(o.status);
    return true;
  });

  const counts = {
    all: orders.length,
    active: orders.filter((o) => ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    disputed: orders.filter((o) => ["disputed", "cancelled"].includes(o.status)).length,
  };

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <ClipboardList size={14} />
              Platform order oversight
            </div>
            <h1 className="oversight-title">Order Oversight</h1>
            <p className="oversight-subtitle">
              Review queue health, jump between order segments, and inspect order context without implying live mutation inside the admin console.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Queue mode</div>
            <div className="oversight-note-value">Read-only governance review</div>
            <p className="oversight-note-text">
              Order status here mirrors the persisted platform read model. Use the detail panel for oversight context and escalation signals only.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <ShoppingBag size={14} />
            {counts.all} total orders in current queue
          </div>
          <div className="oversight-meta-chip">
            <Truck size={14} />
            {counts.active} active orders under watch
          </div>
          <div className="oversight-meta-chip">
            <ShieldAlert size={14} />
            {counts.disputed} disputed or cancelled
          </div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <ClipboardList size={14} />
            Queue total
          </div>
          <div className="oversight-summary-value">{counts.all}</div>
          <div className="oversight-summary-meta">All platform orders currently available in the admin read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <Truck size={14} />
            Active queue
          </div>
          <div className="oversight-summary-value">{counts.active}</div>
          <div className="oversight-summary-meta">Pending, confirmed, preparing, ready, and in-transit orders grouped for active triage.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <Eye size={14} />
            Delivered
          </div>
          <div className="oversight-summary-value">{counts.delivered}</div>
          <div className="oversight-summary-meta">Completed deliveries stay available for review and history checks.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <FileSearch size={14} />
            Escalated cases
          </div>
          <div className="oversight-summary-value">{counts.disputed}</div>
          <div className="oversight-summary-meta">Disputed and cancelled orders remain review-only in this phase.</div>
        </div>
      </section>

      <div className="queue-tabs">
        {(["all", "active", "delivered", "disputed"] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`queue-tab ${activeTab === tab ? "queue-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="queue-tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className={selectedOrder ? "oversight-grid oversight-grid--detail" : "oversight-grid"}>
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">Oversight Queue</h2>
              <p className="oversight-panel-subtitle">
                Select any row to inspect cross-surface order context. Queue actions stay intentionally non-mutating in the admin console.
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              Click a row to open the review pane
            </div>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Store</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className={selectedOrder?.id === order.id ? "row-selected" : ""}
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div className="oversight-row-primary">
                        <span className="oversight-row-title monospace">{order.orderNumber}</span>
                        <span className="oversight-row-meta">{order.merchantName}</span>
                      </div>
                    </td>
                    <td>{order.customerName}</td>
                    <td>{order.storeName}</td>
                    <td>{formatMoney(order.total)}</td>
                    <td className="text-muted">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</td>
                    <td><span className={`status-badge status-badge--${order.status}`}>{order.status.replace("_", " ")}</span></td>
                    <td className="text-muted">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedOrder && (
          <aside className="oversight-panel">
            <div className="oversight-panel-header">
              <div>
                <h3 className="oversight-panel-title">Order Review Pane</h3>
                <p className="oversight-panel-subtitle">
                  Cross-surface context for governance review. This panel stays intentionally non-mutating.
                </p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
            <div className="oversight-pane">
              <div className="oversight-pane-card">
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Order number</div>
                    <div className="oversight-pane-stat-value monospace">{selectedOrder.orderNumber}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Status</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`status-badge status-badge--${selectedOrder.status}`}>{selectedOrder.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Customer</div>
                    <div className="oversight-pane-stat-value">{selectedOrder.customerName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Total</div>
                    <div className="oversight-pane-stat-value">{formatMoney(selectedOrder.total)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">Operational context</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Store</div>
                    <div className="oversight-pane-stat-value">{selectedOrder.storeName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Merchant</div>
                    <div className="oversight-pane-stat-value">{selectedOrder.merchantName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Payment</div>
                    <div className="oversight-pane-stat-value">{PAYMENT_LABELS[selectedOrder.paymentMethod] ?? selectedOrder.paymentMethod}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">Created</div>
                    <div className="oversight-pane-stat-value">{selectedOrder.createdAt}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-note">
                Admin order actions are read-only in this console phase. Use this pane to review platform impact, then coordinate resolution outside the admin UI where required.
              </div>

              <div className="oversight-actions">
                {selectedOrder.status === "disputed" ? <span className="btn-preview">Dispute handled elsewhere</span> : null}
                {selectedOrder.status === "cancelled" ? <span className="btn-preview">Cancellation review preview</span> : null}
                <span className="btn-preview">History preview only</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

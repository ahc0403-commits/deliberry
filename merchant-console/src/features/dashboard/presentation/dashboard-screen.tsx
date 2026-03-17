import Link from "next/link";
import { DollarSign, Hash, Timer, Star, TrendingUp, TrendingDown, Minus, AlertTriangle, Info, CheckCircle, ArrowRight, BellRing, Store, Sparkles } from "lucide-react";
import { merchantQueryServices } from "../../../shared/data/merchant-query-services";
import { formatMoney } from "../../../shared/domain";

type MerchantDashboardScreenProps = {
  storeId: string;
};

export function MerchantDashboardScreen({
  storeId,
}: MerchantDashboardScreenProps) {
  const data = merchantQueryServices.getDashboardData(storeId);
  const activeOrderCount = data.recentOrders.filter((order) =>
    ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status),
  ).length;
  const attentionCount = data.alerts.filter((alert) => alert.type === "warning").length;

  const statusLabel: Record<string, string> = {
    pending: "New",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const alertIcons: Record<string, React.ReactNode> = {
    warning: <AlertTriangle size={14} />,
    info: <Info size={14} />,
    success: <CheckCircle size={14} />,
  };

  const kpiIcons: Record<string, React.ReactNode> = {
    revenue: <DollarSign size={18} />,
    orders: <Hash size={18} />,
    time: <Timer size={18} />,
    rating: <Star size={18} />,
  };

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-dashboard">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Store operations</span>
          <h1 className="merchant-hero-title">Dashboard</h1>
          <p className="merchant-hero-subtitle">
            Monitor today&apos;s queue, alerts, and menu readiness for {data.store.name}.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Fixture-backed demo snapshot
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <BellRing size={14} />
              {data.alerts.length} active alert{data.alerts.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Today&apos;s focus</div>
          <div className="merchant-hero-panel-value">{activeOrderCount} active orders</div>
          <div className="merchant-hero-panel-text">
            {attentionCount > 0
              ? `${attentionCount} item${attentionCount === 1 ? "" : "s"} still needs attention.`
              : "Queue is moving without any flagged issues right now."}
          </div>
          <div className="merchant-hero-panel-links">
            <Link href={`/${storeId}/orders`} className="merchant-inline-link">
              Open queue
              <ArrowRight size={14} />
            </Link>
            <Link href={`/${storeId}/menu`} className="merchant-inline-link merchant-inline-link-muted">
              Review menu
            </Link>
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Queue status</div>
          <div className="merchant-summary-value">{activeOrderCount} in progress</div>
          <div className="merchant-summary-meta">Live within this demo session</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Customer attention</div>
          <div className="merchant-summary-value">{attentionCount} flagged items</div>
          <div className="merchant-summary-meta">Warnings and response follow-up</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Store scope</div>
          <div className="merchant-summary-value">Single demo store</div>
          <div className="merchant-summary-meta">Route scope and repository scope aligned</div>
        </div>
      </div>

      <div className="kpi-grid merchant-kpi-grid">
        {data.kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card merchant-kpi-card">
            <div className={`kpi-icon ${kpi.icon}`}>
              {kpiIcons[kpi.icon] ?? <DollarSign size={18} />}
            </div>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <span className={`kpi-trend ${kpi.trendDirection}`}>
              {kpi.trendDirection === "up" ? <TrendingUp size={12} /> : kpi.trendDirection === "down" ? <TrendingDown size={12} /> : <Minus size={12} />}{" "}
              {kpi.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="grid-2 merchant-grid">
        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Queue snapshot</div>
              <div className="card-subtitle">Latest order movement for this store</div>
            </div>
            <Link
              href={`/${storeId}/orders`}
              className="btn btn-secondary btn-sm"
            >
              Open orders
            </Link>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Window</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="primary">{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td className="mono">{formatMoney(order.total)}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        <span className="status-dot" />
                        {statusLabel[order.status] ?? order.status}
                      </span>
                    </td>
                    <td>{order.estimatedDelivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Activity &amp; alerts</div>
              <div className="card-subtitle">Demo-safe operating notes for the current queue</div>
            </div>
          </div>
          <div className="card-body">
            <div className="alert-list">
              {data.alerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  <span className="alert-icon">
                    {alertIcons[alert.type] ?? <Info size={14} />}
                  </span>
                  <span className="alert-content">{alert.message}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

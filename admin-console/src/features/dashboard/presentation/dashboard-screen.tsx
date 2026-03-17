import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BellRing,
  Info,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";
import { formatMoney } from "../../../shared/domain";

export function AdminDashboardScreen() {
  const { kpis, alerts, recentOrders } = adminQueryServices.getDashboardData();
  const criticalCount = alerts.filter((alert) => alert.type === "critical").length;
  const warningCount = alerts.filter((alert) => alert.type === "warning").length;
  const revenueKpi = kpis.find((kpi) => /revenue/i.test(kpi.label));
  const orderKpi = kpis.find((kpi) => /order/i.test(kpi.label));

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <LayoutDashboard size={14} />
              Admin oversight console
            </div>
            <h1 className="oversight-title">Platform Dashboard</h1>
            <p className="oversight-subtitle">
              Start with the current fixture-backed platform snapshot, then move into order oversight,
              disputes, and customer-service queues from one consistent control surface.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Current mode</div>
            <div className="oversight-note-value">Snapshot oversight only</div>
            <p className="oversight-note-text">
              Metrics and alerts come from the in-memory read model. Use this route for triage and
              visibility, not live platform mutation.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <BellRing size={14} />
            {alerts.length} active platform alerts
          </div>
          <div className="oversight-meta-chip">
            <ShieldAlert size={14} />
            {criticalCount} critical, {warningCount} warning
          </div>
          {revenueKpi ? (
            <div className="oversight-meta-chip">
              <TrendingUp size={14} />
              {revenueKpi.label}: {revenueKpi.value}
            </div>
          ) : null}
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <TrendingUp size={14} />
            Revenue snapshot
          </div>
          <div className="oversight-summary-value">{revenueKpi?.value ?? "—"}</div>
          <div className="oversight-summary-meta">
            {revenueKpi ? `${revenueKpi.change} ${revenueKpi.changeDirection} versus the last comparison window.` : "Current revenue metric from the dashboard read model."}
          </div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <LayoutDashboard size={14} />
            Orders under watch
          </div>
          <div className="oversight-summary-value">{orderKpi?.value ?? recentOrders.length}</div>
          <div className="oversight-summary-meta">
            Current platform order volume is shown here so the oversight routes and dashboard stay aligned.
          </div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <AlertCircle size={14} />
            Escalation pressure
          </div>
          <div className="oversight-summary-value">{criticalCount + warningCount}</div>
          <div className="oversight-summary-meta">
            Combine critical and warning alerts first when triaging queue pressure across routes.
          </div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <ShieldAlert size={14} />
            Console truth
          </div>
          <div className="oversight-summary-value">Read-only</div>
          <div className="oversight-summary-meta">
            Access control is runtime-real, but dashboard data remains fixture-backed and snapshot-oriented.
          </div>
        </div>
      </section>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`kpi-card kpi-card--${kpi.category}`}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-change kpi-change--${kpi.changeDirection}`}>
              {kpi.changeDirection === "up" ? <TrendingUp size={12} /> : kpi.changeDirection === "down" ? <TrendingDown size={12} /> : <Minus size={12} />} {kpi.change}
            </div>
          </div>
        ))}
      </div>

      <div className="oversight-grid">
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">Recent Orders</h2>
              <p className="oversight-panel-subtitle">
                The latest cross-platform order activity for quick oversight before opening the full queue.
              </p>
            </div>
            <a href="/orders" className="oversight-link">
              Open order oversight
              <ArrowRight size={14} />
            </a>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Store</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="oversight-row-primary">
                        <span className="oversight-row-title monospace">{order.orderNumber}</span>
                        <span className="oversight-row-meta">{order.merchantName}</span>
                      </div>
                    </td>
                    <td>{order.customerName}</td>
                    <td>{order.storeName}</td>
                    <td>{formatMoney(order.total)}</td>
                    <td><span className={`status-badge status-badge--${order.status}`}>{order.status.replace("_", " ")}</span></td>
                    <td className="text-muted">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">Platform Alerts</h2>
              <p className="oversight-panel-subtitle">
                Current alert feed from the admin dashboard fixtures. Review here, then route into the matching oversight screen.
              </p>
            </div>
          </div>
          <div className="oversight-list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`oversight-signal oversight-signal--${alert.type}`}>
                <div className="oversight-signal-icon">
                  {alert.type === "critical" ? <AlertCircle size={18} /> : alert.type === "warning" ? <AlertTriangle size={18} /> : <Info size={18} />}
                </div>
                <div className="oversight-signal-body">
                  <div className="oversight-signal-title">{alert.message}</div>
                  <div className="oversight-signal-meta">{alert.source} · {alert.time}</div>
                  <div className="oversight-signal-copy">
                    {alert.type === "critical"
                      ? "Escalate through the relevant oversight route. The dashboard remains a snapshot, not a live incident console."
                      : alert.type === "warning"
                        ? "Use this as triage context before reviewing the related order, dispute, or support queue."
                        : "Informational signals stay visible here so platform context is not lost between routes."}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

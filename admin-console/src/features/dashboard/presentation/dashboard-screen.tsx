"use client";

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
import { formatMoney, toDisplayTime } from "../../../shared/domain";
import type { DashboardData } from "../../../shared/data/admin-repository";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminDashboardScreen({ data }: { data: DashboardData }) {
  const { raw, locale } = useAdminI18n();
  const { activeOrderCount, kpis, alerts, recentOrders } = data;
  const criticalCount = alerts.filter((alert) => alert.type === "critical").length;
  const warningCount = alerts.filter((alert) => alert.type === "warning").length;
  const revenueKpi = kpis.find((kpi) => /revenue/i.test(kpi.label));
  const orderStatusLabel = (status: string) =>
    raw(
      ({
        pending: "Pending",
        confirmed: "Confirmed",
        preparing: "Preparing",
        ready: "Ready",
        in_transit: "In Transit",
        delivered: "Delivered",
        cancelled: "Cancelled",
      } as Record<string, string>)[status] ?? status,
    );
  const alertSourceLabel = (source: string) =>
    raw(
      ({
        orders: "Orders",
        disputes: "Disputes",
        "customer-service": "Customer Service",
        dashboard: "Dashboard",
      } as Record<string, string>)[source] ?? source,
    );
  const localizeAlertMessage = (message: string) => {
    const disputes = message.match(/^(\d+) disputes? currently require oversight$/);
    if (disputes) {
      return raw(
        Number(disputes[1]) === 1
            ? "{count} dispute currently requires oversight"
            : "{count} disputes currently require oversight",
      ).replace("{count}", disputes[1]);
    }

    const pending = message.match(/^(\d+) pending orders? awaiting merchant response$/);
    if (pending) {
      return raw(
        Number(pending[1]) === 1
            ? "{count} pending order awaiting merchant response"
            : "{count} pending orders awaiting merchant response",
      ).replace("{count}", pending[1]);
    }

    const cancelled = message.match(/^(\d+) cancelled orders? remain visible for governance review$/);
    if (cancelled) {
      return raw(
        Number(cancelled[1]) === 1
            ? "{count} cancelled order remains visible for governance review"
            : "{count} cancelled orders remain visible for governance review",
      ).replace("{count}", cancelled[1]);
    }

    const latest = message.match(/^Latest runtime order (.+) from (.+)$/);
    if (latest) {
      return raw("Latest runtime order {order} from {store}")
          .replace("{order}", latest[1])
          .replace("{store}", latest[2]);
    }

    return raw(message);
  };

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <LayoutDashboard size={14} />
              {raw("Admin oversight console")}
            </div>
            <h1 className="oversight-title">{raw("Platform Dashboard")}</h1>
            <p className="oversight-subtitle">
              {raw("Start with the current runtime-backed platform snapshot, then move into order oversight, disputes, and customer-service queues from one consistent control surface.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Current mode")}</div>
            <div className="oversight-note-value">{raw("Runtime-backed oversight")}</div>
            <p className="oversight-note-text">
              {raw("Metrics, alerts, and recent orders come from the live admin read model. Use this route for triage and visibility, not live platform mutation.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <BellRing size={14} />
            {raw("{count} active platform alerts").replace("{count}", String(alerts.length))}
          </div>
          <div className="oversight-meta-chip">
            <ShieldAlert size={14} />
            {raw("{critical} critical, {warning} warning")
              .replace("{critical}", String(criticalCount))
              .replace("{warning}", String(warningCount))}
          </div>
          {revenueKpi ? (
            <div className="oversight-meta-chip">
              <TrendingUp size={14} />
              {raw(revenueKpi.label)}: {revenueKpi.value}
            </div>
          ) : null}
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <TrendingUp size={14} />
            {raw("Revenue snapshot")}
          </div>
          <div className="oversight-summary-value">{revenueKpi?.value ?? "—"}</div>
          <div className="oversight-summary-meta">
            {revenueKpi ? raw(revenueKpi.change) : raw("Current revenue metric from the dashboard read model.")}
          </div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <LayoutDashboard size={14} />
            {raw("Orders under watch")}
          </div>
          <div className="oversight-summary-value">{activeOrderCount}</div>
          <div className="oversight-summary-meta">
            {raw("Active queue volume stays aligned with the runtime admin order oversight route.")}
          </div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <AlertCircle size={14} />
            {raw("Escalation pressure")}
          </div>
          <div className="oversight-summary-value">{criticalCount + warningCount}</div>
          <div className="oversight-summary-meta">
            {raw("Combine critical and warning alerts first when triaging queue pressure across routes.")}
          </div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <ShieldAlert size={14} />
            {raw("Console truth")}
          </div>
          <div className="oversight-summary-value">{raw("Runtime-backed")}</div>
          <div className="oversight-summary-meta">
            {raw("Access control and dashboard reads are runtime-real, while admin actions remain read-only.")}
          </div>
        </div>
      </section>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`kpi-card kpi-card--${kpi.category}`}>
            <div className="kpi-label">{raw(kpi.label)}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-change kpi-change--${kpi.changeDirection}`}>
              {kpi.changeDirection === "up" ? <TrendingUp size={12} /> : kpi.changeDirection === "down" ? <TrendingDown size={12} /> : <Minus size={12} />} {raw(kpi.change)}
            </div>
          </div>
        ))}
      </div>

      <div className="oversight-grid">
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Recent Orders")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("The latest cross-platform order activity for quick oversight before opening the full queue.")}
              </p>
            </div>
            <a href="/orders" className="oversight-link">
              {raw("Open order oversight")}
              <ArrowRight size={14} />
            </a>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{raw("Order")}</th>
                  <th>{raw("Customer")}</th>
                  <th>{raw("Store")}</th>
                  <th>{raw("Total")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Time")}</th>
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
                    <td><span className={`status-badge status-badge--${order.status}`}>{orderStatusLabel(order.status)}</span></td>
                    <td className="text-muted">{toDisplayTime(order.createdAt, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Platform Alerts")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Current alert feed derived from the live admin read model. Review here, then route into the matching oversight screen.")}
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
                  <div className="oversight-signal-title">{localizeAlertMessage(alert.message)}</div>
                  <div className="oversight-signal-meta">
                    {alertSourceLabel(alert.source)} · {toDisplayTime(alert.time, locale)}
                  </div>
                  <div className="oversight-signal-copy">
                    {alert.type === "critical"
                      ? raw("Escalate through the relevant oversight route. This dashboard is runtime-backed for visibility, but it remains a read-only triage surface.")
                      : alert.type === "warning"
                        ? raw("Use this as triage context before reviewing the related order, dispute, or support queue.")
                        : raw("Informational signals stay visible here so platform context is not lost between routes.")}
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

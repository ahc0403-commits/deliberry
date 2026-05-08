 "use client";

import Link from "next/link";
import { DollarSign, Hash, Timer, Star, TrendingUp, TrendingDown, Minus, AlertTriangle, Info, CheckCircle, ArrowRight, BellRing, Store, Sparkles } from "lucide-react";
import type { DashboardData } from "../../../shared/data/merchant-repository";
import { formatMoney, toDisplayTime } from "../../../shared/domain";
import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantDashboardScreenProps = {
  storeId: string;
  data: DashboardData;
  source: "persisted" | "fallback";
};

export function MerchantDashboardScreen({
  storeId,
  data,
  source,
}: MerchantDashboardScreenProps) {
  const { locale, raw } = useMerchantI18n();
  const activeOrderCount = data.recentOrders.filter((order) =>
    ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status),
  ).length;
  const attentionCount = data.alerts.filter((alert) => alert.type === "warning").length;
  const isPersisted = source === "persisted";
  const replaceCount = (value: string, count: number) => raw(value).replace("{count}", String(count));
  const localizeKpiTrend = (trend: string) => {
    const persistedOrders = trend.match(/^(\d+) persisted orders?$/);
    if (persistedOrders) {
      return replaceCount(
        Number(persistedOrders[1]) === 1 ? "{count} persisted order" : "{count} persisted orders",
        Number(persistedOrders[1]),
      );
    }

    const activeOrders = trend.match(/^(\d+) active$/);
    if (activeOrders) {
      return replaceCount("{count} active", Number(activeOrders[1]));
    }

    const reviews = trend.match(/^(\d+) reviews?$/);
    if (reviews) {
      return replaceCount(Number(reviews[1]) === 1 ? "{count} review" : "{count} reviews", Number(reviews[1]));
    }

    return raw(trend);
  };
  const localizeAlertMessage = (message: string) => {
    const activeOrders = message.match(/^(\d+) active orders? in progress$/);
    if (activeOrders) return replaceCount("{count} active orders in progress", Number(activeOrders[1]));

    const readyForHandoff = message.match(/^(\d+) order ready for handoff$/);
    if (readyForHandoff) {
      return replaceCount(
        Number(readyForHandoff[1]) === 1
          ? "{count} order ready for handoff"
          : "{count} orders ready for handoff",
        Number(readyForHandoff[1]),
      );
    }

    const visibleItems = message.match(/^(\d+) menu items visible to customers$/);
    if (visibleItems) {
      return replaceCount(
        Number(visibleItems[1]) === 1
          ? "{count} menu item visible to customers"
          : "{count} menu items visible to customers",
        Number(visibleItems[1]),
      );
    }

    const awaitingReviewReply = message.match(/^(\d+) reviews? awaiting response$/);
    if (awaitingReviewReply) {
      return replaceCount(
        Number(awaitingReviewReply[1]) === 1
          ? "{count} review awaiting response"
          : "{count} reviews awaiting response",
        Number(awaitingReviewReply[1]),
      );
    }

    const lowStock = message.match(/^Low stock: (.+) marked unavailable$/);
    if (lowStock) {
      return raw("Low stock: {item} marked unavailable").replace("{item}", lowStock[1]);
    }

    const promotionActivated = message.match(/^New promotion (.+) activated for this weekend$/);
    if (promotionActivated) {
      return raw("New promotion {code} activated for this weekend").replace(
        "{code}",
        promotionActivated[1],
      );
    }

    const settlementProcessing = message.match(/^Weekly settlement of (.+) is being processed$/);
    if (settlementProcessing) {
      return raw("Weekly settlement of {amount} is being processed").replace(
        "{amount}",
        settlementProcessing[1],
      );
    }

    if (message === "No menu items are currently visible to customers") {
      return raw("No menu items are currently visible to customers");
    }

    return raw(message);
  };

  const statusLabel: Record<string, string> = {
    pending: raw("New"),
    confirmed: raw("Confirmed"),
    preparing: raw("Preparing"),
    ready: raw("Ready"),
    in_transit: raw("In Transit"),
    delivered: raw("Delivered"),
    cancelled: raw("Cancelled"),
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
          <span className="merchant-eyebrow">{raw("Store operations")}</span>
          <h1 className="merchant-hero-title">{raw("Dashboard")}</h1>
          <p className="merchant-hero-subtitle">
            {raw("Monitor today's queue, alerts, and menu readiness for {store}.").replace(
              "{store}",
              data.store.name,
            )}
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              {source === "persisted"
                ? raw("Runtime-backed store snapshot")
                : raw("Fixture fallback snapshot")}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <BellRing size={14} />
              {replaceCount(
                data.alerts.length === 1 ? "{count} active alert" : "{count} active alerts",
                data.alerts.length,
              )}
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">{raw("Today's focus")}</div>
          <div className="merchant-hero-panel-value">
            {replaceCount(
              activeOrderCount === 1 ? "{count} active order" : "{count} active orders",
              activeOrderCount,
            )}
          </div>
          <div className="merchant-hero-panel-text">
            {attentionCount > 0
              ? replaceCount(
                  attentionCount === 1
                    ? "{count} item still needs attention."
                    : "{count} items still need attention.",
                  attentionCount,
                )
              : raw("Queue is moving without any flagged issues right now.")}
          </div>
          <div className="merchant-hero-panel-links">
            <Link href={`/${storeId}/orders`} className="merchant-inline-link">
              {raw("Open queue")}
              <ArrowRight size={14} />
            </Link>
            <Link href={`/${storeId}/menu`} className="merchant-inline-link merchant-inline-link-muted">
              {raw("Review menu")}
            </Link>
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Queue status")}</div>
          <div className="merchant-summary-value">
            {replaceCount("{count} in progress", activeOrderCount)}
          </div>
          <div className="merchant-summary-meta">
            {isPersisted ? raw("Runtime-backed order count") : raw("Fixture fallback order count")}
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Customer attention")}</div>
          <div className="merchant-summary-value">
            {replaceCount(
              attentionCount === 1 ? "{count} flagged item" : "{count} flagged items",
              attentionCount,
            )}
          </div>
          <div className="merchant-summary-meta">{raw("Warnings from the current store snapshot")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Store scope")}</div>
          <div className="merchant-summary-value">{raw("Store-scoped")}</div>
          <div className="merchant-summary-meta">
            {raw("Route scope and repository scope aligned for {store}").replace(
              "{store}",
              data.store.name,
            )}
          </div>
        </div>
      </div>

      <div className="kpi-grid merchant-kpi-grid">
        {data.kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card merchant-kpi-card">
            <div className={`kpi-icon ${kpi.icon}`}>
              {kpiIcons[kpi.icon] ?? <DollarSign size={18} />}
            </div>
            <div className="kpi-label">{raw(kpi.label)}</div>
            <div className="kpi-value">{kpi.value}</div>
            <span className={`kpi-trend ${kpi.trendDirection}`}>
              {kpi.trendDirection === "up" ? <TrendingUp size={12} /> : kpi.trendDirection === "down" ? <TrendingDown size={12} /> : <Minus size={12} />}{" "}
              {localizeKpiTrend(kpi.trend)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid-2 merchant-grid">
        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">{raw("Queue snapshot")}</div>
              <div className="card-subtitle">{raw("Latest order movement for this store")}</div>
            </div>
            <Link
              href={`/${storeId}/orders`}
              className="btn btn-secondary btn-sm"
            >
              {raw("Open orders")}
            </Link>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{raw("Order")}</th>
                  <th>{raw("Customer")}</th>
                  <th>{raw("Total")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Window")}</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => (
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
                      <td>{toDisplayTime(order.estimatedDelivery, locale)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="primary">
                      {raw("No recent orders for this store yet.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">{raw("Activity & alerts")}</div>
              <div className="card-subtitle">
                {isPersisted
                  ? raw("Runtime operating notes for the current store")
                  : raw("Fixture fallback operating notes for local preview")}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="alert-list">
              {data.alerts.length > 0 ? (
                data.alerts.map((alert) => (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <span className="alert-icon">
                      {alertIcons[alert.type] ?? <Info size={14} />}
                    </span>
                    <span className="alert-content">{localizeAlertMessage(alert.message)}</span>
                    <span className="alert-time">
                      {alert.time ? toDisplayTime(alert.time, locale) : raw("Current")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="alert-item success">
                  <span className="alert-icon">
                    <CheckCircle size={14} />
                  </span>
                  <span className="alert-content">{raw("No active dashboard alerts for this store.")}</span>
                  <span className="alert-time">{raw("Current")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

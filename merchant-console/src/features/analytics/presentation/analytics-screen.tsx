 "use client";

import { formatMoney } from "../../../shared/domain";
import { Sparkles, Store } from "lucide-react";
import type { AnalyticsData } from "../../../shared/data/merchant-repository";
import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantAnalyticsScreenProps = {
  initialData: AnalyticsData;
  source: "persisted";
};

export function MerchantAnalyticsScreen({
  initialData,
  source,
}: MerchantAnalyticsScreenProps) {
  const { raw } = useMerchantI18n();
  const data = initialData;
  const maxRevenue = Math.max(1, ...data.dailyRevenue.map((d) => d.revenue));
  const strongestMetric = data.metrics[0];
  const localizeMetricLabel = (label: string) => raw(label);
  const localizeMetricChange = (change: string) => {
    const nonCancelled = change.match(/^(\d+) non-cancelled orders?$/);
    if (nonCancelled) {
      return raw(
        Number(nonCancelled[1]) === 1 ? "{count} non-cancelled order" : "{count} non-cancelled orders",
      ).replace("{count}", nonCancelled[1]);
    }

    const active = change.match(/^(\d+) active right now$/);
    if (active) {
      return raw("{count} active right now").replace("{count}", active[1]);
    }

    const visibleItems = change.match(/^(\d+)\/(\d+) visible menu items?$/);
    if (visibleItems) {
      return raw("{visible}/{total} visible menu items")
        .replace("{visible}", visibleItems[1])
        .replace("{total}", visibleItems[2]);
    }

    const delivered = change.match(/^(\d+) delivered$/);
    if (delivered) {
      return raw("{count} delivered").replace("{count}", delivered[1]);
    }

    const awaitingResponse = change.match(/^(\d+) awaiting response$/);
    if (awaitingResponse) {
      return raw("{count} awaiting response").replace("{count}", awaitingResponse[1]);
    }

    return raw(change);
  };

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Store insights")}</span>
          <h1 className="merchant-hero-title">{raw("Analytics")}</h1>
          <p className="merchant-hero-subtitle">
            {raw("Read runtime-derived performance signals, recent order trends, and top sellers for the active store through the current phase read-only analytics view.")}
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              {source === "persisted"
                ? raw("Runtime-derived analytics snapshot")
                : raw("Analytics snapshot")}
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">{raw("Insight focus")}</div>
          <div className="merchant-hero-panel-value">{strongestMetric?.value ?? "0"}</div>
          <div className="merchant-hero-panel-text">
            {strongestMetric
              ? raw("{label} is the leading highlighted metric in the current runtime-derived snapshot.")
                  .replace("{label}", localizeMetricLabel(strongestMetric.label))
              : raw("This route remains a read-only analytics surface in the current phase.")}
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        {data.metrics.slice(0, 3).map((metric) => (
          <div key={metric.label} className="merchant-summary-card">
            <div className="merchant-summary-label">{localizeMetricLabel(metric.label)}</div>
            <div className="merchant-summary-value">{metric.value}</div>
            <div className="merchant-summary-meta">{localizeMetricChange(metric.change)} {raw("vs last week")}</div>
          </div>
        ))}
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">{raw("Performance snapshot")}</div>
            <div className="card-subtitle">{raw("Read-only metrics, recent revenue bars, and top-selling items")}</div>
          </div>
          <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-secondary"
            disabled
            aria-disabled="true"
          >
            {raw("Export Not Yet Available")}
          </button>
        </div>
        </div>

      <div className="analytics-grid merchant-analytics-grid">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="analytics-metric merchant-analytics-metric">
            <div className="analytics-metric-label">{localizeMetricLabel(metric.label)}</div>
            <div className="analytics-metric-value">{metric.value}</div>
            <span className={`analytics-metric-change ${metric.changeDirection}`}>
              {metric.changeDirection === "up" ? "\u2191" : metric.changeDirection === "down" ? "\u2193" : "\u2192"}{" "}
              {localizeMetricChange(metric.change)} {raw("vs last week")}
            </span>
          </div>
        ))}
      </div>

      <div className="grid-2 merchant-grid">
        <div className="chart-placeholder merchant-chart-card">
          <div className="card-header" style={{ padding: "0 0 var(--space-4) 0", border: "none" }}>
            <div>
              <div className="card-title">{raw("Daily Revenue")}</div>
              <div className="card-subtitle">{raw("Last 7 days from current runtime orders")}</div>
            </div>
          </div>
          <div className="bar-chart">
            {data.dailyRevenue.map((day) => (
              <div key={day.day} className="bar-col">
                <div className="bar-value">{formatMoney(day.revenue)}</div>
                <div
                  className="bar-fill"
                  style={{
                    height: `${(day.revenue / maxRevenue) * 100}%`,
                  }}
                />
                <div className="bar-label">{raw(day.day)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">{raw("Top Selling Items")}</div>
              <div className="card-subtitle">{raw("By current recorded order quantity")}</div>
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{raw("Item")}</th>
                  <th style={{ textAlign: "right" }}>{raw("Orders")}</th>
                  <th style={{ textAlign: "right" }}>{raw("Revenue")}</th>
                </tr>
              </thead>
              <tbody>
                {data.topItems.length > 0 ? (
                  data.topItems.map((item, idx) => (
                    <tr key={item.name}>
                      <td style={{ fontWeight: 700, color: "var(--color-text-muted)" }}>
                        {idx + 1}
                      </td>
                      <td className="primary">{item.name}</td>
                      <td className="right">{item.orders}</td>
                      <td className="mono right">
                        {formatMoney(item.revenue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ color: "var(--color-text-muted)" }}>
                      {raw("No sold menu items are recorded for this store yet.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

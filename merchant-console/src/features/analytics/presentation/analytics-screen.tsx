import { merchantQueryServices } from "../../../shared/data/merchant-query-services";
import { formatMoney } from "../../../shared/domain";
import { Sparkles, Store } from "lucide-react";

type MerchantAnalyticsScreenProps = {
  storeId: string;
};

export function MerchantAnalyticsScreen({
  storeId,
}: MerchantAnalyticsScreenProps) {
  const data = merchantQueryServices.getAnalyticsData(storeId);

  const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue));
  const strongestMetric = data.metrics[0];

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Store insights</span>
          <h1 className="merchant-hero-title">Analytics</h1>
          <p className="merchant-hero-subtitle">
            Read performance signals, trend snapshots, and top sellers for the active store without implying a live reporting backend or export pipeline.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Fixture-backed metrics and preview-only export
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Insight focus</div>
          <div className="merchant-hero-panel-value">{strongestMetric?.value ?? "0"}</div>
          <div className="merchant-hero-panel-text">
            {strongestMetric
              ? `${strongestMetric.label} is the leading highlighted metric in this weekly snapshot.`
              : "This route remains a read-only weekly snapshot in the current phase."}
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        {data.metrics.slice(0, 3).map((metric) => (
          <div key={metric.label} className="merchant-summary-card">
            <div className="merchant-summary-label">{metric.label}</div>
            <div className="merchant-summary-value">{metric.value}</div>
            <div className="merchant-summary-meta">{metric.change} vs last week</div>
          </div>
        ))}
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Performance snapshot</div>
            <div className="card-subtitle">Read-only metrics, revenue bars, and top-selling items</div>
          </div>
          <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-secondary"
            disabled
            aria-disabled="true"
          >
            Export Preview Only
          </button>
        </div>
        </div>

      <div className="analytics-grid merchant-analytics-grid">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="analytics-metric merchant-analytics-metric">
            <div className="analytics-metric-label">{metric.label}</div>
            <div className="analytics-metric-value">{metric.value}</div>
            <span className={`analytics-metric-change ${metric.changeDirection}`}>
              {metric.changeDirection === "up" ? "\u2191" : metric.changeDirection === "down" ? "\u2193" : "\u2192"}{" "}
              {metric.change} vs last week
            </span>
          </div>
        ))}
      </div>

      <div className="grid-2 merchant-grid">
        <div className="chart-placeholder merchant-chart-card">
          <div className="card-header" style={{ padding: "0 0 var(--space-4) 0", border: "none" }}>
            <div>
              <div className="card-title">Daily Revenue</div>
              <div className="card-subtitle">This week</div>
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
                <div className="bar-label">{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Top Selling Items</div>
              <div className="card-subtitle">By order count this week</div>
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th style={{ textAlign: "right" }}>Orders</th>
                  <th style={{ textAlign: "right" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topItems.map((item, idx) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

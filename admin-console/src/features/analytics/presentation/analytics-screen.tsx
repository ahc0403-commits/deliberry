import { BarChart3, CalendarRange, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminAnalyticsScreen() {
  const { metrics, weeklyOrders } = adminQueryServices.getAnalyticsData();

  const maxRevenue = Math.max(...weeklyOrders.map((d) => d.revenue));

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <BarChart3 size={14} />
              Platform analytics snapshot
            </div>
            <h1 className="oversight-title">Analytics</h1>
            <p className="oversight-subtitle">
              Review platform performance and weekly order-revenue shape from a clear analytics snapshot without implying live telemetry, live ranges, or automated analytics infrastructure.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Analytics mode</div>
            <div className="oversight-note-value">Static trend visibility</div>
            <p className="oversight-note-text">
              KPI values and charts are fixture-backed. This screen is for comparative visibility only, not live analytics operations.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><TrendingUp size={14} />{metrics.length} KPI signals</div>
          <div className="oversight-meta-chip"><CalendarRange size={14} />{weeklyOrders.length}-day weekly view</div>
          <div className="oversight-meta-chip"><ShieldCheck size={14} />Snapshot telemetry only</div>
        </div>
      </section>

      <div className="kpi-grid">
        {metrics.map((m) => (
          <div key={m.label} className="kpi-card">
            <div className="kpi-label">{m.label}</div>
            <div className="kpi-value">{m.value}</div>
            <div className={`kpi-change kpi-change--${m.changeDirection}`}>
              {m.changeDirection === "up" ? "↑" : m.changeDirection === "down" ? "↓" : "→"} {m.change}
            </div>
          </div>
        ))}
      </div>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><BarChart3 size={14} />Orders tracked</div>
          <div className="oversight-summary-value">{weeklyOrders.reduce((sum, day) => sum + day.orders, 0)}</div>
          <div className="oversight-summary-meta">Weekly order totals are rolled up from the fixture-backed analytics snapshot.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><TrendingUp size={14} />Peak revenue day</div>
          <div className="oversight-summary-value">{weeklyOrders.reduce((best, day) => (day.revenue > best.revenue ? day : best), weeklyOrders[0]).day}</div>
          <div className="oversight-summary-meta">Useful for trend scanning, but not a live decisioning feed.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><CalendarRange size={14} />Daily view</div>
          <div className="oversight-summary-value">{weeklyOrders.length}</div>
          <div className="oversight-summary-meta">This route stays fixed to the current weekly snapshot rather than offering persisted date-range state.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Sparkles size={14} />Visibility mode</div>
          <div className="oversight-summary-value">Snapshot</div>
          <div className="oversight-summary-meta">All charts remain presentational and read-model aligned with no live analytics pipeline behind them.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Weekly Orders & Revenue</h2>
            <p className="oversight-panel-subtitle">
              The weekly bar view keeps order count and revenue shape visible without implying real-time or interactive analytics behavior.
            </p>
          </div>
        </div>
        <div className="oversight-chart-panel">
          <div className="oversight-chart-grid">
            {weeklyOrders.map((day) => (
              <div key={day.day} className="oversight-chart-col">
                <div className="oversight-chart-value">${(day.revenue / 100000).toFixed(1)}k</div>
                <div className="oversight-chart-bar" style={{ height: `${Math.max((day.revenue / maxRevenue) * 160, 16)}px` }} />
                <div className="oversight-chart-label">{day.day}</div>
                <div className="oversight-chart-sub">{day.orders} orders</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

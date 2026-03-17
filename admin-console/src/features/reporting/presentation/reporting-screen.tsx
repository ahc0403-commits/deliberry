import { ArrowRight, CalendarClock, FileBarChart2, ShieldCheck, Sparkles } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminReportingScreen() {
  const { metrics, reports, schedules } = adminQueryServices.getReportingData();
  const activeSchedules = schedules.filter((schedule) => schedule.active).length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <FileBarChart2 size={14} />
              Reporting visibility
            </div>
            <h1 className="oversight-title">Reporting</h1>
            <p className="oversight-subtitle">
              Review the current report catalog, reporting metrics, and schedule visibility from one snapshot route without implying live export automation or backend report generation.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Reporting mode</div>
            <div className="oversight-note-value">Catalog and schedule preview</div>
            <p className="oversight-note-text">
              Reports and schedules now flow through the reporting read model, but export-style actions remain local UI affordances only.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><FileBarChart2 size={14} />{reports.length} report definitions</div>
          <div className="oversight-meta-chip"><CalendarClock size={14} />{activeSchedules} active schedules</div>
          <div className="oversight-meta-chip"><ShieldCheck size={14} />Read-model aligned reporting view</div>
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
          <div className="oversight-summary-label"><FileBarChart2 size={14} />Reports</div>
          <div className="oversight-summary-value">{reports.length}</div>
          <div className="oversight-summary-meta">Available report definitions are visible here as a static catalog, not on-demand exports.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><CalendarClock size={14} />Schedules</div>
          <div className="oversight-summary-value">{schedules.length}</div>
          <div className="oversight-summary-meta">Reporting schedules show current fixture-backed delivery expectations and recipients.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />Active</div>
          <div className="oversight-summary-value">{activeSchedules}</div>
          <div className="oversight-summary-meta">Active schedule state is visible here, but not wired to a live reporting backend.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Sparkles size={14} />Console truth</div>
          <div className="oversight-summary-value">Snapshot</div>
          <div className="oversight-summary-meta">The route is read-model aligned and export controls stay intentionally non-operational.</div>
        </div>
      </section>

      <div className="oversight-grid">
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">Available Reports</h2>
              <p className="oversight-panel-subtitle">
                Governance reporting catalog with clearer period context and preview-only access states.
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              Export remains static preview
            </div>
          </div>
          <div className="oversight-stack">
            {reports.map((report) => (
              <div key={report.name} className="oversight-record">
                <div className="oversight-record-main">
                  <div className="oversight-record-title">{report.name}</div>
                  <div className="oversight-record-subtitle">{report.desc}</div>
                  <div className="oversight-record-meta">
                    <span className="oversight-micro-chip">{report.period}</span>
                    <span className="oversight-micro-chip">Fixture-backed definition</span>
                  </div>
                </div>
                <span className="btn-preview">Static preview</span>
              </div>
            ))}
          </div>
        </section>

        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">Scheduled Reports</h2>
              <p className="oversight-panel-subtitle">
                Delivery cadence and recipients remain visible here for governance awareness, not live schedule management.
              </p>
            </div>
          </div>
          <div className="oversight-stack">
            {schedules.map((sched) => (
              <div key={sched.name} className="oversight-record">
                <div className="oversight-record-main">
                  <div className="oversight-record-title">{sched.name}</div>
                  <div className="oversight-record-subtitle">{sched.frequency} → {sched.recipients}</div>
                  <div className="oversight-record-meta">
                    <span className="oversight-micro-chip">{sched.active ? "Currently marked active" : "Currently marked paused"}</span>
                    <span className="oversight-micro-chip">Read-model schedule only</span>
                  </div>
                </div>
                <span className={`status-badge status-badge--${sched.active ? "active" : "closed"}`}>{sched.active ? "Active" : "Paused"}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { ArrowRight, CalendarClock, FileBarChart2, ShieldCheck, Sparkles } from "lucide-react";
import { adminFixtureFacade } from "../../../shared/data/admin-query-services";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminReportingScreen() {
  const { raw } = useAdminI18n();
  const { metrics, reports, schedules } = adminFixtureFacade.getReportingData();
  const activeSchedules = schedules.filter((schedule) => schedule.active).length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <FileBarChart2 size={14} />
              {raw("Reporting visibility")}
            </div>
            <h1 className="oversight-title">{raw("Reporting")}</h1>
            <p className="oversight-subtitle">
              {raw("Review the current report catalog, reporting metrics, and schedule visibility from one snapshot route without implying live export automation or backend report generation.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Reporting mode")}</div>
            <div className="oversight-note-value">{raw("Catalog and schedule preview")}</div>
            <p className="oversight-note-text">
              {raw("Reports and schedules now flow through the reporting read model, but export-style actions remain local UI affordances only.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><FileBarChart2 size={14} />{raw("{count} report definitions").replace("{count}", String(reports.length))}</div>
          <div className="oversight-meta-chip"><CalendarClock size={14} />{raw("{count} active schedules").replace("{count}", String(activeSchedules))}</div>
          <div className="oversight-meta-chip"><ShieldCheck size={14} />{raw("Read-model aligned reporting view")}</div>
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
          <div className="oversight-summary-label"><FileBarChart2 size={14} />{raw("Reports")}</div>
          <div className="oversight-summary-value">{reports.length}</div>
          <div className="oversight-summary-meta">{raw("Available report definitions are visible here as a static catalog, not on-demand exports.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><CalendarClock size={14} />{raw("Schedules")}</div>
          <div className="oversight-summary-value">{schedules.length}</div>
          <div className="oversight-summary-meta">{raw("Reporting schedules show current fixture-backed delivery expectations and recipients.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />{raw("Active")}</div>
          <div className="oversight-summary-value">{activeSchedules}</div>
          <div className="oversight-summary-meta">{raw("Active schedule state is visible here, but not wired to a live reporting backend.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Sparkles size={14} />{raw("Console truth")}</div>
          <div className="oversight-summary-value">{raw("Snapshot")}</div>
          <div className="oversight-summary-meta">{raw("The route is read-model aligned and export controls stay intentionally non-operational.")}</div>
        </div>
      </section>

      <div className="oversight-grid">
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Available Reports")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Governance reporting catalog with clearer period context and preview-only access states.")}
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              {raw("Export remains static preview")}
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
                    <span className="oversight-micro-chip">{raw("Fixture-backed definition")}</span>
                  </div>
                </div>
                <span className="btn-preview">{raw("Static preview")}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Scheduled Reports")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Delivery cadence and recipients remain visible here for governance awareness, not live schedule management.")}
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
                    <span className="oversight-micro-chip">{sched.active ? raw("Currently marked active") : raw("Currently marked paused")}</span>
                    <span className="oversight-micro-chip">{raw("Read-model schedule only")}</span>
                  </div>
                </div>
                <span className={`status-badge status-badge--${sched.active ? "active" : "closed"}`}>{sched.active ? raw("Active") : raw("Paused")}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

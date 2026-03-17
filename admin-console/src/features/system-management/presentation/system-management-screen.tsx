import { Cog, ShieldCheck, Sparkles, ToggleLeft, Wrench } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminSystemManagementScreen() {
  const { health, featureFlags } = adminQueryServices.getSystemManagementData();
  const healthyCount = health.filter((service) => service.status === "healthy").length;
  const enabledFlags = featureFlags.filter((flag) => flag.enabled).length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Cog size={14} />
              System visibility
            </div>
            <h1 className="oversight-title">System Management</h1>
            <p className="oversight-subtitle">
              Review platform service health and feature-flag state from one calm oversight surface without implying live control execution or backend configuration writes.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Control mode</div>
            <div className="oversight-note-value">Snapshot and preview only</div>
            <p className="oversight-note-text">
              Health status and feature flags are fixture-backed. Toggles remain read-only so platform control intent stays honest in this phase.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><ShieldCheck size={14} />{healthyCount} healthy services</div>
          <div className="oversight-meta-chip"><ToggleLeft size={14} />{enabledFlags} enabled flags</div>
          <div className="oversight-meta-chip"><Wrench size={14} />Snapshot operations view</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />Healthy services</div>
          <div className="oversight-summary-value">{healthyCount}</div>
          <div className="oversight-summary-meta">Service health remains a current snapshot, not a live monitoring or incident-response system.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Wrench size={14} />Services tracked</div>
          <div className="oversight-summary-value">{health.length}</div>
          <div className="oversight-summary-meta">Infrastructure services and their basic health indicators remain visible in one governance route.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ToggleLeft size={14} />Feature flags</div>
          <div className="oversight-summary-value">{featureFlags.length}</div>
          <div className="oversight-summary-meta">Feature-flag rows stay readable here, but flag state does not imply live console mutation.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Sparkles size={14} />Execution mode</div>
          <div className="oversight-summary-value">Preview</div>
          <div className="oversight-summary-meta">Controls remain read-only and manual follow-through happens outside this console.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Service Health</h2>
            <p className="oversight-panel-subtitle">
              Infrastructure status stays visible as a snapshot, with no auto-refresh or live systems control implied.
            </p>
          </div>
          <span className="table-inline-note">Snapshot view</span>
        </div>
        <div className="health-grid">
          {health.map((svc) => (
            <div key={svc.service} className={`health-card health-card--${svc.status}`}>
              <div className="health-status-dot" />
              <div className="health-service">{svc.service}</div>
              <div className="health-details">
                <span>Uptime: {svc.uptime}</span>
                <span>Latency: {svc.latency}</span>
              </div>
              <div className="text-muted" style={{ fontSize: "0.6875rem" }}>Last check: {svc.lastCheck}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Feature Flags</h2>
            <p className="oversight-panel-subtitle">
              Flag states remain visible here for review confidence while their controls stay explicitly non-operational.
            </p>
          </div>
        </div>
        <div className="oversight-stack">
          {featureFlags.map((flag) => (
            <div key={flag.id} className="oversight-control-card">
              <div className="oversight-control-row">
                <div className="oversight-control-copy">
                  <div className="oversight-control-title monospace">{flag.name}</div>
                  <div className="oversight-control-desc">{flag.description}</div>
                  <div className="oversight-record-meta">
                    <span className={`type-badge type-badge--${flag.scope}`}>{flag.scope}</span>
                    <span className="oversight-micro-chip">Read-only flag preview</span>
                  </div>
                </div>
                <span className="btn-preview">{flag.enabled ? "Enabled snapshot" : "Disabled snapshot"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

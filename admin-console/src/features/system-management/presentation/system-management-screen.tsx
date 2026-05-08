"use client";

import { Cog, ShieldCheck, Sparkles, ToggleLeft, Wrench } from "lucide-react";
import { adminFixtureFacade } from "../../../shared/data/admin-query-services";
import type { AuditLogEntry } from "../../../shared/data/supabase-admin-runtime-repository";
import { useAdminI18n } from "../../../shared/i18n/client";

type AdminSystemManagementScreenProps = {
  auditEntries: AuditLogEntry[];
};

function formatAuditTimestamp(timestampUtc: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(timestampUtc));
}

function formatAuditAction(action: string) {
  return action
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AdminSystemManagementScreen({
  auditEntries,
}: AdminSystemManagementScreenProps) {
  const { raw, locale } = useAdminI18n();
  const { health, featureFlags } = adminFixtureFacade.getSystemManagementData();
  const healthyCount = health.filter((service) => service.status === "healthy").length;
  const enabledFlags = featureFlags.filter((flag) => flag.enabled).length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Cog size={14} />
              {raw("System visibility")}
            </div>
            <h1 className="oversight-title">{raw("System Management")}</h1>
            <p className="oversight-subtitle">
              {raw("Review platform service health and feature-flag state from one calm oversight surface without implying live control execution or backend configuration writes.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Control mode")}</div>
            <div className="oversight-note-value">{raw("Snapshot and preview only")}</div>
            <p className="oversight-note-text">
              {raw("Health status and feature flags are fixture-backed. Toggles remain read-only so platform control intent stays honest in this phase.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><ShieldCheck size={14} />{raw("{count} healthy services").replace("{count}", String(healthyCount))}</div>
          <div className="oversight-meta-chip"><ToggleLeft size={14} />{raw("{count} enabled flags").replace("{count}", String(enabledFlags))}</div>
          <div className="oversight-meta-chip"><Wrench size={14} />{raw("Snapshot operations view")}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />{raw("Healthy services")}</div>
          <div className="oversight-summary-value">{healthyCount}</div>
          <div className="oversight-summary-meta">{raw("Service health remains a current snapshot, not a live monitoring or incident-response system.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Wrench size={14} />{raw("Services tracked")}</div>
          <div className="oversight-summary-value">{health.length}</div>
          <div className="oversight-summary-meta">{raw("Infrastructure services and their basic health indicators remain visible in one governance route.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ToggleLeft size={14} />{raw("Feature flags")}</div>
          <div className="oversight-summary-value">{featureFlags.length}</div>
          <div className="oversight-summary-meta">{raw("Feature-flag rows stay readable here, but flag state does not imply live console mutation.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Sparkles size={14} />{raw("Execution mode")}</div>
          <div className="oversight-summary-value">{raw("Preview")}</div>
          <div className="oversight-summary-meta">{raw("Controls remain read-only and manual follow-through happens outside this console.")}</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Service Health")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Infrastructure status stays visible as a snapshot, with no auto-refresh or live systems control implied.")}
            </p>
          </div>
          <span className="table-inline-note">{raw("Snapshot view")}</span>
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
              <div className="text-muted" style={{ fontSize: "0.6875rem" }}>{raw("Last check:")} {svc.lastCheck}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Feature Flags")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Flag states remain visible here for review confidence while their controls stay explicitly non-operational.")}
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
                    <span className="oversight-micro-chip">{raw("Read-only flag preview")}</span>
                  </div>
                </div>
                <span className="btn-preview">{flag.enabled ? raw("Enabled snapshot") : raw("Disabled snapshot")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Recent Audit Activity")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Recent immutable audit records are read from the governed runtime store so platform reviewers can inspect the latest protected mutations without enabling direct writes from this route.")}
            </p>
          </div>
          <span className="table-inline-note">{raw("Read-only audit log")}</span>
        </div>
        <div className="oversight-stack">
          {auditEntries.map((entry) => (
            <div key={entry.id} className="oversight-record">
              <div className="oversight-record-main">
                <div className="oversight-record-title">
                  {formatAuditAction(entry.action)}
                </div>
                <div className="oversight-record-subtitle">
                  {entry.actorName} ({entry.actorType}) touched{" "}
                  {entry.resourceType} {entry.resourceId}.
                </div>
                <div className="oversight-record-meta">
                  <span className="oversight-micro-chip">
                    Actor {entry.actorId}
                  </span>
                  <span className="oversight-micro-chip">
                    Resource {entry.resourceType}
                  </span>
                  <span className="oversight-micro-chip">
                    UTC {formatAuditTimestamp(entry.timestampUtc, locale)}
                  </span>
                </div>
              </div>
              <span className="btn-preview">{raw("Immutable record")}</span>
            </div>
          ))}
          {auditEntries.length === 0 ? (
            <div className="oversight-record">
              <div className="oversight-record-main">
                <div className="oversight-record-title">{raw("No audit entries yet")}</div>
                <div className="oversight-record-subtitle">
                  {raw("Audit storage is available, but this environment has not produced a governed mutation record yet.")}
                </div>
              </div>
              <span className="btn-preview">{raw("Empty audit store")}</span>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

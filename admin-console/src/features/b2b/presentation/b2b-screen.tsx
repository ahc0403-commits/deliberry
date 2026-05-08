"use client";

import { Building2, FileSignature, Handshake, Mail, ShieldCheck } from "lucide-react";
import { adminFixtureFacade } from "../../../shared/data/admin-query-services";
import { toDisplayTime } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminB2BScreen() {
  const { locale, raw } = useAdminI18n();
  const { partners } = adminFixtureFacade.getB2BData();
  const activeCount = partners.filter((p) => p.status === "active").length;
  const pendingCount = partners.filter((p) => p.status === "pending").length;
  const statusLabel = (status: string) => {
    switch (status) {
      case "active":
        return raw("Active");
      case "inactive":
        return raw("Inactive");
      case "pending":
        return raw("Pending");
      default:
        return raw(status);
    }
  };
  const typeLabel = (type: string) => {
    switch (type) {
      case "supplier":
        return raw("Supplier");
      case "logistics":
        return raw("Logistics");
      case "technology":
        return raw("Technology");
      case "payment":
        return raw("Payment");
      default:
        return raw(type);
    }
  };

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Handshake size={14} />
              {raw("Partner governance")}
            </div>
            <h1 className="oversight-title">{raw("B2B Partners")}</h1>
            <p className="oversight-subtitle">
              {raw("Review partner portfolio status, contract windows, and contact visibility from one governance route without implying live contract operations or partner-management writes.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Partner mode")}</div>
            <div className="oversight-note-value">{raw("Contract visibility only")}</div>
            <p className="oversight-note-text">
              {raw("Partner records are fixture-backed and preview-only. This route is for oversight and relationship visibility, not live contract execution.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><Building2 size={14} />{raw("{count} partner records").replace("{count}", String(partners.length))}</div>
          <div className="oversight-meta-chip"><ShieldCheck size={14} />{raw("{count} active partners").replace("{count}", String(activeCount))}</div>
          <div className="oversight-meta-chip"><FileSignature size={14} />{raw("{count} pending agreements").replace("{count}", String(pendingCount))}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Building2 size={14} />{raw("Total partners")}</div>
          <div className="oversight-summary-value">{partners.length}</div>
          <div className="oversight-summary-meta">{raw("All partner records currently exposed in the B2B oversight read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />{raw("Active")}</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">{raw("Active partners remain visible first so relationship health is clear at a glance.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><FileSignature size={14} />{raw("Pending")}</div>
          <div className="oversight-summary-value">{pendingCount}</div>
          <div className="oversight-summary-meta">{raw("Pending partner rows stay clearly grouped for contract review and follow-up planning.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Mail size={14} />{raw("Route truth")}</div>
          <div className="oversight-summary-value">{raw("Preview")}</div>
          <div className="oversight-summary-meta">{raw("Contact and contract detail remain visible, but partner actions stay explicitly non-operational.")}</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Partner Directory")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Contract windows, partner type, and contact visibility are structured here so the route reads as a deliberate relationship-governance surface.")}
            </p>
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{raw("Company")}</th>
                <th>{raw("Type")}</th>
                <th>{raw("Status")}</th>
                <th>{raw("Contract Start")}</th>
                <th>{raw("Contract End")}</th>
                <th>{raw("Contact")}</th>
                <th>{raw("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{p.companyName}</span>
                      <span className="oversight-row-meta">{toDisplayTime(p.contractStart, locale)} → {toDisplayTime(p.contractEnd, locale)}</span>
                    </div>
                  </td>
                  <td><span className={`type-badge type-badge--${p.type}`}>{typeLabel(p.type)}</span></td>
                  <td><span className={`status-badge status-badge--${p.status}`}>{statusLabel(p.status)}</span></td>
                  <td className="text-muted">{toDisplayTime(p.contractStart, locale)}</td>
                  <td className="text-muted">{toDisplayTime(p.contractEnd, locale)}</td>
                  <td className="text-muted">{p.contactEmail}</td>
                  <td><span className="btn-preview">{raw("View preview")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

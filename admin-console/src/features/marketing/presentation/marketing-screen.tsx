"use client";

import { ArrowRight, Megaphone, Sparkles, Target, Wallet } from "lucide-react";
import { adminFixtureFacade } from "../../../shared/data/admin-query-services";
import { formatMoney, toDisplayTime } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminMarketingScreen() {
  const { locale, raw } = useAdminI18n();
  const { campaigns } = adminFixtureFacade.getMarketingData();
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const totalReach = campaigns.reduce((acc, c) => acc + c.reach, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
  const statusLabel = (status: string) => {
    switch (status) {
      case "active":
        return raw("Active");
      case "draft":
        return raw("Draft");
      case "scheduled":
        return raw("Scheduled");
      case "ended":
        return raw("Ended");
      default:
        return raw(status);
    }
  };
  const typeLabel = (type: string) => {
    switch (type) {
      case "banner":
        return raw("Banner");
      case "push_notification":
        return raw("Push notification");
      case "email":
        return raw("Email campaign");
      case "in_app":
        return raw("In-app placement");
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
              <Megaphone size={14} />
              {raw("Communication oversight")}
            </div>
            <h1 className="oversight-title">{raw("Marketing")}</h1>
            <p className="oversight-subtitle">
              {raw("Review campaign status, reach, and spend visibility from one snapshot communication route without implying live campaign operations or budget controls.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Campaign mode")}</div>
            <div className="oversight-note-value">{raw("Preview-only marketing visibility")}</div>
            <p className="oversight-note-text">
              {raw("Campaign rows are fixture-backed and read-only. This route is for governance review and commercial context, not live campaign execution.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><Target size={14} />{raw("{count} active campaigns").replace("{count}", String(activeCount))}</div>
          <div className="oversight-meta-chip"><Sparkles size={14} />{raw("{count} total reach").replace("{count}", totalReach.toLocaleString(locale))}</div>
          <div className="oversight-meta-chip"><Wallet size={14} />{raw("{amount} total budget").replace("{amount}", formatMoney(totalBudget))}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Megaphone size={14} />{raw("Total campaigns")}</div>
          <div className="oversight-summary-value">{campaigns.length}</div>
          <div className="oversight-summary-meta">{raw("All campaign definitions currently visible in the marketing oversight read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Target size={14} />{raw("Active")}</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">{raw("Active campaigns stay separated from draft and ended states for quick scanability.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Sparkles size={14} />{raw("Total reach")}</div>
          <div className="oversight-summary-value">{totalReach.toLocaleString(locale)}</div>
          <div className="oversight-summary-meta">{raw("Reach remains snapshot reporting only and is not wired to live campaign analytics.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Wallet size={14} />{raw("Conversions")}</div>
          <div className="oversight-summary-value">{totalConversions.toLocaleString(locale)}</div>
          <div className="oversight-summary-meta">{raw("Conversion counts remain informative, not operational triggers or live attribution flows.")}</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Campaign Directory")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Campaign type, status, budget, and spend are grouped here so the route reads as a deliberate communication-governance surface.")}
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            {raw("Campaign detail remains preview-only")}
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{raw("Campaign")}</th>
                <th>{raw("Type")}</th>
                <th>{raw("Status")}</th>
                <th>{raw("Reach")}</th>
                <th>{raw("Conversions")}</th>
                <th>{raw("Budget")}</th>
                <th>{raw("Spent")}</th>
                <th>{raw("Period")}</th>
                <th>{raw("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{c.name}</span>
                      <span className="oversight-row-meta">{toDisplayTime(c.startDate, locale)} – {toDisplayTime(c.endDate, locale)}</span>
                    </div>
                  </td>
                  <td><span className={`type-badge type-badge--${c.type}`}>{typeLabel(c.type)}</span></td>
                  <td><span className={`status-badge status-badge--${c.status === "active" ? "active" : c.status === "ended" ? "closed" : c.status === "draft" ? "pending" : "processing"}`}>{statusLabel(c.status)}</span></td>
                  <td>{c.reach.toLocaleString(locale)}</td>
                  <td>{c.conversions.toLocaleString(locale)}</td>
                  <td>{formatMoney(c.budget)}</td>
                  <td>{formatMoney(c.spent)}</td>
                  <td className="text-muted">{toDisplayTime(c.startDate, locale)} – {toDisplayTime(c.endDate, locale)}</td>
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

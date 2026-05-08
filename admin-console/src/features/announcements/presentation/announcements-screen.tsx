"use client";

import { CalendarClock, Megaphone, PenSquare, RadioTower } from "lucide-react";
import { adminFixtureFacade } from "../../../shared/data/admin-query-services";
import { toDisplayTime } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminAnnouncementsScreen() {
  const { locale, raw } = useAdminI18n();
  const { announcements } = adminFixtureFacade.getAnnouncementsData();
  const publishedCount = announcements.filter((a) => a.status === "published").length;
  const scheduledCount = announcements.filter((a) => a.status === "scheduled").length;
  const draftCount = announcements.filter((a) => a.status === "draft").length;
  const audienceLabel = (audience: string) => {
    switch (audience) {
      case "all":
        return raw("All audiences");
      case "merchants":
        return raw("Merchants");
      case "customers":
        return raw("Customers");
      case "internal":
        return raw("Internal");
      default:
        return raw(audience);
    }
  };
  const statusLabel = (status: string) => {
    switch (status) {
      case "published":
        return raw("Published");
      case "scheduled":
        return raw("Scheduled");
      case "draft":
        return raw("Draft");
      default:
        return raw(status);
    }
  };

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Megaphone size={14} />
              {raw("Message governance")}
            </div>
            <h1 className="oversight-title">{raw("Announcements")}</h1>
            <p className="oversight-subtitle">
              {raw("Review platform-wide communication states, audience targets, and publishing readiness without implying live authoring or operational broadcast tools in this console.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Announcement mode")}</div>
            <div className="oversight-note-value">{raw("Manual messaging preview")}</div>
            <p className="oversight-note-text">
              {raw("Announcement rows are fixture-backed and creation/edit flows remain preview-only. This route is for communication review, not live publishing.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><RadioTower size={14} />{raw("{count} published").replace("{count}", String(publishedCount))}</div>
          <div className="oversight-meta-chip"><CalendarClock size={14} />{raw("{count} scheduled").replace("{count}", String(scheduledCount))}</div>
          <div className="oversight-meta-chip"><PenSquare size={14} />{raw("{count} drafts").replace("{count}", String(draftCount))}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><RadioTower size={14} />{raw("Published")}</div>
          <div className="oversight-summary-value">{publishedCount}</div>
          <div className="oversight-summary-meta">{raw("Published messages stay visible for communication-history review only.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><CalendarClock size={14} />{raw("Scheduled")}</div>
          <div className="oversight-summary-value">{scheduledCount}</div>
          <div className="oversight-summary-meta">{raw("Scheduled rows remain snapshot planning state, not a live scheduling system.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><PenSquare size={14} />{raw("Drafts")}</div>
          <div className="oversight-summary-value">{draftCount}</div>
          <div className="oversight-summary-meta">{raw("Draft counts are surfaced first so unfinished communications are visible before table review.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Megaphone size={14} />{raw("Route truth")}</div>
          <div className="oversight-summary-value">{raw("Preview")}</div>
          <div className="oversight-summary-meta">{raw("Creation and edit affordances remain explicitly non-operational in the current admin phase.")}</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Announcement Directory")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Audience, publication state, and author visibility are grouped here so operators can review communication posture before parsing dates.")}
            </p>
          </div>
          <span className="btn-preview">{raw("Creation preview only")}</span>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{raw("Title")}</th>
                <th>{raw("Audience")}</th>
                <th>{raw("Status")}</th>
                <th>{raw("Date")}</th>
                <th>{raw("Author")}</th>
                <th>{raw("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{a.title}</span>
                      <span className="oversight-row-meta">{a.author}</span>
                    </div>
                  </td>
                  <td><span className={`type-badge type-badge--${a.audience}`}>{audienceLabel(a.audience)}</span></td>
                  <td><span className={`status-badge status-badge--${a.status === "published" ? "active" : a.status === "scheduled" ? "processing" : "pending"}`}>{statusLabel(a.status)}</span></td>
                  <td className="text-muted">{a.publishedAt ? toDisplayTime(a.publishedAt, locale) : a.scheduledAt ? toDisplayTime(a.scheduledAt, locale) : "—"}</td>
                  <td className="text-muted">{a.author}</td>
                  <td><span className="btn-preview">{a.status === "draft" ? raw("Edit preview") : raw("Read-only")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

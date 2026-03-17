import { CalendarClock, Megaphone, PenSquare, RadioTower } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminAnnouncementsScreen() {
  const { announcements } = adminQueryServices.getAnnouncementsData();
  const publishedCount = announcements.filter((a) => a.status === "published").length;
  const scheduledCount = announcements.filter((a) => a.status === "scheduled").length;
  const draftCount = announcements.filter((a) => a.status === "draft").length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Megaphone size={14} />
              Message governance
            </div>
            <h1 className="oversight-title">Announcements</h1>
            <p className="oversight-subtitle">
              Review platform-wide communication states, audience targets, and publishing readiness without implying live authoring or operational broadcast tools in this console.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Announcement mode</div>
            <div className="oversight-note-value">Manual messaging preview</div>
            <p className="oversight-note-text">
              Announcement rows are fixture-backed and creation/edit flows remain preview-only. This route is for communication review, not live publishing.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><RadioTower size={14} />{publishedCount} published</div>
          <div className="oversight-meta-chip"><CalendarClock size={14} />{scheduledCount} scheduled</div>
          <div className="oversight-meta-chip"><PenSquare size={14} />{draftCount} drafts</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><RadioTower size={14} />Published</div>
          <div className="oversight-summary-value">{publishedCount}</div>
          <div className="oversight-summary-meta">Published messages stay visible for communication-history review only.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><CalendarClock size={14} />Scheduled</div>
          <div className="oversight-summary-value">{scheduledCount}</div>
          <div className="oversight-summary-meta">Scheduled rows remain snapshot planning state, not a live scheduling system.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><PenSquare size={14} />Drafts</div>
          <div className="oversight-summary-value">{draftCount}</div>
          <div className="oversight-summary-meta">Draft counts are surfaced first so unfinished communications are visible before table review.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Megaphone size={14} />Route truth</div>
          <div className="oversight-summary-value">Preview</div>
          <div className="oversight-summary-meta">Creation and edit affordances remain explicitly non-operational in the current admin phase.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Announcement Directory</h2>
            <p className="oversight-panel-subtitle">
              Audience, publication state, and author visibility are grouped here so operators can review communication posture before parsing dates.
            </p>
          </div>
          <span className="btn-preview">Creation preview only</span>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Audience</th>
                <th>Status</th>
                <th>Date</th>
                <th>Author</th>
                <th>Actions</th>
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
                  <td><span className={`type-badge type-badge--${a.audience}`}>{a.audience}</span></td>
                  <td><span className={`status-badge status-badge--${a.status === "published" ? "active" : a.status === "scheduled" ? "processing" : "pending"}`}>{a.status}</span></td>
                  <td className="text-muted">{a.publishedAt || a.scheduledAt || "—"}</td>
                  <td className="text-muted">{a.author}</td>
                  <td><span className="btn-preview">{a.status === "draft" ? "Edit preview" : "Read-only"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

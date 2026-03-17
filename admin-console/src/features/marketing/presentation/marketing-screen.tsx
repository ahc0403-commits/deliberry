import { ArrowRight, Megaphone, Sparkles, Target, Wallet } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";
import { formatMoney } from "../../../shared/domain";

export function AdminMarketingScreen() {
  const { campaigns } = adminQueryServices.getMarketingData();
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const totalReach = campaigns.reduce((acc, c) => acc + c.reach, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Megaphone size={14} />
              Communication oversight
            </div>
            <h1 className="oversight-title">Marketing</h1>
            <p className="oversight-subtitle">
              Review campaign status, reach, and spend visibility from one snapshot communication route without implying live campaign operations or budget controls.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Campaign mode</div>
            <div className="oversight-note-value">Preview-only marketing visibility</div>
            <p className="oversight-note-text">
              Campaign rows are fixture-backed and read-only. This route is for governance review and commercial context, not live campaign execution.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><Target size={14} />{activeCount} active campaigns</div>
          <div className="oversight-meta-chip"><Sparkles size={14} />{totalReach.toLocaleString()} total reach</div>
          <div className="oversight-meta-chip"><Wallet size={14} />{formatMoney(totalBudget)} total budget</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Megaphone size={14} />Total campaigns</div>
          <div className="oversight-summary-value">{campaigns.length}</div>
          <div className="oversight-summary-meta">All campaign definitions currently visible in the marketing oversight read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Target size={14} />Active</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">Active campaigns stay separated from draft and ended states for quick scanability.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Sparkles size={14} />Total reach</div>
          <div className="oversight-summary-value">{totalReach.toLocaleString()}</div>
          <div className="oversight-summary-meta">Reach remains snapshot reporting only and is not wired to live campaign analytics.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Wallet size={14} />Conversions</div>
          <div className="oversight-summary-value">{totalConversions.toLocaleString()}</div>
          <div className="oversight-summary-meta">Conversion counts remain informative, not operational triggers or live attribution flows.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Campaign Directory</h2>
            <p className="oversight-panel-subtitle">
              Campaign type, status, budget, and spend are grouped here so the route reads as a deliberate communication-governance surface.
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            Campaign detail remains preview-only
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Type</th>
                <th>Status</th>
                <th>Reach</th>
                <th>Conversions</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{c.name}</span>
                      <span className="oversight-row-meta">{c.startDate} – {c.endDate}</span>
                    </div>
                  </td>
                  <td><span className={`type-badge type-badge--${c.type}`}>{c.type.replace("_", " ")}</span></td>
                  <td><span className={`status-badge status-badge--${c.status === "active" ? "active" : c.status === "ended" ? "closed" : c.status === "draft" ? "pending" : "processing"}`}>{c.status}</span></td>
                  <td>{c.reach.toLocaleString()}</td>
                  <td>{c.conversions.toLocaleString()}</td>
                  <td>{formatMoney(c.budget)}</td>
                  <td>{formatMoney(c.spent)}</td>
                  <td className="text-muted">{c.startDate} – {c.endDate}</td>
                  <td><span className="btn-preview">View preview</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

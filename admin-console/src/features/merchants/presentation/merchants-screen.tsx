import { ArrowRight, BadgeCheck, Building2, ClipboardCheck, Store } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";
import { formatMoney } from "../../../shared/domain";

export function AdminMerchantsScreen() {
  const { merchants } = adminQueryServices.getMerchantsData();
  const activeCount = merchants.filter((m) => m.status === "active").length;
  const pendingCount = merchants.filter((m) => m.status === "pending_review").length;
  const complianceCount = merchants.filter((m) => m.compliance !== "compliant").length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Building2 size={14} />
              Merchant oversight
            </div>
            <h1 className="oversight-title">Merchant Governance</h1>
            <p className="oversight-subtitle">
              Review onboarding pressure, compliance status, and merchant footprint from the same admin oversight system as dashboard, orders, and disputes.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Governance mode</div>
            <div className="oversight-note-value">Snapshot merchant review</div>
            <p className="oversight-note-text">
              Merchant records are fixture-backed. Review and management controls stay preview-only instead of implying live platform operations.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><BadgeCheck size={14} />{activeCount} active merchants</div>
          <div className="oversight-meta-chip"><ClipboardCheck size={14} />{pendingCount} pending review</div>
          <div className="oversight-meta-chip"><Store size={14} />{merchants.reduce((sum, merchant) => sum + merchant.storeCount, 0)} stores in scope</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Building2 size={14} />Total merchants</div>
          <div className="oversight-summary-value">{merchants.length}</div>
          <div className="oversight-summary-meta">All merchant entities visible from the current admin read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><BadgeCheck size={14} />Active</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">Active merchants remain grouped for quick operational confidence checks.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ClipboardCheck size={14} />Pending review</div>
          <div className="oversight-summary-value">{pendingCount}</div>
          <div className="oversight-summary-meta">Review-needed merchants are surfaced directly instead of being buried in the full directory.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Store size={14} />Compliance issues</div>
          <div className="oversight-summary-value">{complianceCount}</div>
          <div className="oversight-summary-meta">Non-compliant or review-needed merchant records remain informative only in this phase.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Merchant Oversight Directory</h2>
            <p className="oversight-panel-subtitle">
              Business footprint, compliance, and commercial performance are grouped here for review confidence without suggesting live merchant management writes.
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            Review remains preview-only
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Stores</th>
                <th>Status</th>
                <th>Compliance</th>
                <th>Revenue</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{m.businessName}</span>
                      <span className="oversight-row-meta">{m.ownerName}</span>
                    </div>
                  </td>
                  <td>{m.ownerName}</td>
                  <td className="text-muted">{m.email}</td>
                  <td>{m.storeCount}</td>
                  <td><span className={`status-badge status-badge--${m.status}`}>{m.status.replace("_", " ")}</span></td>
                  <td><span className={`status-badge status-badge--${m.compliance === "compliant" ? "active" : m.compliance === "review_needed" ? "pending" : "suspended"}`}>{m.compliance.replace("_", " ")}</span></td>
                  <td>{formatMoney(m.totalRevenue)}</td>
                  <td className="text-muted">{m.joinedAt}</td>
                  <td><span className="btn-preview">Review preview</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

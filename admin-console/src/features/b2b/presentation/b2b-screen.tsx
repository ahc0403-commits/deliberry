import { Building2, FileSignature, Handshake, Mail, ShieldCheck } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminB2BScreen() {
  const { partners } = adminQueryServices.getB2BData();
  const activeCount = partners.filter((p) => p.status === "active").length;
  const pendingCount = partners.filter((p) => p.status === "pending").length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Handshake size={14} />
              Partner governance
            </div>
            <h1 className="oversight-title">B2B Partners</h1>
            <p className="oversight-subtitle">
              Review partner portfolio status, contract windows, and contact visibility from one governance route without implying live contract operations or partner-management writes.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Partner mode</div>
            <div className="oversight-note-value">Contract visibility only</div>
            <p className="oversight-note-text">
              Partner records are fixture-backed and preview-only. This route is for oversight and relationship visibility, not live contract execution.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><Building2 size={14} />{partners.length} partner records</div>
          <div className="oversight-meta-chip"><ShieldCheck size={14} />{activeCount} active partners</div>
          <div className="oversight-meta-chip"><FileSignature size={14} />{pendingCount} pending agreements</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Building2 size={14} />Total partners</div>
          <div className="oversight-summary-value">{partners.length}</div>
          <div className="oversight-summary-meta">All partner records currently exposed in the B2B oversight read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />Active</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">Active partners remain visible first so relationship health is clear at a glance.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><FileSignature size={14} />Pending</div>
          <div className="oversight-summary-value">{pendingCount}</div>
          <div className="oversight-summary-meta">Pending partner rows stay clearly grouped for contract review and follow-up planning.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Mail size={14} />Route truth</div>
          <div className="oversight-summary-value">Preview</div>
          <div className="oversight-summary-meta">Contact and contract detail remain visible, but partner actions stay explicitly non-operational.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Partner Directory</h2>
            <p className="oversight-panel-subtitle">
              Contract windows, partner type, and contact visibility are structured here so the route reads as a deliberate relationship-governance surface.
            </p>
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Contract Start</th>
                <th>Contract End</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{p.companyName}</span>
                      <span className="oversight-row-meta">{p.contractStart} → {p.contractEnd}</span>
                    </div>
                  </td>
                  <td><span className={`type-badge type-badge--${p.type}`}>{p.type}</span></td>
                  <td><span className={`status-badge status-badge--${p.status}`}>{p.status}</span></td>
                  <td className="text-muted">{p.contractStart}</td>
                  <td className="text-muted">{p.contractEnd}</td>
                  <td className="text-muted">{p.contactEmail}</td>
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

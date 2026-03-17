import { AlertTriangle, ArrowRight, FileWarning, ShieldAlert, Wallet } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";
import { formatMoney } from "../../../shared/domain";

export function AdminDisputesScreen() {
  const { disputes } = adminQueryServices.getDisputesData();
  const openCases = disputes.filter((d) => d.status === "open").length;
  const escalatedCases = disputes.filter((d) => d.status === "escalated").length;
  const highPriorityCases = disputes.filter((d) => d.priority === "high").length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <ShieldAlert size={14} />
              Platform issue review
            </div>
            <h1 className="oversight-title">Disputes</h1>
            <p className="oversight-subtitle">
              Review active case pressure, identify escalation hotspots, and inspect dispute value without implying live resolution or assignment writes inside this console.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Case handling mode</div>
            <div className="oversight-note-value">Manual resolution outside console</div>
            <p className="oversight-note-text">
              The queue is fixture-backed. Action controls stay in preview-only mode so operators can review current pressure without fake completion.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <FileWarning size={14} />
            {disputes.length} cases visible
          </div>
          <div className="oversight-meta-chip">
            <AlertTriangle size={14} />
            {highPriorityCases} high-priority cases
          </div>
          <div className="oversight-meta-chip">
            <Wallet size={14} />
            {formatMoney(disputes.reduce((acc, d) => acc + d.amount, 0))} at issue
          </div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <FileWarning size={14} />
            Total cases
          </div>
          <div className="oversight-summary-value">{disputes.length}</div>
          <div className="oversight-summary-meta">All disputes currently available in the admin oversight read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <ShieldAlert size={14} />
            Open review
          </div>
          <div className="oversight-summary-value">{openCases}</div>
          <div className="oversight-summary-meta">Cases still waiting for manual follow-through outside the preview-only admin queue.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <AlertTriangle size={14} />
            Escalated
          </div>
          <div className="oversight-summary-value">{escalatedCases}</div>
          <div className="oversight-summary-meta">Escalated items stay visible here to support cross-team governance review.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <Wallet size={14} />
            Amount at issue
          </div>
          <div className="oversight-summary-value">{formatMoney(disputes.reduce((acc, d) => acc + d.amount, 0))}</div>
          <div className="oversight-summary-meta">Value remains informative only in this phase; resolution and payouts are handled elsewhere.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Dispute Case Queue</h2>
            <p className="oversight-panel-subtitle">
              Priority, category, and status are grouped here to make escalation scanning faster without overpromising live dispute operations.
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            Preview-only case actions
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Customer</th>
                <th>Store</th>
                <th>Order</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title monospace">{d.caseNumber}</span>
                      <span className="oversight-row-meta">{d.category.replace("_", " ")}</span>
                    </div>
                  </td>
                  <td>{d.customerName}</td>
                  <td>{d.storeName}</td>
                  <td><span className="monospace">{d.orderId}</span></td>
                  <td>{d.category.replace("_", " ")}</td>
                  <td><span className={`priority-badge priority-badge--${d.priority}`}>{d.priority}</span></td>
                  <td><span className={`status-badge status-badge--${d.status}`}>{d.status}</span></td>
                  <td>{formatMoney(d.amount)}</td>
                  <td className="text-muted">{d.createdAt}</td>
                  <td>
                    <span className="btn-preview">
                      {d.status === "open" ? "Assignment preview" : d.status === "escalated" ? "Review preview" : "Read-only"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

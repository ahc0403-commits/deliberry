import { ArrowRight, Headset, MessageSquareWarning, ShieldCheck, UserRoundSearch } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminCustomerServiceScreen() {
  const { tickets } = adminQueryServices.getCustomerServiceData();
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length;
  const unassignedTickets = tickets.filter((t) => t.assignee === "Unassigned").length;
  const highPriorityTickets = tickets.filter((t) => t.priority === "high").length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Headset size={14} />
              Service oversight
            </div>
            <h1 className="oversight-title">Customer Service</h1>
            <p className="oversight-subtitle">
              Review support workload, queue pressure, and assignment readiness from the same oversight system as orders and disputes, while keeping agent actions truthful and preview-only.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Support mode</div>
            <div className="oversight-note-value">Workload visibility only</div>
            <p className="oversight-note-text">
              Tickets are fixture-backed and agent actions remain non-operational in this phase. Use this view to inspect queue pressure and manual follow-up needs.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <MessageSquareWarning size={14} />
            {tickets.length} visible service tickets
          </div>
          <div className="oversight-meta-chip">
            <UserRoundSearch size={14} />
            {unassignedTickets} unassigned cases
          </div>
          <div className="oversight-meta-chip">
            <ShieldCheck size={14} />
            {highPriorityTickets} high-priority tickets
          </div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <Headset size={14} />
            Total queue
          </div>
          <div className="oversight-summary-value">{tickets.length}</div>
          <div className="oversight-summary-meta">All support cases available in the admin customer-service read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <MessageSquareWarning size={14} />
            Open tickets
          </div>
          <div className="oversight-summary-value">{openTickets}</div>
          <div className="oversight-summary-meta">Open tickets still waiting for manual queue review or external follow-through.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <ShieldCheck size={14} />
            In progress
          </div>
          <div className="oversight-summary-value">{inProgressTickets}</div>
          <div className="oversight-summary-meta">Tickets already under review remain visible here for oversight continuity.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <UserRoundSearch size={14} />
            Unassigned
          </div>
          <div className="oversight-summary-value">{unassignedTickets}</div>
          <div className="oversight-summary-meta">Unassigned ticket count is surfaced directly so workload imbalance is easier to spot.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Support Ticket Queue</h2>
            <p className="oversight-panel-subtitle">
              Inspect customer issue patterns, agent ownership, and status without implying live assignment or resolution in this console.
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            Assignment remains preview-only
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title monospace">{t.ticketNumber}</span>
                      <span className="oversight-row-meta">{t.category.replace("_", " ")}</span>
                    </div>
                  </td>
                  <td>{t.customerName}</td>
                  <td style={{ maxWidth: "240px" }}>{t.subject}</td>
                  <td>{t.category.replace("_", " ")}</td>
                  <td><span className={`priority-badge priority-badge--${t.priority}`}>{t.priority}</span></td>
                  <td><span className={`status-badge status-badge--${t.status}`}>{t.status.replace("_", " ")}</span></td>
                  <td className="text-muted">{t.assignee}</td>
                  <td className="text-muted">{t.createdAt}</td>
                  <td>
                    <span className="btn-preview">
                      {t.assignee === "Unassigned" ? "Assignment preview" : "Read-only"}
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

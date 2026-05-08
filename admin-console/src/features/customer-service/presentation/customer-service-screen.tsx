"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Headset, MessageSquareWarning, ShieldCheck, UserRoundSearch } from "lucide-react";

import type { SupportTicket } from "../../../shared/data/admin-mock-data";
import { toDisplayTime } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";
import { SupportTicketActionCell } from "./support-ticket-action-cell";

export function AdminCustomerServiceScreen({ tickets }: { tickets: SupportTicket[] }) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id ?? null);
  const { raw } = useAdminI18n();

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length;
  const unassignedTickets = tickets.filter((t) => t.assignee === "Unassigned").length;
  const highPriorityTickets = tickets.filter((t) => t.priority === "high").length;
  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId, tickets],
  );
  const displayCategory = (value: SupportTicket["category"]) => raw(ticketCategoryLabel(value));
  const displayStatus = (value: SupportTicket["status"]) => raw(ticketStatusLabel(value));
  const displayPriority = (value: SupportTicket["priority"]) => raw(priorityLabel(value));
  const displayAssignee = (value: string) => raw(value);
  const displaySubject = (value: string) => raw(value);

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Headset size={14} />
              {raw("Service oversight")}
            </div>
            <h1 className="oversight-title">{raw("Customer Service")}</h1>
            <p className="oversight-subtitle">
              {raw("Review support workload, queue pressure, and ticket-state progress from the same oversight system as orders and disputes, while keeping assignment, reply, and payment-side actions outside this console.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Support mode")}</div>
            <div className="oversight-note-value">{raw("Governed status transitions only")}</div>
            <p className="oversight-note-text">
              {raw("Tickets are persisted and admins can move them through the approved audited status path. Assignment, internal notes, customer replies, and refund decisions still remain outside this surface.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <MessageSquareWarning size={14} />
            {tickets.length} {raw("visible service tickets")}
          </div>
          <div className="oversight-meta-chip">
            <UserRoundSearch size={14} />
            {unassignedTickets} {raw("unassigned cases")}
          </div>
          <div className="oversight-meta-chip">
            <ShieldCheck size={14} />
            {highPriorityTickets} {raw("high-priority tickets")}
          </div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <Headset size={14} />
            {raw("Total queue")}
          </div>
          <div className="oversight-summary-value">{tickets.length}</div>
          <div className="oversight-summary-meta">{raw("All support cases available in the admin customer-service read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <MessageSquareWarning size={14} />
            {raw("Open tickets")}
          </div>
          <div className="oversight-summary-value">{openTickets}</div>
          <div className="oversight-summary-meta">{raw("Open tickets still waiting for a governed admin status transition.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <ShieldCheck size={14} />
            {raw("In progress")}
          </div>
          <div className="oversight-summary-value">{inProgressTickets}</div>
          <div className="oversight-summary-meta">{raw("Tickets already under review remain visible here for oversight continuity.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <UserRoundSearch size={14} />
            {raw("Unassigned")}
          </div>
          <div className="oversight-summary-value">{unassignedTickets}</div>
          <div className="oversight-summary-meta">{raw("Unassigned ticket count is surfaced directly so workload imbalance is easier to spot.")}</div>
        </div>
      </section>

      <div className={selectedTicket ? "oversight-grid oversight-grid--detail" : "oversight-grid"}>
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Support Ticket Queue")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Inspect customer issue patterns and move tickets through the approved audited support lifecycle without implying live assignment or refund handling in this console.")}
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              {raw("Select a ticket to inspect runtime detail")}
            </div>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{raw("Ticket")}</th>
                  <th>{raw("Customer")}</th>
                  <th>{raw("Subject")}</th>
                  <th>{raw("Category")}</th>
                  <th>{raw("Priority")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Assignee")}</th>
                  <th>{raw("Created")}</th>
                  <th>{raw("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`data-table-row-clickable${selectedTicket?.id === ticket.id ? " row-selected" : ""}`}
                    onClick={() => setSelectedTicketId(selectedTicket?.id === ticket.id ? null : ticket.id)}
                  >
                    <td>
                      <div className="oversight-row-primary">
                        <span className="oversight-row-title monospace">{ticket.ticketNumber}</span>
                        <span className="oversight-row-meta">{displayCategory(ticket.category)}</span>
                      </div>
                    </td>
                    <td>{ticket.customerName}</td>
                    <td style={{ maxWidth: "240px" }}>{displaySubject(ticket.subject)}</td>
                    <td>{displayCategory(ticket.category)}</td>
                    <td><span className={`priority-badge priority-badge--${ticket.priority}`}>{displayPriority(ticket.priority)}</span></td>
                    <td><span className={`status-badge status-badge--${ticket.status}`}>{displayStatus(ticket.status)}</span></td>
                    <td className="text-muted">{displayAssignee(ticket.assignee)}</td>
                    <td className="text-muted">{toDisplayTime(ticket.createdAt)}</td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <SupportTicketActionCell ticketId={ticket.id} status={ticket.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedTicket ? (
          <aside className="oversight-panel">
            <div className="oversight-panel-header">
              <div>
                <h3 className="oversight-panel-title">{raw("Support Review Pane")}</h3>
                <p className="oversight-panel-subtitle">
                  {raw("Runtime-backed support context for governance review. Audited status transitions stay available in the queue actions, while this pane focuses on triage context only.")}
                </p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedTicketId(null)}>{raw("Close")}</button>
            </div>
            <div className="oversight-pane">
              <div className="oversight-review-banner">
                <div>
                  <div className="oversight-review-label">{raw("Review mode")}</div>
                  <div className="oversight-review-title">{raw(ticketReviewTone(selectedTicket))}</div>
                </div>
                <div className="oversight-review-chips">
                  <span className="btn-preview">{displayPriority(selectedTicket.priority)}</span>
                  <span className="btn-preview">{displayStatus(selectedTicket.status)}</span>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Ticket")}</div>
                    <div className="oversight-pane-stat-value monospace">{selectedTicket.ticketNumber}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Customer")}</div>
                    <div className="oversight-pane-stat-value">{selectedTicket.customerName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Status")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`status-badge status-badge--${selectedTicket.status}`}>{displayStatus(selectedTicket.status)}</span>
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Priority")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`priority-badge priority-badge--${selectedTicket.priority}`}>{displayPriority(selectedTicket.priority)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Ticket context")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Subject")}</div>
                    <div className="oversight-pane-stat-value">{displaySubject(selectedTicket.subject)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Category")}</div>
                    <div className="oversight-pane-stat-value">{displayCategory(selectedTicket.category)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Customer email")}</div>
                    <div className="oversight-pane-stat-value">{selectedTicket.customerEmail ?? raw("Email unavailable")}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Assignee")}</div>
                    <div className="oversight-pane-stat-value">{displayAssignee(selectedTicket.assignee)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Created")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedTicket.createdAt)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Last updated")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedTicket.updatedAt ?? selectedTicket.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-note">
                {raw("This pane stays focused on support triage context. Assignment ownership, customer replies, internal notes, and refund-side decisions remain intentionally outside the admin console even while audited status transitions stay available from the queue.")}
              </div>

              <div className="oversight-actions">
                <span className="oversight-actions-label">{raw("Inspection cues")}</span>
                <div className="oversight-actions-list">
                  <span className="btn-preview">{selectedTicket.assignee === "Unassigned" ? raw("Needs routing") : raw("Assignee visible")}</span>
                  <span className="btn-preview">{selectedTicket.status === "awaiting_reply" ? raw("Awaiting customer reply") : raw("Internal review state")}</span>
                  <span className="btn-preview">{selectedTicket.priority === "high" ? raw("Priority escalation") : raw("Standard urgency")}</span>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function priorityLabel(priority: SupportTicket["priority"]) {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  return "Low";
}

function ticketStatusLabel(status: SupportTicket["status"]) {
  if (status === "open") return "Open";
  if (status === "in_progress") return "In Progress";
  if (status === "awaiting_reply") return "Awaiting Reply";
  if (status === "resolved") return "Resolved";
  return "Closed";
}

function ticketCategoryLabel(category: SupportTicket["category"]) {
  if (category === "order_issue") return "Order Issue";
  if (category === "merchant_complaint") return "Merchant Complaint";
  if (category === "payment") return "Payment";
  if (category === "general") return "General";
  return "Account";
}

function ticketReviewTone(ticket: SupportTicket) {
  if (ticket.status === "open") return "New queue intake";
  if (ticket.status === "in_progress") return "Active support review";
  if (ticket.status === "awaiting_reply") return "Awaiting customer reply";
  if (ticket.status === "resolved") return "Resolution check";
  return "Closed support record";
}

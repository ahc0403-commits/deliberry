"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Eye, FileWarning, ShieldAlert, Wallet } from "lucide-react";

import { formatMoney, toDisplayTime } from "../../../shared/domain";
import type { PlatformDispute } from "../../../shared/data/admin-mock-data";
import { useAdminI18n } from "../../../shared/i18n/client";
import { DisputeActionCell } from "./dispute-action-cell";

export function AdminDisputesScreen({ disputes }: { disputes: PlatformDispute[] }) {
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(disputes[0]?.id ?? null);
  const { raw } = useAdminI18n();

  const openCases = disputes.filter((d) => d.status === "open").length;
  const escalatedCases = disputes.filter((d) => d.status === "escalated").length;
  const highPriorityCases = disputes.filter((d) => d.priority === "high").length;
  const selectedDispute = useMemo(
    () => disputes.find((dispute) => dispute.id === selectedDisputeId) ?? null,
    [disputes, selectedDisputeId],
  );
  const displayCategory = (value: PlatformDispute["category"]) => raw(disputeCategoryLabel(value));
  const displayStatus = (value: PlatformDispute["status"]) => raw(disputeStatusLabel(value));
  const displayPriority = (value: PlatformDispute["priority"]) => raw(priorityLabel(value));
  const displaySummary = (value: string) => raw(value);

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <ShieldAlert size={14} />
              {raw("Platform issue review")}
            </div>
            <h1 className="oversight-title">{raw("Disputes")}</h1>
            <p className="oversight-subtitle">
              {raw("Review active case pressure, identify escalation hotspots, and move disputes through the approved audited status path without drifting into refund, assignment, or payout control.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Case handling mode")}</div>
            <div className="oversight-note-value">{raw("Governed status transitions only")}</div>
            <p className="oversight-note-text">
              {raw("The queue is persisted. Admins can start review, escalate, and resolve through audited writes. Assignment, refund decisions, and support follow-through still stay outside this surface.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <FileWarning size={14} />
            {disputes.length} {raw("cases visible")}
          </div>
          <div className="oversight-meta-chip">
            <AlertTriangle size={14} />
            {highPriorityCases} {raw("high-priority cases")}
          </div>
          <div className="oversight-meta-chip">
            <Wallet size={14} />
            {formatMoney(disputes.reduce((acc, dispute) => acc + dispute.amount, 0))} {raw("at issue")}
          </div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <FileWarning size={14} />
            {raw("Total cases")}
          </div>
          <div className="oversight-summary-value">{disputes.length}</div>
          <div className="oversight-summary-meta">{raw("All disputes currently available in the admin oversight read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <ShieldAlert size={14} />
            {raw("Open review")}
          </div>
          <div className="oversight-summary-value">{openCases}</div>
          <div className="oversight-summary-meta">{raw("Cases still waiting for an approved admin status transition.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <AlertTriangle size={14} />
            {raw("Escalated")}
          </div>
          <div className="oversight-summary-value">{escalatedCases}</div>
          <div className="oversight-summary-meta">{raw("Escalated items stay visible here to support cross-team governance review.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label">
            <Wallet size={14} />
            {raw("Amount at issue")}
          </div>
          <div className="oversight-summary-value">{formatMoney(disputes.reduce((acc, dispute) => acc + dispute.amount, 0))}</div>
          <div className="oversight-summary-meta">{raw("Value remains informative only in this phase; resolution and payouts are handled elsewhere.")}</div>
        </div>
      </section>

      <div className={selectedDispute ? "oversight-grid oversight-grid--detail" : "oversight-grid"}>
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Dispute Case Queue")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Priority, category, and status are grouped here to make escalation scanning faster while keeping the governed admin mutation path narrow and auditable.")}
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              {raw("Select a dispute to inspect runtime detail")}
            </div>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{raw("Case")}</th>
                  <th>{raw("Customer")}</th>
                  <th>{raw("Store")}</th>
                  <th>{raw("Order")}</th>
                  <th>{raw("Category")}</th>
                  <th>{raw("Priority")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Amount")}</th>
                  <th>{raw("Created")}</th>
                  <th>{raw("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute) => (
                  <tr
                    key={dispute.id}
                    className={`data-table-row-clickable${selectedDispute?.id === dispute.id ? " row-selected" : ""}`}
                    onClick={() => setSelectedDisputeId(selectedDispute?.id === dispute.id ? null : dispute.id)}
                  >
                    <td>
                      <div className="oversight-row-primary">
                        <span className="oversight-row-title monospace">{dispute.caseNumber}</span>
                        <span className="oversight-row-meta">{displayCategory(dispute.category)}</span>
                      </div>
                    </td>
                    <td>{dispute.customerName}</td>
                    <td>{dispute.storeName}</td>
                    <td><span className="monospace">{dispute.orderId}</span></td>
                    <td>{displayCategory(dispute.category)}</td>
                    <td><span className={`priority-badge priority-badge--${dispute.priority}`}>{displayPriority(dispute.priority)}</span></td>
                    <td><span className={`status-badge status-badge--${dispute.status}`}>{displayStatus(dispute.status)}</span></td>
                    <td>{formatMoney(dispute.amount)}</td>
                    <td className="text-muted">{toDisplayTime(dispute.createdAt)}</td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <DisputeActionCell disputeId={dispute.id} status={dispute.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedDispute ? (
          <aside className="oversight-panel">
            <div className="oversight-panel-header">
              <div>
                <h3 className="oversight-panel-title">{raw("Dispute Review Pane")}</h3>
                <p className="oversight-panel-subtitle">
                  {raw("Runtime-backed dispute context for governance review. Audited status transitions stay available in the queue actions, while this pane focuses on case assessment only.")}
                </p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedDisputeId(null)}>{raw("Close")}</button>
            </div>
            <div className="oversight-pane">
              <div className="oversight-review-banner">
                <div>
                  <div className="oversight-review-label">{raw("Review mode")}</div>
                  <div className="oversight-review-title">{raw(disputeReviewTone(selectedDispute))}</div>
                </div>
                <div className="oversight-review-chips">
                  <span className="btn-preview">{displayPriority(selectedDispute.priority)}</span>
                  <span className="btn-preview">{displayStatus(selectedDispute.status)}</span>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Case")}</div>
                    <div className="oversight-pane-stat-value monospace">{selectedDispute.caseNumber}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Status")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`status-badge status-badge--${selectedDispute.status}`}>{displayStatus(selectedDispute.status)}</span>
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Priority")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`priority-badge priority-badge--${selectedDispute.priority}`}>{displayPriority(selectedDispute.priority)}</span>
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Amount")}</div>
                    <div className="oversight-pane-stat-value">{formatMoney(selectedDispute.amount)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Case context")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Customer")}</div>
                    <div className="oversight-pane-stat-value">{selectedDispute.customerName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Store")}</div>
                    <div className="oversight-pane-stat-value">{selectedDispute.storeName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Order")}</div>
                    <div className="oversight-pane-stat-value monospace">{selectedDispute.orderId}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Category")}</div>
                    <div className="oversight-pane-stat-value">{displayCategory(selectedDispute.category)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Created")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedDispute.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Case summary")}</div>
                <div className="oversight-note">
                  {displaySummary(selectedDispute.description)}
                </div>
              </div>

              <div className="oversight-note">
                {raw("This pane stays focused on dispute assessment context. Assignment ownership, refund decisions, payout impact, and reopen handling remain intentionally outside the admin console even while audited status transitions stay available from the queue.")}
              </div>

              <div className="oversight-actions">
                <span className="oversight-actions-label">{raw("Inspection cues")}</span>
                <div className="oversight-actions-list">
                  <span className="btn-preview">{selectedDispute.priority === "high" ? raw("Priority escalation") : raw("Standard urgency")}</span>
                  <span className="btn-preview">{selectedDispute.status === "escalated" ? raw("Cross-team follow-up") : raw("Admin queue owned")}</span>
                  <span className="btn-preview">{selectedDispute.category === "billing" ? raw("Payment-adjacent issue") : raw("Operational issue")}</span>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function priorityLabel(priority: PlatformDispute["priority"]) {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  return "Low";
}

function disputeStatusLabel(status: PlatformDispute["status"]) {
  if (status === "open") return "Open";
  if (status === "investigating") return "Investigating";
  if (status === "escalated") return "Escalated";
  return "Resolved";
}

function disputeCategoryLabel(category: PlatformDispute["category"]) {
  if (category === "missing_items") return "Missing Items";
  if (category === "billing") return "Billing";
  if (category === "quality") return "Quality";
  if (category === "delivery") return "Delivery";
  return "Other";
}

function disputeReviewTone(dispute: PlatformDispute) {
  if (dispute.status === "open") return "New dispute intake";
  if (dispute.status === "investigating") return "Active dispute review";
  if (dispute.status === "escalated") return "Escalation in progress";
  return "Resolution check";
}

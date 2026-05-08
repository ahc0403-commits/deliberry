"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Eye, Shield, UserCheck, UserRound, UserX } from "lucide-react";

import type { PlatformUser } from "../../../shared/data/admin-mock-data";
import { toDisplayTime } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminUsersScreen({ users }: { users: PlatformUser[] }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(users[0]?.id ?? null);
  const { raw } = useAdminI18n();
  const displayUserType = (value: PlatformUser["type"]) => raw(userTypeLabel(value));
  const displayUserStatus = (value: PlatformUser["status"]) => raw(userStatusLabel(value));
  const displayActorType = (value: string | null | undefined) => raw(actorTypeLabel(value));
  const displayAdminRole = (value: string | null | undefined) => raw(adminRoleLabel(value));

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending: users.filter((u) => u.status === "pending").length,
  };
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users],
  );

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <UserRound size={14} />
              {raw("Entity oversight")}
            </div>
            <h1 className="oversight-title">{raw("User Management")}</h1>
            <p className="oversight-subtitle">
              {raw("Review account health, status distribution, and platform participation from one snapshot governance surface without implying live account administration.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Management mode")}</div>
            <div className="oversight-note-value">{raw("Runtime-backed account review")}</div>
            <p className="oversight-note-text">
              {raw("Counts and user rows come from the persisted admin read model. Selecting a row opens a read-only runtime detail pane in this console phase.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <UserCheck size={14} />
            {counts.active} {raw("active accounts")}
          </div>
          <div className="oversight-meta-chip">
            <UserX size={14} />
            {counts.suspended} {raw("suspended")}
          </div>
          <div className="oversight-meta-chip">
            <Shield size={14} />
            {counts.pending} {raw("pending review")}
          </div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><UserRound size={14} />{raw("Total users")}</div>
          <div className="oversight-summary-value">{counts.total}</div>
          <div className="oversight-summary-meta">{raw("All persisted platform accounts currently visible to admin oversight.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><UserCheck size={14} />{raw("Active")}</div>
          <div className="oversight-summary-value">{counts.active}</div>
          <div className="oversight-summary-meta">{raw("Active accounts remain readable here for health and participation review.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><UserX size={14} />{raw("Suspended")}</div>
          <div className="oversight-summary-value">{counts.suspended}</div>
          <div className="oversight-summary-meta">{raw("Suspended records are visible for audit context, not live reinstatement or moderation.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Shield size={14} />{raw("Pending")}</div>
          <div className="oversight-summary-value">{counts.pending}</div>
          <div className="oversight-summary-meta">{raw("Pending users stay grouped so governance review starts from the right account segment.")}</div>
        </div>
      </section>

      <div className={selectedUser ? "oversight-grid oversight-grid--detail" : "oversight-grid"}>
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Platform User Directory")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Account rows are optimized for review confidence: identity, activity, order footprint, and runtime detail access.")}
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              {raw("Select a user to inspect runtime detail")}
            </div>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{raw("Name")}</th>
                  <th>{raw("Email")}</th>
                  <th>{raw("Type")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Registered")}</th>
                  <th>{raw("Last Active")}</th>
                  <th>{raw("Orders")}</th>
                  <th>{raw("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`data-table-row-clickable${selectedUser?.id === user.id ? " row-selected" : ""}`}
                    onClick={() => setSelectedUserId(selectedUser?.id === user.id ? null : user.id)}
                  >
                    <td>
                      <div className="oversight-row-primary">
                        <span className="oversight-row-title">{user.name}</span>
                        <span className="oversight-row-meta">{displayUserType(user.type)} {raw("account")}</span>
                      </div>
                    </td>
                    <td className="text-muted">{user.email}</td>
                    <td><span className={`type-badge type-badge--${user.type}`}>{displayUserType(user.type)}</span></td>
                    <td><span className={`status-badge status-badge--${user.status}`}>{displayUserStatus(user.status)}</span></td>
                    <td className="text-muted">{toDisplayTime(user.registeredAt)}</td>
                    <td className="text-muted">{toDisplayTime(user.lastActive)}</td>
                    <td>{user.ordersCount > 0 ? user.ordersCount : "—"}</td>
                    <td className="actions">
                      <button
                        className="btn-secondary btn-sm"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedUserId(selectedUser?.id === user.id ? null : user.id);
                        }}
                      >
                        <Eye size={14} />
                        {selectedUser?.id === user.id ? raw("Close") : raw("Inspect")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedUser ? (
          <aside className="oversight-panel">
            <div className="oversight-panel-header">
              <div>
                <h3 className="oversight-panel-title">{raw("User Review Pane")}</h3>
                <p className="oversight-panel-subtitle">
                  {raw("Runtime-backed user detail for governance review. This panel stays intentionally non-mutating.")}
                </p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedUserId(null)}>{raw("Close")}</button>
            </div>
            <div className="oversight-pane">
              <div className="oversight-review-banner">
                <div>
                  <div className="oversight-review-label">{raw("Review mode")}</div>
                  <div className="oversight-review-title">{raw(userReviewTone(selectedUser))}</div>
                </div>
                <div className="oversight-review-chips">
                  <span className="btn-preview">{displayUserType(selectedUser.type)}</span>
                  <span className="btn-preview">{displayUserStatus(selectedUser.status)}</span>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Name")}</div>
                    <div className="oversight-pane-stat-value">{selectedUser.name}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Type")}</div>
                    <div className="oversight-pane-stat-value">{displayUserType(selectedUser.type)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Status")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`status-badge status-badge--${selectedUser.status}`}>{displayUserStatus(selectedUser.status)}</span>
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Actor type")}</div>
                    <div className="oversight-pane-stat-value">{displayActorType(selectedUser.actorType)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Identity and access context")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Email")}</div>
                    <div className="oversight-pane-stat-value">{selectedUser.email}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Phone")}</div>
                    <div className="oversight-pane-stat-value">{selectedUser.phoneNumber ?? raw("Phone unavailable")}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Registered")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedUser.registeredAt)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Last Active")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedUser.lastActive)}</div>
                  </div>
                  {selectedUser.adminRole ? (
                    <div className="oversight-pane-stat">
                      <div className="oversight-pane-stat-label">{raw("Admin role")}</div>
                      <div className="oversight-pane-stat-value">{displayAdminRole(selectedUser.adminRole)}</div>
                    </div>
                  ) : null}
                  {selectedUser.type === "merchant" ? (
                    <div className="oversight-pane-stat">
                      <div className="oversight-pane-stat-label">{raw("Stores")}</div>
                      <div className="oversight-pane-stat-value">{selectedUser.storeCount ?? 0}</div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Participation and support signal")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Orders")}</div>
                    <div className="oversight-pane-stat-value">{selectedUser.ordersCount}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Active queue")}</div>
                    <div className="oversight-pane-stat-value">{selectedUser.activeOrders ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Disputes")}</div>
                    <div className="oversight-pane-stat-value">{selectedUser.disputedOrders ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Support tickets")}</div>
                    <div className="oversight-pane-stat-value">{selectedUser.supportTickets ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Last order seen")}</div>
                    <div className="oversight-pane-stat-value">
                      {selectedUser.lastOrderAt ? toDisplayTime(selectedUser.lastOrderAt) : raw("No order activity yet")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="oversight-note">
                {raw("Admin user review stays read-only on this route. Use this pane to understand account health and platform participation, then coordinate any governed follow-up through the owning operational route.")}
              </div>

              <div className="oversight-actions">
                <span className="oversight-actions-label">{raw("Inspection cues")}</span>
                <div className="oversight-actions-list">
                  <span className="btn-preview">{selectedUser.type === "customer" ? raw("Customer participation") : selectedUser.type === "merchant" ? raw("Merchant operator") : raw("Platform staff")}</span>
                  <span className="btn-preview">{(selectedUser.supportTickets ?? 0) > 0 ? raw("Support history visible") : raw("No support history")}</span>
                  <span className="btn-preview">{(selectedUser.disputedOrders ?? 0) > 0 ? raw("Dispute follow-up visible") : raw("No dispute signal")}</span>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function userTypeLabel(type: PlatformUser["type"]) {
  if (type === "customer") return "Customer";
  if (type === "merchant") return "Merchant";
  return "Admin";
}

function userStatusLabel(status: PlatformUser["status"]) {
  if (status === "active") return "Active";
  if (status === "suspended") return "Suspended";
  return "Pending";
}

function actorTypeLabel(actorType: string | null | undefined) {
  if (!actorType) return "Unknown actor type";
  if (actorType === "merchant_owner") return "Merchant Owner";
  if (actorType === "customer") return "Customer";
  if (actorType === "admin") return "Admin";
  return actorType;
}

function adminRoleLabel(role: string | null | undefined) {
  if (!role) return "Unknown admin role";
  if (role === "platform_admin") return "Platform Admin";
  if (role === "operations_admin") return "Operations Admin";
  if (role === "finance_admin") return "Finance Admin";
  if (role === "marketing_admin") return "Marketing Admin";
  if (role === "support_admin") return "Support Admin";
  return role;
}

function userReviewTone(user: PlatformUser) {
  if (user.status === "pending") return "Pending identity review";
  if (user.status === "suspended") return "Account hold";
  if ((user.disputedOrders ?? 0) > 0) return "Dispute watch";
  if ((user.supportTickets ?? 0) > 0) return "Support history";
  return "Healthy account posture";
}

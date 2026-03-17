import { ArrowRight, Shield, UserCheck, UserRound, UserX } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminUsersScreen() {
  const { users } = adminQueryServices.getUsersData();

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <UserRound size={14} />
              Entity oversight
            </div>
            <h1 className="oversight-title">User Management</h1>
            <p className="oversight-subtitle">
              Review account health, status distribution, and platform participation from one snapshot governance surface without implying live account administration.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Management mode</div>
            <div className="oversight-note-value">Review-only account oversight</div>
            <p className="oversight-note-text">
              Counts and user rows come from the admin read model. Detail actions remain preview-only in this console phase.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip">
            <UserCheck size={14} />
            {counts.active} active accounts
          </div>
          <div className="oversight-meta-chip">
            <UserX size={14} />
            {counts.suspended} suspended
          </div>
          <div className="oversight-meta-chip">
            <Shield size={14} />
            {counts.pending} pending review
          </div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><UserRound size={14} />Total users</div>
          <div className="oversight-summary-value">{counts.total}</div>
          <div className="oversight-summary-meta">All fixture-backed platform accounts currently visible to admin oversight.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><UserCheck size={14} />Active</div>
          <div className="oversight-summary-value">{counts.active}</div>
          <div className="oversight-summary-meta">Active accounts remain readable here for health and participation review.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><UserX size={14} />Suspended</div>
          <div className="oversight-summary-value">{counts.suspended}</div>
          <div className="oversight-summary-meta">Suspended records are visible for audit context, not live reinstatement or moderation.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Shield size={14} />Pending</div>
          <div className="oversight-summary-value">{counts.pending}</div>
          <div className="oversight-summary-meta">Pending users stay grouped so governance review starts from the right account segment.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Platform User Directory</h2>
            <p className="oversight-panel-subtitle">
              Account rows are optimized for review confidence: identity, activity, order footprint, and preview-only detail access.
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            Detail access remains preview-only
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Last Active</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{user.name}</span>
                      <span className="oversight-row-meta">{user.type} account</span>
                    </div>
                  </td>
                  <td className="text-muted">{user.email}</td>
                  <td><span className={`type-badge type-badge--${user.type}`}>{user.type}</span></td>
                  <td><span className={`status-badge status-badge--${user.status}`}>{user.status}</span></td>
                  <td className="text-muted">{user.registeredAt}</td>
                  <td className="text-muted">{user.lastActive}</td>
                  <td>{user.ordersCount > 0 ? user.ordersCount : "—"}</td>
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

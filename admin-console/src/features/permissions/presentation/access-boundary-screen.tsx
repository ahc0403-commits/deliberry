import { signOutAdminAction } from "../../auth/server/auth-actions";
import { setAdminRoleAction } from "../server/permission-actions";

const roles = [
  { value: "platform_admin", title: "Platform Admin", icon: "🔑", desc: "Full platform governance: all sections, analytics, reporting, and system management" },
  { value: "operations_admin", title: "Operations Admin", icon: "⚙️", desc: "Users, merchants, stores, orders, disputes, and customer service" },
  { value: "finance_admin", title: "Finance Admin", icon: "💰", desc: "Settlements, finance reporting, and payment oversight" },
  { value: "marketing_admin", title: "Marketing Admin", icon: "📢", desc: "Marketing campaigns, announcements, catalog, and B2B content" },
  { value: "support_admin", title: "Support Admin", icon: "🎧", desc: "Customer service operations and dispute resolution" },
];

export function AdminAccessBoundaryScreen() {
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">Access boundary</div>
        <h2 className="auth-form-title auth-entry-title">Select your role for this session</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          Choose the current admin scope before entering the platform. Each option controls which
          oversight sections are available without implying live permission editing from this screen.
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">Runtime-enforced access</span>
          <span className="auth-entry-pill">Role-specific nav</span>
          <span className="auth-entry-pill">Snapshot oversight only</span>
        </div>
      </div>

      <div className="auth-entry-panel">
        <div className="auth-entry-panel-label">Role selection</div>
        <div className="auth-entry-panel-title">Pick the oversight lens you need today</div>
        <p className="auth-entry-panel-copy">
          This screen chooses the route set for the current admin session. It does not create new
          permissions, approve access, or mutate broader role policy.
        </p>
      </div>

      <div className="role-grid">
        {roles.map((role) => (
          <form key={role.value} action={setAdminRoleAction} className="role-card">
            <input type="hidden" name="role" value={role.value} />
            <div className="role-card-icon role-card-icon-emoji">{role.icon}</div>
            <div className="role-card-title">{role.title}</div>
            <div className="role-card-desc">{role.desc}</div>
            <button type="submit" className="role-card-btn">Continue as {role.title}</button>
          </form>
        ))}
      </div>
      <div className="auth-entry-note">
        <form action={signOutAdminAction}>
          <button type="submit" className="auth-entry-link-button">
            Sign out and switch account
          </button>
        </form>
      </div>
    </div>
  );
}

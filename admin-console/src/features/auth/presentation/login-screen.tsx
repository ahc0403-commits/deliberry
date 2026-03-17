import { signInAdminAction } from "../server/auth-actions";

export function AdminLoginScreen() {
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">Admin access</div>
        <h2 className="auth-form-title auth-entry-title">Enter the oversight console</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          Use the current admin login to reach the snapshot-based platform oversight routes. This
          entry point is for governed access only, not live operational control.
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">Role-aware access</span>
          <span className="auth-entry-pill">Fixture-backed oversight</span>
          <span className="auth-entry-pill">Read-only admin mode</span>
        </div>
      </div>

      <div className="auth-entry-panel">
        <div className="auth-entry-panel-label">Current mode</div>
        <div className="auth-entry-panel-title">Sign in before selecting an admin role</div>
        <p className="auth-entry-panel-copy">
          Access control is runtime-real. The platform data you see afterward remains snapshot-based
          and intentionally non-operational beyond the documented admin flows.
        </p>
      </div>

      <form action={signInAdminAction} className="auth-form">
        <div className="auth-input-group">
          <label className="auth-input-label" htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-input"
            placeholder="admin@deliberry.com"
            defaultValue="admin@deliberry.com"
          />
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="auth-input"
            placeholder="Enter your password"
            defaultValue="demo"
          />
        </div>
        <button type="submit" className="auth-btn-primary">
          Sign in to Admin Console
        </button>
      </form>
      <div className="auth-entry-note">
        <span>
          Access restricted to authorized personnel only
        </span>
      </div>
    </div>
  );
}

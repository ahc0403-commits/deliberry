import { signInAdminAction } from "../server/auth-actions";

const LOGIN_ERROR_COPY: Record<string, string> = {
  missing_credentials: "Enter both your admin email and password.",
  invalid_credentials: "The admin email or password is not valid.",
  admin_profile_missing: "The authenticated user is not linked to an admin profile yet.",
  auth_unavailable: "Admin auth is temporarily unavailable. Please retry in a moment.",
};

export function AdminLoginScreen({ error }: { error?: string | null }) {
  const errorCopy = error ? LOGIN_ERROR_COPY[error] ?? null : null;

  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">Admin access</div>
        <h2 className="auth-form-title auth-entry-title">Enter the oversight console</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          Sign in with the hosted admin identity to reach the live platform oversight console.
          Access remains governed by the session role you choose after login.
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">Role-aware access</span>
          <span className="auth-entry-pill">Hosted Supabase identity</span>
          <span className="auth-entry-pill">Live admin runtime</span>
        </div>
      </div>

      <div className="auth-entry-panel">
        <div className="auth-entry-panel-label">Current mode</div>
        <div className="auth-entry-panel-title">Sign in before selecting an admin role</div>
        <p className="auth-entry-panel-copy">
          Your admin credentials are validated against the hosted identity runtime before the
          platform access boundary opens.
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
            required
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
            required
          />
        </div>
        {errorCopy ? (
          <div className="auth-form-error" role="alert">
            {errorCopy}
          </div>
        ) : null}
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

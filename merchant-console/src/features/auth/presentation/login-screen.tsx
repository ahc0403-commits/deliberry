import Link from "next/link";

import { signInMerchantAction } from "../server/auth-actions";

export function MerchantLoginScreen() {
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">Merchant sign-in</div>
        <h2 className="auth-form-title auth-entry-title">Return to your store workspace</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          Sign in to review today&apos;s queue, menu visibility, and store-scoped operating snapshots
          from the current demo-safe console.
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">Store-scoped access</span>
          <span className="auth-entry-pill">Fixture-backed data</span>
          <span className="auth-entry-pill">Manual partner onboarding</span>
        </div>
      </div>

      <form action={signInMerchantAction} className="auth-form">
        <div className="auth-entry-panel">
          <div className="auth-entry-panel-label">Demo merchant access</div>
          <div className="auth-entry-panel-title">Use the seeded store account</div>
          <p className="auth-entry-panel-copy">
            This login opens the current merchant console flow without implying live approvals or
            backend-backed merchant provisioning.
          </p>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            className="auth-input"
            type="email"
            placeholder="merchant@example.com"
            defaultValue="demo@saborcriollo.com"
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            defaultValue="demo1234"
          />
        </div>

        <button type="submit" className="auth-btn-primary">
          Sign in
        </button>
      </form>

      <div className="auth-divider">or</div>

      <div className="auth-footer">
        New to Deliberry?{" "}
        <Link href="https://your-main-site.com/merchant" target="_blank" rel="noreferrer">
          Apply as a merchant
        </Link>
      </div>
    </div>
  );
}

import { completeMerchantOnboardingAction } from "../../auth/server/auth-actions";

export function MerchantOnboardingScreen() {
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">Merchant onboarding</div>
        <h2 className="auth-form-title auth-entry-title">Complete your current setup stage</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          This step finishes the demo-safe onboarding path before store selection and menu review.
          It stays intentionally procedural rather than implying live verification workflows.
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">Step 3 of 3</span>
          <span className="auth-entry-pill">Manual setup path</span>
          <span className="auth-entry-pill">Store scope comes next</span>
        </div>
      </div>

      <div className="onboarding-steps">
        <div className="auth-entry-panel">
          <div className="auth-entry-panel-label">Current stage</div>
          <div className="auth-entry-panel-title">You&apos;re ready to move into store selection</div>
          <p className="auth-entry-panel-copy">
            Account, business, and banking placeholders are already treated as complete in this
            phase. Menu setup and delivery preferences still remain preview-stage tasks.
          </p>
        </div>

        <div className="onboarding-progress">
          <div className="onboarding-progress-step done" />
          <div className="onboarding-progress-step done" />
          <div className="onboarding-progress-step active" />
        </div>

        <ul className="onboarding-checklist">
          <li className="onboarding-checklist-item completed">
            <span className="onboarding-check done">&#10003;</span>
            Account created and verified
          </li>
          <li className="onboarding-checklist-item completed">
            <span className="onboarding-check done">&#10003;</span>
            Business information submitted
          </li>
          <li className="onboarding-checklist-item completed">
            <span className="onboarding-check done">&#10003;</span>
            Banking details confirmed
          </li>
          <li className="onboarding-checklist-item">
            <span className="onboarding-check" />
            Menu setup (complete after store selection)
          </li>
          <li className="onboarding-checklist-item">
            <span className="onboarding-check" />
            Set delivery preferences
          </li>
        </ul>

        <form action={completeMerchantOnboardingAction} className="auth-form">
          <button type="submit" className="auth-btn-primary">
            Continue to store selection
          </button>
        </form>
      </div>
    </div>
  );
}

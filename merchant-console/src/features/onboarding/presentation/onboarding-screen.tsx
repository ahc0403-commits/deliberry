 "use client";

import { completeMerchantOnboardingAction } from "../../auth/server/auth-actions";
import { useMerchantI18n } from "../../../shared/i18n/client";

const ONBOARDING_REASON_COPY: Record<string, string> = {
  onboarding_required:
    "Finish the current onboarding step before entering store-scoped merchant routes.",
};

export function MerchantOnboardingScreen({
  authority = "supabase",
  reason,
}: {
  authority?: "supabase" | "demo-cookie";
  reason?: string | null;
}) {
  const { raw } = useMerchantI18n();
  const reasonCopy = reason ? raw(ONBOARDING_REASON_COPY[reason] ?? reason) : null;
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">{raw("Merchant onboarding")}</div>
        <h2 className="auth-form-title auth-entry-title">{raw("Complete your current setup stage")}</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          {raw("This step finishes the demo-safe onboarding path before store selection and menu review. It stays intentionally procedural rather than implying live verification workflows.")}
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">{raw("Step 3 of 3")}</span>
          <span className="auth-entry-pill">{raw("Manual setup path")}</span>
          <span className="auth-entry-pill">{raw("Store scope comes next")}</span>
        </div>
        {authority === "demo-cookie" ? (
          <p className="auth-form-subtitle auth-entry-copy" style={{ marginTop: 12 }}>
            {raw("Local development is running in demo-cookie mode because merchant Supabase public config is not set for this environment.")}
          </p>
        ) : null}
        {reasonCopy ? (
          <p className="auth-form-subtitle auth-entry-copy" style={{ marginTop: 12 }}>
            {reasonCopy}
          </p>
        ) : null}
      </div>

      <div className="onboarding-steps">
        <div className="auth-entry-panel">
          <div className="auth-entry-panel-label">{raw("Current stage")}</div>
          <div className="auth-entry-panel-title">{raw("You're ready to move into store selection")}</div>
          <p className="auth-entry-panel-copy">
            {raw("This continuation marks the current console handoff as ready. It does not represent a live merchant approval, banking verification, or backend-confirmed business review.")}
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
            {raw("Console access prepared")}
          </li>
          <li className="onboarding-checklist-item completed">
            <span className="onboarding-check done">&#10003;</span>
            {raw("Partner handoff details prepared")}
          </li>
          <li className="onboarding-checklist-item completed">
            <span className="onboarding-check done">&#10003;</span>
            {raw("Current onboarding stage acknowledged")}
          </li>
          <li className="onboarding-checklist-item">
            <span className="onboarding-check" />
            {raw("Menu setup (complete after store selection)")}
          </li>
          <li className="onboarding-checklist-item">
            <span className="onboarding-check" />
            {raw("Set delivery preferences")}
          </li>
        </ul>

        <form action={completeMerchantOnboardingAction} className="auth-form">
          <button type="submit" className="auth-btn-primary">
            {raw("Continue to store selection")}
          </button>
        </form>
      </div>
    </div>
  );
}

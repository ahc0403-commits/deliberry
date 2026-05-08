 "use client";

import Link from "next/link";

import { signInMerchantAction } from "../server/auth-actions";
import { useMerchantI18n } from "../../../shared/i18n/client";

const LOGIN_ERROR_COPY: Record<string, string> = {
  missing_credentials: "Enter both your merchant email and password.",
  invalid_credentials: "The merchant email or password is not valid.",
  auth_unavailable: "Merchant auth is temporarily unavailable. Please retry in a moment.",
  session_required: "Sign in again to reach the merchant console.",
};

const LOGIN_REASON_COPY: Record<string, string> = {
  session_required: "Sign in again to continue into the merchant console.",
};

function resolveMerchantApplyHref() {
  const publicWebsiteUrl = process.env.NEXT_PUBLIC_PUBLIC_WEBSITE_URL?.trim();
  if (!publicWebsiteUrl) {
    return "mailto:partners@deliberry.com";
  }

  try {
    return new URL("/merchant", publicWebsiteUrl).toString();
  } catch {
    return "mailto:partners@deliberry.com";
  }
}

export function MerchantLoginScreen({
  error,
  authUnavailable = false,
  authority = "supabase",
  reason,
}: {
  error?: string | null;
  authUnavailable?: boolean;
  authority?: "supabase" | "demo-cookie";
  reason?: string | null;
}) {
  const { raw } = useMerchantI18n();
  const merchantApplyHref = resolveMerchantApplyHref();
  const opensPartnerRoute = merchantApplyHref.startsWith("http");
  const errorCopy = authUnavailable
    ? raw(LOGIN_ERROR_COPY.auth_unavailable)
    : error
        ? raw(LOGIN_ERROR_COPY[error] ?? error)
        : null;
  const reasonCopy =
    !errorCopy && reason ? raw(LOGIN_REASON_COPY[reason] ?? reason) : null;

  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">{raw("Merchant sign-in")}</div>
        <h2 className="auth-form-title auth-entry-title">{raw("Return to your store workspace")}</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          {raw("Sign in to review today's queue, menu visibility, and store-scoped operating snapshots from the current store console.")}
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">{raw("Store-scoped access")}</span>
          <span className="auth-entry-pill">{raw("Runtime-backed data")}</span>
          <span className="auth-entry-pill">{raw("Admin-provisioned merchants")}</span>
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

      <form action={signInMerchantAction} className="auth-form">
        <div className="auth-entry-panel">
          <div className="auth-entry-panel-label">{raw("Merchant access")}</div>
          <div className="auth-entry-panel-title">{raw("Use your provisioned store account")}</div>
          <p className="auth-entry-panel-copy">
            {raw("Platform admins create merchant credentials first; store owners then sign in here to operate their assigned store.")}
          </p>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label" htmlFor="email">
            {raw("Email address")}
          </label>
          <input
            id="email"
            name="email"
            className="auth-input"
            type="email"
            placeholder={raw("merchant@example.com")}
            disabled={authUnavailable}
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label" htmlFor="password">
            {raw("Password")}
          </label>
          <input
            id="password"
            name="password"
            className="auth-input"
            type="password"
            placeholder={raw("Enter your password")}
            disabled={authUnavailable}
          />
        </div>

        {errorCopy ? (
          <div className="auth-form-error" role="alert">
            {errorCopy}
          </div>
        ) : null}

        <button type="submit" className="auth-btn-primary" disabled={authUnavailable}>
          {raw("Sign in")}
        </button>
      </form>

      <div className="auth-divider">{raw("or")}</div>

      <div className="auth-footer">
        {raw("New to Deliberry?")}{" "}
        <Link
          href={merchantApplyHref}
          target={opensPartnerRoute ? "_blank" : undefined}
          rel={opensPartnerRoute ? "noreferrer" : undefined}
        >
          {opensPartnerRoute ? raw("Open the partner route") : raw("Email the partner team")}
        </Link>
      </div>
    </div>
  );
}

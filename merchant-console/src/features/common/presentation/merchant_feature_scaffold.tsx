"use client";

import Link from "next/link";
import { useMerchantI18n } from "../../../shared/i18n/client";

type FeatureAction = {
  href: string;
  label: string;
};

type MerchantFeatureScaffoldProps = {
  title: string;
  description: string;
  ownership: string;
  placeholderState: string;
  flowFocus?: string;
  sections?: readonly string[];
  guardrails?: readonly string[];
  actions?: readonly FeatureAction[];
};

export function MerchantFeatureScaffold({
  title,
  description,
  ownership,
  placeholderState,
  flowFocus,
  sections = [],
  guardrails = [],
  actions = [],
}: MerchantFeatureScaffoldProps) {
  const { raw } = useMerchantI18n();

  return (
    <article className="feature-scaffold">
      <div className="feature-scaffold-header">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="feature-meta">
          <span className="feature-badge">
            <span className="feature-badge-label">{raw("Owner")}</span>
            {ownership}
          </span>
        </div>
      </div>

      {flowFocus ? (
        <div className="feature-flow-focus">{raw(flowFocus)}</div>
      ) : null}

      <div className="feature-placeholder-state">{raw(placeholderState)}</div>

      {sections.length > 0 ? (
        <div>
          <p className="feature-sections-label">{raw("Structural sections")}</p>
          <div className="feature-sections-grid">
            {sections.map((section) => (
              <div key={section} className="section-card">
                {raw(section)}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {guardrails.length > 0 ? (
        <div>
          <p className="feature-guardrails-label">{raw("Merchant guardrails")}</p>
          <div className="feature-guardrails">
            {guardrails.map((item) => (
              <span key={item} className="guardrail-tag">
                {raw(item)}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div>
          <p className="feature-actions-label">{raw("Next merchant routes")}</p>
          <div className="feature-actions">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="action-link">
                {raw(action.label)}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

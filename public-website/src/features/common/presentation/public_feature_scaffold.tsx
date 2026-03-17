import Link from "next/link";

type FeatureAction = {
  href: string;
  label: string;
};

type PublicFeatureScaffoldProps = {
  title: string;
  description: string;
  ownership: string;
  placeholderState: string;
  flowFocus?: string;
  sections?: readonly string[];
  guardrails?: readonly string[];
  actions?: readonly FeatureAction[];
};

export function PublicFeatureScaffold({
  title,
  description,
  ownership,
  placeholderState,
  flowFocus,
  sections = [],
  guardrails = [],
  actions = [],
}: PublicFeatureScaffoldProps) {
  return (
    <article className="feature-scaffold">
      <div className="feature-scaffold-header">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="feature-meta">
          <span className="feature-badge">
            <span className="feature-badge-label">Owner</span>
            {ownership}
          </span>
        </div>
      </div>

      {flowFocus ? (
        <div className="feature-flow-focus">{flowFocus}</div>
      ) : null}

      <div className="feature-placeholder-state">{placeholderState}</div>

      {sections.length > 0 ? (
        <div className="section-grid">
          {sections.map((section) => (
            <div key={section} className="section-card">
              <span className="section-card-dot" />
              <span className="section-card-title">{section}</span>
            </div>
          ))}
        </div>
      ) : null}

      {guardrails.length > 0 ? (
        <div className="guardrails-section">
          <h3>Guardrails</h3>
          <ul className="guardrails-list">
            {guardrails.map((item) => (
              <li key={item} className="guardrail-tag">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div className="actions-section">
          <h3>Continue</h3>
          <ul className="action-grid">
            {actions.map((action, index) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className={
                    index === 0 ? "action-link" : "action-link action-link-secondary"
                  }
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

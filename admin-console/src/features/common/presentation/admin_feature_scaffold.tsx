import Link from "next/link";

type FeatureAction = {
  href: string;
  label: string;
};

type AdminFeatureScaffoldProps = {
  title: string;
  description: string;
  ownership: string;
  placeholderState: string;
  flowFocus?: string;
  sections?: readonly string[];
  guardrails?: readonly string[];
  actions?: readonly FeatureAction[];
};

export function AdminFeatureScaffold({
  title,
  description,
  ownership,
  placeholderState,
  flowFocus,
  sections = [],
  guardrails = [],
  actions = [],
}: AdminFeatureScaffoldProps) {
  return (
    <div className="scaffold-card">
      <div className="scaffold-card-header">
        <h2 className="scaffold-card-title">{title}</h2>
        <p className="scaffold-card-description">{description}</p>
      </div>
      <div className="scaffold-card-body">
        <div className="scaffold-meta">
          <div className="scaffold-meta-item">
            <span className="scaffold-meta-label">Feature owner</span>
            <span className="scaffold-meta-value">{ownership}</span>
          </div>
          <div className="scaffold-meta-item">
            <span className="scaffold-meta-label">Placeholder state</span>
            <span className="scaffold-placeholder-badge">{placeholderState}</span>
          </div>
        </div>

        {flowFocus ? (
          <div className="scaffold-flow-focus">{flowFocus}</div>
        ) : null}

        {sections.length > 0 ? (
          <div className="scaffold-section">
            <span className="scaffold-section-title">Structural sections</span>
            <ul className="scaffold-list">
              {sections.map((section) => (
                <li key={section} className="scaffold-list-item">{section}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {guardrails.length > 0 ? (
          <div className="scaffold-section">
            <span className="scaffold-section-title">Admin guardrails</span>
            <ul className="scaffold-list">
              {guardrails.map((item) => (
                <li key={item} className="scaffold-guardrail-item">{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {actions.length > 0 ? (
          <div className="scaffold-section">
            <span className="scaffold-section-title">Next admin routes</span>
            <div className="scaffold-actions">
              {actions.map((action) => (
                <Link key={action.href} href={action.href} className="scaffold-action-link">
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

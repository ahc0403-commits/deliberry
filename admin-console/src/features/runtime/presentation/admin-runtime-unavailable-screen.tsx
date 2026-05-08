import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function AdminRuntimeUnavailableScreen({
  routeTitle,
  eyebrow,
  title,
  body,
  hint,
  retryLabel,
  retryHref,
}: {
  routeTitle: string;
  eyebrow: string;
  title: string;
  body: string;
  hint: string;
  retryLabel: string;
  retryHref: string;
}) {
  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <AlertTriangle size={14} />
              {eyebrow}
            </div>
            <h1 className="oversight-title">{routeTitle}</h1>
            <p className="oversight-subtitle">{title}</p>
          </div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{routeTitle}</h2>
            <p className="oversight-panel-subtitle">{body}</p>
          </div>
          <Link href={retryHref} className="oversight-link">
            {retryLabel}
            <RefreshCw size={14} />
          </Link>
        </div>
        <div
          style={{
            padding: "1rem 1.125rem",
            borderRadius: "14px",
            border: "1px solid rgba(245, 158, 11, 0.24)",
            background: "rgba(255, 251, 235, 0.9)",
            color: "var(--color-text-primary)",
            lineHeight: 1.6,
          }}
        >
          {hint}
        </div>
      </section>
    </div>
  );
}

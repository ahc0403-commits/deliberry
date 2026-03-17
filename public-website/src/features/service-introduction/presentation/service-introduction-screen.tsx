import Link from "next/link";
import { ArrowRight, Headphones, Lock, Smartphone, Star, Thermometer, Zap } from "lucide-react";
import type { ReactNode } from "react";

const valueProps: { icon: ReactNode; title: string; desc: string }[] = [
  { icon: <Zap size={24} />, title: "Speed you can count on", desc: "Our routing technology and dedicated courier network means your food arrives in around 28 minutes on average. Not 45. Not \"soon\"." },
  { icon: <Thermometer size={24} />, title: "Fresh, hot, intact", desc: "Insulated packaging, careful handling, and short routes mean your food arrives exactly as the restaurant intended it." },
  { icon: <Smartphone size={24} />, title: "One tap away", desc: "Open the app, find your restaurant, build your cart. Our checkout takes under a minute. No fuss, no friction." },
  { icon: <Lock size={24} />, title: "Checkout-ready payment choice", desc: "Choose how you want to pay at checkout while live payment verification remains limited in the current product." },
  { icon: <Headphones size={24} />, title: "Human support when needed", desc: "If something goes wrong, Deliberry provides support guidance and contact paths without hiding you behind automated loops." },
  { icon: <Star size={24} />, title: "Quality you can trust", desc: "Every restaurant on Deliberry is reviewed and onboarded by our team. We only list partners who meet our quality standards." },
];

const coverage = [
  "Palermo", "Recoleta", "Belgrano", "San Telmo", "Puerto Madero",
  "Microcentro", "Villa Crespo", "Colegiales",
];

export function PublicServiceIntroductionScreen() {
  return (
    <div className="public-surface">
      <section className="hero hero-route">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content hero-content-left">
            <span className="eyebrow">The Deliberry service</span>
            <h1 className="hero-headline hero-route-headline">
              Delivery done
              <br />
              <span>with clearer expectations.</span>
            </h1>
            <p className="hero-sub">
              This route explains the product honestly: customers get order-progress updates, merchants get dedicated operating tools, and the public website stays acquisition-first instead of pretending those flows happen here.
            </p>
            <div className="hero-actions">
              <Link href="/merchant" className="btn btn-primary btn-lg">See the partner route</Link>
              <Link href="/download" className="btn btn-secondary btn-lg">Check app availability</Link>
            </div>
          </div>
          <div className="hero-panel hero-panel-route">
            <div className="hero-panel-eyebrow">Service path</div>
            <h2 className="hero-panel-title">Understand the product before you commit</h2>
            <div className="hero-route-list">
              <Link href="/merchant" className="hero-route-card">
                <ArrowRight size={16} />
                <div>
                  <strong>Merchant onboarding</strong>
                  <span>Manual handoff with partner-team email completion</span>
                </div>
              </Link>
              <Link href="/download" className="hero-route-card">
                <ArrowRight size={16} />
                <div>
                  <strong>Download status</strong>
                  <span>Coming soon, with support fallback instead of live install links</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: "var(--space-10)" }}>
            <span className="eyebrow">What makes us different</span>
            <h2 className="section-headline section-headline--center">Designed around clarity, not just velocity</h2>
          </div>
          <div className="feature-grid">
            {valueProps.map((v) => (
              <div key={v.title} className="feature-card">
                <div className="feature-icon">{v.icon}</div>
                <div className="feature-card-title">{v.title}</div>
                <p className="feature-card-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section public-band-section">
        <div className="container public-split-grid">
          <div>
            <span className="eyebrow">The platform</span>
            <h2 className="section-headline">Three surfaces, one connected experience</h2>
            <p style={{ marginBottom: "var(--space-6)" }}>
              Deliberry connects customers, restaurant partners, and our operations team through purpose-built tools designed for each role.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {[
                { label: "Customer app", desc: "Browse, order, check progress updates, and reorder from restaurants in your area." },
                { label: "Merchant console", desc: "Manage orders, menus, analytics, and settlements from a dedicated dashboard." },
                { label: "Platform governance", desc: "Our team uses internal tools to ensure quality, resolve disputes, and grow the network." },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, minWidth: 8, borderRadius: "50%", background: "var(--color-primary)", marginTop: 8 }} />
                  <div>
                    <strong style={{ fontSize: "var(--text-sm)", color: "var(--color-text)", display: "block", marginBottom: 2 }}>{item.label}</strong>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="public-route-card public-route-card-highlight">
            <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
              <span className="eyebrow">Platform stats</span>
            </div>
            <div className="trust-metric-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="trust-metric"><div className="trust-metric-value">24k+</div><div className="trust-metric-label">Users</div></div>
              <div className="trust-metric"><div className="trust-metric-value">186</div><div className="trust-metric-label">Merchants</div></div>
              <div className="trust-metric"><div className="trust-metric-value">1,200+</div><div className="trust-metric-label">Daily orders</div></div>
              <div className="trust-metric"><div className="trust-metric-value">4.5★</div><div className="trust-metric-label">Avg rating</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-center">
        <div className="container">
          <span className="eyebrow">Delivery coverage</span>
          <h2 className="section-headline section-headline--center">Delivering across Buenos Aires</h2>
          <p className="section-sub section-sub--center">We currently cover 8 barrios and are expanding to new zones every month.</p>
          <div className="chip-row">
            {coverage.map((zone) => (
              <span key={zone} className="chip">{zone}</span>
            ))}
            <span className="chip" style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)", fontWeight: 600 }}>+ more coming</span>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="download-section">
            <h2>Need the next step?</h2>
            <p>Move directly into the partner route or the honest app-availability route from here.</p>
            <div className="store-badges">
              <Link href="/download" className="store-badge">
                <div><span className="store-badge-label">Follow</span><strong>App availability</strong></div>
              </Link>
              <Link href="/download" className="store-badge">
                <div><span className="store-badge-label">See the</span><strong>Coming-soon status</strong></div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

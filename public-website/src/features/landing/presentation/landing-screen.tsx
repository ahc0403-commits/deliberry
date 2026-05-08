 "use client";

import Link from "next/link";
import { ArrowRight, Compass, CreditCard, Handshake, MapPin, Sparkles, Star, TrendingUp, UtensilsCrossed, Wallet, Wrench, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { usePublicI18n } from "../../../shared/i18n/client";

const features: { icon: ReactNode; title: string; desc: string }[] = [
  { icon: <Zap size={24} />, title: "30-minute delivery", desc: "From order placed to food at your door. We optimize every route so your meal arrives hot and on time." },
  { icon: <UtensilsCrossed size={24} />, title: "200+ restaurants", desc: "From local Vietnamese favorites to global flavours. Your favourite spots, all in one place." },
  { icon: <MapPin size={24} />, title: "Clear order updates", desc: "Stay informed with in-app order progress updates from confirmation through delivery." },
  { icon: <CreditCard size={24} />, title: "Flexible checkout options", desc: "Choose your preferred payment method during checkout while payment verification remains out of scope in the current product." },
  { icon: <Star size={24} />, title: "Rated 4.5 / 5", desc: "Tens of thousands of happy customers trust Deliberry for their daily meals across Ho Chi Minh City." },
  { icon: <Handshake size={24} />, title: "Merchant partnership", desc: "We grow with our restaurant partners, giving them tools and reach they wouldn't have alone." },
];

const reviews = [
  { text: "Deliberry changed how I eat lunch. The app is incredibly fast and the delivery is always on time. My go-to for everything.", name: "Minh A.", meta: "Customer since 2025", initials: "MA" },
  { text: "I've tried every delivery app out there. Deliberry has the best restaurant selection and the order updates stay easy to follow.", name: "Linh T.", meta: "Ho Chi Minh City", initials: "LT" },
  { text: "Amazing experience from start to finish. The food arrived hot, the driver was polite, and the app is super clean.", name: "An N.", meta: "Customer since 2025", initials: "AN" },
];

export function PublicLandingScreen() {
  const { raw } = usePublicI18n();
  return (
    <div className="public-surface">
      <section className="hero hero-acquisition">
        <div className="hero-inner hero-acquisition-inner">
          <div className="hero-content hero-content-left">
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              {raw("Ho Chi Minh City delivery, merchant growth, and app launch updates")}
            </div>
            <h1 className="hero-headline">
              {raw("Understand Deliberry,")}
              <br />
              <span>{raw("then choose your path.")}</span>
            </h1>
            <p className="hero-sub">
              {raw("Discover how the service works, explore the merchant partner program, and follow app availability without running into fake install or onboarding flows.")}
            </p>
            <div className="hero-actions">
              <Link href="/service" className="btn btn-primary btn-lg">{raw("Explore the service")}</Link>
              <Link href="/merchant" className="btn btn-secondary btn-lg">{raw("For merchants")}</Link>
            </div>
            <div className="hero-social-proof">
              <div className="hero-proof-item">
                <span className="hero-proof-value">24,000+</span>
                <span className="hero-proof-label">{raw("Customer interest")}</span>
              </div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item">
                <span className="hero-proof-value">186</span>
                <span className="hero-proof-label">{raw("Merchant partners")}</span>
              </div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item">
                <span className="hero-proof-value">Manual</span>
                <span className="hero-proof-label">{raw("Merchant handoff today")}</span>
              </div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item">
                <span className="hero-proof-value">Soon</span>
                <span className="hero-proof-label">{raw("App store launch")}</span>
              </div>
            </div>
          </div>
          <div className="hero-panel hero-panel-acquisition">
            <div className="hero-panel-eyebrow">{raw("Start here")}</div>
            <h2 className="hero-panel-title">{raw("One public surface, four clear destinations")}</h2>
            <div className="hero-route-list">
              <Link href="/service" className="hero-route-card">
                <Compass size={18} />
                <div>
                  <strong>{raw("See how the service works")}</strong>
                  <span>{raw("Customer, merchant, and operations model")}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
              <Link href="/merchant" className="hero-route-card">
                <Handshake size={18} />
                <div>
                  <strong>{raw("Explore merchant onboarding")}</strong>
                  <span>{raw("Manual partner handoff and console overview")}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
              <Link href="/download" className="hero-route-card">
                <Sparkles size={18} />
                <div>
                  <strong>{raw("Check app availability")}</strong>
                  <span>{raw("Coming-soon status with support fallback")}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-bar">
          <div className="stats-bar-inner">
          <div className="stat-item"><div className="stat-value">1,200<span>+</span></div><div className="stat-label">{raw("Daily demand signals")}</div></div>
          <div className="stat-item"><div className="stat-value">186</div><div className="stat-label">{raw("Active partners")}</div></div>
          <div className="stat-item"><div className="stat-value">8<span> {raw("districts")}</span></div><div className="stat-label">{raw("Current coverage")}</div></div>
          <div className="stat-item"><div className="stat-value">{raw("Support")}</div><div className="stat-label">{raw("Used for release updates")}</div></div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-center">
            <span className="eyebrow">{raw("Why Deliberry")}</span>
            <h2 className="section-headline section-headline--center">{raw("One acquisition story, told clearly")}</h2>
            <p className="section-sub section-sub--center">{raw("Speed, restaurant selection, merchant tools, and honest app-readiness all belong to the same public journey now.")}</p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-card-title">{raw(f.title)}</div>
                <p className="feature-card-desc">{raw(f.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section public-band-section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: "var(--space-12)" }}>
            <span className="eyebrow">{raw("Choose your next step")}</span>
            <h2 className="section-headline section-headline--center">{raw("Three public routes, three honest outcomes")}</h2>
          </div>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-title">{raw("Understand the service")}</div>
              <p className="step-desc">{raw("Use the service page to see how customers, merchants, and platform operations connect today.")}</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-title">{raw("Explore merchant onboarding")}</div>
              <p className="step-desc">{raw("Restaurant owners can review the manual partner handoff process and prepare their inquiry details.")}</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-title">{raw("Follow app availability")}</div>
              <p className="step-desc">{raw("The download page keeps the coming-soon install status explicit and points to support for release updates.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: "var(--space-10)" }}>
            <span className="eyebrow">{raw("Customer stories")}</span>
            <h2 className="section-headline section-headline--center">{raw("Loved by thousands across Ho Chi Minh City")}</h2>
          </div>
          <div className="review-grid">
            {reviews.map((r) => (
              <div key={r.name} className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">&ldquo;{raw(r.text)}&rdquo;</p>
                <div className="review-author">
                  <div className="review-avatar">{r.initials}</div>
                  <div>
                    <div className="review-author-name">{r.name}</div>
                    <div className="review-author-meta">{raw(r.meta)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Merchant pitch ── */}
      <section className="section-sm">
        <div className="container">
          <div className="merchant-pitch">
            <div className="merchant-pitch-eyebrow">{raw("For restaurant owners")}</div>
            <h2>{raw("Move from interest to partner inquiry")}</h2>
            <p>{raw("Join the current partner network, understand the merchant console value, and use the manual handoff route when you're ready to talk to the team.")}</p>
            <div className="merchant-benefit-row">
              <div className="merchant-benefit">
                <div className="merchant-benefit-icon"><TrendingUp size={20} /></div>
                <div className="merchant-benefit-text">
                  <strong>{raw("New revenue stream")}</strong>
                  <span>{raw("Reach delivery customers 24/7")}</span>
                </div>
              </div>
              <div className="merchant-benefit">
                <div className="merchant-benefit-icon"><Wrench size={20} /></div>
                <div className="merchant-benefit-text">
                  <strong>{raw("Merchant console")}</strong>
                  <span>{raw("Orders, menu, analytics in one place")}</span>
                </div>
              </div>
              <div className="merchant-benefit">
                <div className="merchant-benefit-icon"><Wallet size={20} /></div>
                <div className="merchant-benefit-text">
                  <strong>{raw("Weekly settlements")}</strong>
                  <span>{raw("Clear, transparent payouts every week")}</span>
                </div>
              </div>
            </div>
            <Link href="/merchant" className="btn btn-primary">Explore the partner route</Link>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="download-section">
            <h2>{raw("Want the app when it launches?")}</h2>
            <p>{raw("The app store release is still coming soon. Use the download page for availability truth and the service page to see how Deliberry works today.")}</p>
            <div className="store-badges">
              <Link href="/download" className="store-badge">
                <div>
                  <span className="store-badge-label">{raw("Check the")}</span>
                  <strong>{raw("App Store status")}</strong>
                </div>
              </Link>
              <Link href="/download" className="store-badge">
                <div>
                  <span className="store-badge-label">{raw("Check the")}</span>
                  <strong>{raw("Google Play status")}</strong>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

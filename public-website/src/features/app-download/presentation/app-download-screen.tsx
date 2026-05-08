 "use client";

import Link from "next/link";
import { ArrowRight, CreditCard, Gift, Headphones, MapPin, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import { usePublicI18n } from "../../../shared/i18n/client";

const appFeatures: { icon: ReactNode; title: string; desc: string }[] = [
  { icon: <UtensilsCrossed size={24} />, title: "200+ restaurants", desc: "From Vietnamese favourites to global cuisine, all at your fingertips." },
  { icon: <MapPin size={24} />, title: "Order status updates", desc: "Follow your order through preparation, pickup, and delivery-ready milestones in the app." },
  { icon: <Star size={24} />, title: "Favourites & reorder", desc: "Save your favourite orders and reorder in one tap. Your history is always there." },
  { icon: <CreditCard size={24} />, title: "Checkout-ready payment selection", desc: "Choose your preferred payment method during checkout while payment verification remains outside the current product scope." },
  { icon: <Gift size={24} />, title: "Exclusive deals", desc: "App-only promotions, free delivery days, and partner discounts just for you." },
  { icon: <Headphones size={24} />, title: "Help paths in the app", desc: "Find support guidance, order follow-up, and contact details without leaving your account flow." },
];

function readStoreLink(envValue: string | undefined): string | null {
  const value = envValue?.trim();
  if (!value) return null;
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

export function PublicAppDownloadScreen() {
  const { raw } = usePublicI18n();
  const appStoreUrl = readStoreLink(process.env.NEXT_PUBLIC_CUSTOMER_APP_STORE_URL);
  const playStoreUrl = readStoreLink(process.env.NEXT_PUBLIC_CUSTOMER_PLAY_STORE_URL);
  const hasLiveStoreLink = Boolean(appStoreUrl || playStoreUrl);
  return (
    <div className="public-surface">
      <section className="hero hero-route hero-route-download">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content hero-content-left">
            <span className="eyebrow">Deliberry for customers</span>
            <h1 className="hero-headline hero-route-headline">
              {raw("The app is coming soon.")}
              <br />
              <span>{raw("Know exactly what that means.")}</span>
            </h1>
            <p className="hero-sub">
              {hasLiveStoreLink
                ? raw("Use the live store link that is available below, or follow support for any remaining rollout updates.")
                : raw("There are no live app-store install links yet. This route exists to explain what the mobile experience will cover, point you to support for release updates, and keep the launch state explicit.")}
            </p>
            <div className="hero-actions">
              <Link href="/support" className="btn btn-primary btn-lg">{raw("Get release updates")}</Link>
              <Link href="/service" className="btn btn-secondary btn-lg">{raw("Learn about the service")}</Link>
            </div>
          </div>
          <div className="hero-panel hero-panel-route">
            <div className="hero-panel-eyebrow">{raw("Availability truth")}</div>
            <h2 className="hero-panel-title">
              {hasLiveStoreLink
                ? raw("At least one install path is live now")
                : raw("No install flow yet, but no dead end either")}
            </h2>
            <div className="store-badges public-store-badges-left">
              {appStoreUrl ? (
                <Link href={appStoreUrl} className="store-badge" target="_blank" rel="noreferrer">
                  <div>
                    <span className="store-badge-label">{raw("Download on the")}</span>
                    <strong style={{ fontSize: "var(--text-lg)" }}>{raw("App Store")}</strong>
                    <span className="store-badge-label public-store-note">{raw("Live now")}</span>
                  </div>
                </Link>
              ) : (
                <div
                  className="store-badge store-badge-disabled"
                  aria-disabled="true"
                >
                  <div>
                    <span className="store-badge-label">{raw("Download on the")}</span>
                    <strong style={{ fontSize: "var(--text-lg)" }}>{raw("App Store")}</strong>
                    <span className="store-badge-label public-store-note">{raw("Coming soon")}</span>
                  </div>
                </div>
              )}
              {playStoreUrl ? (
                <Link href={playStoreUrl} className="store-badge" target="_blank" rel="noreferrer">
                  <div>
                    <span className="store-badge-label">{raw("Get it on")}</span>
                    <strong style={{ fontSize: "var(--text-lg)" }}>{raw("Google Play")}</strong>
                    <span className="store-badge-label public-store-note">{raw("Live now")}</span>
                  </div>
                </Link>
              ) : (
                <div
                  className="store-badge store-badge-disabled"
                  aria-disabled="true"
                >
                  <div>
                    <span className="store-badge-label">{raw("Get it on")}</span>
                    <strong style={{ fontSize: "var(--text-lg)" }}>{raw("Google Play")}</strong>
                    <span className="store-badge-label public-store-note">{raw("Coming soon")}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="hero-route-list">
              <Link href="/support" className="hero-route-card">
                <ArrowRight size={16} />
                <div>
                  <strong>{raw("Support for availability updates")}</strong>
                  <span>{raw("Use the current contact path instead of waiting on dead buttons")}</span>
                </div>
              </Link>
              <Link href="/service" className="hero-route-card">
                <ArrowRight size={16} />
                <div>
                  <strong>{raw("Service overview")}</strong>
                  <span>{raw("See the ordering experience and current product boundaries")}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: "var(--space-10)" }}>
            <span className="eyebrow">{raw("Everything in the app")}</span>
            <h2 className="section-headline section-headline--center">{raw("What the mobile experience is being built around")}</h2>
          </div>
          <div className="feature-grid">
            {appFeatures.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-card-title">{raw(f.title)}</div>
                <p className="feature-card-desc">{raw(f.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm public-band-section">
        <div className="container">
          <div className="trust-section">
            <div className="section-center">
              <span className="eyebrow">{raw("By the numbers")}</span>
              <h2 className="section-headline section-headline--center" style={{ fontSize: "var(--text-2xl)" }}>
                {raw("Trusted by thousands of customers every day")}
              </h2>
            </div>
            <div className="trust-metric-grid">
              <div className="trust-metric"><div className="trust-metric-value">24,000+</div><div className="trust-metric-label">{raw("Active customers")}</div></div>
              <div className="trust-metric"><div className="trust-metric-value">~28 min</div><div className="trust-metric-label">{raw("Avg delivery time")}</div></div>
              <div className="trust-metric"><div className="trust-metric-value">200+</div><div className="trust-metric-label">{raw("Restaurant partners")}</div></div>
              <div className="trust-metric"><div className="trust-metric-value">98%</div><div className="trust-metric-label">{raw("On-time rate")}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: "var(--space-10)" }}>
            <span className="eyebrow">{raw("Getting started")}</span>
            <h2 className="section-headline section-headline--center">{raw("What to do before the launch")}</h2>
          </div>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-title">{raw("Watch for the release")}</div>
              <p className="step-desc">{hasLiveStoreLink ? raw("Use the store links that are already live below, and follow support for any remaining rollout updates.") : raw("App Store and Google Play launches are still being prepared. Use this page or support to follow availability updates.")}</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-title">{raw("Create your account when live")}</div>
              <p className="step-desc">{raw("Once the app launches, sign up with your phone number and browse restaurants before checkout.")}</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-title">{raw("Place your first order")}</div>
              <p className="step-desc">{raw("After launch, browse nearby restaurants, pick what you want, and checkout. You'll see order progress updates after you place it.")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container section-center">
          <h2 className="section-headline section-headline--center">{raw("Stay close to the launch")}</h2>
          <p className="section-sub section-sub--center">{hasLiveStoreLink ? raw("A live app-store path is now available for at least one platform. Use support for any remaining availability questions.") : raw("The mobile app store launch is still being prepared. You can follow availability updates and learn how Deliberry works today.")}</p>
          <div className="btn-group" style={{ justifyContent: "center" }}>
            <Link href="/support" className="btn btn-primary btn-lg">{raw("Get release updates")}</Link>
            <Link href="/service" className="btn btn-secondary btn-lg">{raw("Learn about the service")}</Link>
          </div>
          <p style={{ marginTop: "var(--space-5)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            {raw("Are you a restaurant owner?")} <Link href="/merchant">{raw("Apply to become a partner →")}</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

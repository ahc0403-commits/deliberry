"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, Headphones, Megaphone, TrendingUp, Wallet, Wrench } from "lucide-react";
import type { ReactNode } from "react";

const benefits: { icon: ReactNode; title: string; desc: string }[] = [
  { icon: <TrendingUp size={24} />, title: "Reach new customers", desc: "Get discovered by 24,000+ active users ordering delivery every day across Buenos Aires." },
  { icon: <Wrench size={24} />, title: "Powerful merchant tools", desc: "Manage orders, update your menu, track performance, and view settlements — all from one dashboard." },
  { icon: <Wallet size={24} />, title: "Weekly transparent payouts", desc: "We settle every Friday. You see exactly what you earned, what the commission was, and what we transferred." },
  { icon: <Megaphone size={24} />, title: "Marketing & visibility", desc: "Featured placements, promotional campaigns, and app-wide visibility. We invest in growing the whole network." },
  { icon: <Headphones size={24} />, title: "Dedicated partner support", desc: "A real team that helps you onboard, troubleshoot, and grow. Not a ticket queue — a partnership." },
  { icon: <BarChart3 size={24} />, title: "Performance analytics", desc: "See your best-selling items, peak hours, average order values, and customer ratings over time." },
];

const steps = [
  { num: "01", title: "Prepare your details", desc: "Fill in the form below to prepare a manual partner handoff with your restaurant, cuisine type, and location." },
  { num: "02", title: "Email the partner team", desc: "Send the prepared details to our partner inbox so the team can review them manually." },
  { num: "03", title: "Onboarding call", desc: "We walk you through the merchant console, help you set up your menu, and answer every question." },
  { num: "04", title: "Go live", desc: "Your restaurant appears on Deliberry. Start receiving orders and growing your business." },
];

export function PublicMerchantOnboardingScreen() {
  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    cuisineType: "",
    businessEmail: "",
    phone: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mailtoHref = useMemo(() => {
    const body = [
      "Restaurant application details",
      "",
      `Restaurant name: ${form.restaurantName || "-"}`,
      `Owner name: ${form.ownerName || "-"}`,
      `Cuisine type: ${form.cuisineType || "-"}`,
      `Business email: ${form.businessEmail || "-"}`,
      `Phone: ${form.phone || "-"}`,
      `Address: ${form.address || "-"}`,
    ].join("\n");

    return `mailto:partners@deliberry.com?subject=${encodeURIComponent("Deliberry partner interest")}&body=${encodeURIComponent(body)}`;
  }, [form]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="public-surface">
      <section className="hero hero-route hero-route-merchant">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content hero-content-left">
            <span className="eyebrow">Restaurant partner program</span>
            <h1 className="hero-headline hero-route-headline">
              Grow your restaurant
              <br />
              <span>with a truthful onboarding path.</span>
            </h1>
            <p className="hero-sub">
              This route is for partner acquisition, not a live SaaS signup. You can understand the merchant value, prepare your details, and complete the inquiry through the manual team handoff that exists today.
            </p>
            <div className="hero-actions">
              <a href="#apply" className="btn btn-primary btn-lg">Start the partner inquiry</a>
              <Link href="/service" className="btn btn-secondary btn-lg">See the service model</Link>
            </div>
            <div className="hero-social-proof">
              <div className="hero-proof-item"><span className="hero-proof-value">186</span><span className="hero-proof-label">Active partners</span></div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item"><span className="hero-proof-value">15%</span><span className="hero-proof-label">Avg uplift claim</span></div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item"><span className="hero-proof-value">Email</span><span className="hero-proof-label">Current handoff path</span></div>
            </div>
          </div>
          <div className="hero-panel hero-panel-route">
            <div className="hero-panel-eyebrow">Partner route</div>
            <h2 className="hero-panel-title">What actually happens next</h2>
            <div className="hero-route-list">
              <a href="#apply" className="hero-route-card">
                <ArrowRight size={16} />
                <div>
                  <strong>Prepare details here</strong>
                  <span>Restaurant info stays on this page until you confirm the manual handoff</span>
                </div>
              </a>
              <a href="mailto:partners@deliberry.com" className="hero-route-card">
                <ArrowRight size={16} />
                <div>
                  <strong>Email the partner team</strong>
                  <span>Visible completion exists, but automatic submission does not</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="benefits">
        <div className="container">
          <div className="section-center" style={{ marginBottom: "var(--space-10)" }}>
            <span className="eyebrow">Partner benefits</span>
            <h2 className="section-headline section-headline--center">Everything you need to succeed on delivery</h2>
          </div>
          <div className="feature-grid">
            {benefits.map((b) => (
              <div key={b.title} className="feature-card">
                <div className="feature-icon">{b.icon}</div>
                <div className="feature-card-title">{b.title}</div>
                <p className="feature-card-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section public-band-section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: "var(--space-10)" }}>
            <span className="eyebrow">Getting started</span>
            <h2 className="section-headline section-headline--center">Manual onboarding in 4 steps</h2>
          </div>
          <div className="process-grid">
            {steps.map((s) => (
              <div key={s.num} className="process-card">
                <div className="process-num">{s.num}</div>
                <div className="process-title">{s.title}</div>
                <p className="process-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="apply">
        <div className="container public-split-grid public-split-grid-start">
          <div>
            <span className="eyebrow">Apply now</span>
            <h2 className="section-headline" style={{ marginBottom: "var(--space-4)" }}>Become a Deliberry partner</h2>
            <p style={{ marginBottom: "var(--space-8)" }}>
              Fill in your details to prepare a manual partner handoff. Live online application submission is not enabled yet.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {[
                { icon: "✅", text: "No exclusivity required — stay on other platforms" },
                { icon: "✅", text: "No setup fee" },
                { icon: "✅", text: "Transparent 15% commission, no hidden charges" },
                { icon: "✅", text: "Full control over your menu and pricing" },
                { icon: "✅", text: "Weekly settlements, every Friday" },
              ].map((item) => (
                <div key={item.text} className="public-check-row">
                  <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "var(--text-sm)" }}>{item.icon}</span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lead-form-wrap public-form-panel">
            <h3>Restaurant application</h3>
            <p>Tell us about your restaurant. We&apos;ll prepare your details for a manual email handoff to the partner team.</p>
            {submitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-surface-muted)",
                  border: "1px solid var(--color-border-light)",
                }}
              >
                <div>
                  <strong style={{ display: "block", marginBottom: "var(--space-2)" }}>Partner interest prepared</strong>
                  <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                    Your details are ready for manual review, but they have not been submitted automatically from this page.
                  </p>
                </div>
                <a href={mailtoHref} className="btn btn-primary" style={{ justifyContent: "center" }}>
                  Email the partner team
                </a>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ justifyContent: "center" }}
                  onClick={() => setSubmitted(false)}
                >
                  Edit details
                </button>
                <p className="form-note" style={{ marginBottom: 0 }}>
                  Prefer not to email right now? Keep these details and contact partners@deliberry.com when you&apos;re ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            <div className="form-field">
              <label className="form-label" htmlFor="biz-name">Restaurant name</label>
              <input
                id="biz-name"
                className="form-input"
                type="text"
                placeholder="e.g. Sabor Criollo Kitchen"
                value={form.restaurantName}
                onChange={(event) => updateField("restaurantName", event.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="form-label" htmlFor="owner-name">Owner name</label>
                <input
                  id="owner-name"
                  className="form-input"
                  type="text"
                  placeholder="Your full name"
                  value={form.ownerName}
                  onChange={(event) => updateField("ownerName", event.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="cuisine">Cuisine type</label>
                <input
                  id="cuisine"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Argentine, Italian"
                  value={form.cuisineType}
                  onChange={(event) => updateField("cuisineType", event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="biz-email">Business email</label>
              <input
                id="biz-email"
                className="form-input"
                type="email"
                placeholder="you@yourrestaurant.com"
                value={form.businessEmail}
                onChange={(event) => updateField("businessEmail", event.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                className="form-input"
                type="tel"
                placeholder="+54 11 xxxx-xxxx"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="address">Restaurant address</label>
              <input
                id="address"
                className="form-input"
                type="text"
                placeholder="Street, neighbourhood, Buenos Aires"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)" }}>
              Prepare manual handoff
            </button>
            <p className="form-note">This page prepares your details for partner-team email review. Automatic online submission is not live yet.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

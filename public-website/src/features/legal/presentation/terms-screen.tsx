export function PublicTermsScreen() {
  return (
    <div className="public-legal-surface">
      <section className="hero hero-route public-legal-hero">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content-left">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Service rules
            </span>
            <h1 className="hero-headline hero-route-headline">
              Terms of service with <span>clear platform responsibilities</span>
            </h1>
            <p className="hero-sub">
              This page explains how Deliberry operates as a platform, what customers agree to
              when placing orders, and where responsibility sits across restaurants, delivery,
              support, and account use.
            </p>
          </div>

          <aside className="hero-panel hero-panel-route public-trust-panel">
            <div className="hero-panel-eyebrow">Terms snapshot</div>
            <h2 className="hero-panel-title">What this route clarifies</h2>
            <div className="public-trust-list">
              <div className="public-trust-list-item">
                <strong>Platform role</strong>
                <span>Deliberry coordinates ordering and delivery. It does not prepare food.</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Payment truth</strong>
                <span>Payment method selection happens in checkout and depends on the current app payment flow.</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Support path</strong>
                <span>Questions about these terms go to legal@deliberry.com.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="public-legal-summary-grid">
            <div className="public-route-card">
              <span className="public-route-card-kicker">Ordering relationship</span>
              <h3>Customers buy from restaurants through Deliberry</h3>
              <p>The platform facilitates ordering and delivery coordination while restaurants control menus, pricing, and food preparation.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">Operational limits</span>
              <h3>Delivery times and cancellations depend on real order context</h3>
              <p>The route states the legal framework without pretending there is always instant cancellation or automated compensation.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">Policy use</span>
              <h3>Reference page, not an operational workflow</h3>
              <p>This route is meant to explain service terms clearly and permanently, not to act as a live support or account-control surface.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="public-legal-layout">
            <aside className="public-legal-sidecard">
              <div className="public-legal-sidecard-label">Quick guide</div>
              <h2>Use this page to understand service boundaries</h2>
              <ul className="public-legal-sidecard-list">
                <li>who the order agreement is with</li>
                <li>how account responsibility works</li>
                <li>how pricing, payment, and cancellations are framed</li>
                <li>what conduct is prohibited on the platform</li>
              </ul>
            </aside>

            <div className="legal-doc public-legal-doc">
              <p className="legal-updated">Last updated: March 1, 2026</p>

              <div className="highlight-box">
                <p>By using Deliberry, you agree to these terms. Please read them carefully. If you do not agree, do not use the service.</p>
              </div>

              <h2>1. About Deliberry</h2>
              <p>Deliberry is a food delivery platform that connects customers with local restaurants in Buenos Aires, Argentina. We act as an intermediary between customers and restaurants — we are not a restaurant and do not prepare food.</p>

              <h2>2. Eligibility</h2>
              <p>You must be at least 18 years old to use Deliberry. By creating an account, you confirm that you meet this requirement and that the information you provide is accurate and complete.</p>

              <h2>3. Your account</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at hello@deliberry.com if you suspect unauthorised access.</p>

              <h2>4. Placing orders</h2>
              <p>When you place an order through Deliberry, you are entering into a purchase agreement with the restaurant, not with Deliberry. Deliberry facilitates the transaction and coordinates delivery. Menu availability and pricing are set by each restaurant and may vary.</p>

              <h2>5. Pricing and payment</h2>
              <p>Prices displayed in the app include the item price plus applicable delivery fees. A platform service fee may apply to certain orders. All prices are shown in Argentine Pesos (ARS). Payment method selection happens during checkout, and live charge timing depends on the current payment flow available in the app.</p>

              <h2>6. Cancellations</h2>
              <p>You may cancel an order within 2 minutes of placing it for a full refund. Once a restaurant has accepted and begun preparing your order, cancellations are subject to our Refund Policy. Deliberry reserves the right to cancel orders in cases of suspected fraud or system errors.</p>

              <h2>7. Delivery</h2>
              <p>Delivery times are estimates and may vary due to traffic, weather, or restaurant preparation time. Deliberry is not liable for delays caused by circumstances outside our reasonable control. It is your responsibility to provide accurate delivery details. Re-delivery fees may apply if an order cannot be delivered due to incorrect information.</p>

              <h2>8. Restaurant content</h2>
              <p>Menu descriptions, photos, and allergen information are provided by restaurants. Deliberry does not independently verify this content. If you have food allergies or dietary requirements, we strongly recommend contacting the restaurant directly before ordering.</p>

              <h2>9. Prohibited use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the platform for any unlawful purpose</li>
                <li>Submit false, misleading, or fraudulent orders or reviews</li>
                <li>Attempt to disrupt or access the platform's systems without authorisation</li>
                <li>Resell or commercially exploit any part of the service</li>
                <li>Harass or abuse restaurant staff, couriers, or support agents</li>
              </ul>

              <h2>10. Intellectual property</h2>
              <p>The Deliberry name, logo, app, and all associated content are owned by Deliberry and protected by intellectual property law. You may not reproduce, modify, or distribute any part of the platform without written permission.</p>

              <h2>11. Limitation of liability</h2>
              <p>To the fullest extent permitted by law, Deliberry&apos;s liability for any claim arising from the use of the service is limited to the amount you paid for the order in question. We are not liable for indirect, incidental, or consequential damages.</p>

              <h2>12. Governing law</h2>
              <p>These terms are governed by the laws of Argentina. Any disputes will be subject to the exclusive jurisdiction of the courts of Buenos Aires.</p>

              <h2>13. Changes to these terms</h2>
              <p>We may update these terms. We will notify you of material changes at least 30 days in advance via email or in-app notification. Continued use after the effective date constitutes acceptance.</p>

              <h2>14. Contact</h2>
              <p>Questions about these terms? Contact us at <strong>legal@deliberry.com</strong>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

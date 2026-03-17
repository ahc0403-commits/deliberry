export function PublicPrivacyScreen() {
  return (
    <div className="public-legal-surface">
      <section className="hero hero-route public-legal-hero">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content-left">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Privacy and data use
            </span>
            <h1 className="hero-headline hero-route-headline">
              Privacy policy with <span>clear rights and handling rules</span>
            </h1>
            <p className="hero-sub">
              This page explains what Deliberry collects, how data is used to operate the service,
              and how customers can contact us about privacy requests.
            </p>
          </div>

          <aside className="hero-panel hero-panel-route public-trust-panel">
            <div className="hero-panel-eyebrow">Policy snapshot</div>
            <h2 className="hero-panel-title">What to expect</h2>
            <div className="public-trust-list">
              <div className="public-trust-list-item">
                <strong>Last updated</strong>
                <span>March 1, 2026</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Primary contact</strong>
                <span>privacy@deliberry.com</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Key point</strong>
                <span>Deliberry does not sell personal data to advertisers or data brokers.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="public-legal-summary-grid">
            <div className="public-route-card">
              <span className="public-route-card-kicker">Data categories</span>
              <h3>Account, order, location, and usage data</h3>
              <p>The policy explains the core information needed to operate orders, delivery updates, and account support.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">Your rights</span>
              <h3>Access, correction, deletion, and consent withdrawal</h3>
              <p>Customers can contact the privacy team directly when they need to review or change personal data handling.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">Operational truth</span>
              <h3>Policy is informational and structured</h3>
              <p>This route is a clear legal reference page, not a dynamic settings dashboard or live consent-management tool.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="public-legal-layout">
            <aside className="public-legal-sidecard">
              <div className="public-legal-sidecard-label">Quick guide</div>
              <h2>Read this page when you need the data-handling baseline</h2>
              <ul className="public-legal-sidecard-list">
                <li>what personal data Deliberry collects</li>
                <li>how order and account data is used</li>
                <li>who receives data to fulfill service operations</li>
                <li>how to make a privacy request</li>
              </ul>
            </aside>

            <div className="legal-doc public-legal-doc">
              <p className="legal-updated">Last updated: March 1, 2026</p>

              <div className="highlight-box">
                <p>This policy explains what personal data Deliberry collects, how we use it, and your rights. We do not sell your data to third parties.</p>
              </div>

              <h2>1. Who we are</h2>
              <p>Deliberry is a food delivery platform connecting customers with local restaurants across Buenos Aires, Argentina. References to "Deliberry", "we", "us", or "our" in this policy refer to the Deliberry platform and its operators.</p>

              <h2>2. Data we collect</h2>
              <h3>Account information</h3>
              <p>When you create an account, we collect your name, email address, phone number, and any profile details you provide.</p>
              <h3>Order and transaction data</h3>
              <p>We collect information about the orders you place, including items ordered, restaurant, delivery address, payment method selection, and transaction amounts. We do not store full card numbers, and live payment processing may depend on the current checkout phase and provider availability.</p>
              <h3>Location data</h3>
              <p>With your permission, we collect your device location to show nearby restaurants and support order progress updates. You can disable location access in your device settings at any time.</p>
              <h3>Usage and device data</h3>
              <p>We collect information about how you interact with the app — pages visited, features used, session duration — and technical identifiers such as device type and operating system version.</p>

              <h2>3. How we use your data</h2>
              <ul>
                <li>To process and deliver your orders</li>
                <li>To provide customer support and resolve disputes</li>
                <li>To improve our platform and services</li>
                <li>To send you transactional notifications (order updates, receipts)</li>
                <li>To send you promotional communications if you have opted in</li>
                <li>To comply with our legal obligations</li>
              </ul>

              <h2>4. Sharing your data</h2>
              <p>We share your data only as necessary to operate the service:</p>
              <ul>
                <li><strong>Restaurants:</strong> Receive your name, delivery address, and order details to prepare and dispatch your order.</li>
                <li><strong>Delivery couriers:</strong> Receive your delivery address and phone number to complete delivery.</li>
                <li><strong>Payment processors:</strong> Process your payment securely. Governed by their own privacy terms.</li>
                <li><strong>Infrastructure providers:</strong> Cloud hosting, analytics, and operational tools that help us run the platform.</li>
              </ul>
              <p>We do not sell, rent, or trade your personal data with advertisers or data brokers.</p>

              <h2>5. Data retention</h2>
              <p>We retain your account data for as long as your account is active. Order records are retained for 5 years for tax and legal compliance. You may request deletion of your account at any time (see Section 7).</p>

              <h2>6. Security</h2>
              <p>We use industry-standard encryption (TLS) for data in transit and encrypted storage for data at rest. Our payment provider is PCI-DSS certified. Access to personal data is restricted to authorised personnel only.</p>

              <h2>7. Your rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Object to certain uses of your data</li>
                <li>Withdraw consent for optional processing (e.g. marketing emails)</li>
              </ul>
              <p>To exercise any of these rights, contact us at <strong>privacy@deliberry.com</strong>.</p>

              <h2>8. Cookies</h2>
              <p>Our website uses essential cookies for session management and analytics cookies to understand traffic patterns. You can manage cookie preferences through your browser settings.</p>

              <h2>9. Changes to this policy</h2>
              <p>We may update this policy from time to time. We will notify you of significant changes via email or in-app notification before they take effect.</p>

              <h2>10. Contact</h2>
              <p>For any privacy-related questions, contact us at <strong>privacy@deliberry.com</strong> or write to: Deliberry, Buenos Aires, Argentina.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

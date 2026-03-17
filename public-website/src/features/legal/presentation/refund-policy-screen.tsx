import Link from "next/link";

export function PublicRefundPolicyScreen() {
  return (
    <div className="public-legal-surface">
      <section className="hero hero-route public-legal-hero">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content-left">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Refund and cancellation guidance
            </span>
            <h1 className="hero-headline hero-route-headline">
              A structured refund policy for <span>manual case review</span>
            </h1>
            <p className="hero-sub">
              This page explains the current refund and cancellation process without implying
              automatic refunds, instant case resolution, or always-available in-app issue tools.
            </p>
          </div>

          <aside className="hero-panel hero-panel-route public-trust-panel">
            <div className="hero-panel-eyebrow">Policy snapshot</div>
            <h2 className="hero-panel-title">Current resolution model</h2>
            <div className="public-trust-list">
              <div className="public-trust-list-item">
                <strong>Review path</strong>
                <span>Cases are reviewed through app guidance plus email follow-up.</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Timing truth</strong>
                <span>Refund timing depends on payment context and support review.</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Primary contact</strong>
                <span>hello@deliberry.com</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="public-legal-summary-grid">
            <div className="public-route-card">
              <span className="public-route-card-kicker">Cancellation truth</span>
              <h3>Outcome depends on the current order stage</h3>
              <p>The public site explains the policy framework clearly, but active-order decisions still depend on live order context and review.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">Refund handling</span>
              <h3>Manual review, then resolution guidance</h3>
              <p>Customers should use the app for the latest order follow-up steps and email support when review is needed.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">What this page is</span>
              <h3>Reference policy, not a live claims center</h3>
              <p>This route clarifies policy and contact paths. It does not submit, track, or auto-resolve refund cases directly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="public-legal-layout">
            <aside className="public-legal-sidecard">
              <div className="public-legal-sidecard-label">Quick guide</div>
              <h2>Use this page to understand the current review path</h2>
              <ul className="public-legal-sidecard-list">
                <li>when cancellations may still be possible</li>
                <li>which situations may qualify for a refund</li>
                <li>how to prepare a support email with the right order details</li>
                <li>what timing depends on payment and review context</li>
              </ul>
            </aside>

            <div className="legal-doc public-legal-doc">
              <p className="legal-updated">Last updated: March 1, 2026</p>

              <div className="highlight-box">
                <p>We want every Deliberry experience to be great. If something went wrong with your order, our team will review the issue and explain the current resolution options clearly.</p>
              </div>

              <h2>1. Order cancellations</h2>
              <h3>Before preparation begins</h3>
              <p>Cancellation handling depends on the current order stage and the restaurant&apos;s status. Review the latest cancellation guidance in the app and contact support if you need help with an active order.</p>
              <h3>After preparation begins</h3>
              <p>Once preparation is underway, cancellation is not guaranteed. If support confirms that a cancellation or refund is appropriate, the final outcome depends on the order context and payment method.</p>
              <h3>Cancellations by Deliberry</h3>
              <p>In rare cases, Deliberry may cancel an order due to restaurant unavailability, payment issues, or system errors. If that happens, support will explain the next steps and any refund handling that applies.</p>

              <h2>2. Refund eligibility</h2>
              <p>You are eligible for a full or partial refund in the following situations:</p>
              <ul>
                <li>Items were missing from your order</li>
                <li>You received the wrong items</li>
                <li>Food arrived in an unacceptable condition (cold, spoiled, or damaged)</li>
                <li>Your order was significantly delayed beyond the estimated time and you no longer wish to receive it</li>
                <li>Your order was never delivered</li>
              </ul>
              <p>Refunds are not issued for minor presentation differences, personal taste preferences, or situations where food is consumed before a complaint is made.</p>

              <h2>3. How to request a refund</h2>
              <p>To request a refund:</p>
              <ul>
                <li>Open the Deliberry app</li>
                <li>Review the latest order follow-up guidance for the affected order</li>
                <li>Email <strong>hello@deliberry.com</strong> with your order number and the issue details</li>
                <li>Add a description and photo if possible to help our team review the case</li>
              </ul>
              <p>Our support team reviews requests during support hours and will reply by email with the next steps.</p>

              <h2>4. Refund processing times</h2>
              <ul>
                <li><strong>Card payments:</strong> timing depends on the payment and review context</li>
                <li><strong>Cash orders:</strong> support will explain the available resolution path for the affected order</li>
                <li><strong>Account credits:</strong> only offered when explicitly confirmed by support</li>
              </ul>

              <h2>5. Partial refunds</h2>
              <p>If only part of your order was affected, support may approve a partial refund or another resolution based on the reviewed issue and payment context.</p>

              <h2>6. Disputes</h2>
              <p>If you disagree with a refund decision, you may escalate by emailing <strong>hello@deliberry.com</strong> with your order number and a description of the issue. Our team will review your case within 48 hours.</p>

              <h2>7. Merchant responsibility</h2>
              <p>Restaurants are responsible for order accuracy and food quality. Deliberry facilitates the refund process on behalf of the restaurant. In cases where a restaurant is found repeatedly at fault, Deliberry may take corrective action including temporary suspension from the platform.</p>

              <h2>8. Contact</h2>
              <p>
                Questions about a refund? Contact us at <strong>hello@deliberry.com</strong>.
                {" "}For policy questions: <Link href="/support">Support centre →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

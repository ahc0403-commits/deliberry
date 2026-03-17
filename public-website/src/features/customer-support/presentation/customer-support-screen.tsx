import Link from "next/link";
import { MessageCircle, Mail, Handshake } from "lucide-react";

const faqs = [
  {
    q: "My order hasn't arrived — what do I do?",
    a: "First, check the order status screen in the app for the latest delivery update. If your order looks delayed, use the support details in the app or email us and our team will review it during support hours.",
  },
  {
    q: "How do I cancel an order?",
    a: "Cancellation handling depends on the current stage of the order. Review the latest cancellation guidance in the app and contact support if you need help with an active order.",
  },
  {
    q: "I received the wrong items or something was missing.",
    a: "We&apos;re sorry about that. Use the order follow-up guidance in the app or email support with your order details and we&apos;ll review the issue with you.",
  },
  {
    q: "How do refunds work?",
    a: "Refund handling depends on the order and payment context. Please review our Refund Policy for the current process and contact support if you need help with a specific case.",
  },
  {
    q: "How do I update my delivery address?",
    a: "You can manage your saved addresses in Profile → Addresses. During checkout, you can also enter a new address before confirming the order.",
  },
  {
    q: "I can't log in to my account.",
    a: "If you can&apos;t complete sign-in, contact support by email and include the phone number linked to your account so we can help you from there.",
  },
  {
    q: "I'm a restaurant owner with a question.",
    a: "Partner support is handled separately. Visit our merchant page or email partners@deliberry.com and a partner success manager will respond within one business day.",
  },
  {
    q: "How do I delete my account?",
    a: "You can request account deletion in Profile → Settings → Delete account. This is permanent and will remove your account access, order history, and saved addresses.",
  },
];

export function PublicCustomerSupportScreen() {
  return (
    <div className="public-trust-surface">
      <section className="hero hero-route public-trust-hero">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content-left">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Support visibility
            </span>
            <h1 className="hero-headline hero-route-headline">
              Clear help paths for <span>orders, accounts, and refunds</span>
            </h1>
            <p className="hero-sub">
              Deliberry support is handled through in-app guidance and email follow-up during support
              hours. This page shows the current help routes clearly, without implying live chat or
              instant case handling.
            </p>
            <div className="hero-actions">
              <a href="mailto:hello@deliberry.com" className="btn btn-primary btn-lg">
                Email support
              </a>
              <Link href="/refund-policy" className="btn btn-secondary btn-lg">
                Refund policy
              </Link>
            </div>
            <div className="hero-social-proof">
              <div className="hero-proof-item">
                <span className="hero-proof-value">Email</span>
                <span className="hero-proof-label">Primary support path</span>
              </div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item">
                <span className="hero-proof-value">Manual</span>
                <span className="hero-proof-label">Case review process</span>
              </div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item">
                <span className="hero-proof-value">Separate</span>
                <span className="hero-proof-label">Partner support channel</span>
              </div>
            </div>
          </div>

          <aside className="hero-panel hero-panel-route public-trust-panel">
            <div className="hero-panel-eyebrow">Support at a glance</div>
            <h2 className="hero-panel-title">What this route covers today</h2>
            <div className="public-trust-list">
              <div className="public-trust-list-item">
                <strong>Order and refund guidance</strong>
                <span>Use the app for the latest order context, then email support when you need review help.</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Account follow-up</strong>
                <span>Login and account issues are reviewed manually from the support inbox during business hours.</span>
              </div>
              <div className="public-trust-list-item">
                <strong>Partner questions</strong>
                <span>Restaurant support uses the separate partner success contact path.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="public-support-highlights">
            <div className="public-route-card">
              <span className="public-route-card-kicker">Support hours</span>
              <h3>Reviewed during business hours</h3>
              <p>Requests are triaged manually. The public site does not offer live chat or instant case resolution.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">Best starting point</span>
              <h3>Check the relevant app screen first</h3>
              <p>Orders, account, and address screens show the most current self-serve guidance before you contact support.</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">Partner support</span>
              <h3>Separate merchant channel</h3>
              <p>Restaurant owners should use the merchant route or the partner success inbox for onboarding and operations questions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="support-grid">
            <div className="public-trust-card">
              <div className="public-trust-card-header">
                <span className="eyebrow">Help topics</span>
                <h2>Frequently asked questions</h2>
                <p>These answers reflect the current support model and point you to the right next step without overstating what is automated.</p>
              </div>
              <div className="faq-list">
                {faqs.map((item) => (
                  <div key={item.q} className="faq-item">
                    <div className="faq-q">{item.q}</div>
                    <p className="faq-a">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="contact-card public-trust-card">
                <div className="public-trust-card-header">
                  <span className="eyebrow">Contact options</span>
                  <h2>Choose the right support path</h2>
                  <p>We keep each contact route explicit so customers know what is informational, what is manual, and what belongs to partners.</p>
                </div>

                <div className="contact-option">
                  <div className="contact-icon"><MessageCircle size={20} /></div>
                  <div>
                    <div className="contact-option-title">In-app help guidance</div>
                    <div className="contact-option-desc">Use the app&apos;s order and account screens to find the latest self-serve steps and contact details.</div>
                  </div>
                </div>
                <div className="contact-option">
                  <div className="contact-icon"><Mail size={20} /></div>
                  <div>
                    <div className="contact-option-title">Email support</div>
                    <div className="contact-option-desc">hello@deliberry.com — best for account, order, and refund questions that need manual review.</div>
                  </div>
                </div>
                <div className="contact-option">
                  <div className="contact-icon"><Handshake size={20} /></div>
                  <div>
                    <div className="contact-option-title">Restaurant partners</div>
                    <div className="contact-option-desc">partners@deliberry.com — dedicated partner success for onboarding and merchant operations.</div>
                  </div>
                </div>

                <div className="public-trust-links">
                  <div className="public-trust-links-label">Useful links</div>
                  <div className="public-trust-links-list">
                    <Link href="/refund-policy">Refund policy →</Link>
                    <Link href="/privacy">Privacy policy →</Link>
                    <Link href="/terms">Terms of service →</Link>
                    <Link href="/merchant">Merchant onboarding →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

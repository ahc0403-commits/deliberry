 "use client";

import Link from "next/link";
import { MessageCircle, Mail, Handshake } from "lucide-react";
import { usePublicI18n } from "../../../shared/i18n/client";

export function PublicCustomerSupportScreen() {
  const { raw } = usePublicI18n();
  const faqs = [
    {
      q: raw("My order hasn't arrived — what do I do?"),
      a: raw(
        "First, check the order status screen in the app for the latest delivery update. If your order looks delayed, use the support details in the app or email us and our team will review it during support hours.",
      ),
    },
    {
      q: raw("How do I cancel an order?"),
      a: raw(
        "Cancellation handling depends on the current stage of the order. Review the latest cancellation guidance in the app and contact support if you need help with an active order.",
      ),
    },
    {
      q: raw("I received the wrong items or something was missing."),
      a: raw(
        "We're sorry about that. Use the order follow-up guidance in the app or email support with your order details and we'll review the issue with you.",
      ),
    },
    {
      q: raw("How do refunds work?"),
      a: raw(
        "Refund handling depends on the order and payment context. Please review our Refund Policy for the current process and contact support if you need help with a specific case.",
      ),
    },
    {
      q: raw("How do I update my delivery address?"),
      a: raw(
        "You can manage your saved addresses in Profile -> Addresses. During checkout, you can also enter a new address before confirming the order.",
      ),
    },
    {
      q: raw("I can't log in to my account."),
      a: raw(
        "If you can't complete sign-in, contact support by email and include the phone number linked to your account so we can help you from there.",
      ),
    },
    {
      q: raw("I'm a restaurant owner with a question."),
      a: raw(
        "Partner support is handled separately. Visit our merchant page or email partners@deliberry.com and a partner success manager will respond within one business day.",
      ),
    },
    {
      q: raw("How do I delete my account?"),
      a: raw(
        "You can request account deletion in Profile -> Settings -> Delete account. This is permanent and will remove your account access, order history, and saved addresses.",
      ),
    },
  ];
  return (
    <div className="public-trust-surface">
      <section className="hero hero-route public-trust-hero">
        <div className="hero-inner hero-route-inner">
          <div className="hero-content-left">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              {raw("Support visibility")}
            </span>
            <h1 className="hero-headline hero-route-headline">
              {raw("Clear help paths for")} <span>{raw("orders, accounts, and refunds")}</span>
            </h1>
            <p className="hero-sub">
              {raw(
                "Deliberry support is handled through in-app guidance and email follow-up during support hours. This page shows the current help routes clearly, without implying live chat or instant case handling.",
              )}
            </p>
            <div className="hero-actions">
              <a href="mailto:hello@deliberry.com" className="btn btn-primary btn-lg">
                {raw("Email support")}
              </a>
              <Link href="/refund-policy" className="btn btn-secondary btn-lg">
                {raw("Refund policy")}
              </Link>
            </div>
            <div className="hero-social-proof">
              <div className="hero-proof-item">
                <span className="hero-proof-value">Email</span>
                <span className="hero-proof-label">{raw("Primary support path")}</span>
              </div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item">
                <span className="hero-proof-value">Manual</span>
                <span className="hero-proof-label">{raw("Case review process")}</span>
              </div>
              <div className="hero-proof-divider" />
              <div className="hero-proof-item">
                <span className="hero-proof-value">Separate</span>
                <span className="hero-proof-label">{raw("Partner support channel")}</span>
              </div>
            </div>
          </div>

          <aside className="hero-panel hero-panel-route public-trust-panel">
            <div className="hero-panel-eyebrow">{raw("Support at a glance")}</div>
            <h2 className="hero-panel-title">{raw("What this route covers today")}</h2>
            <div className="public-trust-list">
              <div className="public-trust-list-item">
                <strong>{raw("Order and refund guidance")}</strong>
                <span>{raw("Use the app for the latest order context, then email support when you need review help.")}</span>
              </div>
              <div className="public-trust-list-item">
                <strong>{raw("Account follow-up")}</strong>
                <span>{raw("Login and account issues are reviewed manually from the support inbox during business hours.")}</span>
              </div>
              <div className="public-trust-list-item">
                <strong>{raw("Partner questions")}</strong>
                <span>{raw("Restaurant support uses the separate partner success contact path.")}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="public-support-highlights">
            <div className="public-route-card">
              <span className="public-route-card-kicker">{raw("Support hours")}</span>
              <h3>{raw("Reviewed during business hours")}</h3>
              <p>{raw("Requests are triaged manually. The public site does not offer live chat or instant case resolution.")}</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">{raw("Best starting point")}</span>
              <h3>{raw("Check the relevant app screen first")}</h3>
              <p>{raw("Orders, account, and address screens show the most current self-serve guidance before you contact support.")}</p>
            </div>
            <div className="public-route-card">
              <span className="public-route-card-kicker">{raw("Partner support")}</span>
              <h3>{raw("Separate merchant channel")}</h3>
              <p>{raw("Restaurant owners should use the merchant route or the partner success inbox for onboarding and operations questions.")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="support-grid">
            <div className="public-trust-card">
              <div className="public-trust-card-header">
                <span className="eyebrow">{raw("Help topics")}</span>
                <h2>{raw("Frequently asked questions")}</h2>
                <p>{raw("These answers reflect the current support model and point you to the right next step without overstating what is automated.")}</p>
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
                  <span className="eyebrow">{raw("Contact options")}</span>
                  <h2>{raw("Choose the right support path")}</h2>
                  <p>{raw("We keep each contact route explicit so customers know what is informational, what is manual, and what belongs to partners.")}</p>
                </div>

                <div className="contact-option">
                  <div className="contact-icon"><MessageCircle size={20} /></div>
                  <div>
                    <div className="contact-option-title">{raw("In-app help guidance")}</div>
                    <div className="contact-option-desc">{raw("Use the app's order and account screens to find the latest self-serve steps and contact details.")}</div>
                  </div>
                </div>
                <div className="contact-option">
                  <div className="contact-icon"><Mail size={20} /></div>
                  <div>
                    <div className="contact-option-title">{raw("Email support")}</div>
                    <div className="contact-option-desc">{raw("hello@deliberry.com - best for account, order, and refund questions that need manual review.")}</div>
                  </div>
                </div>
                <div className="contact-option">
                  <div className="contact-icon"><Handshake size={20} /></div>
                  <div>
                    <div className="contact-option-title">{raw("Restaurant partners")}</div>
                    <div className="contact-option-desc">{raw("partners@deliberry.com - dedicated partner success for onboarding and merchant operations.")}</div>
                  </div>
                </div>

                <div className="public-trust-links">
                  <div className="public-trust-links-label">{raw("Useful links")}</div>
                  <div className="public-trust-links-list">
                    <Link href="/refund-policy">{raw("Refund policy ->")}</Link>
                    <Link href="/privacy">{raw("Privacy policy ->")}</Link>
                    <Link href="/terms">{raw("Terms of service ->")}</Link>
                    <Link href="/merchant">{raw("Merchant onboarding ->")}</Link>
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

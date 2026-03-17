import Link from "next/link";
import { Settings2, Sparkles, Store } from "lucide-react";
import { merchantQueryServices } from "../../../shared/data/merchant-query-services";

type MerchantSettingsScreenProps = {
  storeId: string;
};

export function MerchantSettingsScreen({
  storeId,
}: MerchantSettingsScreenProps) {
  const data = merchantQueryServices.getSettingsData(storeId);
  const disabledToggleProps = {
    disabled: true,
    "aria-disabled": true,
  } as const;

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Configuration preview</span>
          <h1 className="merchant-hero-title">Settings</h1>
          <p className="merchant-hero-subtitle">
            Review the operating preferences and notification defaults attached to the current store without implying live account-setting writes.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Local preview only, no persisted settings backend
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Current route truth</div>
          <div className="merchant-hero-panel-value">Preview-only</div>
          <div className="merchant-hero-panel-text">
            The store scope is real, but preference changes still need manual or future-backed implementation before they can become live.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Operations controls</div>
          <div className="merchant-summary-value">4 preview toggles</div>
          <div className="merchant-summary-meta">Auto-accept, alerts, rush mode, and note handling remain illustrative</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Notification defaults</div>
          <div className="merchant-summary-value">4 preview toggles</div>
          <div className="merchant-summary-meta">Email, reviews, settlements, and stock alerts are visible but not writable here</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Manual actions</div>
          <div className="merchant-summary-value">Partner-team owned</div>
          <div className="merchant-summary-meta">Closures and operational overrides still route through manual support</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Settings preview</div>
            <div className="card-subtitle">Read the current control model for this store before operational write paths exist</div>
          </div>
          <div className="merchant-inline-note">
            <Settings2 size={14} />
            Read-only and demo-safe
          </div>
        </div>

        <div className="merchant-settings-intro">
          <strong>Settings preview</strong>
          <p>
            These controls show the kinds of merchant settings Deliberry supports, but live operational changes are not writable from this console yet.
          </p>
        </div>

      <div className="grid-2 merchant-grid merchant-settings-grid">
        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Operations</div>
              <div className="card-subtitle">Store-behavior defaults for order handling</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Auto-accept orders</div>
                <div className="form-toggle-desc">
                  Automatically accept new orders without manual review
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={false} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Order notifications</div>
                <div className="form-toggle-desc">
                  Play sound when new orders arrive
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={true} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Rush hour mode</div>
                <div className="form-toggle-desc">
                  Extend estimated prep times by 10 minutes during peak hours
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={false} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Allow special instructions</div>
                <div className="form-toggle-desc">
                  Let customers add notes to their orders
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={true} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Notifications</div>
              <div className="card-subtitle">Merchant-facing alerts that would apply once settings writes exist</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Email reports</div>
                <div className="form-toggle-desc">
                  Receive daily summary emails
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={true} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Review alerts</div>
                <div className="form-toggle-desc">
                  Get notified for new customer reviews
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={true} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Settlement notifications</div>
                <div className="form-toggle-desc">
                  Get notified when payouts are processed
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={true} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="form-toggle-row">
              <div>
                <div className="form-toggle-label">Low stock alerts</div>
                <div className="form-toggle-desc">
                  Alert when menu items are frequently unavailable
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={false} {...disabledToggleProps} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="card merchant-card">
        <div className="card-header">
          <div>
            <div className="card-title">Related routes</div>
            <div className="card-subtitle">Use the routes below to review the connected store surfaces</div>
          </div>
        </div>
        <div className="card-body">
          <div className="merchant-link-grid">
            <Link
              href={`/${storeId}/store`}
              className="btn btn-secondary"
              style={{ justifyContent: "center" }}
            >
              Edit Store Profile
            </Link>
            <Link
              href={`/${storeId}/menu`}
              className="btn btn-secondary"
              style={{ justifyContent: "center" }}
            >
              Manage Menu
            </Link>
            <Link
              href={`/${storeId}/promotions`}
              className="btn btn-secondary"
              style={{ justifyContent: "center" }}
            >
              Manage Promotions
            </Link>
            <Link
              href={`/${storeId}/settlement`}
              className="btn btn-secondary"
              style={{ justifyContent: "center" }}
            >
              View Settlements
            </Link>
          </div>
        </div>
      </div>

      <div className="card merchant-card merchant-warning-card">
        <div className="card-header">
          <div>
            <div className="card-title merchant-warning-title">Manual operations only</div>
            <div className="card-subtitle">High-impact store controls remain outside the self-serve console</div>
          </div>
        </div>
        <div className="card-body">
          <div className="merchant-warning-row">
            <div>
              <div className="merchant-warning-item-title">Temporarily close store</div>
              <div className="merchant-warning-item-copy">
                Stop accepting all orders until manually reopened
              </div>
            </div>
            <button className="btn btn-danger btn-sm" disabled aria-disabled="true">
              Manual closure only
            </button>
          </div>
          <p className="merchant-warning-footnote">
            Temporary closures are currently handled through the partner team, not from this settings page.
          </p>
        </div>
      </div>
    </div>
  );
}

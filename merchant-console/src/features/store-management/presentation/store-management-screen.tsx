import { merchantQueryServices } from "../../../shared/data/merchant-query-services";
import { Sparkles, Store } from "lucide-react";

type MerchantStoreManagementScreenProps = {
  storeId: string;
};

export function MerchantStoreManagementScreen({
  storeId,
}: MerchantStoreManagementScreenProps) {
  const data = merchantQueryServices.getStoreManagementData(storeId);
  const store = data.store;
  const readOnlyInputProps = {
    disabled: true,
    "aria-disabled": true,
  } as const;

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Store profile preview</span>
          <h1 className="merchant-hero-title">Store Information</h1>
          <p className="merchant-hero-subtitle">
            Review the current store profile, visibility, and operating hours for the selected store without implying live self-serve edits.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Fixture-backed store data, manual updates only
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Store scope</div>
          <div className="merchant-hero-panel-value">Single demo store</div>
          <div className="merchant-hero-panel-text">
            Profile fields, hours, and service settings are visible here, but changes still need partner-team support before they become live.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Customer rating</div>
          <div className="merchant-summary-value">{store.rating} / 5.0</div>
          <div className="merchant-summary-meta">Based on {store.reviewCount} current review entries</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Delivery radius</div>
          <div className="merchant-summary-value">{store.deliveryRadius}</div>
          <div className="merchant-summary-meta">Current read-only service radius for this store</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Prep estimate</div>
          <div className="merchant-summary-value">{store.avgPrepTime}</div>
          <div className="merchant-summary-meta">Shown as an operational reference, not a live configurable SLA</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Store preview</div>
            <div className="card-subtitle">Profile, availability, and hours for the active store scope</div>
          </div>
          <div className="page-actions merchant-page-actions">
            <button className="btn btn-primary" disabled aria-disabled="true">
              Read-only preview
            </button>
          </div>
        </div>

        <div className="merchant-settings-intro">
          <strong>Manual store updates only</strong>
          <p>
            Store profile edits and hours changes are not writable from this console yet. Review the current setup here and contact the partner team for live changes.
          </p>
        </div>

      <div className="grid-2 merchant-grid merchant-settings-grid">
        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Store Profile</div>
              <div className="card-subtitle">Core read-only identity and contact information</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input
                  className="form-input"
                  type="text"
                  defaultValue={store.name}
                  {...readOnlyInputProps}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cuisine Type</label>
                <input
                  className="form-input"
                  type="text"
                  defaultValue={store.cuisineType}
                  {...readOnlyInputProps}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    type="tel"
                    defaultValue={store.phone}
                    {...readOnlyInputProps}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    defaultValue={store.email}
                    {...readOnlyInputProps}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-input"
                  type="text"
                  defaultValue={store.address}
                  {...readOnlyInputProps}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Store Status</div>
              <div className="card-subtitle">Visibility and service defaults shown as controlled previews</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-section">
              <div className="form-toggle-row">
                <div>
                  <div className="form-toggle-label">Accepting Orders</div>
                  <div className="form-toggle-desc">
                    Toggle to pause or resume incoming orders
                  </div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked={store.acceptingOrders} disabled aria-disabled="true" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="form-toggle-row">
                <div>
                  <div className="form-toggle-label">Visible on App</div>
                  <div className="form-toggle-desc">
                    Show store in customer search results
                  </div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked={true} disabled aria-disabled="true" />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <div className="form-section" style={{ marginTop: "var(--space-6)" }}>
              <div className="form-section-title">Service Settings</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Delivery Radius</label>
                  <input
                    className="form-input"
                    type="text"
                    defaultValue={store.deliveryRadius}
                    {...readOnlyInputProps}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Avg Preparation Time</label>
                  <input
                    className="form-input"
                    type="text"
                    defaultValue={store.avgPrepTime}
                    {...readOnlyInputProps}
                  />
                </div>
              </div>
            </div>

            <div className="merchant-status-highlight">
              <span className="merchant-status-highlight-icon">{"\u2B50"}</span>
              <div>
                <div className="merchant-status-highlight-value">
                  {store.rating} / 5.0
                </div>
                <div className="merchant-status-highlight-copy">
                  Based on {store.reviewCount} reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="card merchant-card">
        <div className="card-header">
          <div>
            <div className="card-title">Operating Hours</div>
            <div className="card-subtitle">Current weekly hours for the store, visible without edit persistence</div>
          </div>
          <button className="btn btn-secondary btn-sm" disabled aria-disabled="true">
            Manual updates only
          </button>
        </div>
        <div className="card-body">
          <table className="hours-table">
            <tbody>
              {store.hours.map((h) => (
                <tr key={h.day}>
                  <td>{h.day}</td>
                  <td>
                    {h.open} &ndash; {h.close}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { selectDemoStoreAction } from "../server/store-selection-actions";

export function MerchantStoreSelectionScreen() {
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">Store selection</div>
        <h2 className="auth-form-title auth-entry-title">Choose the store scope for this session</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          Merchant routes stay store-bound. Select the current demo store to continue into the
          console, or review the placeholder state for multi-store expansion later.
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">Single demo store</span>
          <span className="auth-entry-pill">Route scope preserved</span>
          <span className="auth-entry-pill">Read model aligned</span>
        </div>
      </div>

      <div className="auth-entry-panel">
        <div className="auth-entry-panel-label">Current availability</div>
        <div className="auth-entry-panel-title">One seeded store is ready to manage</div>
        <p className="auth-entry-panel-copy">
          Additional locations are still preview-only. The active route tree and repository stay
          aligned to the selected store for the current session.
        </p>
      </div>

      <div className="store-select-grid">
        <form action={selectDemoStoreAction}>
          <button type="submit" className="store-select-card store-select-card-action">
            <div className="store-select-avatar">SC</div>
            <div className="store-select-info">
              <div className="store-select-name">Sabor Criollo Kitchen</div>
              <div className="store-select-meta">
                Av. Corrientes 1234 &middot; Open now
              </div>
            </div>
            <span className="store-select-arrow">&rarr;</span>
          </button>
        </form>

        <div className="store-select-card store-select-card-preview">
          <div className="store-select-avatar store-select-avatar-muted">+</div>
          <div className="store-select-info">
            <div className="store-select-name store-select-name-muted">
              Add another store
            </div>
            <div className="store-select-meta">
              Register a new location
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { MerchantStoreMembership } from "../../../shared/auth/merchant-auth-adapter";
import { selectMerchantStoreAction } from "../server/store-selection-actions";

type MerchantStoreSelectionScreenProps = {
  memberships: MerchantStoreMembership[];
  membershipCount: number;
};

function buildStoreAvatar(storeId: string) {
  return storeId
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "ST";
}

export function MerchantStoreSelectionScreen({
  memberships,
  membershipCount,
}: MerchantStoreSelectionScreenProps) {
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">Store selection</div>
        <h2 className="auth-form-title auth-entry-title">Choose the store scope for this session</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          Merchant routes stay store-bound. Select one of your available stores to continue into
          the console.
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">
            {membershipCount === 0 ? "No assigned stores" : `${membershipCount} available store${membershipCount === 1 ? "" : "s"}`}
          </span>
          <span className="auth-entry-pill">Route scope preserved</span>
          <span className="auth-entry-pill">Membership-scoped access</span>
        </div>
      </div>

      <div className="auth-entry-panel">
        <div className="auth-entry-panel-label">Current availability</div>
        <div className="auth-entry-panel-title">
          {membershipCount === 0 ? "No store is assigned to this merchant" : "Select a store to continue"}
        </div>
        <p className="auth-entry-panel-copy">
          {membershipCount === 0
            ? "This session is authenticated, but it does not currently have any store memberships. Store-scoped routes stay blocked until a store is assigned."
            : "The active route tree and repository stay aligned to the selected store for the current session."}
        </p>
      </div>

      <div className="store-select-grid">
        {memberships.length === 0 ? (
          <div className="store-select-card store-select-card-preview">
            <div className="store-select-avatar store-select-avatar-muted">!</div>
            <div className="store-select-info">
              <div className="store-select-name store-select-name-muted">
                No store assigned
              </div>
              <div className="store-select-meta">
                Contact the partner team to receive store access for this merchant account.
              </div>
            </div>
          </div>
        ) : (
          memberships.map((membership) => (
            <form key={membership.storeId} action={selectMerchantStoreAction}>
              <input type="hidden" name="storeId" value={membership.storeId} />
              <button type="submit" className="store-select-card store-select-card-action">
                <div className="store-select-avatar">
                  {buildStoreAvatar(membership.storeId)}
                </div>
                <div className="store-select-info">
                  <div className="store-select-name">{membership.storeId}</div>
                  <div className="store-select-meta">
                    {membership.actorType === "merchant_owner" ? "Owner access" : "Staff access"}
                    {membership.isDefault ? " · Current default" : ""}
                  </div>
                </div>
                <span className="store-select-arrow">&rarr;</span>
              </button>
            </form>
          ))
        )}
      </div>
    </div>
  );
}

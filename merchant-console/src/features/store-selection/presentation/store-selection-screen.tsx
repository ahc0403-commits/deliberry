 "use client";

import type { MerchantStoreMembership } from "../../../shared/auth/merchant-auth-adapter";
import { selectMerchantStoreAction } from "../server/store-selection-actions";
import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantStoreSelectionScreenProps = {
  memberships: MerchantStoreMembership[];
  membershipCount: number;
  authority?: "supabase" | "demo-cookie";
  reason?: string | null;
};

const STORE_REASON_COPY: Record<string, string> = {
  no_store_membership:
    "This merchant account does not currently have any store memberships assigned.",
  no_store_selected:
    "Choose a store before continuing into store-scoped merchant routes.",
  store_scope_mismatch:
    "That route belongs to a different store. Re-select the store scope for this session.",
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
  authority = "supabase",
  reason,
}: MerchantStoreSelectionScreenProps) {
  const { raw } = useMerchantI18n();
  const reasonCopy = reason ? raw(STORE_REASON_COPY[reason] ?? reason) : null;
  return (
    <div className="auth-entry-shell">
      <div className="auth-entry-intro">
        <div className="auth-entry-kicker">{raw("Store selection")}</div>
        <h2 className="auth-form-title auth-entry-title">{raw("Choose the store scope for this session")}</h2>
        <p className="auth-form-subtitle auth-entry-copy">
          {raw("Merchant routes stay store-bound. Select one of your available stores to continue into the console.")}
        </p>
        <div className="auth-entry-pill-row">
          <span className="auth-entry-pill">
            {membershipCount === 0
              ? raw("No assigned stores")
              : raw(membershipCount === 1 ? "{count} available store" : "{count} available stores").replace(
                  "{count}",
                  String(membershipCount),
                )}
          </span>
          <span className="auth-entry-pill">{raw("Route scope preserved")}</span>
          <span className="auth-entry-pill">{raw("Membership-scoped access")}</span>
        </div>
        {authority === "demo-cookie" ? (
          <p className="auth-form-subtitle auth-entry-copy" style={{ marginTop: 12 }}>
            {raw("Local development is running in demo-cookie mode because merchant Supabase public config is not set for this environment.")}
          </p>
        ) : null}
        {reasonCopy ? (
          <p className="auth-form-subtitle auth-entry-copy" style={{ marginTop: 12 }}>
            {reasonCopy}
          </p>
        ) : null}
      </div>

      <div className="auth-entry-panel">
        <div className="auth-entry-panel-label">{raw("Current availability")}</div>
        <div className="auth-entry-panel-title">
          {membershipCount === 0 ? raw("No store is assigned to this merchant") : raw("Select a store to continue")}
        </div>
        <p className="auth-entry-panel-copy">
          {membershipCount === 0
            ? raw("This session is authenticated, but it does not currently have any store memberships. Store-scoped routes stay blocked until a store is assigned.")
            : raw("The active route tree and repository stay aligned to the selected store for the current session.")}
        </p>
      </div>

      <div className="store-select-grid">
        {memberships.length === 0 ? (
          <div className="store-select-card store-select-card-preview">
            <div className="store-select-avatar store-select-avatar-muted">!</div>
            <div className="store-select-info">
              <div className="store-select-name store-select-name-muted">
                {raw("No store assigned")}
              </div>
              <div className="store-select-meta">
                {raw("Contact the partner team to receive store access for this merchant account.")}
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
                  <div className="store-select-name">{membership.storeName}</div>
                  <div className="store-select-meta">
                    {membership.actorType === "merchant_owner" ? raw("Owner access") : raw("Staff access")}
                    {membership.isDefault ? ` · ${raw("Current default")}` : ""}
                  </div>
                  <div className="store-select-meta store-select-meta-muted">
                    {membership.storeId}
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

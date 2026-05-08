"use client";

import { useActionState } from "react";
import { KeyRound, Store, UserPlus } from "lucide-react";
import {
  provisionMerchantStoreAction,
  type ProvisionMerchantStoreActionState,
} from "../server/provisioning-actions";

const INITIAL_STATE: ProvisionMerchantStoreActionState = {
  status: "idle",
  message: null,
  credentials: null,
};

export function ProvisionMerchantStoreForm() {
  const [state, formAction, isPending] = useActionState(
    provisionMerchantStoreAction,
    INITIAL_STATE,
  );

  return (
    <section className="oversight-panel">
      <div className="oversight-panel-header">
        <div>
          <h2 className="oversight-panel-title">Provision Merchant Store</h2>
          <p className="oversight-panel-subtitle">
            Create the merchant owner identity, default store, membership, and audit entry from the admin governance surface.
          </p>
        </div>
        <div className="table-inline-note">
          <UserPlus size={13} />
          Admin-created first use
        </div>
      </div>

      <form action={formAction} className="oversight-provision-form">
        <div className="oversight-provision-grid">
          <LabeledInput label="Merchant business name" name="merchantName" placeholder="Pho Saigon Kitchen" required />
          <LabeledInput label="Owner name" name="ownerName" placeholder="Nguyen Minh" required />
          <LabeledInput label="Login email" name="email" type="email" placeholder="owner@example.com" required />
          <LabeledInput label="Phone" name="phone" type="tel" placeholder="+84..." />
          <LabeledInput label="Store name" name="storeName" placeholder="Pho Saigon District 1" required />
          <LabeledInput label="Cuisine type" name="cuisineType" placeholder="Vietnamese" />
          <LabeledInput label="City" name="city" placeholder="Ho Chi Minh City" required />
          <LabeledInput label="Address" name="address" placeholder="Street, ward, district" />
        </div>

        {state.message ? (
          <div className={`oversight-provision-result oversight-provision-result--${state.status}`}>
            <strong>{state.status === "success" ? "Provisioned" : "Provisioning failed"}</strong>
            <p>{state.message}</p>
            {state.credentials ? (
              <div className="oversight-credential-card">
                <div>
                  <span>Login email</span>
                  <strong>{state.credentials.email}</strong>
                </div>
                <div>
                  <span>Temporary password</span>
                  <strong>{state.credentials.temporaryPassword}</strong>
                </div>
                <div>
                  <span>Store ID</span>
                  <strong>{state.credentials.storeId}</strong>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="oversight-actions">
          <button className="btn btn-primary" type="submit" disabled={isPending}>
            <Store size={14} />
            {isPending ? "Provisioning..." : "Create merchant and store"}
          </button>
          <span className="table-inline-note">
            <KeyRound size={13} />
            Temporary password is shown once
          </span>
        </div>
      </form>
    </section>
  );
}

function LabeledInput({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="oversight-provision-field">
      <span>{label}</span>
      <input name={name} type={type} placeholder={placeholder} required={required} />
    </label>
  );
}

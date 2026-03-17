export type MerchantAuthIdentity = {
  merchantId: string;
  merchantName: string;
  actorType: "merchant_owner" | "merchant_staff";
};

export type MerchantStoreMembership = {
  storeId: string;
  actorType: "merchant_owner" | "merchant_staff";
  isDefault: boolean;
};

export type MerchantSessionSnapshot = {
  identity: MerchantAuthIdentity;
  onboardingComplete: boolean;
  memberships: MerchantStoreMembership[];
  selectedStoreId: string | null;
};

export interface MerchantAuthAdapter {
  readSession(): Promise<MerchantSessionSnapshot | null>;
  signInWithPassword(input: { email: string; password: string }): Promise<MerchantSessionSnapshot>;
  signOut(): Promise<void>;
  selectStore(storeId: string): Promise<void>;
}

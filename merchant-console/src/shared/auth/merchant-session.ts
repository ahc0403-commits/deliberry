import { cookies } from "next/headers";

export const MERCHANT_SESSION_COOKIE = "merchant_session";
export const MERCHANT_ONBOARDING_COOKIE = "merchant_onboarding_complete";
export const MERCHANT_STORE_COOKIE = "merchant_selected_store";

// R-020: Every mutation must be attributed to an authenticated actor.
// R-023: Merchant access must be store-scoped.
// IDENTITY.md Section 6: Token claims include actor_type.
export type MerchantSession = {
  merchantId: string;
  merchantName: string;
  actorType: "merchant_owner" | "merchant_staff";
};

export async function readMerchantSession(): Promise<MerchantSession | null> {
  const store = await cookies();
  const value = store.get(MERCHANT_SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<MerchantSession>;
    if (!parsed.merchantId || !parsed.merchantName) return null;
    return {
      merchantId: parsed.merchantId,
      merchantName: parsed.merchantName,
      actorType: parsed.actorType ?? "merchant_owner",
    };
  } catch {
    return null;
  }
}

export async function isMerchantOnboardingComplete(): Promise<boolean> {
  const store = await cookies();
  return store.get(MERCHANT_ONBOARDING_COOKIE)?.value == "true";
}

export async function readSelectedStoreId(): Promise<string | null> {
  const store = await cookies();
  return store.get(MERCHANT_STORE_COOKIE)?.value ?? null;
}

export async function readMerchantAccessState() {
  const session = await readMerchantSession();
  const onboardingComplete = await isMerchantOnboardingComplete();
  const selectedStoreId = await readSelectedStoreId();

  return {
    session,
    onboardingComplete,
    selectedStoreId,
  };
}

export function resolveMerchantAccessPath(input: {
  hasSession: boolean;
  onboardingComplete: boolean;
  selectedStoreId: string | null;
}): string {
  if (!input.hasSession) {
    return "/login";
  }

  if (!input.onboardingComplete) {
    return "/onboarding";
  }

  if (!input.selectedStoreId) {
    return "/select-store";
  }

  return `/${input.selectedStoreId}/dashboard`;
}

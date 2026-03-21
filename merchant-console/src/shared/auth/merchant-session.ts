import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import { readMerchantAuthAuthority } from "../supabase/config";
import type { MerchantStoreMembership } from "./merchant-auth-adapter";
import { supabaseMerchantAuthAdapter } from "./supabase-merchant-auth-adapter";

export const MERCHANT_SESSION_COOKIE = "merchant_session";
export const MERCHANT_ONBOARDING_COOKIE = "merchant_onboarding_complete";
export const MERCHANT_STORE_COOKIE = "merchant_selected_store";
export const DEMO_MERCHANT_ID = "11111111-1111-4111-8111-111111111111";
export const DEMO_MERCHANT_NAME = "Demo Merchant";
export const DEMO_STORE_ID = "demo-store";

// R-020: Every mutation must be attributed to an authenticated actor.
// R-023: Merchant access must be store-scoped.
// IDENTITY.md Section 6: Token claims include actor_type.
export type MerchantSession = {
  merchantId: string;
  merchantName: string;
  actorType: "merchant_owner" | "merchant_staff";
};

export type MerchantAccessState = {
  session: MerchantSession | null;
  onboardingComplete: boolean;
  selectedStoreId: string | null;
  memberships: MerchantStoreMembership[];
  membershipCount: number;
  authority: "supabase" | "demo-cookie" | "none";
};

async function readDemoMerchantSession(): Promise<MerchantSession | null> {
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

async function readCookieFlag(name: string): Promise<boolean> {
  const store = await cookies();
  return store.get(name)?.value == "true";
}

async function readCookieValue(name: string): Promise<string | null> {
  const store = await cookies();
  return store.get(name)?.value ?? null;
}

function mapSnapshotToSession(snapshot: Awaited<ReturnType<typeof supabaseMerchantAuthAdapter.readSession>>): MerchantSession | null {
  if (!snapshot) {
    return null;
  }

  return {
    merchantId: snapshot.identity.merchantId,
    merchantName: snapshot.identity.merchantName,
    actorType: snapshot.identity.actorType,
  };
}

function buildAccessState(input: {
  session: MerchantSession | null;
  onboardingComplete: boolean;
  selectedStoreId: string | null;
  memberships: MerchantStoreMembership[];
  membershipCount: number;
  authority: "supabase" | "demo-cookie" | "none";
}): MerchantAccessState {
  return input;
}

export async function readMerchantSession(): Promise<MerchantSession | null> {
  noStore();

  if (readMerchantAuthAuthority() !== "supabase") {
    return readDemoMerchantSession();
  }

  return mapSnapshotToSession(await supabaseMerchantAuthAdapter.readSession());
}

export async function readMerchantAccessState(): Promise<MerchantAccessState> {
  noStore();

  if (readMerchantAuthAuthority() !== "supabase") {
    const session = await readDemoMerchantSession();
    const onboardingComplete = await readCookieFlag(MERCHANT_ONBOARDING_COOKIE);
    const selectedStoreId = await readCookieValue(MERCHANT_STORE_COOKIE);
    const memberships = session
      ? [{
          storeId: DEMO_STORE_ID,
          actorType: session.actorType,
          isDefault: selectedStoreId === DEMO_STORE_ID,
        }]
      : [];

    return buildAccessState({
      session,
      onboardingComplete,
      selectedStoreId,
      memberships,
      membershipCount: memberships.length,
      authority: session ? ("demo-cookie" as const) : ("none" as const),
    });
  }

  const snapshot = await supabaseMerchantAuthAdapter.readSession();

  return buildAccessState({
    session: mapSnapshotToSession(snapshot),
    onboardingComplete: snapshot?.onboardingComplete ?? false,
    selectedStoreId: snapshot?.selectedStoreId ?? null,
    memberships: snapshot?.memberships ?? [],
    membershipCount: snapshot?.memberships.length ?? 0,
    authority: snapshot ? ("supabase" as const) : ("none" as const),
  });
}

export async function signInMerchantSession(input: {
  email: string;
  password: string;
}): Promise<MerchantAccessState> {
  if (readMerchantAuthAuthority() !== "supabase") {
    const store = await cookies();
    const session = {
      merchantId: DEMO_MERCHANT_ID,
      merchantName: DEMO_MERCHANT_NAME,
      actorType: "merchant_owner" as const,
    };
    store.set(
      MERCHANT_SESSION_COOKIE,
      JSON.stringify(session),
    );
    store.set(MERCHANT_ONBOARDING_COOKIE, "false");
    store.delete(MERCHANT_STORE_COOKIE);
    return buildAccessState({
      session,
      onboardingComplete: false,
      selectedStoreId: null,
      memberships: [{
        storeId: DEMO_STORE_ID,
        actorType: "merchant_owner",
        isDefault: false,
      }],
      membershipCount: 1,
      authority: "demo-cookie",
    });
  }

  const snapshot = await supabaseMerchantAuthAdapter.signInWithPassword(input);
  return buildAccessState({
    session: mapSnapshotToSession(snapshot),
    onboardingComplete: snapshot.onboardingComplete,
    selectedStoreId: snapshot.selectedStoreId,
    memberships: snapshot.memberships,
    membershipCount: snapshot.memberships.length,
    authority: "supabase",
  });
}

export async function completeMerchantOnboardingSession(): Promise<MerchantAccessState> {
  if (readMerchantAuthAuthority() === "supabase") {
    const snapshot = await supabaseMerchantAuthAdapter.completeOnboarding();
    return buildAccessState({
      session: mapSnapshotToSession(snapshot),
      onboardingComplete: snapshot.onboardingComplete,
      selectedStoreId: snapshot.selectedStoreId,
      memberships: snapshot.memberships,
      membershipCount: snapshot.memberships.length,
      authority: "supabase",
    });
  }

  const access = await readMerchantAccessState();
  if (!access.session) {
    throw new Error("Merchant session is required before completing onboarding.");
  }

  const store = await cookies();
  store.set(MERCHANT_ONBOARDING_COOKIE, "true");

  return buildAccessState({
    session: access.session,
    onboardingComplete: true,
    selectedStoreId: access.selectedStoreId,
    memberships: access.memberships,
    membershipCount: access.membershipCount,
    authority: "demo-cookie",
  });
}

export async function selectMerchantStoreSession(storeId: string): Promise<MerchantAccessState> {
  if (readMerchantAuthAuthority() === "supabase") {
    const snapshot = await supabaseMerchantAuthAdapter.selectStore(storeId);
    return buildAccessState({
      session: mapSnapshotToSession(snapshot),
      onboardingComplete: snapshot.onboardingComplete,
      selectedStoreId: snapshot.selectedStoreId,
      memberships: snapshot.memberships,
      membershipCount: snapshot.memberships.length,
      authority: "supabase",
    });
  }

  const access = await readMerchantAccessState();
  if (!access.session) {
    throw new Error("Merchant session is required before selecting a store.");
  }

  const store = await cookies();
  store.set(MERCHANT_STORE_COOKIE, storeId);

  return buildAccessState({
    session: access.session,
    onboardingComplete: access.onboardingComplete,
    selectedStoreId: storeId,
    memberships: access.memberships.map((membership) => ({
      ...membership,
      isDefault: membership.storeId === storeId,
    })),
    membershipCount: access.membershipCount,
    authority: "demo-cookie",
  });
}

export async function signOutMerchantSession() {
  if (readMerchantAuthAuthority() === "supabase") {
    await supabaseMerchantAuthAdapter.signOut();
    return;
  }

  const store = await cookies();
  store.delete(MERCHANT_SESSION_COOKIE);
  store.delete(MERCHANT_ONBOARDING_COOKIE);
  store.delete(MERCHANT_STORE_COOKIE);
}

export function resolveMerchantAccessPath(input: {
  hasSession: boolean;
  onboardingComplete: boolean;
  selectedStoreId: string | null;
  membershipCount?: number;
}): string {
  if (!input.hasSession) {
    return "/login";
  }

  if (!input.onboardingComplete) {
    return "/onboarding";
  }

  if ((input.membershipCount ?? 0) === 0) {
    return "/select-store";
  }

  if (!input.selectedStoreId) {
    return "/select-store";
  }

  return `/${input.selectedStoreId}/dashboard`;
}

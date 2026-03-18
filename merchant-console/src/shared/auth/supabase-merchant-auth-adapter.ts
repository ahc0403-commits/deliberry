import type { User } from "@supabase/supabase-js";

import { createMerchantServerSupabaseClient } from "../supabase/client";
import { isMerchantSupabaseConfigured } from "../supabase/config";
import type {
  MerchantAuthAdapter,
  MerchantSessionSnapshot,
  MerchantStoreMembership,
} from "./merchant-auth-adapter";

type MerchantActorType = "merchant_owner" | "merchant_staff";

function isMerchantActorType(value: unknown): value is MerchantActorType {
  return value === "merchant_owner" || value === "merchant_staff";
}

function readBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readStoreIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function buildMemberships(user: User, actorType: MerchantActorType): MerchantStoreMembership[] {
  const appMetadata = user.app_metadata ?? {};
  const userMetadata = user.user_metadata ?? {};
  const defaultStoreId =
    readString(appMetadata.default_store_id) ??
    readString(userMetadata.default_store_id) ??
    readString(appMetadata.store_id) ??
    readString(userMetadata.store_id);
  const storeIds = new Set<string>([
    ...readStoreIds(appMetadata.store_ids),
    ...readStoreIds(userMetadata.store_ids),
    ...(defaultStoreId ? [defaultStoreId] : []),
  ]);

  return Array.from(storeIds).map((storeId) => ({
    storeId,
    actorType,
    isDefault: storeId === defaultStoreId,
  }));
}

function mapUserToMerchantSnapshot(user: User): MerchantSessionSnapshot | null {
  const appMetadata = user.app_metadata ?? {};
  const userMetadata = user.user_metadata ?? {};
  const actorTypeValue =
    appMetadata.actor_type ??
    userMetadata.actor_type ??
    userMetadata.actorType;

  if (!isMerchantActorType(actorTypeValue)) {
    return null;
  }

  const memberships = buildMemberships(user, actorTypeValue);
  const selectedStoreId = memberships.find((membership) => membership.isDefault)?.storeId ?? null;
  const merchantName =
    readString(appMetadata.merchant_name) ??
    readString(userMetadata.merchant_name) ??
    readString(userMetadata.merchantName) ??
    readString(user.user_metadata?.display_name) ??
    readString(user.email) ??
    "Merchant";

  return {
    identity: {
      merchantId: user.id,
      merchantName,
      actorType: actorTypeValue,
    },
    onboardingComplete:
      readBoolean(appMetadata.onboarding_complete) ??
      readBoolean(userMetadata.onboarding_complete) ??
      false,
    memberships,
    selectedStoreId,
  };
}

export class SupabaseMerchantAuthAdapter implements MerchantAuthAdapter {
  async readSession(): Promise<MerchantSessionSnapshot | null> {
    if (!isMerchantSupabaseConfigured()) {
      return null;
    }

    const supabase = await createMerchantServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return mapUserToMerchantSnapshot(user);
  }

  async signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<MerchantSessionSnapshot> {
    if (!isMerchantSupabaseConfigured()) {
      throw new Error("Merchant Supabase auth is not configured.");
    }

    const supabase = await createMerchantServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword(input);

    if (error || !data.user) {
      throw new Error(error?.message ?? "Merchant sign-in failed.");
    }

    const snapshot = mapUserToMerchantSnapshot(data.user);
    if (!snapshot) {
      throw new Error("Signed-in actor is not a merchant actor.");
    }

    return snapshot;
  }

  async signOut(): Promise<void> {
    if (!isMerchantSupabaseConfigured()) {
      return;
    }

    const supabase = await createMerchantServerSupabaseClient();
    await supabase.auth.signOut();
  }

  async selectStore(storeId: string): Promise<void> {
    const snapshot = await this.readSession();
    if (!snapshot) {
      throw new Error("Merchant session is required before selecting a store.");
    }

    if (snapshot.memberships.length > 0) {
      const isAllowed = snapshot.memberships.some((membership) => membership.storeId === storeId);
      if (!isAllowed) {
        throw new Error(`Store ${storeId} is not available to the current merchant session.`);
      }
    }
  }
}

export const supabaseMerchantAuthAdapter = new SupabaseMerchantAuthAdapter();

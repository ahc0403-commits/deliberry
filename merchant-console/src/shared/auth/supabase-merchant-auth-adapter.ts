import type { User } from "@supabase/supabase-js";

import {
  createMerchantServerSupabaseClient,
  createMerchantServiceSupabaseClient,
} from "../supabase/client";
import { readMerchantAuthAuthority } from "../supabase/config";
import type {
  MerchantAuthAdapter,
  MerchantSessionSnapshot,
  MerchantStoreMembership,
} from "./merchant-auth-adapter";

type MerchantActorType = "merchant_owner" | "merchant_staff";
type MerchantProfileRow = {
  merchant_name: string;
  onboarding_complete: boolean;
};
type ActorProfileRow = {
  actor_type: string;
  display_name: string;
};
type MerchantMembershipRow = {
  store_id: string;
  role: string;
  is_default: boolean;
};

function isMerchantActorType(value: unknown): value is MerchantActorType {
  return value === "merchant_owner" || value === "merchant_staff";
}

function mapMembershipRows(rows: MerchantMembershipRow[]): MerchantStoreMembership[] {
  const sortedRows = [...rows].sort((left, right) => {
    if (left.is_default == right.is_default) {
      return left.store_id.localeCompare(right.store_id);
    }

    return left.is_default ? -1 : 1;
  });
  const defaultStoreId =
    sortedRows.find((row) => row.is_default)?.store_id ??
    sortedRows[0]?.store_id ??
    null;

  return sortedRows
    .filter((row): row is MerchantMembershipRow & { role: MerchantActorType } => isMerchantActorType(row.role))
    .map((row) => ({
      storeId: row.store_id,
      actorType: row.role,
      isDefault: defaultStoreId != null && row.store_id === defaultStoreId,
    }));
}

async function readAuthenticatedMerchantUser(): Promise<User> {
  const supabase = await createMerchantServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Merchant session is required.");
  }

  return user;
}

async function readMerchantSnapshot(user: User): Promise<MerchantSessionSnapshot | null> {
  const service = createMerchantServiceSupabaseClient();
  const { data: actorProfile, error: actorError } = await service
    .from("actor_profiles")
    .select("actor_type, display_name")
    .eq("id", user.id)
    .maybeSingle<ActorProfileRow>();

  if (actorError) {
    throw new Error(actorError.message ?? "Failed to load merchant actor profile.");
  }

  if (!actorProfile) {
    return null;
  }

  if (!isMerchantActorType(actorProfile.actor_type)) {
    return null;
  }

  const fallbackMerchantName = actorProfile.display_name || user.email || "Merchant";

  const { error: profileUpsertError } = await service
    .from("merchant_profiles")
    .upsert(
      {
        user_id: user.id,
        merchant_name: fallbackMerchantName,
        onboarding_complete: false,
      },
      { onConflict: "user_id", ignoreDuplicates: true },
    );

  if (profileUpsertError) {
    throw new Error(
      profileUpsertError.message ?? "Failed to initialize merchant profile state.",
    );
  }

  const [{ data: merchantProfile, error: merchantError }, { data: memberships, error: membershipsError }] =
    await Promise.all([
      service
        .from("merchant_profiles")
        .select("merchant_name, onboarding_complete")
        .eq("user_id", user.id)
        .maybeSingle<MerchantProfileRow>(),
      service
        .from("merchant_memberships")
        .select("store_id, role, is_default")
        .eq("user_id", user.id)
        .returns<MerchantMembershipRow[]>(),
    ]);

  if (merchantError || membershipsError) {
    throw new Error(
      merchantError?.message ??
      membershipsError?.message ??
      "Failed to load merchant session state.",
    );
  }

  if (!merchantProfile) {
    throw new Error("Merchant profile is missing after initialization.");
  }

  const mappedMemberships = mapMembershipRows(memberships ?? []);
  const selectedStoreId = mappedMemberships.find((membership) => membership.isDefault)?.storeId ?? null;

  return {
    identity: {
      merchantId: user.id,
      merchantName: merchantProfile.merchant_name || actorProfile.display_name || user.email || "Merchant",
      actorType: actorProfile.actor_type,
    },
    onboardingComplete: merchantProfile.onboarding_complete,
    memberships: mappedMemberships,
    selectedStoreId,
  };
}

export class SupabaseMerchantAuthAdapter implements MerchantAuthAdapter {
  async readSession(): Promise<MerchantSessionSnapshot | null> {
    if (readMerchantAuthAuthority() !== "supabase") {
      return null;
    }

    try {
      return await readMerchantSnapshot(await readAuthenticatedMerchantUser());
    } catch {
      return null;
    }
  }

  async signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<MerchantSessionSnapshot> {
    if (readMerchantAuthAuthority() !== "supabase") {
      throw new Error("Merchant Supabase auth is not configured.");
    }

    const supabase = await createMerchantServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword(input);

    if (error || !data.user) {
      throw new Error(error?.message ?? "Merchant sign-in failed.");
    }

    const snapshot = await readMerchantSnapshot(data.user);
    if (!snapshot) {
      throw new Error("Signed-in actor is not a merchant actor.");
    }

    return snapshot;
  }

  async completeOnboarding(): Promise<MerchantSessionSnapshot> {
    const user = await readAuthenticatedMerchantUser();

    const service = createMerchantServiceSupabaseClient();
    const { error: updateError } = await service
      .from("merchant_profiles")
      .update({ onboarding_complete: true })
      .eq("user_id", user.id);

    if (updateError) {
      throw new Error(updateError?.message ?? "Failed to persist merchant onboarding state.");
    }

    const snapshot = await readMerchantSnapshot(user);
    if (!snapshot) {
      throw new Error("Updated actor is not a merchant actor.");
    }

    return snapshot;
  }

  async signOut(): Promise<void> {
    if (readMerchantAuthAuthority() !== "supabase") {
      return;
    }

    const supabase = await createMerchantServerSupabaseClient();
    await supabase.auth.signOut();
  }

  async selectStore(storeId: string): Promise<MerchantSessionSnapshot> {
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

    const user = await readAuthenticatedMerchantUser();

    const service = createMerchantServiceSupabaseClient();
    const { error: updateError } = await service.rpc("set_merchant_default_store", {
        p_store_id: storeId,
      });

    if (updateError) {
      throw new Error(updateError.message ?? "Failed to persist merchant store selection.");
    }

    const updatedSnapshot = await readMerchantSnapshot(user);
    if (!updatedSnapshot) {
      throw new Error("Updated actor is not a merchant actor.");
    }

    return updatedSnapshot;
  }
}

export const supabaseMerchantAuthAdapter = new SupabaseMerchantAuthAdapter();

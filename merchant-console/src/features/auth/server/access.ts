"use server";

import { redirect } from "next/navigation";

import {
  readMerchantAccessState,
  resolveMerchantAccessPath,
} from "../../../shared/auth/merchant-session";

export async function ensureMerchantConsoleAccess() {
  const access = await readMerchantAccessState();

  if (!access.session) {
    redirect(
      resolveMerchantAccessPath({
        hasSession: false,
        onboardingComplete: access.onboardingComplete,
        selectedStoreId: access.selectedStoreId,
        membershipCount: access.membershipCount,
        reason: "session_required",
      }),
    );
  }

  if (!access.onboardingComplete) {
    redirect(
      resolveMerchantAccessPath({
        hasSession: true,
        onboardingComplete: false,
        selectedStoreId: access.selectedStoreId,
        membershipCount: access.membershipCount,
        reason: "onboarding_required",
      }),
    );
  }

  return access;
}

export async function ensureMerchantStoreScope(storeId: string) {
  const access = await ensureMerchantConsoleAccess();

  if (!access.selectedStoreId) {
    redirect(
      resolveMerchantAccessPath({
        hasSession: true,
        onboardingComplete: access.onboardingComplete,
        selectedStoreId: null,
        membershipCount: access.membershipCount,
        reason:
          access.membershipCount === 0
              ? "no_store_membership"
              : "no_store_selected",
      }),
    );
  }

  if (access.selectedStoreId !== storeId) {
    redirect(
      resolveMerchantAccessPath({
        hasSession: true,
        onboardingComplete: access.onboardingComplete,
        selectedStoreId: access.selectedStoreId,
        membershipCount: access.membershipCount,
        reason: "store_scope_mismatch",
      }),
    );
  }

  return access;
}

export async function redirectMerchantIfSessionExists() {
  const access = await readMerchantAccessState();

  if (!access.session) {
    return;
  }

  redirect(
    resolveMerchantAccessPath({
      hasSession: true,
      onboardingComplete: access.onboardingComplete,
      selectedStoreId: access.selectedStoreId,
      membershipCount: access.membershipCount,
    }),
  );
}

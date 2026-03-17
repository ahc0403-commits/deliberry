"use server";

import { redirect } from "next/navigation";

import {
  readMerchantAccessState,
  resolveMerchantAccessPath,
} from "../../../shared/auth/merchant-session";

export async function ensureMerchantConsoleAccess() {
  const access = await readMerchantAccessState();

  if (!access.session) {
    redirect("/login");
  }

  if (!access.onboardingComplete) {
    redirect("/onboarding");
  }

  return access;
}

export async function ensureMerchantStoreScope(storeId: string) {
  const access = await ensureMerchantConsoleAccess();

  if (!access.selectedStoreId) {
    redirect("/select-store");
  }

  if (access.selectedStoreId !== storeId) {
    redirect(`/${access.selectedStoreId}/dashboard`);
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
    }),
  );
}

"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  completeMerchantOnboardingSession,
  resolveMerchantAccessPath,
  signInMerchantSession,
  signOutMerchantSession,
} from "../../../shared/auth/merchant-session";

export async function signInMerchantAction(formData: FormData) {
  const access = await signInMerchantSession({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  revalidatePath("/", "layout");

  redirect(
    resolveMerchantAccessPath({
      hasSession: Boolean(access.session),
      onboardingComplete: access.onboardingComplete,
      selectedStoreId: access.selectedStoreId,
      membershipCount: access.membershipCount,
    }),
  );
}

export async function completeMerchantOnboardingAction() {
  const access = await completeMerchantOnboardingSession();
  revalidatePath("/", "layout");

  redirect(
    resolveMerchantAccessPath({
      hasSession: Boolean(access.session),
      onboardingComplete: access.onboardingComplete,
      selectedStoreId: access.selectedStoreId,
      membershipCount: access.membershipCount,
    }),
  );
}

export async function signOutMerchantAction() {
  await signOutMerchantSession();
  revalidatePath("/", "layout");

  redirect(
    resolveMerchantAccessPath({
      hasSession: false,
      onboardingComplete: false,
      selectedStoreId: null,
      membershipCount: 0,
    }),
  );
}

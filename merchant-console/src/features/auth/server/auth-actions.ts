"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { readMerchantAuthAvailability } from "../../../shared/supabase/config";
import {
  completeMerchantOnboardingSession,
  resolveMerchantAccessPath,
  signInMerchantSession,
  signOutMerchantSession,
} from "../../../shared/auth/merchant-session";

function redirectToLoginError(code: string): never {
  redirect(`/login?error=${code}`);
}

export async function signInMerchantAction(formData: FormData) {
  const availability = readMerchantAuthAvailability();
  if (!availability.available) {
    redirectToLoginError("auth_unavailable");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectToLoginError("missing_credentials");
  }

  let access;
  try {
    access = await signInMerchantSession({
      email,
      password,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message.includes("sign-in failed") ||
      message.includes("Invalid login credentials")
    ) {
      redirectToLoginError("invalid_credentials");
    }

    redirectToLoginError("auth_unavailable");
  }
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
  const availability = readMerchantAuthAvailability();
  if (!availability.available) {
    redirectToLoginError("auth_unavailable");
  }

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

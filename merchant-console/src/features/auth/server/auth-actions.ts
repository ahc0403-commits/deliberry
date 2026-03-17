"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  MERCHANT_ONBOARDING_COOKIE,
  MERCHANT_SESSION_COOKIE,
  MERCHANT_STORE_COOKIE,
} from "../../../shared/auth/merchant-session";

export async function signInMerchantAction() {
  const store = await cookies();
  store.set(
    MERCHANT_SESSION_COOKIE,
    JSON.stringify({
      merchantId: "merchant-demo",
      merchantName: "Demo Merchant",
      actorType: "merchant_owner",
    }),
  );
  store.set(MERCHANT_ONBOARDING_COOKIE, "false");
  store.delete(MERCHANT_STORE_COOKIE);

  redirect("/onboarding");
}

export async function completeMerchantOnboardingAction() {
  const store = await cookies();
  store.set(MERCHANT_ONBOARDING_COOKIE, "true");

  redirect("/select-store");
}

export async function signOutMerchantAction() {
  const store = await cookies();
  store.delete(MERCHANT_SESSION_COOKIE);
  store.delete(MERCHANT_ONBOARDING_COOKIE);
  store.delete(MERCHANT_STORE_COOKIE);

  redirect("/login");
}

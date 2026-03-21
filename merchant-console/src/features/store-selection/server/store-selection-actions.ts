"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  resolveMerchantAccessPath,
  selectMerchantStoreSession,
} from "../../../shared/auth/merchant-session";

export async function selectMerchantStoreAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "").trim();
  if (!storeId) {
    throw new Error("Store selection requires a valid storeId.");
  }

  const access = await selectMerchantStoreSession(storeId);
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

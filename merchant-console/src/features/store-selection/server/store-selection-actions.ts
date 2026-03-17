"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { MERCHANT_STORE_COOKIE } from "../../../shared/auth/merchant-session";

export async function selectDemoStoreAction() {
  const store = await cookies();
  store.set(MERCHANT_STORE_COOKIE, "demo-store");

  redirect("/demo-store/dashboard");
}

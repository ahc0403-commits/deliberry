import "server-only";

import {
  readMerchantAuthAuthority,
  type MerchantAuthAuthority,
} from "../supabase/config";

export type MerchantRuntimeOperation =
  | "dashboard.read"
  | "orders.read"
  | "order.status_update"
  | "settlement.read"
  | "store_shell.read"
  | "store_profile.read"
  | "store_profile.write"
  | "settings.read"
  | "settings.write";

type MerchantFixtureFallbackPolicy =
  | "never"
  | "demo-cookie-only"
  | "on-persisted-read-failure";

type MerchantSupabaseClientMode = "server" | "service";

type MerchantRuntimeCompatibilityRule = {
  fixtureFallbackPolicy: MerchantFixtureFallbackPolicy;
};

const MERCHANT_RUNTIME_COMPATIBILITY_RULES: Record<
  MerchantRuntimeOperation,
  MerchantRuntimeCompatibilityRule
> = {
  "dashboard.read": { fixtureFallbackPolicy: "on-persisted-read-failure" },
  "orders.read": { fixtureFallbackPolicy: "never" },
  "order.status_update": { fixtureFallbackPolicy: "never" },
  "settlement.read": { fixtureFallbackPolicy: "demo-cookie-only" },
  "store_shell.read": { fixtureFallbackPolicy: "demo-cookie-only" },
  "store_profile.read": { fixtureFallbackPolicy: "never" },
  "store_profile.write": { fixtureFallbackPolicy: "never" },
  "settings.read": { fixtureFallbackPolicy: "never" },
  "settings.write": { fixtureFallbackPolicy: "never" },
};

export type MerchantRuntimeCompatibility = {
  authAuthority: MerchantAuthAuthority;
  operation: MerchantRuntimeOperation;
  fixtureFallbackPolicy: MerchantFixtureFallbackPolicy;
  supabaseClientMode: MerchantSupabaseClientMode;
};

export function getMerchantRuntimeCompatibility(
  operation: MerchantRuntimeOperation,
): MerchantRuntimeCompatibility {
  const authAuthority = readMerchantAuthAuthority();
  return {
    authAuthority,
    operation,
    fixtureFallbackPolicy:
      MERCHANT_RUNTIME_COMPATIBILITY_RULES[operation].fixtureFallbackPolicy,
    supabaseClientMode:
      authAuthority === "demo-cookie" ? "service" : "server",
  };
}

export function prefersMerchantFixtureSource(
  compatibility: MerchantRuntimeCompatibility,
): boolean {
  return (
    compatibility.authAuthority === "demo-cookie" &&
    compatibility.fixtureFallbackPolicy === "demo-cookie-only"
  );
}

export function canMerchantFallbackToFixtureAfterFailure(
  compatibility: MerchantRuntimeCompatibility,
): boolean {
  return compatibility.fixtureFallbackPolicy === "on-persisted-read-failure";
}

export function usesMerchantServiceRoleReads(
  compatibility: MerchantRuntimeCompatibility,
): boolean {
  return compatibility.supabaseClientMode === "service";
}

export function resolveMerchantRuntimeSupabaseClientMode(): MerchantSupabaseClientMode {
  return readMerchantAuthAuthority() === "demo-cookie" ? "service" : "server";
}

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function textFromEnv(name: string) {
  return (Deno.env.get(name) ?? "").trim();
}

export function requireEnv(name: string) {
  const value = textFromEnv(name);
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export function assertSandboxEnvironment() {
  const environment = textFromEnv("VNPAY_ENVIRONMENT") || "sandbox";
  if (environment !== "sandbox") {
    throw new Error("VNPAY sandbox flow is disabled outside sandbox.");
  }
}

export function assertSandboxPaymentCreationEnabled() {
  assertSandboxEnvironment();
  if (textFromEnv("VNPAY_SANDBOX_ENABLED") !== "true") {
    throw new Error(
      "Set VNPAY_SANDBOX_ENABLED=true to create sandbox payments.",
    );
  }
}

export function encodeQueryValue(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

export function sortedQuery(params: Record<string, string>) {
  return Object.keys(params)
    .sort()
    .map((key) => `${encodeQueryValue(key)}=${encodeQueryValue(params[key])}`)
    .join("&");
}

export async function hmacSha512Hex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Hex(payload: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(payload),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function vnpayParamsFrom(url: URL) {
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    if (
      key.startsWith("vnp_") &&
      key !== "vnp_SecureHash" &&
      key !== "vnp_SecureHashType"
    ) {
      params[key] = value;
    }
  });
  return params;
}

export function normalizeSandboxReturnUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  if (url.protocol !== "https:") {
    throw new Error("VNPAY_RETURN_URL must use https.");
  }
  if (!url.pathname.includes("vnpay-sandbox-return")) {
    throw new Error(
      "VNPAY_RETURN_URL must target the vnpay-sandbox-return handler.",
    );
  }
  return url.toString();
}

export function normalizeSandboxPaymentUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  if (url.protocol !== "https:") {
    throw new Error("VNPAY_PAYMENT_URL must use https.");
  }
  if (url.hostname !== "sandbox.vnpayment.vn") {
    throw new Error(
      "VNPAY_PAYMENT_URL must use the official sandbox.vnpayment.vn host.",
    );
  }
  return url.toString();
}

export function createSupabaseAdminClient() {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

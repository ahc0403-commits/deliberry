import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_CALLBACK_URI = "deliberry-customer-auth://zalo-callback/auth";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
};

type ExchangeRequest = {
  authorization_code?: string;
  redirect_uri?: string;
  code_verifier?: string;
  device_context?: Record<string, unknown>;
};

type ZaloTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: number | string;
  error_name?: string;
  error_message?: string;
  message?: string;
};

type ZaloProfileResponse = {
  id?: string;
  name?: string;
  phone?: string;
  picture?: { data?: { url?: string } } | string;
  error?: number | string;
  message?: string;
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function requiredEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function buildAppRedirect(query: URLSearchParams) {
  const url = new URL(APP_CALLBACK_URI);
  query.forEach((value, key) => {
    if (value.trim().length > 0) {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

function decodeWebReturnTo(state: string | null) {
  if (!state) {
    return null;
  }

  try {
    const normalized = state.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(
      Buffer.from(padded, "base64").toString("utf8"),
    ) as { return_to?: string };
    const returnTo = decoded.return_to?.trim();
    if (!returnTo) {
      return null;
    }
    const url = new URL(returnTo);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function htmlRedirect(target: URL, title: string) {
  const escapedTarget = target.toString().replaceAll("&", "&amp;");
  return new NextResponse(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${title}</title><meta http-equiv="refresh" content="0;url=${escapedTarget}" /></head><body><p>Returning to Deliberry…</p><p><a href="${escapedTarget}">Continue</a></p><script>window.location.replace(${JSON.stringify(
      target.toString(),
    )});</script></body></html>`,
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

function syntheticEmailFor(zaloUserId: string) {
  const safeId = zaloUserId.replaceAll(/[^a-zA-Z0-9_-]/g, "");
  return `zalo-${safeId}@customer.zalo.deliberry.local`;
}

async function deterministicPasswordFor(zaloUserId: string, secret: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${secret}:${zaloUserId}`),
  );
  const base64 = Buffer.from(digest)
    .toString("base64url")
    .replace(/=/g, "");
  return `Za_${base64}_lo!`;
}

function resolveDisplayName(profile: ZaloProfileResponse, userId: string) {
  const trimmed = profile.name?.trim();
  if (trimmed && trimmed.length > 0) {
    return trimmed;
  }
  return `Zalo User ${userId.slice(-6)}`;
}

async function exchangeAuthorizationCode(
  payload: ExchangeRequest,
  env: {
    zaloAppId: string;
    zaloAppSecret: string;
  },
) {
  const form = new URLSearchParams({
    app_id: env.zaloAppId,
    app_secret: env.zaloAppSecret,
    code: payload.authorization_code ?? "",
    grant_type: "authorization_code",
    redirect_uri: payload.redirect_uri ?? "",
  });
  if (payload.code_verifier?.trim()) {
    form.set("code_verifier", payload.code_verifier.trim());
  }

  const response = await fetch("https://oauth.zaloapp.com/v4/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: env.zaloAppSecret,
    },
    body: form.toString(),
    cache: "no-store",
  });

  const text = await response.text();
  let json: ZaloTokenResponse;
  try {
    json = JSON.parse(text) as ZaloTokenResponse;
  } catch {
    throw new Error(`zalo_exchange_invalid_json:${text}`);
  }

  if (!response.ok || json.error != null || !json.access_token) {
    throw new Error(
      `zalo_exchange_failed:${json.error_name ?? json.error_message ?? json.message ?? response.status}`,
    );
  }

  return json;
}

async function fetchZaloProfile(accessToken: string) {
  const profileProxyUrl = requiredEnv("VIETNAM_ZALO_PROFILE_PROXY_URL");
  const profileProxySecret = requiredEnv("VIETNAM_ZALO_PROXY_SHARED_SECRET");

  if (!profileProxyUrl || !profileProxySecret) {
    throw new Error(
      "zalo_profile_proxy_unconfigured:VIETNAM_ZALO_PROFILE_PROXY_URL and VIETNAM_ZALO_PROXY_SHARED_SECRET are required",
    );
  }

  const response = await fetch(profileProxyUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${profileProxySecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
    cache: "no-store",
  });
  const text = await response.text();
  let json: ZaloProfileResponse;
  try {
    json = JSON.parse(text) as ZaloProfileResponse;
  } catch {
    throw new Error(`zalo_profile_invalid_json:${text}`);
  }

  if (!response.ok || json.error != null || !json.id) {
    throw new Error(`zalo_profile_failed:${json.message ?? response.status}`);
  }

  return json;
}

async function resolveSupabaseIdentity(
  env: {
    projectUrl: string;
    serviceRoleKey: string;
  },
  profile: ZaloProfileResponse,
) {
  const supabaseAdmin = createClient(env.projectUrl, env.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const zaloUserId = profile.id!;
  const email = syntheticEmailFor(zaloUserId);
  const password = await deterministicPasswordFor(zaloUserId, env.serviceRoleKey);
  const displayName = resolveDisplayName(profile, zaloUserId);
  const phoneNumber = profile.phone?.trim() || null;

  const { data: existingAuthUsers, error: existingAuthUserError } =
    await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });

  if (existingAuthUserError) {
    throw new Error(`supabase_user_lookup_failed:${existingAuthUserError.message}`);
  }

  const existingAuthUser = existingAuthUsers.users.find(
    (candidate) => candidate.email?.trim().toLowerCase() === email.toLowerCase(),
  );

  const userMetadata = {
    display_name: displayName,
    phone_number: phoneNumber,
    provider: "zalo",
    zalo_user_id: zaloUserId,
    needs_onboarding: phoneNumber == null,
  };
  const appMetadata = {
    provider: "zalo",
    providers: ["zalo"],
    actor_type: "customer",
    zalo_user_id: zaloUserId,
  };

  let authUserId = existingAuthUser?.id as string | undefined;
  const isNewCustomer = authUserId == null;

  if (authUserId == null) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userMetadata,
      app_metadata: appMetadata,
    });
    if (error || data.user == null) {
      throw new Error(`supabase_user_create_failed:${error?.message ?? "unknown"}`);
    }
    authUserId = data.user.id;
  } else {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
      email,
      password,
      user_metadata: userMetadata,
      app_metadata: appMetadata,
    });
    if (error) {
      throw new Error(`supabase_user_update_failed:${error.message}`);
    }
  }

  const { error: actorProfileError } = await supabaseAdmin
    .from("actor_profiles")
    .upsert({
      id: authUserId,
      actor_type: "customer",
      display_name: displayName,
      email,
      phone_number: phoneNumber,
    });
  if (actorProfileError) {
    throw new Error(`profile_bootstrap_failed:${actorProfileError.message}`);
  }

  return {
    actorId: authUserId,
    displayName,
    email,
    password,
    isNewCustomer,
    needsOnboarding: phoneNumber == null,
  };
}

async function issueSupabaseSession(
  env: {
    projectUrl: string;
    serviceRoleKey: string;
  },
  credentials: {
    email: string;
    password: string;
  },
) {
  const response = await fetch(
    `${env.projectUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.serviceRoleKey,
        Authorization: `Bearer ${env.serviceRoleKey}`,
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    },
  );

  const text = await response.text();
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`supabase_session_invalid_json:${text}`);
  }

  if (!response.ok) {
    throw new Error(
      `supabase_session_create_failed:${String(json["msg"] ?? response.status)}`,
    );
  }

  return json;
}

async function handleExchange(payload: ExchangeRequest) {
  const projectUrl = requiredEnv("PROJECT_URL");
  const serviceRoleKey = requiredEnv("SERVICE_ROLE_KEY");
  const zaloAppId = requiredEnv("ZALO_APP_ID");
  const zaloAppSecret = requiredEnv("ZALO_APP_SECRET");
  const zaloRedirectUri = requiredEnv("ZALO_REDIRECT_URI");

  if (!projectUrl || !serviceRoleKey) {
    return jsonResponse(503, {
      error_code: "supabase_admin_unconfigured",
      message:
        "PROJECT_URL and SERVICE_ROLE_KEY are required for customer Zalo auth exchange.",
    });
  }

  if (!zaloAppId || !zaloAppSecret || !zaloRedirectUri) {
    return jsonResponse(503, {
      error_code: "provider_not_configured",
      message:
        "ZALO_APP_ID, ZALO_APP_SECRET, and ZALO_REDIRECT_URI are required for customer Zalo auth exchange.",
    });
  }

  const authorizationCode = payload.authorization_code?.trim();
  const redirectUri = payload.redirect_uri?.trim();
  if (!authorizationCode || !redirectUri) {
    return jsonResponse(400, {
      error_code: "invalid_callback_payload",
      message:
        "authorization_code and redirect_uri are required for customer Zalo auth exchange.",
    });
  }

  if (redirectUri !== zaloRedirectUri) {
    return jsonResponse(400, {
      error_code: "redirect_uri_mismatch",
      message: "redirect_uri did not match the configured Zalo redirect URI.",
    });
  }

  try {
    console.log("[zalo-exchange] step=token_exchange");
    const tokenResponse = await exchangeAuthorizationCode(payload, {
      zaloAppId,
      zaloAppSecret,
    });
    console.log("[zalo-exchange] step=token_exchange_ok");

    console.log("[zalo-exchange] step=profile_fetch");
    const profile = await fetchZaloProfile(tokenResponse.access_token!);
    console.log("[zalo-exchange] step=profile_fetch_ok", { zaloId: profile.id });

    console.log("[zalo-exchange] step=resolve_identity");
    const identity = await resolveSupabaseIdentity(
      { projectUrl, serviceRoleKey },
      profile,
    );
    console.log("[zalo-exchange] step=resolve_identity_ok", { actorId: identity.actorId });

    console.log("[zalo-exchange] step=issue_session");
    const session = await issueSupabaseSession(
      { projectUrl, serviceRoleKey },
      {
        email: identity.email,
        password: identity.password,
      },
    );
    console.log("[zalo-exchange] step=issue_session_ok");

    return jsonResponse(200, {
      access_token: session["access_token"],
      refresh_token: session["refresh_token"],
      expires_in: session["expires_in"],
      actor_id: identity.actorId,
      actor_type: "customer",
      is_new_customer: identity.isNewCustomer,
      needs_onboarding: identity.needsOnboarding,
      display_name: identity.displayName,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown exchange failure";
    console.error("[zalo-exchange] step=FAILED", msg, error);
    return jsonResponse(502, {
      error_code: "provider_exchange_failed",
      message: msg,
    });
  }
}

export async function OPTIONS() {
  return new NextResponse("ok", { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  if (!query.has("code") && !query.has("error")) {
    return jsonResponse(400, {
      error_code: "invalid_callback_payload",
      message: "Expected code or error query parameters from Zalo.",
    });
  }

  const redirectQuery = new URLSearchParams();
  if (query.has("code")) {
    redirectQuery.set("code", query.get("code") ?? "");
  }
  if (query.has("state")) {
    redirectQuery.set("state", query.get("state") ?? "");
  }
  if (query.has("error")) {
    redirectQuery.set("error", query.get("error") ?? "");
  }
  if (query.has("error_description")) {
    redirectQuery.set(
      "error_description",
      query.get("error_description") ?? "",
    );
  }
  redirectQuery.set("provider", "zalo");

  const webReturnTo = decodeWebReturnTo(query.get("state"));
  if (webReturnTo != null) {
    redirectQuery.forEach((value, key) => {
      if (value.trim().length > 0) {
        webReturnTo.searchParams.set(key, value);
      }
    });
    return NextResponse.redirect(webReturnTo, {
      headers: {
        ...corsHeaders,
      },
    });
  }

  return htmlRedirect(buildAppRedirect(redirectQuery), "Deliberry Zalo Sign-In");
}

export async function POST(request: NextRequest) {
  let payload: ExchangeRequest;
  try {
    payload = (await request.json()) as ExchangeRequest;
  } catch {
    return jsonResponse(400, {
      error_code: "invalid_callback_payload",
      message: "Request body must be valid JSON.",
    });
  }

  return handleExchange(payload);
}

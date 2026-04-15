import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_CALLBACK_URI = "deliberry-customer-auth://zalo-callback/auth";
const AUTH_COMPLETION_RESULT_VERSION = "customer_auth_completion_v1";
const EXPECTED_ZALO_EXCHANGE_PATH = "/customer-zalo-auth-exchange";
const baseCorsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

type ExchangeRequest = {
  authorization_code?: string;
  redirect_uri?: string;
  code_verifier?: string;
  device_context?: Record<string, unknown>;
};

type CustomerAuthCompletionEnvelope = {
  contract_version: typeof AUTH_COMPLETION_RESULT_VERSION;
  provider: "zalo";
  result: "authenticated";
  session: {
    transport: "refresh_token_exchange";
    access_token?: string;
    refresh_token: string;
    expires_in?: number;
  };
  identity: {
    actor_id: string;
    actor_type: "customer";
    is_new_customer: boolean;
    needs_onboarding: boolean;
    display_name: string;
  };
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

function summarizeError(error: unknown) {
  if (error == null) return "unknown";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function summarizeSupabaseError(
  error:
    | {
        code?: string | null;
        message?: string | null;
        details?: string | null;
        hint?: string | null;
      }
    | null
    | undefined,
) {
  if (!error) {
    return "unknown";
  }
  return JSON.stringify({
    code: error.code ?? null,
    message: error.message ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
  });
}

function isAllowedAppOrigin(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return false;
  }

  const host = url.hostname.toLowerCase();
  const configuredOrigins = (process.env["CUSTOMER_AUTH_ALLOWED_ORIGINS"] ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  if (configuredOrigins.length > 0) {
    return configuredOrigins.includes(url.origin);
  }

  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "deli-berry.com" ||
    host === "go.deli-berry.com" ||
    host.endsWith(".deli-berry.com") ||
    host === "deliberry-customer.vercel.app" ||
    host.endsWith(".deliberry-customer.vercel.app")
  );
}

function resolveAllowedCorsOrigin(origin: string | null) {
  if (!origin) {
    return null;
  }

  try {
    const url = new URL(origin);
    return isAllowedAppOrigin(url) ? url.origin : null;
  } catch {
    return null;
  }
}

function buildCorsHeaders(origin: string | null) {
  const allowedOrigin = resolveAllowedCorsOrigin(origin);
  return allowedOrigin == null
    ? { ...baseCorsHeaders }
    : {
        ...baseCorsHeaders,
        "Access-Control-Allow-Origin": allowedOrigin,
        Vary: "Origin",
      };
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  origin: string | null = null,
) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      ...buildCorsHeaders(origin),
      "Content-Type": "application/json",
    },
  });
}

function requiredEnv(name: string) {
  const rawValue = process.env[name] ?? "";
  const value = normalizeEnvValue(rawValue);
  if (!value) {
    throw new Error(`missing_env:${name}`);
  }
  if (rawValue.trim() != value) {
    logAuthEvent("auth.exchange.env_normalized", "ERROR", {
      env_name: name,
    });
  }
  return value;
}

function normalizeEnvValue(value: string) {
  return value
    .trim()
    .replace(/(?:\\r|\\n)+$/g, "")
    .trim();
}

function validateZaloRedirectAuthority(redirectUri: string) {
  let parsed: URL;
  try {
    parsed = new URL(redirectUri);
  } catch {
    throw new Error("invalid_zalo_redirect_uri:absolute_uri_required");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("invalid_zalo_redirect_uri:http_or_https_required");
  }
  if (parsed.pathname !== EXPECTED_ZALO_EXCHANGE_PATH) {
    throw new Error(
      `invalid_zalo_redirect_uri:expected_path_${EXPECTED_ZALO_EXCHANGE_PATH}`,
    );
  }
  if (parsed.search.length > 0 || parsed.hash.length > 0) {
    throw new Error("invalid_zalo_redirect_uri:no_query_or_fragment_allowed");
  }

  return parsed.toString();
}

function logAuthEvent(
  event: string,
  level: "INFO" | "ERROR",
  fields: Record<string, unknown> = {},
) {
  const safe = { ...fields };
  delete safe["access_token"];
  delete safe["refresh_token"];
  delete safe["service_role_key"];
  delete safe["secret"];
  delete safe["jwt"];
  const entry = {
    event,
    level,
    timestamp: new Date().toISOString(),
    ...safe,
  };
  if (level === "ERROR") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
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
    if (!isAllowedAppOrigin(url)) {
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
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

function syntheticEmailFor(zaloUserId: string) {
  const safeId = zaloUserId.replaceAll(/[^a-zA-Z0-9_-]/g, "");
  return `zalo-${safeId}@customer.zalo.deliberry.local`;
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
  const displayName = resolveDisplayName(profile, zaloUserId);
  const phoneNumber = profile.phone?.trim() || null;
  const needsOnboarding = phoneNumber == null;

  logAuthEvent("auth.user_lookup.start", "INFO", {
    provider: "zalo",
    project_url_host: new URL(env.projectUrl).host,
    service_role_key_present: env.serviceRoleKey.length > 0,
    service_role_key_kind: env.serviceRoleKey.startsWith("eyJ")
      ? "jwt"
      : env.serviceRoleKey.startsWith("sb_")
        ? "sb_secret"
        : "other",
  });

  const { data: existingActorProfile, error: existingActorProfileError } =
    await supabaseAdmin
      .from("actor_profiles")
      .select("id")
      .eq("actor_type", "customer")
      .eq("email", email)
      .maybeSingle();

  if (existingActorProfileError) {
    throw new Error(
      `actor_profile_lookup_failed:${summarizeSupabaseError(existingActorProfileError)}`,
    );
  }

  const userMetadata = {
    display_name: displayName,
    phone_number: phoneNumber,
    provider: "zalo",
    zalo_user_id: zaloUserId,
    needs_onboarding: needsOnboarding,
  };
  const appMetadata = {
    provider: "zalo",
    providers: ["zalo"],
    actor_type: "customer",
    zalo_user_id: zaloUserId,
  };

  let authUserId = existingActorProfile?.id as string | undefined;
  const isNewCustomer = authUserId == null;

  // Random password per-call: invalidates any old deterministic credential
  // and ensures no reusable password is derived from secrets.
  const randomPassword = `Rnd_${crypto.randomUUID()}_${Date.now()}!`;

  if (authUserId == null) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: userMetadata,
      app_metadata: appMetadata,
    });
    if (error || data.user == null) {
      throw new Error(
        `supabase_user_create_failed:${summarizeError(error)}`,
      );
    }
    authUserId = data.user.id;
  } else {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
      email,
      password: randomPassword,
      user_metadata: userMetadata,
      app_metadata: appMetadata,
    });
    if (error) {
      throw new Error(
        `supabase_user_update_failed:${summarizeError(error)}`,
      );
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
    throw new Error(
      `profile_bootstrap_failed:${summarizeSupabaseError(actorProfileError)}`,
    );
  }

  return {
    actorId: authUserId,
    displayName,
    email,
    isNewCustomer,
    needsOnboarding,
  };
}

async function issueSupabaseSession(
  env: {
    projectUrl: string;
    serviceRoleKey: string;
  },
  identity: {
    email: string;
  },
) {
  const supabaseAdmin = createClient(env.projectUrl, env.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Generate a magic link server-side (no email is actually sent).
  const { data: linkData, error: linkError } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: identity.email,
    });

  if (linkError || !linkData?.properties?.email_otp) {
    throw new Error(
      `supabase_session_link_failed:${summarizeError(linkError ?? "missing email_otp")}`,
    );
  }

  // Verify the OTP server-side to obtain real session tokens.
  const response = await fetch(`${env.projectUrl}/auth/v1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: env.serviceRoleKey,
    },
    body: JSON.stringify({
      type: "magiclink",
      token: linkData.properties.email_otp,
      email: identity.email,
    }),
    cache: "no-store",
  });

  const text = await response.text();
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`supabase_session_invalid_json:${text}`);
  }

  if (!response.ok) {
    throw new Error(
      `supabase_session_create_failed:${JSON.stringify({
        status: response.status,
        error: json["error"] ?? null,
        code: json["code"] ?? null,
        msg: json["msg"] ?? null,
        message: json["message"] ?? null,
        error_description: json["error_description"] ?? null,
      })}`,
    );
  }

  const nestedSession =
    json["session"] != null &&
    typeof json["session"] === "object" &&
    !Array.isArray(json["session"])
      ? (json["session"] as Record<string, unknown>)
      : null;
  let finalSession: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  if (nestedSession != null) {
    finalSession = {
      access_token:
        typeof nestedSession["access_token"] === "string"
          ? nestedSession["access_token"]
          : undefined,
      refresh_token:
        typeof nestedSession["refresh_token"] === "string"
          ? nestedSession["refresh_token"]
          : undefined,
      expires_in:
        typeof nestedSession["expires_in"] === "number"
          ? nestedSession["expires_in"]
          : undefined,
    };
  } else {
    finalSession = {
      access_token:
        typeof json["access_token"] === "string"
          ? json["access_token"]
          : undefined,
      refresh_token:
        typeof json["refresh_token"] === "string"
          ? json["refresh_token"]
          : undefined,
      expires_in:
        typeof json["expires_in"] === "number" ? json["expires_in"] : undefined,
    };
  }

  if (!finalSession.refresh_token) {
    throw new Error(
      `supabase_session_missing_refresh_token:${JSON.stringify({
        top_level_keys: Object.keys(json),
        has_nested_session: nestedSession != null,
        nested_session_keys: nestedSession != null
          ? Object.keys(nestedSession)
          : [],
      })}`,
    );
  }

  return finalSession;
}

async function handleExchange(
  payload: ExchangeRequest,
  origin: string | null,
) {
  let projectUrl = "";
  let serviceRoleKey = "";
  let zaloAppId = "";
  let zaloAppSecret = "";
  let zaloRedirectUri = "";
  try {
    projectUrl = requiredEnv("SUPABASE_URL");
    serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    zaloAppId = requiredEnv("ZALO_APP_ID");
    zaloAppSecret = requiredEnv("ZALO_APP_SECRET");
    zaloRedirectUri = validateZaloRedirectAuthority(
      requiredEnv("ZALO_REDIRECT_URI"),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "missing_env:SUPABASE_URL" ||
        message === "missing_env:SUPABASE_SERVICE_ROLE_KEY") {
      return jsonResponse(503, {
        error_code: "supabase_admin_unconfigured",
        message:
          "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for customer Zalo auth exchange.",
      }, origin);
    }
    if (message === "missing_env:ZALO_APP_ID" ||
        message === "missing_env:ZALO_APP_SECRET" ||
        message === "missing_env:ZALO_REDIRECT_URI") {
      return jsonResponse(503, {
        error_code: "provider_not_configured",
        message:
          "ZALO_APP_ID, ZALO_APP_SECRET, and ZALO_REDIRECT_URI are required for customer Zalo auth exchange.",
      }, origin);
    }
    if (message.startsWith("invalid_zalo_redirect_uri:")) {
      return jsonResponse(503, {
        error_code: "redirect_authority_invalid",
        message:
          "ZALO_REDIRECT_URI must be an absolute http(s) URL for /customer-zalo-auth-exchange with no query string or fragment.",
      }, origin);
    }
    throw error;
  }

  const authorizationCode = payload.authorization_code?.trim();
  const redirectUri = payload.redirect_uri?.trim();
  if (!authorizationCode || !redirectUri) {
    return jsonResponse(400, {
      error_code: "invalid_callback_payload",
      message:
        "authorization_code and redirect_uri are required for customer Zalo auth exchange.",
    }, origin);
  }

  if (redirectUri !== zaloRedirectUri) {
    return jsonResponse(400, {
      error_code: "redirect_uri_mismatch",
      message: "redirect_uri did not match the configured Zalo redirect URI.",
    }, origin);
  }

  try {
    logAuthEvent("auth.exchange.env_check", "INFO", {
      projectUrlPresent: Boolean(projectUrl),
      projectUrlHost: projectUrl ? new URL(projectUrl).host : null,
      serviceRoleKeyPresent: Boolean(serviceRoleKey),
      serviceRoleKeyEnv: "SUPABASE_SERVICE_ROLE_KEY",
      zaloAppIdPresent: Boolean(zaloAppId),
      zaloAppSecretPresent: Boolean(zaloAppSecret),
      zaloRedirectUriPresent: Boolean(zaloRedirectUri),
      proxyUrlPresent: Boolean(
        process.env["VIETNAM_ZALO_PROFILE_PROXY_URL"]?.trim(),
      ),
      proxySecretPresent: Boolean(
        process.env["VIETNAM_ZALO_PROXY_SHARED_SECRET"]?.trim(),
      ),
    });
    logAuthEvent("auth.exchange.start", "INFO", { provider: "zalo" });
    const tokenResponse = await exchangeAuthorizationCode(payload, {
      zaloAppId,
      zaloAppSecret,
    });
    logAuthEvent("auth.exchange.success", "INFO", { provider: "zalo" });

    logAuthEvent("auth.profile_fetch.start", "INFO", { provider: "zalo" });
    const profile = await fetchZaloProfile(tokenResponse.access_token!);
    logAuthEvent("auth.profile_fetch.success", "INFO", {
      provider: "zalo",
      zalo_id: profile.id,
    });

    logAuthEvent("auth.user_lookup.start", "INFO", { provider: "zalo" });
    const identity = await resolveSupabaseIdentity(
      { projectUrl, serviceRoleKey },
      profile,
    );
    logAuthEvent("auth.user_lookup.success", "INFO", {
      provider: "zalo",
      user_id: identity.actorId,
    });

    logAuthEvent("auth.session.start", "INFO", { provider: "zalo" });
    const session = await issueSupabaseSession(
      { projectUrl, serviceRoleKey },
      { email: identity.email },
    );
    logAuthEvent("auth.session.issued", "INFO", { provider: "zalo" });

    const completion: CustomerAuthCompletionEnvelope = {
      contract_version: AUTH_COMPLETION_RESULT_VERSION,
      provider: "zalo",
      result: "authenticated",
      session: {
        transport: "refresh_token_exchange",
        access_token: session["access_token"] as string | undefined,
        refresh_token: session["refresh_token"] as string,
        expires_in: session["expires_in"] as number | undefined,
      },
      identity: {
        actor_id: identity.actorId,
        actor_type: "customer",
        is_new_customer: identity.isNewCustomer,
        needs_onboarding: identity.needsOnboarding,
        display_name: identity.displayName,
      },
    };

    return jsonResponse(200, completion, origin);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown exchange failure";
    logAuthEvent("auth.exchange.failed", "ERROR", {
      provider: "zalo",
      error_code: msg,
      error_message: error instanceof Error ? error.message : String(error),
    });
    return jsonResponse(502, {
      error_code: "provider_exchange_failed",
      message: msg,
    }, origin);
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin != null && resolveAllowedCorsOrigin(origin) == null) {
    return new NextResponse("forbidden", { status: 403 });
  }
  return new NextResponse("ok", { headers: buildCorsHeaders(origin) });
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
  redirectQuery.set("provider", "zalo");
  if (query.has("code")) {
    redirectQuery.set("code", query.get("code") ?? "");
    redirectQuery.set("result", "authenticated");
  }
  if (query.has("state")) {
    redirectQuery.set("state", query.get("state") ?? "");
  }
  if (query.has("error")) {
    redirectQuery.set("error", query.get("error") ?? "");
    redirectQuery.set("result", "error");
  }
  if (query.has("error_description")) {
    redirectQuery.set(
      "error_description",
      query.get("error_description") ?? "",
    );
  }

  const webReturnTo = decodeWebReturnTo(query.get("state"));
  if (webReturnTo != null) {
    redirectQuery.forEach((value, key) => {
      if (value.trim().length > 0) {
        webReturnTo.searchParams.set(key, value);
      }
    });
    return NextResponse.redirect(webReturnTo, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return htmlRedirect(buildAppRedirect(redirectQuery), "Deliberry Zalo Sign-In");
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin != null && resolveAllowedCorsOrigin(origin) == null) {
    return jsonResponse(403, {
      error_code: "origin_not_allowed",
      message: "Origin is not allowed for customer auth exchange.",
    });
  }

  let payload: ExchangeRequest;
  try {
    payload = (await request.json()) as ExchangeRequest;
  } catch {
    return jsonResponse(400, {
      error_code: "invalid_callback_payload",
      message: "Request body must be valid JSON.",
    }, origin);
  }

  return handleExchange(payload, origin);
}

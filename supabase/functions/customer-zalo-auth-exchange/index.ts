import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
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
  const bytes = new Uint8Array(digest);
  const base64 = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
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
  const profileUrl = new URL("https://graph.zalo.me/v2.0/me");
  profileUrl.searchParams.set("access_token", accessToken);
  profileUrl.searchParams.set("fields", "id,name,picture,phone");

  const response = await fetch(profileUrl);
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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      error_code: "method_not_allowed",
      message: "Use POST for customer Zalo auth exchange.",
    });
  }

  let payload: ExchangeRequest;
  try {
    payload = (await request.json()) as ExchangeRequest;
  } catch {
    return jsonResponse(400, {
      error_code: "invalid_callback_payload",
      message: "Request body must be valid JSON.",
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

  const supabaseUrl = Deno.env.get("PROJECT_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";
  const zaloAppId = Deno.env.get("ZALO_APP_ID") ?? "";
  const zaloAppSecret = Deno.env.get("ZALO_APP_SECRET") ?? "";
  const zaloRedirectUri = Deno.env.get("ZALO_REDIRECT_URI") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
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

  if (redirectUri != zaloRedirectUri) {
    return jsonResponse(400, {
      error_code: "redirect_uri_mismatch",
      message: "redirect_uri did not match the configured Zalo redirect URI.",
    });
  }

  try {
    const tokenResponse = await exchangeAuthorizationCode(payload, {
      zaloAppId,
      zaloAppSecret,
    });
    const profile = await fetchZaloProfile(tokenResponse.access_token!);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const zaloUserId = profile.id!;
    const email = syntheticEmailFor(zaloUserId);
    const password = await deterministicPasswordFor(zaloUserId, serviceRoleKey);
    const displayName = resolveDisplayName(profile, zaloUserId);
    const phoneNumber = profile.phone?.trim() || null;
    const needsOnboarding = phoneNumber == null;

    const { data: existingAuthUser, error: existingAuthUserError } =
      await supabaseAdmin
        .schema("auth")
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (existingAuthUserError) {
      throw new Error(
        `supabase_user_lookup_failed:${existingAuthUserError.message}`,
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
        throw new Error(
          `supabase_user_create_failed:${error?.message ?? "unknown"}`,
        );
      }
      authUserId = data.user.id;
    } else {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        authUserId,
        {
          email,
          password,
          user_metadata: userMetadata,
          app_metadata: appMetadata,
        },
      );
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

    const sessionResponse = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ email, password }),
      },
    );
    const sessionText = await sessionResponse.text();
    let sessionJson: Record<string, unknown>;
    try {
      sessionJson = JSON.parse(sessionText) as Record<string, unknown>;
    } catch {
      throw new Error(`supabase_session_invalid_json:${sessionText}`);
    }

    if (!sessionResponse.ok) {
      throw new Error(
        `supabase_session_create_failed:${String(sessionJson["msg"] ?? sessionResponse.status)}`,
      );
    }

    return jsonResponse(200, {
      access_token: sessionJson["access_token"],
      refresh_token: sessionJson["refresh_token"],
      expires_in: sessionJson["expires_in"],
      actor_id: authUserId,
      actor_type: "customer",
      is_new_customer: isNewCustomer,
      needs_onboarding: needsOnboarding,
      display_name: displayName,
    });
  } catch (error) {
    return jsonResponse(502, {
      error_code: "provider_exchange_failed",
      message: error instanceof Error ? error.message : "Unknown exchange failure",
    });
  }
});

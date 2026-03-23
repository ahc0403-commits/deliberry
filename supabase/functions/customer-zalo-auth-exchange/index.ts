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

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const zaloAppId = Deno.env.get("ZALO_APP_ID") ?? "";
  const zaloAppSecret = Deno.env.get("ZALO_APP_SECRET") ?? "";
  const zaloRedirectUri = Deno.env.get("ZALO_REDIRECT_URI") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(503, {
      error_code: "supabase_admin_unconfigured",
      message:
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for customer Zalo auth exchange.",
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

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  void supabaseAdmin;
  void authorizationCode;
  void payload.code_verifier;
  void payload.device_context;

  return jsonResponse(501, {
    error_code: "provider_exchange_not_implemented",
    message:
      "Customer Zalo auth exchange contract is installed, but provider token exchange and session issuance are not implemented yet.",
    request_contract: {
      authorization_code: "string",
      redirect_uri: "string",
      code_verifier: "string | optional",
      device_context: "object | optional",
    },
    response_contract: {
      access_token: "string",
      refresh_token: "string",
      expires_in: "number",
      actor_id: "string",
      actor_type: "customer",
      is_new_customer: "boolean",
      needs_onboarding: "boolean",
      display_name: "string | null",
    },
  });
});

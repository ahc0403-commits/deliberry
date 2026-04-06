import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  runSettlementGeneration,
  validateWindow,
} from "../_shared/settlement-core.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type TriggerRequest = {
  restaurant_id?: string;
  period_start?: string;
  period_end?: string;
  period_label?: string;
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

async function assertAdmin(request: Request): Promise<{ ok: true } | { ok: false; message: string }> {
  const authHeader = request.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return { ok: false, message: "Missing bearer token." };
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  if (!supabaseUrl || !anonKey) {
    return {
      ok: false,
      message: "SUPABASE_URL and SUPABASE_ANON_KEY are required.",
    };
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, message: error?.message ?? "Invalid token." };
  }

  const actorType =
    (data.user.app_metadata?.actor_type as string | undefined) ??
    (data.user.user_metadata?.actor_type as string | undefined);
  if (actorType !== "admin") {
    return { ok: false, message: "Admin privileges are required." };
  }

  return { ok: true };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      error_code: "method_not_allowed",
      message: "Use POST for trigger-settlement.",
    });
  }

  const adminCheck = await assertAdmin(request);
  if (!adminCheck.ok) {
    return jsonResponse(401, {
      error_code: "unauthorized",
      message: adminCheck.message,
    });
  }

  let payload: TriggerRequest;
  try {
    payload = (await request.json()) as TriggerRequest;
  } catch {
    return jsonResponse(400, {
      error_code: "invalid_payload",
      message: "Request body must be valid JSON.",
    });
  }

  if (!payload.period_start || !payload.period_end) {
    return jsonResponse(400, {
      error_code: "invalid_period_window",
      message: "period_start and period_end are required.",
    });
  }

  try {
    const window = validateWindow({
      periodStart: payload.period_start,
      periodEnd: payload.period_end,
      periodLabel: payload.period_label,
    });
    const result = await runSettlementGeneration({
      ...window,
      restaurantId: payload.restaurant_id?.trim() || undefined,
    });

    return jsonResponse(200, {
      ok: true,
      ...result,
      window,
      scope: payload.restaurant_id?.trim() || "all_restaurants",
    });
  } catch (error) {
    return jsonResponse(500, {
      error_code: "settlement_generation_failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});


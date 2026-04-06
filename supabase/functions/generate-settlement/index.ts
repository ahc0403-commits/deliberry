import {
  resolveAutoSettlementWindow,
  runSettlementGeneration,
} from "../_shared/settlement-core.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
      message: "Use POST for generate-settlement.",
    });
  }

  const cronSecret = Deno.env.get("CRON_SECRET") ?? "";
  const authHeader = request.headers.get("Authorization") ?? "";
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return jsonResponse(401, {
      error_code: "unauthorized",
      message: "CRON_SECRET authorization failed.",
    });
  }

  try {
    const window = resolveAutoSettlementWindow(new Date());
    const result = await runSettlementGeneration(window);
    return jsonResponse(200, {
      ok: true,
      ...result,
      window,
    });
  } catch (error) {
    return jsonResponse(500, {
      error_code: "settlement_generation_failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});


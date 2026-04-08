import {
  resolveAutoSettlementWindow,
  runSettlementGeneration,
} from "../_shared/settlement-core.ts";

// CRON-only function: no browser CORS needed, restrict to same-origin/internal
const ALLOWED_ORIGINS = [
  "https://admin.deli-berry.com",
  "http://localhost:3103",
];

function buildCorsHeaders(request: Request) {
  const origin = request.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function jsonResponse(status: number, body: Record<string, unknown>, request: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...buildCorsHeaders(request),
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: buildCorsHeaders(request) });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      error_code: "method_not_allowed",
      message: "Use POST for generate-settlement.",
    }, request);
  }

  const cronSecret = Deno.env.get("CRON_SECRET") ?? "";
  const authHeader = request.headers.get("Authorization") ?? "";
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return jsonResponse(401, {
      error_code: "unauthorized",
      message: "CRON_SECRET authorization failed.",
    }, request);
  }

  try {
    const window = resolveAutoSettlementWindow(new Date());
    const result = await runSettlementGeneration(window);
    return jsonResponse(200, {
      ok: true,
      ...result,
      window,
    }, request);
  } catch (error) {
    return jsonResponse(500, {
      error_code: "settlement_generation_failed",
      message: error instanceof Error ? error.message : String(error),
    }, request);
  }
});


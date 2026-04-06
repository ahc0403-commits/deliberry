import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type WindowInput = {
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
};

type SettlementRunOptions = WindowInput & {
  restaurantId?: string;
};

type SettlementRunResult = {
  processed: number;
  periodLabel: string;
  results: Array<Record<string, unknown>>;
};

function parseIsoDate(date: string): Date | null {
  const trimmed = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }
  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function resolveAutoSettlementWindow(now = new Date()): WindowInput {
  const utcDay = now.getUTCDate();
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();

  if (utcDay <= 15) {
    const prevMonthDate = new Date(Date.UTC(utcYear, utcMonth - 1, 1));
    const year = prevMonthDate.getUTCFullYear();
    const month = prevMonthDate.getUTCMonth();
    const monthLabel = String(month + 1).padStart(2, "0");
    const periodStart = `${year}-${monthLabel}-16`;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const periodEnd = `${year}-${monthLabel}-${String(lastDay).padStart(2, "0")}`;
    return {
      periodStart,
      periodEnd,
      periodLabel: `${year}-${monthLabel}-B`,
    };
  }

  const monthLabel = String(utcMonth + 1).padStart(2, "0");
  return {
    periodStart: `${utcYear}-${monthLabel}-01`,
    periodEnd: `${utcYear}-${monthLabel}-15`,
    periodLabel: `${utcYear}-${monthLabel}-A`,
  };
}

export function validateWindow(input: {
  periodStart: string;
  periodEnd: string;
  periodLabel?: string;
}): WindowInput {
  const start = parseIsoDate(input.periodStart);
  const end = parseIsoDate(input.periodEnd);
  if (!start || !end) {
    throw new Error("invalid_period_window:period_start and period_end must be YYYY-MM-DD");
  }
  if (start.getTime() > end.getTime()) {
    throw new Error("invalid_period_window:period_start must be before or equal to period_end");
  }

  const label =
    input.periodLabel?.trim().length ? input.periodLabel.trim() : `${input.periodStart}_${input.periodEnd}`;
  return {
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    periodLabel: label,
  };
}

export async function runSettlementGeneration(
  options: SettlementRunOptions,
): Promise<SettlementRunResult> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("supabase_admin_unconfigured:SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const startIso = `${options.periodStart}T00:00:00.000Z`;
  const endIso = `${options.periodEnd}T23:59:59.999Z`;

  let restaurantQuery = supabase
    .from("external_sales")
    .select("restaurant_id")
    .eq("is_revenue", true)
    .eq("order_status", "completed")
    .is("settlement_id", null)
    .gte("completed_at", startIso)
    .lte("completed_at", endIso);

  if (options.restaurantId) {
    restaurantQuery = restaurantQuery.eq("restaurant_id", options.restaurantId);
  }

  const { data: restaurantRows, error: fetchRestaurantError } =
    await restaurantQuery;
  if (fetchRestaurantError) {
    throw new Error(`settlement_restaurant_query_failed:${fetchRestaurantError.message}`);
  }

  const restaurantIds = [
    ...new Set(
      (restaurantRows ?? [])
        .map((row) => row.restaurant_id as string | null)
        .filter((value): value is string => Boolean(value && value.trim().length)),
    ),
  ];

  const results: Array<Record<string, unknown>> = [];

  for (const restaurantId of restaurantIds) {
    try {
      const { data: salesRows, error: salesError } = await supabase
        .from("external_sales")
        .select("id, gross_amount")
        .eq("restaurant_id", restaurantId)
        .eq("is_revenue", true)
        .eq("order_status", "completed")
        .is("settlement_id", null)
        .gte("completed_at", startIso)
        .lte("completed_at", endIso);

      if (salesError) {
        results.push({
          restaurant_id: restaurantId,
          error: `sales_query_failed:${salesError.message}`,
        });
        continue;
      }

      if (!salesRows || salesRows.length === 0) {
        continue;
      }

      const grossTotal = salesRows.reduce((sum, sale) => {
        return sum + Number(sale.gross_amount ?? 0);
      }, 0);

      const { data: settlement, error: settlementError } = await supabase
        .from("delivery_settlements")
        .insert({
          restaurant_id: restaurantId,
          source_system: "deliberry",
          period_start: options.periodStart,
          period_end: options.periodEnd,
          period_label: options.periodLabel,
          gross_total: grossTotal,
          total_deductions: 0,
          net_settlement: grossTotal,
          status: "calculated",
        })
        .select("id")
        .single();

      if (settlementError || !settlement) {
        results.push({
          restaurant_id: restaurantId,
          error: `settlement_insert_failed:${settlementError?.message ?? "unknown"}`,
        });
        continue;
      }

      const platformFee = Math.round(grossTotal * 0.015);
      const paymentFee = Math.round(grossTotal * 0.015);

      const deductionItems = [
        {
          settlement_id: settlement.id,
          item_type: "platform_commission",
          amount: platformFee,
          description: "Platform commission 1.5%",
          reference_rate: 0.015,
          reference_base: grossTotal,
        },
        {
          settlement_id: settlement.id,
          item_type: "payment_fee",
          amount: paymentFee,
          description: "Payment fee estimate 1.5%",
          reference_rate: 0.015,
          reference_base: grossTotal,
        },
      ];

      const { error: deductionError } = await supabase
        .from("delivery_settlement_items")
        .insert(deductionItems);
      if (deductionError) {
        results.push({
          restaurant_id: restaurantId,
          settlement_id: settlement.id,
          error: `settlement_items_insert_failed:${deductionError.message}`,
        });
        continue;
      }

      const totalDeductions = deductionItems.reduce(
        (sum, item) => sum + Number(item.amount ?? 0),
        0,
      );
      const netSettlement = grossTotal - totalDeductions;

      const { error: settlementUpdateError } = await supabase
        .from("delivery_settlements")
        .update({
          total_deductions: totalDeductions,
          net_settlement: netSettlement,
        })
        .eq("id", settlement.id);
      if (settlementUpdateError) {
        results.push({
          restaurant_id: restaurantId,
          settlement_id: settlement.id,
          error: `settlement_update_failed:${settlementUpdateError.message}`,
        });
        continue;
      }

      const salesIds = salesRows.map((sale) => sale.id as string);
      const { error: salesLinkError } = await supabase
        .from("external_sales")
        .update({ settlement_id: settlement.id })
        .in("id", salesIds);
      if (salesLinkError) {
        results.push({
          restaurant_id: restaurantId,
          settlement_id: settlement.id,
          error: `sales_link_failed:${salesLinkError.message}`,
        });
        continue;
      }

      results.push({
        restaurant_id: restaurantId,
        settlement_id: settlement.id,
        period_label: options.periodLabel,
        gross_total: grossTotal,
        total_deductions: totalDeductions,
        net_settlement: netSettlement,
        order_count: salesRows.length,
      });
    } catch (error) {
      results.push({
        restaurant_id: restaurantId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    processed: restaurantIds.length,
    periodLabel: options.periodLabel,
    results,
  };
}


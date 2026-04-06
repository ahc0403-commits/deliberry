import {
  createMerchantServerSupabaseClient,
  createMerchantServiceSupabaseClient,
} from "../supabase/client";
import { readMerchantAuthAuthority } from "../supabase/config";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";
import { formatMoney } from "../domain";
import {
  mockKPIs,
  mockRecentAlerts,
  mockStore,
  type MerchantReview,
  type MerchantOrder,
} from "./merchant-mock-data";
import { ExternalSalesService } from "./external-sales-service";
import type {
  MerchantDashboardKpiSnapshot,
  MerchantOrdersQuery,
  MerchantReadCursor,
  MerchantReviewsQuery,
  MerchantRuntimeRepository,
} from "./merchant-runtime-repository";
import type {
  DashboardData,
  OrdersData,
  SettingsData,
  StoreManagementData,
} from "./merchant-repository";

const MERCHANT_DASHBOARD_ORDER_LIMIT = 25;
const MERCHANT_DASHBOARD_REVIEW_LIMIT = 10;

type PersistedOrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string | null;
  store_id: string;
  delivery_address: string;
  notes: string | null;
  subtotal_centavos: number;
  delivery_fee_centavos: number;
  total_centavos: number;
  payment_method: MerchantOrder["paymentMethod"];
  status: MerchantOrder["status"];
  created_at: string;
  estimated_delivery_at: string;
  line_items_summary: Array<{
    name: string;
    quantity: number;
    unit_price_centavos: number;
    modifiers?: string[];
  }> | null;
};

type PersistedStoreRow = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  rating: number | null;
  review_count: number | null;
  status: "open" | "closed" | "paused" | null;
  cuisine_type: string | null;
  hours_json:
    | Array<{
        day: string;
        open: string;
        close: string;
      }>
    | null;
  delivery_radius: string | null;
  avg_prep_time: string | null;
  accepting_orders: boolean | null;
  settings_json: {
    auto_accept_orders?: boolean;
    order_notifications?: boolean;
    rush_hour_mode?: boolean;
    allow_special_instructions?: boolean;
    email_reports?: boolean;
    review_alerts?: boolean;
    settlement_notifications?: boolean;
    low_stock_alerts?: boolean;
  } | null;
};

type PersistedReviewRow = {
  id: string;
  order_id: string;
  rating: number;
  review_text: string;
  response_text: string | null;
  response_created_at: string | null;
  created_at: string;
  orders:
    | {
        customer_name: string | null;
        order_number: string | null;
      }
    | {
        customer_name: string | null;
        order_number: string | null;
      }[]
    | null;
};

function mapPersistedOrder(row: PersistedOrderRow): MerchantOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone ?? 'Phone unavailable',
    items: (row.line_items_summary ?? []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.unit_price_centavos,
      modifiers: item.modifiers ?? [],
    })),
    subtotal: row.subtotal_centavos,
    deliveryFee: row.delivery_fee_centavos,
    total: row.total_centavos,
    status: row.status,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    estimatedDelivery: row.estimated_delivery_at,
    deliveryAddress: row.delivery_address,
    notes: row.notes ?? undefined,
  };
}

function mapPersistedStore(row: PersistedStoreRow) {
  return {
    ...mockStore,
    id: row.id,
    name: row.name,
    address: row.address ?? mockStore.address,
    phone: row.phone ?? mockStore.phone,
    email: row.email ?? mockStore.email,
    rating: row.rating ?? mockStore.rating,
    reviewCount: row.review_count ?? mockStore.reviewCount,
    status: row.status ?? mockStore.status,
    cuisineType: row.cuisine_type ?? mockStore.cuisineType,
    hours:
      row.hours_json?.map((hour) => ({
        day: hour.day,
        open: hour.open,
        close: hour.close,
      })) ?? mockStore.hours,
    deliveryRadius: row.delivery_radius ?? mockStore.deliveryRadius,
    avgPrepTime: row.avg_prep_time ?? mockStore.avgPrepTime,
    acceptingOrders: row.accepting_orders ?? mockStore.acceptingOrders,
  };
}

function mapPersistedReview(row: PersistedReviewRow): MerchantReview {
  const order = Array.isArray(row.orders) ? row.orders[0] : row.orders;
  return {
    id: row.id,
    customerName: order?.customer_name?.trim() || "Customer",
    rating: row.rating,
    text: row.review_text,
    date: row.created_at,
    orderId: order?.order_number?.trim() || row.order_id,
    responded: Boolean(row.response_text),
    response: row.response_text ?? undefined,
    responseDate: row.response_created_at ?? undefined,
  };
}

export class SupabaseMerchantRuntimeRepository implements MerchantRuntimeRepository {
  private async createRuntimeSupabaseClient() {
    if (readMerchantAuthAuthority() === "demo-cookie") {
      return createMerchantServiceSupabaseClient();
    }

    return createMerchantServerSupabaseClient();
  }

  private async readPersistedStore(storeId: string) {
    const supabase = await this.createRuntimeSupabaseClient();
    const { data, error } = await supabase
      .from("stores")
      .select(`
        id,
        name,
        address,
        phone,
        email,
        rating,
        review_count,
        status,
        cuisine_type,
        hours_json,
        delivery_radius,
        avg_prep_time,
        accepting_orders,
        settings_json
      `)
      .eq("id", storeId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error(`Persisted store ${storeId} was not found.`);
    }

    return data as PersistedStoreRow;
  }

  async getDashboardKpiSnapshot(storeId: string): Promise<MerchantDashboardKpiSnapshot> {
    const supabase = await this.createRuntimeSupabaseClient();
    const { data, error } = await supabase.rpc(
      "get_merchant_dashboard_kpi_snapshot",
      { p_store_id: storeId },
    );

    if (error) {
      throw new Error(error.message);
    }

    const snapshot = data as {
      active_order_count: number;
      ready_order_count: number;
      gross_revenue_centavos: number;
      non_cancelled_order_count: number;
      review_count: number;
    };

    return {
      activeOrderCount: snapshot.active_order_count ?? 0,
      readyOrderCount: snapshot.ready_order_count ?? 0,
      grossRevenueCentavos: snapshot.gross_revenue_centavos ?? 0,
      nonCancelledOrderCount: snapshot.non_cancelled_order_count ?? 0,
      reviewCount: snapshot.review_count ?? 0,
    };
  }

  async getDashboardData(storeId: string): Promise<DashboardData> {
    // P1: Use exact KPI snapshot RPC instead of deriving from bounded slices.
    const [kpiSnapshot, ordersData, reviewsData] = await Promise.all([
      this.getDashboardKpiSnapshot(storeId),
      this.getOrdersData({
        storeId,
        limit: MERCHANT_DASHBOARD_ORDER_LIMIT,
      }),
      this.getReviewsData({
        storeId,
        limit: MERCHANT_DASHBOARD_REVIEW_LIMIT,
      }),
    ]);

    const kpis = mockKPIs.map((kpi) => {
      if (kpi.label === "Today's Revenue") {
        return {
          ...kpi,
          value: formatMoney(kpiSnapshot.grossRevenueCentavos),
          trend: `${kpiSnapshot.nonCancelledOrderCount} persisted order${kpiSnapshot.nonCancelledOrderCount === 1 ? "" : "s"}`,
          trendDirection: "neutral" as const,
        };
      }

      if (kpi.label === "Active Orders") {
        return {
          ...kpi,
          value: String(kpiSnapshot.activeOrderCount),
          trend: `${kpiSnapshot.activeOrderCount} active`,
          trendDirection: "neutral" as const,
        };
      }

      return kpi;
    });
    const alerts = [
      ...(kpiSnapshot.activeOrderCount > 0
        ? [
            {
              id: "merchant-active-orders-persisted",
              type: "info" as const,
              message: `${kpiSnapshot.activeOrderCount} active order${kpiSnapshot.activeOrderCount === 1 ? "" : "s"} in progress`,
              time: ordersData.orders[0]?.createdAt ?? "",
            },
          ]
        : []),
      ...(kpiSnapshot.readyOrderCount > 0
        ? [
            {
              id: "merchant-ready-orders-persisted",
              type: "success" as const,
              message: `${kpiSnapshot.readyOrderCount} order${kpiSnapshot.readyOrderCount === 1 ? "" : "s"} ready for handoff`,
              time:
                ordersData.orders.find((order) => order.status === "ready")
                  ?.estimatedDelivery ?? "",
            },
          ]
        : []),
      ...(kpiSnapshot.reviewCount > 0
        ? [
            {
              id: "merchant-unanswered-reviews",
              type: "warning" as const,
              message: `${kpiSnapshot.reviewCount} review${kpiSnapshot.reviewCount === 1 ? "" : "s"} awaiting response`,
              time:
                reviewsData.reviews.find((review) => !review.responded)?.date ??
                "",
            },
          ]
        : []),
      ...mockRecentAlerts.filter((alert) => !alert.id.startsWith("merchant-active-orders")),
    ].slice(0, 4);

    return {
      kpis,
      recentOrders: ordersData.orders.slice(0, 5),
      alerts,
      store: ordersData.store,
    };
  }

  async getOrdersData(query: MerchantOrdersQuery): Promise<OrdersData> {
    const supabase = await this.createRuntimeSupabaseClient();
    let request = supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        store_id,
        delivery_address,
        notes,
        subtotal_centavos,
        delivery_fee_centavos,
        total_centavos,
        payment_method,
        status,
        created_at,
        estimated_delivery_at,
        line_items_summary
      `)
      .eq("store_id", query.storeId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (query.statuses && query.statuses.length > 0) {
      request = request.in("status", query.statuses);
    }

    if (query.cursor) {
      request = request.or(this.buildDescendingCursorFilter(query.cursor));
    }

    const [{ data, error }, store] = await Promise.all([
      request.limit(query.limit),
      this.readPersistedStore(query.storeId),
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return {
      orders: (data ?? []).map((row) => mapPersistedOrder(row as PersistedOrderRow)),
      store: mapPersistedStore(store),
    };
  }

  async updateOrderStatus(input: {
    storeId: string;
    orderId: string;
    status: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    traceId?: string;
  }): Promise<MerchantOrder> {
    const nextStatus = input.status as MerchantOrder["status"];
    const startedAt = Date.now();
    const supabase = await this.createRuntimeSupabaseClient();
    const { data: refreshedOrder, error } = await supabase.rpc(
      "update_order_status_with_audit",
      {
        p_order_id: input.orderId,
        p_store_id: input.storeId,
        p_next_status: nextStatus,
        p_actor_id: input.actorId,
        p_actor_type: input.actorType,
      },
    );

    if (error) {
      const failureClass = buildMerchantRuntimeFailureClass(error);
      try {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "repository",
            operation: "merchant.order.status_update",
            outcome: "failed",
            traceId: input.traceId ?? `trace_${Date.now()}`,
            attemptSource: "persisted",
            failureClass,
            actorType: input.actorType,
            storeId: input.storeId,
            orderId: input.orderId,
            toStatus: nextStatus,
            durationMs: Date.now() - startedAt,
          }),
        );
        if (
          failureClass === "auth_missing" ||
          failureClass === "rls_denied" ||
          failureClass === "membership_denied"
        ) {
          await recordMerchantRuntimeObservabilityEvent(
            buildMerchantRuntimeEvent({
              surface: "merchant-console",
              layer: "repository",
              operation: "runtime.access_denied",
              outcome: "failed",
              traceId: input.traceId ?? `trace_${Date.now()}`,
              attemptSource: "persisted",
              failureClass,
              actorType: input.actorType,
              storeId: input.storeId,
              orderId: input.orderId,
              resourceType: "Order",
              resourceScope: input.storeId,
              durationMs: Date.now() - startedAt,
              metadata: {
                triggeringOperation: "merchant.order.status_update",
              },
            }),
          );
        }
      } catch {}
      throw new Error(error.message);
    }

    if (!refreshedOrder) {
      try {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "repository",
            operation: "merchant.order.status_update",
            outcome: "failed",
            traceId: input.traceId ?? `trace_${Date.now()}`,
            attemptSource: "persisted",
            failureClass: "unexpected_null_reload",
            actorType: input.actorType,
            storeId: input.storeId,
            orderId: input.orderId,
            toStatus: nextStatus,
            durationMs: Date.now() - startedAt,
          }),
        );
      } catch {}
      throw new Error(
        `Persisted order ${input.orderId} could not be reloaded after update.`,
      );
    }

    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "repository",
          operation: "merchant.order.status_update",
          outcome: "succeeded",
          traceId: input.traceId ?? `trace_${Date.now()}`,
          attemptSource: "persisted",
          actorType: input.actorType,
          storeId: input.storeId,
          orderId: input.orderId,
          toStatus: nextStatus,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}

    const updatedOrder = mapPersistedOrder(refreshedOrder as PersistedOrderRow);

    // Fire-and-forget: external sales replication must not block order updates.
    const externalSalesService = new ExternalSalesService(supabase);
    if (nextStatus === "delivered") {
      void externalSalesService.recordCompletedOrder({
        storeId: input.storeId,
        order: updatedOrder,
      });
    } else if (nextStatus === "cancelled") {
      void externalSalesService.recordCancelledOrder({
        storeId: input.storeId,
        order: updatedOrder,
      });
    }

    return updatedOrder;
  }

  async getMenuData(): Promise<never> {
    throw new Error("Menu persistence cutover is not part of Phase 3.");
  }
  async getStoreManagementData(storeId: string) {
    return {
      store: mapPersistedStore(await this.readPersistedStore(storeId)),
    };
  }
  async getReviewsData(query: MerchantReviewsQuery) {
    const supabase = await this.createRuntimeSupabaseClient();
    const [reviewResult, storeRow] = await Promise.all([
      (() => {
        let request = supabase
        .from("customer_reviews")
        .select(`
          id,
          order_id,
          rating,
          review_text,
          response_text,
          response_created_at,
          created_at,
          orders!inner (
            customer_name,
            order_number
          )
        `)
        .eq("store_id", query.storeId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });
        if (query.cursor) {
          request = request.or(this.buildDescendingCursorFilter(query.cursor));
        }
        return request.limit(query.limit);
      })(),
      this.readPersistedStore(query.storeId),
    ]);
    const { data: reviewRows, error: reviewError } = reviewResult;

    if (reviewError) {
      throw new Error(reviewError.message);
    }

    return {
      reviews: (reviewRows ?? []).map((row) =>
        mapPersistedReview(row as PersistedReviewRow),
      ),
      store: mapPersistedStore(storeRow),
    };
  }

  async replyToReview(input: {
    storeId: string;
    reviewId: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    responseText: string;
  }): Promise<MerchantReview> {
    const supabase = await this.createRuntimeSupabaseClient();
    const normalizedResponse = input.responseText.trim();

    if (normalizedResponse.length === 0) {
      throw new Error("Review response cannot be empty.");
    }

    const { data: updatedRow, error } = await supabase
      .from("customer_reviews")
      .update({
        response_text: normalizedResponse,
        response_created_at: new Date().toISOString(),
        response_actor_id: input.actorId,
      })
      .eq("id", input.reviewId)
      .eq("store_id", input.storeId)
      .select(`
        id,
        order_id,
        rating,
        review_text,
        response_text,
        response_created_at,
        created_at,
        orders!inner (
          customer_name,
          order_number
        )
      `)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!updatedRow) {
      throw new Error(
        `Persisted review ${input.reviewId} could not be updated for store ${input.storeId}.`,
      );
    }

    return mapPersistedReview(updatedRow as PersistedReviewRow);
  }

  private buildDescendingCursorFilter(cursor: MerchantReadCursor): string {
    const createdAt = this.escapePostgrestValue(cursor.createdAt);
    const id = this.escapePostgrestValue(cursor.id);
    return `created_at.lt."${createdAt}",and(created_at.eq."${createdAt}",id.lt."${id}")`;
  }

  private escapePostgrestValue(value: string): string {
    return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  }

  async getPromotionsData(): Promise<never> {
    throw new Error("Promotions persistence cutover is not part of Phase 3.");
  }
  async getSettlementData(): Promise<never> {
    throw new Error("Settlement persistence cutover is not part of Phase 3.");
  }
  async getAnalyticsData(): Promise<never> {
    throw new Error("Analytics persistence cutover is not part of Phase 3.");
  }
  async getSettingsData(storeId: string): Promise<SettingsData> {
    const data = await this.readPersistedStore(storeId);
    const store = mapPersistedStore(data);
    const settings = data.settings_json ?? {};

    return {
      store,
      toggles: {
        autoAcceptOrders: settings.auto_accept_orders ?? false,
        orderNotifications: settings.order_notifications ?? true,
        rushHourMode: settings.rush_hour_mode ?? false,
        allowSpecialInstructions: settings.allow_special_instructions ?? true,
        emailReports: settings.email_reports ?? true,
        reviewAlerts: settings.review_alerts ?? true,
        settlementNotifications: settings.settlement_notifications ?? true,
        lowStockAlerts: settings.low_stock_alerts ?? false,
      },
    };
  }

  async updateSettingsData(input: {
    storeId: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    toggles: SettingsData["toggles"];
  }): Promise<SettingsData> {
    const traceId = `trace_${Date.now()}`;
    const startedAt = Date.now();
    const supabase = await this.createRuntimeSupabaseClient();
    const { data, error } = await supabase.rpc(
      "update_store_settings_with_audit",
      {
        p_store_id: input.storeId,
        p_actor_id: input.actorId,
        p_actor_type: input.actorType,
        p_settings_json: {
          auto_accept_orders: input.toggles.autoAcceptOrders,
          order_notifications: input.toggles.orderNotifications,
          rush_hour_mode: input.toggles.rushHourMode,
          allow_special_instructions: input.toggles.allowSpecialInstructions,
          email_reports: input.toggles.emailReports,
          review_alerts: input.toggles.reviewAlerts,
          settlement_notifications: input.toggles.settlementNotifications,
          low_stock_alerts: input.toggles.lowStockAlerts,
        },
      },
    );

    if (error) {
      const failureClass = buildMerchantRuntimeFailureClass(error);
      try {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "repository",
            operation: "merchant.settings.write",
            outcome: "failed",
            traceId,
            attemptSource: "persisted",
            failureClass,
            actorType: input.actorType,
            storeId: input.storeId,
            durationMs: Date.now() - startedAt,
          }),
        );
        if (
          failureClass === "auth_missing" ||
          failureClass === "rls_denied" ||
          failureClass === "membership_denied"
        ) {
          await recordMerchantRuntimeObservabilityEvent(
            buildMerchantRuntimeEvent({
              surface: "merchant-console",
              layer: "repository",
              operation: "runtime.access_denied",
              outcome: "failed",
              traceId,
              attemptSource: "persisted",
              failureClass,
              actorType: input.actorType,
              storeId: input.storeId,
              resourceType: "StoreSettings",
              resourceScope: input.storeId,
              durationMs: Date.now() - startedAt,
              metadata: {
                triggeringOperation: "merchant.settings.write",
              },
            }),
          );
        }
      } catch {}
      throw new Error(error.message);
    }

    if (!data) {
      try {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "repository",
            operation: "merchant.settings.write",
            outcome: "failed",
            traceId,
            attemptSource: "persisted",
            failureClass: "unexpected_null_reload",
            actorType: input.actorType,
            storeId: input.storeId,
            durationMs: Date.now() - startedAt,
          }),
        );
      } catch {}
      throw new Error(
        `Persisted store settings for ${input.storeId} could not be reloaded after update.`,
      );
    }

    const store = mapPersistedStore(data as PersistedStoreRow);
    const settings = (data as PersistedStoreRow).settings_json ?? {};
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "repository",
          operation: "merchant.settings.write",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          actorType: input.actorType,
          storeId: input.storeId,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}

    return {
      store,
      toggles: {
        autoAcceptOrders: settings.auto_accept_orders ?? false,
        orderNotifications: settings.order_notifications ?? true,
        rushHourMode: settings.rush_hour_mode ?? false,
        allowSpecialInstructions: settings.allow_special_instructions ?? true,
        emailReports: settings.email_reports ?? true,
        reviewAlerts: settings.review_alerts ?? true,
        settlementNotifications: settings.settlement_notifications ?? true,
        lowStockAlerts: settings.low_stock_alerts ?? false,
      },
    };
  }

  async updateStoreManagementData(input: {
    storeId: string;
    actorId: string;
    actorType: "merchant_owner" | "merchant_staff";
    store: StoreManagementData["store"];
  }): Promise<StoreManagementData> {
    const traceId = `trace_${Date.now()}`;
    const startedAt = Date.now();
    const supabase = await this.createRuntimeSupabaseClient();
    const { data, error } = await supabase.rpc(
      "update_store_profile_with_audit",
      {
        p_store_id: input.storeId,
        p_actor_id: input.actorId,
        p_actor_type: input.actorType,
        p_name: input.store.name,
        p_cuisine_type: input.store.cuisineType,
        p_phone: input.store.phone,
        p_email: input.store.email,
        p_address: input.store.address,
        p_delivery_radius: input.store.deliveryRadius,
        p_avg_prep_time: input.store.avgPrepTime,
        p_accepting_orders: input.store.acceptingOrders,
        p_hours_json: input.store.hours.map((hour) => ({
          day: hour.day,
          open: hour.open,
          close: hour.close,
        })),
      },
    );

    if (error) {
      const failureClass = buildMerchantRuntimeFailureClass(error);
      try {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "repository",
            operation: "merchant.store_profile.write",
            outcome: "failed",
            traceId,
            attemptSource: "persisted",
            failureClass,
            actorType: input.actorType,
            storeId: input.storeId,
            durationMs: Date.now() - startedAt,
          }),
        );
        if (
          failureClass === "auth_missing" ||
          failureClass === "rls_denied" ||
          failureClass === "membership_denied"
        ) {
          await recordMerchantRuntimeObservabilityEvent(
            buildMerchantRuntimeEvent({
              surface: "merchant-console",
              layer: "repository",
              operation: "runtime.access_denied",
              outcome: "failed",
              traceId,
              attemptSource: "persisted",
              failureClass,
              actorType: input.actorType,
              storeId: input.storeId,
              resourceType: "StoreProfile",
              resourceScope: input.storeId,
              durationMs: Date.now() - startedAt,
              metadata: {
                triggeringOperation: "merchant.store_profile.write",
              },
            }),
          );
        }
      } catch {}
      throw new Error(error.message);
    }

    if (!data) {
      try {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "repository",
            operation: "merchant.store_profile.write",
            outcome: "failed",
            traceId,
            attemptSource: "persisted",
            failureClass: "unexpected_null_reload",
            actorType: input.actorType,
            storeId: input.storeId,
            durationMs: Date.now() - startedAt,
          }),
        );
      } catch {}
      throw new Error(
        `Persisted store profile for ${input.storeId} could not be reloaded after update.`,
      );
    }

    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "repository",
          operation: "merchant.store_profile.write",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          actorType: input.actorType,
          storeId: input.storeId,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}

    return {
      store: mapPersistedStore(data as PersistedStoreRow),
    };
  }

  /**
   * @deprecated Internal-only masked export primitive. Do not treat this as an approved
   * external LLM outbound path. Use buildMerchantStoreMaskedExternalLlmTransmission(...)
   * instead.
   */
  async exportMaskedStoreSnapshotForExternalLlm(input: {
    storeId: string;
    actorId: string;
    profile?: "external_llm_retrieval" | "external_llm_prompt";
  }): Promise<Record<string, unknown>> {
    const supabase = await createMerchantServerSupabaseClient();
    const { data, error } = await supabase.rpc(
      "export_masked_merchant_store_snapshot_for_llm",
      {
        p_store_id: input.storeId,
        p_actor_id: input.actorId,
        p_profile: input.profile ?? "external_llm_retrieval",
      },
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error(
        `Masked merchant store export for ${input.storeId} could not be generated.`,
      );
    }

    return data as Record<string, unknown>;
  }
}

export const supabaseMerchantRuntimeRepository =
  new SupabaseMerchantRuntimeRepository();

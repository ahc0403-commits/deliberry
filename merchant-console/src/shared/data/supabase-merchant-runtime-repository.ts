import {
  createMerchantServerSupabaseClient,
  createMerchantServiceSupabaseClient,
} from "../supabase/client";
import { HO_CHI_MINH_TZ } from "../../../../shared/utils/date";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";
import { formatMoney } from "../domain";
import {
  resolveMerchantRuntimeSupabaseClientMode,
} from "./merchant-runtime-compatibility";
import {
  mockKPIs,
  mockRecentAlerts,
  mockStore,
  type AnalyticsMetric,
  type DailyRevenue,
  type MerchantReview,
  type MenuCategory,
  type MenuItem,
  type MerchantOrder,
  type TopSellingItem,
} from "./merchant-mock-data";
import { ExternalSalesService } from "./external-sales-service";
import type {
  MerchantDashboardKpiSnapshot,
  MerchantOrdersQuery,
  MerchantReadCursor,
  MerchantReviewsQuery,
  MerchantRuntimeRepository,
  MerchantStoreShellSnapshot,
} from "./merchant-runtime-repository";
import type {
  AnalyticsData,
  DashboardData,
  MenuData,
  OrdersData,
  SettlementData,
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

type PersistedMenuItemRow = {
  id: string;
  store_id: string;
  name: string;
  description: string;
  category: string;
  price_centavos: number;
  image_color_hex: string;
  image_storage_path: string | null;
  is_popular: boolean;
  is_available: boolean;
  sort_order: number;
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

type PersistedSettlementRow = {
  id: string;
  restaurant_id: string;
  period_start: string;
  period_end: string;
  gross_total: number;
  total_deductions: number;
  net_settlement: number;
  status: SettlementData["records"][number]["status"];
  received_at: string | null;
};

type PersistedSettlementItemRow = {
  settlement_id: string;
  item_type: string;
  amount: number;
};

type PersistedSettlementLinkedSaleRow = {
  settlement_id: string | null;
};

type MerchantDashboardKpiRpcRow = {
  active_order_count: number;
  ready_order_count: number;
  gross_revenue_centavos: number;
  non_cancelled_order_count: number;
  review_count: number;
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

function mapPersistedMenuItems(
  rows: PersistedMenuItemRow[],
  resolveImageUrl: (path: string) => string,
): { categories: MenuCategory[]; items: MenuItem[] } {
  const categoriesByName = new Map<string, MenuCategory>();
  const items = rows.map((row) => {
    const categoryName = row.category.trim() || "Menu";
    const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "menu";
    const existingCategory = categoriesByName.get(categoryName);
    categoriesByName.set(categoryName, {
      id: categoryId,
      name: categoryName,
      sortOrder: existingCategory?.sortOrder ?? categoriesByName.size,
      itemCount: (existingCategory?.itemCount ?? 0) + 1,
      active: true,
    });

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price_centavos,
      categoryId,
      categoryName,
      available: row.is_available,
      popular: row.is_popular,
      imageUrl: row.image_storage_path ? resolveImageUrl(row.image_storage_path) : "",
      preparationTime: "15-25 min",
    };
  });

  return {
    categories: [...categoriesByName.values()].sort((a, b) => a.sortOrder - b.sortOrder),
    items,
  };
}

function buildRecentDailyRevenue(orders: MerchantOrder[]): DailyRevenue[] {
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: HO_CHI_MINH_TZ,
  });
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const buckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      day: weekdayFormatter.format(date),
      revenue: 0,
      orders: 0,
    };
  });

  const bucketsByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const bucket = bucketsByKey.get(order.createdAt.slice(0, 10));
    if (!bucket) continue;
    bucket.revenue += order.total;
    bucket.orders += 1;
  }

  return buckets.map(({ key: _key, ...bucket }) => bucket);
}

function buildTopSellingItems(orders: MerchantOrder[]): TopSellingItem[] {
  const totalsByItemName = new Map<string, TopSellingItem>();

  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      const existing = totalsByItemName.get(item.name) ?? {
        name: item.name,
        orders: 0,
        revenue: 0,
      };
      existing.orders += item.quantity;
      existing.revenue += item.price * item.quantity;
      totalsByItemName.set(item.name, existing);
    }
  }

  return [...totalsByItemName.values()]
    .sort((left, right) => {
      if (right.orders !== left.orders) {
        return right.orders - left.orders;
      }
      return right.revenue - left.revenue;
    })
    .slice(0, 5);
}

function buildRuntimeAnalyticsMetrics(input: {
  orders: MerchantOrder[];
  reviews: MerchantReview[];
  menuItemCount: number;
  visibleMenuItemCount: number;
  avgPrepTime: string;
}): AnalyticsMetric[] {
  const { orders, reviews, menuItemCount, visibleMenuItemCount, avgPrepTime } = input;
  const nonCancelledOrders = orders.filter((order) => order.status !== "cancelled");
  const deliveredOrders = orders.filter((order) => order.status === "delivered");
  const activeOrders = orders.filter((order) =>
    ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status),
  );
  const totalRevenue = nonCancelledOrders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = nonCancelledOrders.length > 0
    ? Math.round(totalRevenue / nonCancelledOrders.length)
    : 0;
  const completionRate = orders.length > 0
    ? (deliveredOrders.length / orders.length) * 100
    : 0;
  const respondedReviewCount = reviews.filter((review) => review.responded).length;
  const pendingReviewCount = reviews.length - respondedReviewCount;
  const reviewResponseRate = reviews.length > 0
    ? (respondedReviewCount / reviews.length) * 100
    : 0;

  return [
    {
      label: "Recorded Revenue",
      value: formatMoney(totalRevenue),
      change: `${nonCancelledOrders.length} non-cancelled order${nonCancelledOrders.length === 1 ? "" : "s"}`,
      changeDirection: "neutral",
    },
    {
      label: "Recorded Orders",
      value: String(orders.length),
      change: `${activeOrders.length} active right now`,
      changeDirection: "neutral",
    },
    {
      label: "Avg Order Value",
      value: formatMoney(averageOrderValue),
      change: `${visibleMenuItemCount}/${menuItemCount} visible menu item${menuItemCount === 1 ? "" : "s"}`,
      changeDirection: "neutral",
    },
    {
      label: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      change: `${deliveredOrders.length} delivered`,
      changeDirection: completionRate >= 90 ? "up" : completionRate >= 70 ? "neutral" : "down",
    },
    {
      label: "Avg Prep Window",
      value: avgPrepTime,
      change: "Store profile default",
      changeDirection: "neutral",
    },
    {
      label: "Review Response Rate",
      value: `${reviewResponseRate.toFixed(1)}%`,
      change: `${pendingReviewCount} awaiting response`,
      changeDirection: pendingReviewCount === 0 ? "up" : "neutral",
    },
  ];
}

export class SupabaseMerchantRuntimeRepository implements MerchantRuntimeRepository {
  private async createRuntimeSupabaseClient() {
    if (resolveMerchantRuntimeSupabaseClientMode() === "service") {
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

    const snapshot = (Array.isArray(data) ? data[0] : data) as
      | MerchantDashboardKpiRpcRow
      | null;

    if (!snapshot) {
      throw new Error(`Merchant dashboard KPI snapshot for ${storeId} was empty.`);
    }

    return {
      activeOrderCount: snapshot.active_order_count ?? 0,
      readyOrderCount: snapshot.ready_order_count ?? 0,
      grossRevenueCentavos: snapshot.gross_revenue_centavos ?? 0,
      nonCancelledOrderCount: snapshot.non_cancelled_order_count ?? 0,
      reviewCount: snapshot.review_count ?? 0,
    };
  }

  private async getPendingReviewCount(storeId: string): Promise<number> {
    const supabase = await this.createRuntimeSupabaseClient();
    const { count, error } = await supabase
      .from("customer_reviews")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .is("response_text", null);

    if (error) {
      throw new Error(error.message);
    }

    return count ?? 0;
  }

  async getStoreShellSnapshot(storeId: string): Promise<MerchantStoreShellSnapshot> {
    const [storeRow, kpiSnapshot, pendingReviewCount] = await Promise.all([
      this.readPersistedStore(storeId),
      this.getDashboardKpiSnapshot(storeId),
      this.getPendingReviewCount(storeId),
    ]);

    return {
      storeName: storeRow.name,
      activeOrderCount: kpiSnapshot.activeOrderCount,
      pendingReviewCount,
    };
  }

  async getDashboardData(storeId: string): Promise<DashboardData> {
    // P1: Use exact KPI snapshot RPC instead of deriving from bounded slices.
    const [kpiSnapshot, ordersData, reviewsData, menuData] = await Promise.all([
      this.getDashboardKpiSnapshot(storeId),
      this.getOrdersData({
        storeId,
        limit: MERCHANT_DASHBOARD_ORDER_LIMIT,
      }),
      this.getReviewsData({
        storeId,
        limit: MERCHANT_DASHBOARD_REVIEW_LIMIT,
      }),
      this.getMenuData(storeId),
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

      if (kpi.label === "Avg Prep Time") {
        return {
          ...kpi,
          value: ordersData.store.avgPrepTime,
          trend: "Current store default",
          trendDirection: "neutral" as const,
        };
      }

      if (kpi.label === "Today's Rating") {
        return {
          ...kpi,
          value: ordersData.store.rating.toFixed(1),
          trend: `${ordersData.store.reviewCount} review${ordersData.store.reviewCount === 1 ? "" : "s"}`,
          trendDirection: "neutral" as const,
        };
      }

      return kpi;
    });
    const visibleMenuItemCount = menuData.items.filter((item) => item.available).length;
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
      ...(visibleMenuItemCount > 0
        ? [
            {
              id: "merchant-visible-menu-items-persisted",
              type: "success" as const,
              message: `${visibleMenuItemCount} menu item${visibleMenuItemCount === 1 ? "" : "s"} visible to customers`,
              time: "",
            },
          ]
        : [
            {
              id: "merchant-no-visible-menu-items-persisted",
              type: "warning" as const,
              message: "No menu items are currently visible to customers",
              time: "",
            },
          ]),
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
    idempotencyKey: string;
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
        p_idempotency_key: input.idempotencyKey,
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

  async getMenuData(storeId: string): Promise<MenuData> {
    const supabase = await this.createRuntimeSupabaseClient();
    const [{ data, error }, store] = await Promise.all([
      supabase
        .from("store_menu_items")
        .select(`
          id,
          store_id,
          name,
          description,
          category,
          price_centavos,
          image_color_hex,
          image_storage_path,
          is_popular,
          is_available,
          sort_order
        `)
        .eq("store_id", storeId)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      this.readPersistedStore(storeId),
    ]);

    if (error) {
      throw new Error(error.message);
    }

    const mapped = mapPersistedMenuItems(
      (data ?? []) as PersistedMenuItemRow[],
      (path) => supabase.storage.from("menu-item-images").getPublicUrl(path).data.publicUrl,
    );

    return {
      ...mapped,
      store: mapPersistedStore(store),
    };
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

    const { error: rpcError } = await supabase.rpc(
      "respond_to_customer_review_with_audit",
      {
        p_review_id: input.reviewId,
        p_store_id: input.storeId,
        p_response_text: normalizedResponse,
      },
    );

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    const { data: updatedRow, error } = await supabase
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
      .eq("id", input.reviewId)
      .eq("store_id", input.storeId)
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
  async getSettlementData(storeId: string): Promise<SettlementData> {
    const supabase = await this.createRuntimeSupabaseClient();
    const storePromise = this.readPersistedStore(storeId);
    const settlementsPromise = supabase
      .from("delivery_settlements")
      .select(`
        id,
        restaurant_id,
        period_start,
        period_end,
        gross_total,
        total_deductions,
        net_settlement,
        status,
        received_at
      `)
      .eq("restaurant_id", storeId)
      .order("period_start", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);

    const [storeRow, { data: settlements, error: settlementsError }] =
      await Promise.all([storePromise, settlementsPromise]);

    if (settlementsError) {
      throw new Error(settlementsError.message);
    }

    const settlementRows = (settlements ?? []) as PersistedSettlementRow[];
    const settlementIds = settlementRows.map((row) => row.id);

    let itemRows: PersistedSettlementItemRow[] = [];
    let linkedSalesRows: PersistedSettlementLinkedSaleRow[] = [];

    if (settlementIds.length > 0) {
      const [{ data: items, error: itemsError }, { data: linkedSales, error: linkedSalesError }] =
        await Promise.all([
          supabase
            .from("delivery_settlement_items")
            .select("settlement_id, item_type, amount")
            .in("settlement_id", settlementIds),
          supabase
            .from("external_sales")
            .select("settlement_id")
            .in("settlement_id", settlementIds),
        ]);

      if (itemsError) {
        throw new Error(itemsError.message);
      }
      if (linkedSalesError) {
        throw new Error(linkedSalesError.message);
      }

      itemRows = (items ?? []) as PersistedSettlementItemRow[];
      linkedSalesRows = (linkedSales ?? []) as PersistedSettlementLinkedSaleRow[];
    }

    const itemsBySettlementId = new Map<string, PersistedSettlementItemRow[]>();
    for (const item of itemRows) {
      const existing = itemsBySettlementId.get(item.settlement_id) ?? [];
      existing.push(item);
      itemsBySettlementId.set(item.settlement_id, existing);
    }

    const orderCountsBySettlementId = new Map<string, number>();
    for (const row of linkedSalesRows) {
      if (!row.settlement_id) continue;
      orderCountsBySettlementId.set(
        row.settlement_id,
        (orderCountsBySettlementId.get(row.settlement_id) ?? 0) + 1,
      );
    }

    return {
      records: settlementRows.map((row) => {
        const items = itemsBySettlementId.get(row.id) ?? [];
        const commission = items
          .filter((item) => item.item_type === "platform_commission")
          .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
        const nonCommissionDeductions = items
          .filter((item) => item.item_type !== "platform_commission")
          .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

        return {
          id: row.id,
          periodStart: row.period_start,
          periodEnd: row.period_end,
          orderCount: orderCountsBySettlementId.get(row.id) ?? 0,
          grossAmount: row.gross_total,
          commission,
          adjustments: nonCommissionDeductions === 0 ? 0 : -nonCommissionDeductions,
          netAmount: row.net_settlement,
          status: row.status,
          receivedAt: row.received_at ?? undefined,
        };
      }),
      store: mapPersistedStore(storeRow),
    };
  }
  async getAnalyticsData(storeId: string): Promise<AnalyticsData> {
    const [ordersData, reviewsData, menuData] = await Promise.all([
      this.getOrdersData({
        storeId,
        limit: 200,
      }),
      this.getReviewsData({
        storeId,
        limit: 100,
      }),
      this.getMenuData(storeId),
    ]);

    const visibleMenuItemCount = menuData.items.filter((item) => item.available).length;

    return {
      metrics: buildRuntimeAnalyticsMetrics({
        orders: ordersData.orders,
        reviews: reviewsData.reviews,
        menuItemCount: menuData.items.length,
        visibleMenuItemCount,
        avgPrepTime: ordersData.store.avgPrepTime,
      }),
      topItems: buildTopSellingItems(ordersData.orders),
      dailyRevenue: buildRecentDailyRevenue(ordersData.orders),
      store: ordersData.store,
    };
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

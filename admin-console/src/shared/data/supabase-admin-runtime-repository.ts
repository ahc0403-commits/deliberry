import "server-only";

import type {
  CustomerServiceData,
  DashboardData,
  DisputesData,
  FinanceData,
  MerchantsData,
  OrdersData,
  SettlementsData,
  StoresData,
  UsersData,
} from "./admin-repository";
import type {
  FinanceSummary,
  PlatformDispute,
  PlatformMerchant,
  PlatformOrder,
  PlatformSettlement,
  PlatformStore,
  SupportTicket,
  PlatformUser,
} from "./admin-mock-data";
import type { MoneyAmount } from "../domain";
import { formatMoney } from "../domain";
import { createAdminServiceSupabaseClient } from "../supabase/client";

type ActorProfileRow = {
  id: string;
  actor_type: string;
  display_name: string;
  email: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
};

type AdminProfileRow = {
  actor_id: string;
  role: string;
};

type CustomerOrderSummaryRow = {
  customer_actor_id: string | null;
  status: PlatformOrder["status"];
  created_at: string;
};

type SupportTicketActorRow = {
  actor_id: string;
};

type DisputeCustomerRow = {
  customer_actor_id: string;
};

type StoreRow = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  status: "open" | "closed" | "paused" | null;
  rating: number | null;
  review_count: number | null;
  cuisine_type: string | null;
  delivery_radius: string | null;
  avg_prep_time: string | null;
  accepting_orders: boolean | null;
  is_open: boolean | null;
  merchant_actor_id: string;
  created_at: string;
  updated_at: string;
  merchant_profiles:
    | {
        merchant_name: string | null;
      }
    | {
        merchant_name: string | null;
      }[]
    | null;
};

type StoreOrderSummaryRow = {
  store_id: string | null;
  status: PlatformOrder["status"];
  created_at: string;
};

type StoreProvisionAuditRow = {
  resource_id: string;
  timestamp_utc: string;
};

type MerchantProfileRow = {
  user_id: string;
  merchant_name: string;
  onboarding_complete: boolean;
  created_at: string;
  actor_profiles:
    | {
        display_name: string | null;
        email: string | null;
        phone_number: string | null;
        updated_at: string;
      }
    | {
        display_name: string | null;
        email: string | null;
        phone_number: string | null;
        updated_at: string;
      }[]
    | null;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  customer_name: string | null;
  store_id: string;
  total_centavos: number;
  status: PlatformOrder["status"];
  payment_method: PlatformOrder["paymentMethod"];
  created_at: string;
  stores:
    | {
        name: string | null;
        merchant_profiles:
          | {
              merchant_name: string | null;
            }
          | {
              merchant_name: string | null;
            }[]
          | null;
      }
    | {
        name: string | null;
        merchant_profiles:
          | {
              merchant_name: string | null;
            }
          | {
              merchant_name: string | null;
            }[]
          | null;
      }[]
    | null;
};

type DisputeRow = {
  id: string;
  case_number: string;
  category: PlatformDispute["category"];
  priority: PlatformDispute["priority"];
  status: PlatformDispute["status"];
  description: string;
  amount_centavos: number;
  created_at: string;
  orders:
    | {
        order_number: string | null;
        customer_name: string | null;
        stores:
          | {
              name: string | null;
            }
          | {
              name: string | null;
            }[]
          | null;
      }
    | {
        order_number: string | null;
        customer_name: string | null;
        stores:
          | {
              name: string | null;
            }
          | {
              name: string | null;
            }[]
          | null;
      }[]
    | null;
};

type SupportTicketRow = {
  id: string;
  ticket_number: string;
  subject: string;
  category: SupportTicket["category"];
  priority: SupportTicket["priority"];
  status: SupportTicket["status"];
  assignee_name: string;
  created_at: string;
  updated_at: string;
  actor_profiles:
    | {
        display_name: string | null;
        email: string | null;
      }
    | {
        display_name: string | null;
        email: string | null;
      }[]
    | null;
};

export type AuditLogEntry = {
  id: string;
  actorId: string;
  actorType: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestampUtc: string;
};

type AuditLogRow = {
  id: string;
  actor_id: string;
  actor_type: string;
  action: string;
  resource_type: string;
  resource_id: string;
  timestamp_utc: string;
  actor_profiles:
    | {
        display_name: string | null;
      }
    | {
        display_name: string | null;
      }[]
    | null;
};

type SettlementRow = {
  id: string;
  restaurant_id: string;
  period_start: string;
  period_end: string;
  gross_total: number;
  total_deductions: number;
  net_settlement: number;
  status: PlatformSettlement["status"];
  received_at: string | null;
};

type SettlementItemRow = {
  settlement_id: string;
  item_type: string;
  amount: number;
};

type SettlementStoreLookupRow = {
  id: string;
  name: string;
  merchant_profiles:
    | {
        merchant_name: string | null;
      }
    | {
        merchant_name: string | null;
      }[]
    | null;
};

function countByUserId(rows: Array<{ customer_actor_id: string | null }>) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const actorId = row.customer_actor_id;
    if (actorId == null) continue;
    counts.set(actorId, (counts.get(actorId) ?? 0) + 1);
  }
  return counts;
}

function resolveMerchantName(
  merchantProfiles:
    | { merchant_name: string | null }
    | { merchant_name: string | null }[]
    | null,
): string {
  const row = Array.isArray(merchantProfiles)
    ? merchantProfiles[0]
    : merchantProfiles;
  return row?.merchant_name?.trim() || "Merchant";
}

function mapUserType(actorType: string): PlatformUser["type"] {
  switch (actorType) {
    case "merchant_owner":
    case "merchant_staff":
      return "merchant";
    case "admin":
      return "admin";
    default:
      return "customer";
  }
}

function mapUserStatus(actorType: string): PlatformUser["status"] {
  if (actorType == "system" || actorType == "guest") {
    return "pending";
  }
  return "active";
}

function mapStoreStatus(
  status: StoreRow["status"],
): PlatformStore["status"] {
  switch (status) {
    case "open":
    case "closed":
    case "paused":
      return status;
    default:
      return "under_review";
  }
}

export class SupabaseAdminRuntimeRepository {
  private async readPlatformSettlements(): Promise<PlatformSettlement[]> {
    const supabase = createAdminServiceSupabaseClient();
    const { data: settlements, error: settlementsError } = await supabase
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
      .order("period_start", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);

    if (settlementsError) {
      throw new Error(settlementsError.message);
    }

    const settlementRows = (settlements ?? []) as SettlementRow[];
    const storeIds = [...new Set(settlementRows.map((row) => row.restaurant_id))];
    const settlementIds = settlementRows.map((row) => row.id);

    let itemRows: SettlementItemRow[] = [];
    let stores: SettlementStoreLookupRow[] = [];

    if (settlementIds.length > 0) {
      const [{ data: items, error: itemsError }, { data: storeRows, error: storesError }] =
        await Promise.all([
          supabase
            .from("delivery_settlement_items")
            .select("settlement_id, item_type, amount")
            .in("settlement_id", settlementIds),
          supabase
            .from("stores")
            .select(`
              id,
              name,
              merchant_profiles!stores_merchant_actor_id_fkey (
                merchant_name
              )
            `)
            .in("id", storeIds),
        ]);

      if (itemsError) {
        throw new Error(itemsError.message);
      }
      if (storesError) {
        throw new Error(storesError.message);
      }

      itemRows = (items ?? []) as SettlementItemRow[];
      stores = (storeRows ?? []) as SettlementStoreLookupRow[];
    }

    const itemsBySettlementId = new Map<string, SettlementItemRow[]>();
    for (const item of itemRows) {
      const existing = itemsBySettlementId.get(item.settlement_id) ?? [];
      existing.push(item);
      itemsBySettlementId.set(item.settlement_id, existing);
    }

    const storesById = new Map<string, SettlementStoreLookupRow>();
    for (const store of stores) {
      storesById.set(store.id, store);
    }

    return settlementRows.map((row) => {
      const items = itemsBySettlementId.get(row.id) ?? [];
      const commission = items
        .filter((item) => item.item_type === "platform_commission")
        .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
      const store = storesById.get(row.restaurant_id);

      return {
        id: row.id,
        merchantName: resolveMerchantName(store?.merchant_profiles ?? null),
        storeName: store?.name?.trim() || row.restaurant_id,
        periodStart: row.period_start,
        periodEnd: row.period_end,
        grossAmount: row.gross_total,
        commission,
        netAmount: row.net_settlement,
        status: row.status,
        receivedAt: row.received_at ?? undefined,
      };
    });
  }

  async getDashboardData(): Promise<DashboardData> {
    const supabase = createAdminServiceSupabaseClient();
    const ordersPromise = this.getOrdersData();

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const startOfLocalDay = new Date();
    startOfLocalDay.setHours(0, 0, 0, 0);
    const startOfDayIso = startOfLocalDay.toISOString();

    const [
      { count: totalUsersCount, error: totalUsersError },
      { count: merchantCount, error: merchantCountError },
      { count: todayOrdersCount, error: todayOrdersError },
      { data: revenueRows, error: revenueError },
      { count: disputeCount, error: disputeCountError },
      { data: storeRatings, error: storeRatingsError },
      ordersData,
    ] = await Promise.all([
      supabase
        .from("actor_profiles")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("merchant_profiles")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDayIso),
      supabase
        .from("orders")
        .select("total_centavos, status")
        .neq("status", "cancelled"),
      supabase
        .from("disputes")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("stores")
        .select("rating")
        .not("rating", "is", null),
      ordersPromise,
    ]);

    if (totalUsersError) {
      throw new Error(totalUsersError.message);
    }
    if (merchantCountError) {
      throw new Error(merchantCountError.message);
    }
    if (todayOrdersError) {
      throw new Error(todayOrdersError.message);
    }
    if (revenueError) {
      throw new Error(revenueError.message);
    }
    if (disputeCountError) {
      throw new Error(disputeCountError.message);
    }
    if (storeRatingsError) {
      throw new Error(storeRatingsError.message);
    }

    const recentOrders = ordersData.orders.slice(0, 5);
    const activeOrderCount = ordersData.orders.filter((order) =>
      ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status),
    ).length;
    const pendingOrderCount = ordersData.orders.filter((order) => order.status === "pending").length;
    const cancelledOrderCount = ordersData.orders.filter((order) => order.status === "cancelled").length;
    const grossRevenueCentavos = ((revenueRows ?? []) as Array<{ total_centavos: number; status: string }>)
      .reduce((sum, row) => sum + (row.total_centavos ?? 0), 0);
    const averageRating = ((storeRatings ?? []) as Array<{ rating: number | null }>)
      .reduce((sum, row) => sum + (row.rating ?? 0), 0);
    const averageRatingCount = (storeRatings ?? []).length;

    const kpis = [
      {
        label: "Total Users",
        value: String(totalUsersCount ?? 0),
        change: "Live count",
        changeDirection: "neutral" as const,
        category: "primary" as const,
      },
      {
        label: "Active Merchants",
        value: String(merchantCount ?? 0),
        change: "Runtime-backed",
        changeDirection: "neutral" as const,
        category: "success" as const,
      },
      {
        label: "Orders Today",
        value: String(todayOrdersCount ?? 0),
        change: `${localTimeZone} day window`,
        changeDirection: "neutral" as const,
        category: "info" as const,
      },
      {
        label: "Platform Revenue",
        value: formatMoney(grossRevenueCentavos as MoneyAmount),
        change: "Non-cancelled total",
        changeDirection: "neutral" as const,
        category: "success" as const,
      },
      {
        label: "Open Disputes",
        value: String(disputeCount ?? 0),
        change: "Runtime-backed",
        changeDirection: "neutral" as const,
        category: "warning" as const,
      },
      {
        label: "Avg Rating",
        value: averageRatingCount > 0 ? (averageRating / averageRatingCount).toFixed(1) : "—",
        change: "Store average",
        changeDirection: "neutral" as const,
        category: "info" as const,
      },
    ];

    const alerts = [
      ...(disputeCount && disputeCount > 0
        ? [{
            id: "platform-live-disputes",
            type: "critical" as const,
            message: `${disputeCount} dispute${disputeCount === 1 ? "" : "s"} currently require oversight`,
            time: recentOrders[0]?.createdAt ?? startOfDayIso,
            source: "Disputes",
          }]
        : []),
      ...(pendingOrderCount > 0
        ? [{
            id: "platform-live-pending-orders",
            type: "warning" as const,
            message: `${pendingOrderCount} pending order${pendingOrderCount === 1 ? "" : "s"} awaiting merchant response`,
            time: recentOrders.find((order) => order.status === "pending")?.createdAt ?? startOfDayIso,
            source: "Orders",
          }]
        : []),
      ...(cancelledOrderCount > 0
        ? [{
            id: "platform-live-cancelled-orders",
            type: "warning" as const,
            message: `${cancelledOrderCount} cancelled order${cancelledOrderCount === 1 ? "" : "s"} remain visible for governance review`,
            time: recentOrders.find((order) => order.status === "cancelled")?.createdAt ?? startOfDayIso,
            source: "Orders",
          }]
        : []),
      ...(recentOrders[0]
        ? [{
            id: "platform-live-latest-order",
            type: "info" as const,
            message: `Latest runtime order ${recentOrders[0].orderNumber} from ${recentOrders[0].storeName}`,
            time: recentOrders[0].createdAt,
            source: "Runtime",
          }]
        : []),
      ...(activeOrderCount > 0
        ? [{
            id: "platform-live-active-queue",
            type: "info" as const,
            message: `${activeOrderCount} active order${activeOrderCount === 1 ? "" : "s"} currently sit in the admin oversight queue`,
            time: recentOrders[0]?.createdAt ?? startOfDayIso,
            source: "Orders",
          }]
        : []),
    ].slice(0, 5);

    return {
      activeOrderCount,
      kpis,
      alerts,
      recentOrders,
    };
  }

  async getUsersData(): Promise<UsersData> {
    const supabase = createAdminServiceSupabaseClient();
    const [
      { data: profiles, error: profilesError },
      { data: orderRows, error: orderError },
      { data: adminProfiles, error: adminProfilesError },
      { data: merchantProfiles, error: merchantProfilesError },
      { data: stores, error: storesError },
      { data: supportTickets, error: supportTicketsError },
      { data: disputes, error: disputesError },
    ] =
      await Promise.all([
        supabase
          .from("actor_profiles")
          .select("id, actor_type, display_name, email, phone_number, created_at, updated_at")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("customer_actor_id, status, created_at"),
        supabase.from("admin_profiles").select("actor_id, role"),
        supabase.from("merchant_profiles").select("user_id"),
        supabase.from("stores").select("merchant_actor_id"),
        supabase.from("support_tickets").select("actor_id"),
        supabase.from("disputes").select("customer_actor_id"),
      ]);

    if (profilesError) {
      throw new Error(profilesError.message);
    }
    if (orderError) {
      throw new Error(orderError.message);
    }
    if (adminProfilesError) {
      throw new Error(adminProfilesError.message);
    }
    if (merchantProfilesError) {
      throw new Error(merchantProfilesError.message);
    }
    if (storesError) {
      throw new Error(storesError.message);
    }
    if (supportTicketsError) {
      throw new Error(supportTicketsError.message);
    }
    if (disputesError) {
      throw new Error(disputesError.message);
    }

    const orderCounts = countByUserId((orderRows ?? []) as CustomerOrderSummaryRow[]);
    const activeOrderCounts = new Map<string, number>();
    const lastOrderByUser = new Map<string, string>();
    for (const row of (orderRows ?? []) as CustomerOrderSummaryRow[]) {
      if (!row.customer_actor_id) continue;
      if (["pending", "confirmed", "preparing", "ready", "in_transit"].includes(row.status)) {
        activeOrderCounts.set(
          row.customer_actor_id,
          (activeOrderCounts.get(row.customer_actor_id) ?? 0) + 1,
        );
      }
      const currentLastOrder = lastOrderByUser.get(row.customer_actor_id);
      if (!currentLastOrder || row.created_at > currentLastOrder) {
        lastOrderByUser.set(row.customer_actor_id, row.created_at);
      }
    }

    const adminRoleById = new Map<string, string>();
    for (const row of (adminProfiles ?? []) as AdminProfileRow[]) {
      adminRoleById.set(row.actor_id, row.role);
    }

    const merchantProfileIds = new Set(
      ((merchantProfiles ?? []) as Array<{ user_id: string }>).map((row) => row.user_id),
    );
    const storeCountByMerchant = new Map<string, number>();
    for (const row of (stores ?? []) as Array<{ merchant_actor_id: string | null }>) {
      if (!row.merchant_actor_id) continue;
      storeCountByMerchant.set(
        row.merchant_actor_id,
        (storeCountByMerchant.get(row.merchant_actor_id) ?? 0) + 1,
      );
    }

    const supportTicketCounts = new Map<string, number>();
    for (const row of (supportTickets ?? []) as SupportTicketActorRow[]) {
      supportTicketCounts.set(row.actor_id, (supportTicketCounts.get(row.actor_id) ?? 0) + 1);
    }

    const disputeCounts = new Map<string, number>();
    for (const row of (disputes ?? []) as DisputeCustomerRow[]) {
      disputeCounts.set(
        row.customer_actor_id,
        (disputeCounts.get(row.customer_actor_id) ?? 0) + 1,
      );
    }

    const users: PlatformUser[] = ((profiles ?? []) as ActorProfileRow[]).map(
      (profile) => ({
        id: profile.id,
        name: profile.display_name,
        email: profile.email ?? "Email unavailable",
        phoneNumber: profile.phone_number,
        actorType: profile.actor_type,
        type: mapUserType(profile.actor_type),
        status: mapUserStatus(profile.actor_type),
        registeredAt: profile.created_at,
        lastActive: profile.updated_at,
        ordersCount: orderCounts.get(profile.id) ?? 0,
        activeOrders: activeOrderCounts.get(profile.id) ?? 0,
        disputedOrders: disputeCounts.get(profile.id) ?? 0,
        supportTickets: supportTicketCounts.get(profile.id) ?? 0,
        storeCount: merchantProfileIds.has(profile.id)
          ? (storeCountByMerchant.get(profile.id) ?? 0)
          : undefined,
        adminRole: adminRoleById.get(profile.id) ?? null,
        lastOrderAt: lastOrderByUser.get(profile.id) ?? null,
      }),
    );

    return { users };
  }

  async getMerchantsData(): Promise<MerchantsData> {
    const supabase = createAdminServiceSupabaseClient();
    const [
      { data: merchants, error: merchantsError },
      { data: stores, error: storesError },
      { data: orders, error: ordersError },
      { data: auditRows, error: auditError },
    ] =
      await Promise.all([
        supabase
          .from("merchant_profiles")
          .select(`
            user_id,
            merchant_name,
            onboarding_complete,
            created_at,
            actor_profiles (
              display_name,
              email,
              phone_number,
              updated_at
            )
          `)
          .order("created_at", { ascending: false }),
        supabase.from("stores").select("id, merchant_actor_id, status, updated_at, created_at"),
        supabase
          .from("orders")
          .select("store_id, total_centavos, status, created_at")
          .neq("status", "cancelled"),
        supabase
          .from("audit_logs")
          .select("resource_id, timestamp_utc")
          .eq("resource_type", "Store")
          .eq("action", "admin_merchant_store_provisioned"),
      ]);

    if (merchantsError) {
      throw new Error(merchantsError.message);
    }
    if (storesError) {
      throw new Error(storesError.message);
    }
    if (ordersError) {
      throw new Error(ordersError.message);
    }
    if (auditError) {
      throw new Error(auditError.message);
    }

    const storeCountByMerchant = new Map<string, number>();
    const storeOwnerByStoreId = new Map<string, string>();
    const activeStoreCountByMerchant = new Map<string, number>();
    const pausedStoreCountByMerchant = new Map<string, number>();
    const reviewStoreCountByMerchant = new Map<string, number>();
    const latestStoreActivityByMerchant = new Map<string, string>();
    const storeMerchantById = new Map<string, string>();
    for (const store of (stores ?? []) as Array<{
      id: string;
      merchant_actor_id: string;
      status: string | null;
      updated_at: string;
      created_at: string;
    }>) {
      storeCountByMerchant.set(
        store.merchant_actor_id,
        (storeCountByMerchant.get(store.merchant_actor_id) ?? 0) + 1,
      );
      storeOwnerByStoreId.set(store.id, store.merchant_actor_id);
      storeMerchantById.set(store.id, store.merchant_actor_id);
      if (store.status === "open") {
        activeStoreCountByMerchant.set(
          store.merchant_actor_id,
          (activeStoreCountByMerchant.get(store.merchant_actor_id) ?? 0) + 1,
        );
      }
      if (store.status === "paused") {
        pausedStoreCountByMerchant.set(
          store.merchant_actor_id,
          (pausedStoreCountByMerchant.get(store.merchant_actor_id) ?? 0) + 1,
        );
      }
      if (store.status !== "open" && store.status !== "closed" && store.status !== "paused") {
        reviewStoreCountByMerchant.set(
          store.merchant_actor_id,
          (reviewStoreCountByMerchant.get(store.merchant_actor_id) ?? 0) + 1,
        );
      }
      const currentLatestStoreActivity = latestStoreActivityByMerchant.get(store.merchant_actor_id);
      if (!currentLatestStoreActivity || store.updated_at > currentLatestStoreActivity) {
        latestStoreActivityByMerchant.set(store.merchant_actor_id, store.updated_at);
      }
    }

    const revenueByMerchant = new Map<string, number>();
    const activeOrdersByMerchant = new Map<string, number>();
    const exceptionOrdersByMerchant = new Map<string, number>();
    for (const order of (orders ?? []) as Array<{
      store_id: string | null;
      total_centavos: number | null;
      status: PlatformOrder["status"];
      created_at: string;
    }>) {
      const merchantId = order.store_id ? storeOwnerByStoreId.get(order.store_id) : null;
      if (!merchantId) continue;
      revenueByMerchant.set(
        merchantId,
        (revenueByMerchant.get(merchantId) ?? 0) + (order.total_centavos ?? 0),
      );
      if (["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status)) {
        activeOrdersByMerchant.set(
          merchantId,
          (activeOrdersByMerchant.get(merchantId) ?? 0) + 1,
        );
      }
      if (["cancelled", "disputed"].includes(order.status)) {
        exceptionOrdersByMerchant.set(
          merchantId,
          (exceptionOrdersByMerchant.get(merchantId) ?? 0) + 1,
        );
      }
      const currentLatestStoreActivity = latestStoreActivityByMerchant.get(merchantId);
      if (!currentLatestStoreActivity || order.created_at > currentLatestStoreActivity) {
        latestStoreActivityByMerchant.set(merchantId, order.created_at);
      }
    }

    const latestProvisionedAtByMerchant = new Map<string, string>();
    for (const row of (auditRows ?? []) as StoreProvisionAuditRow[]) {
      const merchantId = storeMerchantById.get(row.resource_id);
      if (!merchantId) continue;
      const currentLatestProvisionedAt = latestProvisionedAtByMerchant.get(merchantId);
      if (!currentLatestProvisionedAt || row.timestamp_utc > currentLatestProvisionedAt) {
        latestProvisionedAtByMerchant.set(merchantId, row.timestamp_utc);
      }
    }

    const mappedMerchants: PlatformMerchant[] = ((merchants ?? []) as MerchantProfileRow[]).map(
      (merchant) => {
        const actor = Array.isArray(merchant.actor_profiles)
          ? merchant.actor_profiles[0]
          : merchant.actor_profiles;
        return {
          id: merchant.user_id,
          businessName: merchant.merchant_name,
          ownerName: actor?.display_name?.trim() || "Merchant owner",
          email: actor?.email?.trim() || "Email unavailable",
          phoneNumber: actor?.phone_number?.trim() || null,
          storeCount: storeCountByMerchant.get(merchant.user_id) ?? 0,
          status: merchant.onboarding_complete ? "active" : "pending_review",
          compliance:
            (reviewStoreCountByMerchant.get(merchant.user_id) ?? 0) > 0
              ? "review_needed"
              : merchant.onboarding_complete
                ? "compliant"
                : "review_needed",
          joinedAt: merchant.created_at,
          totalRevenue: revenueByMerchant.get(merchant.user_id) ?? 0,
          lastActive: actor?.updated_at ?? null,
          activeStoreCount: activeStoreCountByMerchant.get(merchant.user_id) ?? 0,
          pausedStoreCount: pausedStoreCountByMerchant.get(merchant.user_id) ?? 0,
          reviewStoreCount: reviewStoreCountByMerchant.get(merchant.user_id) ?? 0,
          activeOrders: activeOrdersByMerchant.get(merchant.user_id) ?? 0,
          exceptionOrders: exceptionOrdersByMerchant.get(merchant.user_id) ?? 0,
          latestStoreActivity: latestStoreActivityByMerchant.get(merchant.user_id) ?? null,
          latestProvisionedAt: latestProvisionedAtByMerchant.get(merchant.user_id) ?? null,
        };
      },
    );

    return { merchants: mappedMerchants };
  }

  async getStoresData(): Promise<StoresData> {
    const supabase = createAdminServiceSupabaseClient();
    const [
      { data: stores, error: storesError },
      { data: orders, error: ordersError },
      { data: auditRows, error: auditError },
    ] =
      await Promise.all([
        supabase
          .from("stores")
          .select(`
            id,
            name,
            address,
            city,
            phone,
            email,
            status,
            rating,
            review_count,
            cuisine_type,
            delivery_radius,
            avg_prep_time,
            accepting_orders,
            is_open,
            merchant_actor_id,
            created_at,
            updated_at,
            merchant_profiles!stores_merchant_actor_id_fkey (
              merchant_name
            )
          `)
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("store_id, status, created_at"),
        supabase
          .from("audit_logs")
          .select("resource_id, timestamp_utc")
          .eq("resource_type", "Store")
          .eq("action", "admin_merchant_store_provisioned"),
      ]);

    if (storesError) {
      throw new Error(storesError.message);
    }
    if (ordersError) {
      throw new Error(ordersError.message);
    }
    if (auditError) {
      throw new Error(auditError.message);
    }

    const orderCounts = new Map<string, number>();
    const activeOrderCounts = new Map<string, number>();
    const completedOrderCounts = new Map<string, number>();
    const exceptionOrderCounts = new Map<string, number>();
    const latestOrderByStore = new Map<string, string>();
    for (const row of (orders ?? []) as StoreOrderSummaryRow[]) {
      if (!row.store_id) continue;
      orderCounts.set(row.store_id, (orderCounts.get(row.store_id) ?? 0) + 1);
      if (["pending", "confirmed", "preparing", "ready", "in_transit"].includes(row.status)) {
        activeOrderCounts.set(row.store_id, (activeOrderCounts.get(row.store_id) ?? 0) + 1);
      }
      if (row.status === "delivered") {
        completedOrderCounts.set(row.store_id, (completedOrderCounts.get(row.store_id) ?? 0) + 1);
      }
      if (["cancelled", "disputed"].includes(row.status)) {
        exceptionOrderCounts.set(row.store_id, (exceptionOrderCounts.get(row.store_id) ?? 0) + 1);
      }
      const currentLatest = latestOrderByStore.get(row.store_id);
      if (!currentLatest || row.created_at > currentLatest) {
        latestOrderByStore.set(row.store_id, row.created_at);
      }
    }

    const provisionedAtByStore = new Map<string, string>();
    for (const row of (auditRows ?? []) as StoreProvisionAuditRow[]) {
      const currentProvisionedAt = provisionedAtByStore.get(row.resource_id);
      if (!currentProvisionedAt || row.timestamp_utc > currentProvisionedAt) {
        provisionedAtByStore.set(row.resource_id, row.timestamp_utc);
      }
    }

    const mappedStores: PlatformStore[] = ((stores ?? []) as StoreRow[]).map(
      (store) => ({
        id: store.id,
        name: store.name,
        merchantName: resolveMerchantName(store.merchant_profiles),
        address: store.address ?? "Address unavailable",
        city: store.city ?? null,
        phone: store.phone,
        email: store.email,
        status: mapStoreStatus(store.status),
        rating: store.rating ?? 0,
        totalOrders: orderCounts.get(store.id) ?? 0,
        reviewCount: store.review_count ?? 0,
        cuisineType: store.cuisine_type,
        deliveryRadius: store.delivery_radius,
        avgPrepTime: store.avg_prep_time,
        acceptingOrders: store.accepting_orders ?? false,
        isOpen: store.is_open ?? false,
        createdAt: store.created_at,
        activeOrders: activeOrderCounts.get(store.id) ?? 0,
        completedOrders: completedOrderCounts.get(store.id) ?? 0,
        exceptionOrders: exceptionOrderCounts.get(store.id) ?? 0,
        latestOrderAt: latestOrderByStore.get(store.id) ?? null,
        provisionedAt: provisionedAtByStore.get(store.id) ?? null,
        lastActive: store.updated_at,
      }),
    );

    return { stores: mappedStores };
  }

  async getOrdersData(): Promise<OrdersData> {
    const supabase = createAdminServiceSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        store_id,
        total_centavos,
        status,
        payment_method,
        created_at,
        stores!orders_store_id_fkey (
          name,
          merchant_profiles!stores_merchant_actor_id_fkey (
            merchant_name
          )
        )
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(error.message);
    }

    const orders: PlatformOrder[] = ((data ?? []) as OrderRow[]).map((row) => {
      const store = Array.isArray(row.stores) ? row.stores[0] : row.stores;
      const merchantName = resolveMerchantName(store?.merchant_profiles ?? null);

      return {
        id: row.id,
        orderNumber: row.order_number?.trim() || row.id,
        customerName: row.customer_name?.trim() || "Customer",
        storeName: store?.name?.trim() || row.store_id,
        merchantName,
        total: row.total_centavos as MoneyAmount,
        status: row.status,
        createdAt: row.created_at,
        paymentMethod: row.payment_method,
      };
    });

    return { orders };
  }

  async getSettlementsData(): Promise<SettlementsData> {
    return {
      settlements: await this.readPlatformSettlements(),
    };
  }

  async getFinanceData(): Promise<FinanceData> {
    const settlements = await this.readPlatformSettlements();
    const grossTotal = settlements.reduce((sum, settlement) => sum + settlement.grossAmount, 0);
    const commissionTotal = settlements.reduce((sum, settlement) => sum + settlement.commission, 0);
    const netTotal = settlements.reduce((sum, settlement) => sum + settlement.netAmount, 0);
    const openValue = settlements
      .filter((settlement) => settlement.status !== "received")
      .reduce((sum, settlement) => sum + settlement.netAmount, 0);
    const disputedOrAdjustedValue = settlements
      .filter((settlement) =>
        settlement.status === "disputed" || settlement.status === "adjusted")
      .reduce((sum, settlement) => sum + settlement.netAmount, 0);
    const receivedValue = settlements
      .filter((settlement) => settlement.status === "received")
      .reduce((sum, settlement) => sum + settlement.netAmount, 0);

    const summary: FinanceSummary[] = [
      { label: "Gross Settlement Volume", value: formatMoney(grossTotal as MoneyAmount), period: "Current visible periods" },
      { label: "Total Commission Recorded", value: formatMoney(commissionTotal as MoneyAmount), period: "Current visible periods" },
      { label: "Open Settlement Value", value: formatMoney(openValue as MoneyAmount), period: "Not yet received" },
      { label: "Disputed / Adjusted Value", value: formatMoney(disputedOrAdjustedValue as MoneyAmount), period: "Needs finance review" },
      { label: "Received Settlement Value", value: formatMoney(receivedValue as MoneyAmount), period: "Marked received" },
      { label: "Net Merchant Payout", value: formatMoney(netTotal as MoneyAmount), period: "Current visible periods" },
    ];

    return {
      summary,
      settlements,
    };
  }

  async getDisputesData(): Promise<DisputesData> {
    const supabase = createAdminServiceSupabaseClient();
    const { data, error } = await supabase
      .from("disputes")
      .select(`
        id,
        case_number,
        category,
        priority,
        status,
        description,
        amount_centavos,
        created_at,
        orders!disputes_order_id_fkey (
          order_number,
          customer_name,
          stores!orders_store_id_fkey (
            name
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const disputes: PlatformDispute[] = ((data ?? []) as DisputeRow[]).map(
      (row) => {
        const order = Array.isArray(row.orders) ? row.orders[0] : row.orders;
        const store = Array.isArray(order?.stores) ? order.stores[0] : order?.stores;

        return {
          id: row.id,
          caseNumber: row.case_number,
          customerName: order?.customer_name?.trim() || "Customer",
          storeName: store?.name?.trim() || "Store",
          orderId: order?.order_number?.trim() || row.id,
          category: row.category,
          priority: row.priority,
          status: row.status,
          createdAt: row.created_at,
          description: row.description,
          amount: row.amount_centavos as MoneyAmount,
        };
      },
    );

    return { disputes };
  }

  async getCustomerServiceData(): Promise<CustomerServiceData> {
    const supabase = createAdminServiceSupabaseClient();
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        id,
        ticket_number,
        subject,
        category,
        priority,
        status,
        assignee_name,
        created_at,
        updated_at,
        actor_profiles!support_tickets_actor_id_fkey (
          display_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const tickets: SupportTicket[] = ((data ?? []) as SupportTicketRow[]).map(
      (row) => {
        const actor = Array.isArray(row.actor_profiles)
          ? row.actor_profiles[0]
          : row.actor_profiles;

        return {
          id: row.id,
          ticketNumber: row.ticket_number,
          customerName: actor?.display_name?.trim() || "Customer",
          customerEmail: actor?.email?.trim() || null,
          subject: row.subject,
          category: row.category,
          priority: row.priority,
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          assignee: row.assignee_name,
        };
      },
    );

    return { tickets };
  }

  async getAuditLogEntries(limit = 12): Promise<AuditLogEntry[]> {
    const supabase = createAdminServiceSupabaseClient();
    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        id,
        actor_id,
        actor_type,
        action,
        resource_type,
        resource_id,
        timestamp_utc,
        actor_profiles!audit_logs_actor_id_fkey (
          display_name
        )
      `)
      .order("timestamp_utc", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return ((data ?? []) as AuditLogRow[]).map((row) => {
      const actor = Array.isArray(row.actor_profiles)
        ? row.actor_profiles[0]
        : row.actor_profiles;

      return {
        id: row.id,
        actorId: row.actor_id,
        actorType: row.actor_type,
        actorName: actor?.display_name?.trim() || "Unknown actor",
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        timestampUtc: row.timestamp_utc,
      };
    });
  }
}

export const supabaseAdminRuntimeRepository =
  new SupabaseAdminRuntimeRepository();

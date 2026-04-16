import "server-only";

import type {
  CustomerServiceData,
  DisputesData,
  OrdersData,
  StoresData,
  UsersData,
} from "./admin-repository";
import type {
  PlatformDispute,
  PlatformOrder,
  PlatformStore,
  SupportTicket,
  PlatformUser,
} from "./admin-mock-data";
import type { MoneyAmount } from "../domain";
import { createAdminServiceSupabaseClient } from "../supabase/client";

type ActorProfileRow = {
  id: string;
  actor_type: string;
  display_name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
};

type StoreRow = {
  id: string;
  name: string;
  address: string | null;
  status: "open" | "closed" | "paused" | null;
  rating: number | null;
  merchant_actor_id: string;
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
  actor_profiles:
    | {
        display_name: string | null;
      }
    | {
        display_name: string | null;
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
  async getUsersData(): Promise<UsersData> {
    const supabase = createAdminServiceSupabaseClient();
    const [{ data: profiles, error: profilesError }, { data: orderRows, error: orderError }] =
      await Promise.all([
        supabase
          .from("actor_profiles")
          .select("id, actor_type, display_name, email, created_at, updated_at")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("customer_actor_id"),
      ]);

    if (profilesError) {
      throw new Error(profilesError.message);
    }
    if (orderError) {
      throw new Error(orderError.message);
    }

    const orderCounts = countByUserId(
      (orderRows ?? []) as Array<{ customer_actor_id: string | null }>,
    );

    const users: PlatformUser[] = ((profiles ?? []) as ActorProfileRow[]).map(
      (profile) => ({
        id: profile.id,
        name: profile.display_name,
        email: profile.email ?? "Email unavailable",
        type: mapUserType(profile.actor_type),
        status: mapUserStatus(profile.actor_type),
        registeredAt: profile.created_at,
        lastActive: profile.updated_at,
        ordersCount: orderCounts.get(profile.id) ?? 0,
      }),
    );

    return { users };
  }

  async getStoresData(): Promise<StoresData> {
    const supabase = createAdminServiceSupabaseClient();
    const [{ data: stores, error: storesError }, { data: orders, error: ordersError }] =
      await Promise.all([
        supabase
          .from("stores")
          .select(`
            id,
            name,
            address,
            status,
            rating,
            merchant_actor_id,
            updated_at,
            merchant_profiles!stores_merchant_actor_id_fkey (
              merchant_name
            )
          `)
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("store_id"),
      ]);

    if (storesError) {
      throw new Error(storesError.message);
    }
    if (ordersError) {
      throw new Error(ordersError.message);
    }

    const orderCounts = new Map<string, number>();
    for (const row of (orders ?? []) as Array<{ store_id: string | null }>) {
      if (!row.store_id) continue;
      orderCounts.set(row.store_id, (orderCounts.get(row.store_id) ?? 0) + 1);
    }

    const mappedStores: PlatformStore[] = ((stores ?? []) as StoreRow[]).map(
      (store) => ({
        id: store.id,
        name: store.name,
        merchantName: resolveMerchantName(store.merchant_profiles),
        address: store.address ?? "Address unavailable",
        status: mapStoreStatus(store.status),
        rating: store.rating ?? 0,
        totalOrders: orderCounts.get(store.id) ?? 0,
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
        actor_profiles!support_tickets_actor_id_fkey (
          display_name
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
          subject: row.subject,
          category: row.category,
          priority: row.priority,
          status: row.status,
          createdAt: row.created_at,
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

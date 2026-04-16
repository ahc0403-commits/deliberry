import type { SupabaseClient } from "@supabase/supabase-js";

import type { MerchantOrder } from "./merchant-mock-data";

type ExternalSalesOrderStatus =
  | "completed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

type ExternalSalesOrderInput = {
  storeId: string;
  order: MerchantOrder;
};

export class ExternalSalesService {
  constructor(private readonly client: SupabaseClient) {}

  async recordCompletedOrder(input: ExternalSalesOrderInput): Promise<void> {
    await this.record({
      ...input,
      externalOrderId: input.order.id,
      status: "completed",
      isRevenue: true,
      grossAmount: input.order.total,
      netAmount: input.order.total,
      payload: this.buildPayload(input.order),
    });
  }

  async recordCancelledOrder(input: ExternalSalesOrderInput): Promise<void> {
    await this.record({
      ...input,
      externalOrderId: `${input.order.id}-cancel`,
      status: "cancelled",
      isRevenue: false,
      grossAmount: input.order.total,
      netAmount: input.order.total,
      payload: {
        original_order_id: input.order.id,
        reason: "cancelled",
      },
    });
  }

  async recordRefundedOrder(
    input: ExternalSalesOrderInput & { refundAmount?: number },
  ): Promise<void> {
    const amount = input.refundAmount ?? input.order.total;
    const status: ExternalSalesOrderStatus =
      input.refundAmount != null && amount < input.order.total
        ? "partially_refunded"
        : "refunded";

    await this.record({
      ...input,
      externalOrderId: `${input.order.id}-refund`,
      status,
      isRevenue: false,
      grossAmount: amount,
      netAmount: amount,
      payload: {
        original_order_id: input.order.id,
        refund_amount: amount,
        reason: "refunded",
      },
    });
  }

  private async record(input: {
    storeId: string;
    order: MerchantOrder;
    externalOrderId: string;
    status: ExternalSalesOrderStatus;
    isRevenue: boolean;
    grossAmount: number;
    netAmount: number;
    payload: Record<string, unknown>;
  }): Promise<void> {
    try {
      await this.client.from("external_sales").insert({
        restaurant_id: input.storeId,
        source_system: "deliberry",
        external_order_id: input.externalOrderId,
        sales_channel: "delivery",
        gross_amount: input.grossAmount,
        discount_amount: 0,
        delivery_fee: input.order.deliveryFee,
        net_amount: input.netAmount,
        currency: "ARS",
        order_status: input.status,
        is_revenue: input.isRevenue,
        completed_at: new Date().toISOString(),
        payload: input.payload,
      });
    } catch (error) {
      // External sales logging must never break order state transitions.
      console.error("[ExternalSales] failed to record order event", {
        orderId: input.order.id,
        storeId: input.storeId,
        status: input.status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private buildPayload(order: MerchantOrder): Record<string, unknown> {
    return {
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      payment_method: order.paymentMethod,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }
}

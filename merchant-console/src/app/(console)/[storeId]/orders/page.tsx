import { MerchantOrdersScreen } from "../../../../features/orders/presentation/orders-screen";
import {
  buildMerchantProductTelemetryEvent,
  recordMerchantProductTelemetryEvent,
} from "../../../../shared/data/product-telemetry-service";
import { getMerchantOrdersRuntimeData } from "../../../../shared/data/merchant-order-runtime-service";

type MerchantOrdersPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantOrdersPage({
  params,
}: MerchantOrdersPageProps) {
  const { storeId } = await params;
  const result = await getMerchantOrdersRuntimeData(storeId);
  try {
    await recordMerchantProductTelemetryEvent(
      buildMerchantProductTelemetryEvent({
        surface: "merchant-console",
        eventName: "merchant.orders_viewed",
        outcome: "viewed",
        sessionMode: "merchant_session",
        actorType: "merchant_owner",
        storeId,
        itemCount: result.data.orders.length,
        source: result.source,
      }),
    );
  } catch {}

  const initialHasMore = result.data.orders.length >= 50;

  return (
    <MerchantOrdersScreen
      storeId={storeId}
      initialData={result.data}
      initialHasMore={initialHasMore}
    />
  );
}

import { MerchantDashboardScreen } from "../../../../features/dashboard/presentation/dashboard-screen";
import { getMerchantDashboardRuntimeData } from "../../../../shared/data/merchant-order-runtime-service";

type MerchantDashboardPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantDashboardPage({
  params,
}: MerchantDashboardPageProps) {
  const { storeId } = await params;
  const runtime = await getMerchantDashboardRuntimeData(storeId);

  return (
    <MerchantDashboardScreen
      storeId={storeId}
      data={runtime.data}
      source={runtime.source}
    />
  );
}

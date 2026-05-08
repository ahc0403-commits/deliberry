import { MerchantAnalyticsScreen } from "../../../../features/analytics/presentation/analytics-screen";
import { getMerchantAnalyticsRuntimeData } from "../../../../shared/data/merchant-analytics-runtime-service";

type MerchantAnalyticsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantAnalyticsPage({
  params,
}: MerchantAnalyticsPageProps) {
  const { storeId } = await params;
  const result = await getMerchantAnalyticsRuntimeData(storeId);

  return (
    <MerchantAnalyticsScreen
      initialData={result.data}
      source={result.source}
    />
  );
}

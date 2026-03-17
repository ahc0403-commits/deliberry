import { MerchantAnalyticsScreen } from "../../../../features/analytics/presentation/analytics-screen";

type MerchantAnalyticsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantAnalyticsPage({
  params,
}: MerchantAnalyticsPageProps) {
  const { storeId } = await params;

  return <MerchantAnalyticsScreen storeId={storeId} />;
}

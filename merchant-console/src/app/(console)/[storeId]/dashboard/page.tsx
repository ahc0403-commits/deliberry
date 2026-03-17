import { MerchantDashboardScreen } from "../../../../features/dashboard/presentation/dashboard-screen";

type MerchantDashboardPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantDashboardPage({
  params,
}: MerchantDashboardPageProps) {
  const { storeId } = await params;

  return <MerchantDashboardScreen storeId={storeId} />;
}

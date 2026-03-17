import { MerchantOrdersScreen } from "../../../../features/orders/presentation/orders-screen";

type MerchantOrdersPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantOrdersPage({
  params,
}: MerchantOrdersPageProps) {
  const { storeId } = await params;

  return <MerchantOrdersScreen storeId={storeId} />;
}

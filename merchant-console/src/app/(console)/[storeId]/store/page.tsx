import { MerchantStoreManagementScreen } from "../../../../features/store-management/presentation/store-management-screen";

type MerchantStorePageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantStorePage({
  params,
}: MerchantStorePageProps) {
  const { storeId } = await params;

  return <MerchantStoreManagementScreen storeId={storeId} />;
}

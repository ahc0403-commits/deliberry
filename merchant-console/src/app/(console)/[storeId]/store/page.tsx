import { MerchantStoreManagementScreen } from "../../../../features/store-management/presentation/store-management-screen";
import { getMerchantStoreManagementRuntimeData } from "../../../../shared/data/merchant-store-runtime-service";

type MerchantStorePageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantStorePage({
  params,
}: MerchantStorePageProps) {
  const { storeId } = await params;
  const result = await getMerchantStoreManagementRuntimeData(storeId);

  return (
    <MerchantStoreManagementScreen
      storeId={storeId}
      initialData={result.data}
    />
  );
}

import { MerchantMenuScreen } from "../../../../features/menu/presentation/menu-screen";
import { getMerchantMenuRuntimeData } from "../../../../shared/data/merchant-menu-runtime-service";

type MerchantMenuPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantMenuPage({
  params,
}: MerchantMenuPageProps) {
  const { storeId } = await params;
  const { data } = await getMerchantMenuRuntimeData(storeId);

  return <MerchantMenuScreen storeId={storeId} initialData={data} />;
}

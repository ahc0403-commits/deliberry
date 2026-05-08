import { MerchantPromotionsScreen } from "../../../../features/promotions/presentation/promotions-screen";
import { getMerchantPromotionsRuntimeData } from "../../../../shared/data/merchant-promotions-runtime-service";

type MerchantPromotionsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantPromotionsPage({
  params,
}: MerchantPromotionsPageProps) {
  const { storeId } = await params;
  const result = await getMerchantPromotionsRuntimeData(storeId);

  return (
    <MerchantPromotionsScreen
      initialData={result.data}
      source={result.source}
    />
  );
}

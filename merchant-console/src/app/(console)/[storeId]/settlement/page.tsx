import { MerchantSettlementScreen } from "../../../../features/settlement/presentation/settlement-screen";
import { getMerchantSettlementRuntimeData } from "../../../../shared/data/merchant-settlement-runtime-service";

type MerchantSettlementPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantSettlementPage({
  params,
}: MerchantSettlementPageProps) {
  const { storeId } = await params;
  const result = await getMerchantSettlementRuntimeData(storeId);

  return (
    <MerchantSettlementScreen
      storeId={storeId}
      initialData={result.data}
      source={result.source}
    />
  );
}

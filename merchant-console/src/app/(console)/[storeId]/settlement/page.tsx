import { MerchantSettlementScreen } from "../../../../features/settlement/presentation/settlement-screen";

type MerchantSettlementPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantSettlementPage({
  params,
}: MerchantSettlementPageProps) {
  const { storeId } = await params;

  return <MerchantSettlementScreen storeId={storeId} />;
}

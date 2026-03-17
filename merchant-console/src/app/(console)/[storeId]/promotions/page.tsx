import { MerchantPromotionsScreen } from "../../../../features/promotions/presentation/promotions-screen";

type MerchantPromotionsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantPromotionsPage({
  params,
}: MerchantPromotionsPageProps) {
  const { storeId } = await params;

  return <MerchantPromotionsScreen storeId={storeId} />;
}

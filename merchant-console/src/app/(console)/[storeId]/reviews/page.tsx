import { MerchantReviewsScreen } from "../../../../features/reviews/presentation/reviews-screen";

type MerchantReviewsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantReviewsPage({
  params,
}: MerchantReviewsPageProps) {
  const { storeId } = await params;

  return <MerchantReviewsScreen storeId={storeId} />;
}

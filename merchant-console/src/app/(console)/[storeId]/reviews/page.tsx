import { MerchantReviewsScreen } from "../../../../features/reviews/presentation/reviews-screen";
import { getMerchantReviewsRuntimeData } from "../../../../shared/data/merchant-review-runtime-service";

type MerchantReviewsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantReviewsPage({
  params,
}: MerchantReviewsPageProps) {
  const { storeId } = await params;
  const { data } = await getMerchantReviewsRuntimeData(storeId);
  const initialHasMore = data.reviews.length >= 25;

  return (
    <MerchantReviewsScreen
      data={data}
      storeId={storeId}
      initialHasMore={initialHasMore}
    />
  );
}

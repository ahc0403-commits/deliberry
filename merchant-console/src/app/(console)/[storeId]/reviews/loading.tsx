import { MerchantLoadingState } from "../../../../features/common/presentation/merchant-loading-state";

export default function MerchantReviewsLoading() {
  return (
    <MerchantLoadingState
      title="Reviews"
      subtitle="Loading the current customer feedback queue."
    />
  );
}

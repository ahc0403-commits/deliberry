import { MerchantLoadingState } from "../../../../features/common/presentation/merchant-loading-state";

export default function MerchantOrdersLoading() {
  return (
    <MerchantLoadingState
      title="Orders"
      subtitle="Loading the live order queue for this store."
    />
  );
}

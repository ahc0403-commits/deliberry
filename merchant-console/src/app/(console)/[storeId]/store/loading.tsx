import { MerchantLoadingState } from "../../../../features/common/presentation/merchant-loading-state";

export default function MerchantStoreLoading() {
  return (
    <MerchantLoadingState
      title="Store Information"
      subtitle="Loading the store profile and operating details."
    />
  );
}

import { MerchantLoadingState } from "../../../../features/common/presentation/merchant-loading-state";

export default function MerchantSettingsLoading() {
  return (
    <MerchantLoadingState
      title="Settings"
      subtitle="Loading persisted settings for this store."
    />
  );
}

"use client";

import { MerchantErrorState } from "../../../../features/common/presentation/merchant-error-state";

export default function MerchantStoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MerchantErrorState
      title="Store Information"
      message={error.message || "Unable to load store profile data."}
      onReset={reset}
    />
  );
}

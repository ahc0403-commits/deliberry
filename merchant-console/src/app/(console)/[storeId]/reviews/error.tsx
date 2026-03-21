"use client";

import { MerchantErrorState } from "../../../../features/common/presentation/merchant-error-state";

export default function MerchantReviewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MerchantErrorState
      title="Reviews"
      message={error.message || "Unable to load merchant reviews for this store."}
      onReset={reset}
    />
  );
}

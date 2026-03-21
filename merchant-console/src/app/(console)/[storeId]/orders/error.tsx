"use client";

import { MerchantErrorState } from "../../../../features/common/presentation/merchant-error-state";

export default function MerchantOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MerchantErrorState
      title="Orders"
      message={error.message || "Unable to load the store order queue."}
      onReset={reset}
    />
  );
}

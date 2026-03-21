"use client";

import { MerchantErrorState } from "../../../../features/common/presentation/merchant-error-state";

export default function MerchantSettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MerchantErrorState
      title="Settings"
      message={error.message || "Unable to load store settings."}
      onReset={reset}
    />
  );
}

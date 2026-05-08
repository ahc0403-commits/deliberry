import { redirect } from "next/navigation";

import { ensureMerchantConsoleAccess } from "../../../features/auth/server/access";
import { resolveMerchantAccessPath } from "../../../shared/auth/merchant-session";
import { MerchantStoreSelectionScreen } from "../../../features/store-selection/presentation/store-selection-screen";

export default async function MerchantSelectStorePage({
  searchParams,
}: {
  searchParams?: Promise<{ reason?: string }>;
}) {
  const access = await ensureMerchantConsoleAccess();
  const params = await searchParams;

  if (access.selectedStoreId) {
    redirect(
      resolveMerchantAccessPath({
        hasSession: true,
        onboardingComplete: access.onboardingComplete,
        selectedStoreId: access.selectedStoreId,
        membershipCount: access.membershipCount,
      }),
    );
  }

  return (
    <MerchantStoreSelectionScreen
      memberships={access.memberships}
      membershipCount={access.membershipCount}
      authority={access.authority === "none" ? "demo-cookie" : access.authority}
      reason={params?.reason ?? null}
    />
  );
}

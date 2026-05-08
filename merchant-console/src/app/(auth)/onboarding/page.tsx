import { redirect } from "next/navigation";

import {
  readMerchantAccessState,
  resolveMerchantAccessPath,
} from "../../../shared/auth/merchant-session";
import { readMerchantAuthAuthority } from "../../../shared/supabase/config";
import { MerchantOnboardingScreen } from "../../../features/onboarding/presentation/onboarding-screen";

export default async function MerchantOnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ reason?: string }>;
}) {
  const access = await readMerchantAccessState();
  const params = await searchParams;

  if (!access.session) {
    redirect(
      resolveMerchantAccessPath({
        hasSession: false,
        onboardingComplete: access.onboardingComplete,
        selectedStoreId: access.selectedStoreId,
        membershipCount: access.membershipCount,
      }),
    );
  }

  if (access.onboardingComplete) {
    redirect(
      resolveMerchantAccessPath({
        hasSession: true,
        onboardingComplete: true,
        selectedStoreId: access.selectedStoreId,
        membershipCount: access.membershipCount,
      }),
    );
  }

  return (
    <MerchantOnboardingScreen
      authority={access.authority === "none" ? readMerchantAuthAuthority() : access.authority}
      reason={params?.reason ?? null}
    />
  );
}

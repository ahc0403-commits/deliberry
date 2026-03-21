import { redirect } from "next/navigation";

import {
  readMerchantAccessState,
  resolveMerchantAccessPath,
} from "../../../shared/auth/merchant-session";
import { MerchantOnboardingScreen } from "../../../features/onboarding/presentation/onboarding-screen";

export default async function MerchantOnboardingPage() {
  const access = await readMerchantAccessState();

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

  return <MerchantOnboardingScreen />;
}

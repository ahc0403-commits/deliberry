import { redirect } from "next/navigation";

import { readMerchantAccessState } from "../../../shared/auth/merchant-session";
import { MerchantOnboardingScreen } from "../../../features/onboarding/presentation/onboarding-screen";

export default async function MerchantOnboardingPage() {
  const access = await readMerchantAccessState();

  if (!access.session) {
    redirect("/login");
  }

  if (access.onboardingComplete) {
    if (access.selectedStoreId) {
      redirect(`/${access.selectedStoreId}/dashboard`);
    }

    redirect("/select-store");
  }

  return <MerchantOnboardingScreen />;
}

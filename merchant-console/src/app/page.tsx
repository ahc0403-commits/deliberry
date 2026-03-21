import { redirect } from "next/navigation";

import {
  readMerchantAccessState,
  resolveMerchantAccessPath,
} from "../shared/auth/merchant-session";

export default async function HomePage() {
  const access = await readMerchantAccessState();

  redirect(
    resolveMerchantAccessPath({
      hasSession: Boolean(access.session),
      onboardingComplete: access.onboardingComplete,
      selectedStoreId: access.selectedStoreId,
      membershipCount: access.membershipCount,
    }),
  );
}

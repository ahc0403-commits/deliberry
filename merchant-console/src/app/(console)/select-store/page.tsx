import { redirect } from "next/navigation";

import { ensureMerchantConsoleAccess } from "../../../features/auth/server/access";
import { MerchantStoreSelectionScreen } from "../../../features/store-selection/presentation/store-selection-screen";

export default async function MerchantSelectStorePage() {
  const access = await ensureMerchantConsoleAccess();

  if (access.selectedStoreId) {
    redirect(`/${access.selectedStoreId}/dashboard`);
  }

  return <MerchantStoreSelectionScreen />;
}

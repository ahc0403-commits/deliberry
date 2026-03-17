import { redirectMerchantIfSessionExists } from "../../../features/auth/server/access";
import { MerchantLoginScreen } from "../../../features/auth/presentation/login-screen";

export default async function MerchantLoginPage() {
  await redirectMerchantIfSessionExists();
  return <MerchantLoginScreen />;
}

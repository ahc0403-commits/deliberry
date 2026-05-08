import { redirectMerchantIfSessionExists } from "../../../features/auth/server/access";
import { MerchantLoginScreen } from "../../../features/auth/presentation/login-screen";
import { readMerchantAuthAvailability } from "../../../shared/supabase/config";

export default async function MerchantLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; reason?: string }>;
}) {
  const availability = readMerchantAuthAvailability();
  const params = await searchParams;

  if (availability.available) {
    await redirectMerchantIfSessionExists();
  }

  return (
    <MerchantLoginScreen
      error={params?.error ?? null}
      authUnavailable={!availability.available}
      authority={availability.available ? availability.authority : "supabase"}
      reason={params?.reason ?? null}
    />
  );
}

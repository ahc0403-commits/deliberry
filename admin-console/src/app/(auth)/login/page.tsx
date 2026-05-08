import { AdminLoginScreen } from "../../../features/auth/presentation/login-screen";
import { readAdminAuthAvailability } from "../../../shared/supabase/config";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const availability = readAdminAuthAvailability();

  return (
    <AdminLoginScreen
      error={params?.error ?? null}
      authUnavailable={!availability.available}
    />
  );
}

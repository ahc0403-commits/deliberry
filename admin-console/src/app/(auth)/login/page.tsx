import { AdminLoginScreen } from "../../../features/auth/presentation/login-screen";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <AdminLoginScreen error={params?.error ?? null} />;
}

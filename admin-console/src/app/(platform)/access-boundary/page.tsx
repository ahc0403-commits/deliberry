import { AdminAccessBoundaryScreen } from "../../../features/permissions/presentation/access-boundary-screen";

export default async function AdminAccessBoundaryPage({
  searchParams,
}: {
  searchParams?: Promise<{ reason?: string }>;
}) {
  const params = await searchParams;
  return <AdminAccessBoundaryScreen reason={params?.reason ?? null} />;
}

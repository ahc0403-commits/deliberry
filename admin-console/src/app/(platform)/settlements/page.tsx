import { AdminSettlementsScreen } from "../../../features/settlements/presentation/settlements-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminSettlementsPage() {
  const { settlements } = await supabaseAdminRuntimeRepository.getSettlementsData();
  return <AdminSettlementsScreen settlements={settlements} />;
}

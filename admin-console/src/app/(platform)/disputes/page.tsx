import { AdminDisputesScreen } from "../../../features/disputes/presentation/disputes-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminDisputesPage() {
  const { disputes } = await supabaseAdminRuntimeRepository.getDisputesData();
  return <AdminDisputesScreen disputes={disputes} />;
}

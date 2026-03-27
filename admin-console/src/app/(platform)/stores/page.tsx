import { AdminStoresScreen } from "../../../features/stores/presentation/stores-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminStoresPage() {
  const { stores } = await supabaseAdminRuntimeRepository.getStoresData();
  return <AdminStoresScreen stores={stores} />;
}

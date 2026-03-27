import { AdminCustomerServiceScreen } from "../../../features/customer-service/presentation/customer-service-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminCustomerServicePage() {
  const { tickets } = await supabaseAdminRuntimeRepository.getCustomerServiceData();
  return <AdminCustomerServiceScreen tickets={tickets} />;
}

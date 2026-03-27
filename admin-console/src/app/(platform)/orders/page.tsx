import { AdminOrdersScreen } from "../../../features/orders/presentation/orders-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminOrdersPage() {
  const { orders } = await supabaseAdminRuntimeRepository.getOrdersData();
  return <AdminOrdersScreen orders={orders} />;
}

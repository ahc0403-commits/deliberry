import { AdminFinanceScreen } from "../../../features/finance/presentation/finance-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminFinancePage() {
  const data = await supabaseAdminRuntimeRepository.getFinanceData();
  return <AdminFinanceScreen data={data} />;
}

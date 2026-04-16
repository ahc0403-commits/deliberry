import { AdminSystemManagementScreen } from "../../../features/system-management/presentation/system-management-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminSystemManagementPage() {
  const auditEntries =
    await supabaseAdminRuntimeRepository.getAuditLogEntries();

  return <AdminSystemManagementScreen auditEntries={auditEntries} />;
}

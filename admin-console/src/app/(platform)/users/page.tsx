import { AdminUsersScreen } from "../../../features/users/presentation/users-screen";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";

export default async function AdminUsersPage() {
  const { users } = await supabaseAdminRuntimeRepository.getUsersData();
  return <AdminUsersScreen users={users} />;
}

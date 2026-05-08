import { AdminDashboardScreen } from "../../../features/dashboard/presentation/dashboard-screen";
import { AdminRuntimeUnavailableScreen } from "../../../features/runtime/presentation/admin-runtime-unavailable-screen";
import { readAdminRuntimeSafely } from "../../../shared/data/admin-runtime-availability";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";
import { getTranslations } from "../../../shared/i18n/server";

export default async function AdminDashboardPage() {
  const { raw, t } = await getTranslations();
  const result = await readAdminRuntimeSafely(() =>
    supabaseAdminRuntimeRepository.getDashboardData(),
  );

  if (!result.available) {
    return (
      <AdminRuntimeUnavailableScreen
        routeTitle={raw("Platform Dashboard")}
        eyebrow={t("runtime.unavailableEyebrow")}
        title={t("runtime.unavailableTitle")}
        body={t("runtime.unavailableBody")}
        hint={t("runtime.unavailableHint")}
        retryLabel={t("runtime.unavailableRetry")}
        retryHref="/dashboard"
      />
    );
  }

  return <AdminDashboardScreen data={result.data} />;
}

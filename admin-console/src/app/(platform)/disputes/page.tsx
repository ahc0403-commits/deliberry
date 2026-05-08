import { AdminDisputesScreen } from "../../../features/disputes/presentation/disputes-screen";
import { AdminRuntimeUnavailableScreen } from "../../../features/runtime/presentation/admin-runtime-unavailable-screen";
import { readAdminRuntimeSafely } from "../../../shared/data/admin-runtime-availability";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";
import { getTranslations } from "../../../shared/i18n/server";

export default async function AdminDisputesPage() {
  const { raw, t } = await getTranslations();
  const result = await readAdminRuntimeSafely(() =>
    supabaseAdminRuntimeRepository.getDisputesData(),
  );

  if (!result.available) {
    return (
      <AdminRuntimeUnavailableScreen
        routeTitle={raw("Disputes")}
        eyebrow={t("runtime.unavailableEyebrow")}
        title={t("runtime.unavailableTitle")}
        body={t("runtime.unavailableBody")}
        hint={t("runtime.unavailableHint")}
        retryLabel={t("runtime.unavailableRetry")}
        retryHref="/disputes"
      />
    );
  }

  return <AdminDisputesScreen disputes={result.data.disputes} />;
}

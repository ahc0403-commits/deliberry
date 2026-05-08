import { AdminCustomerServiceScreen } from "../../../features/customer-service/presentation/customer-service-screen";
import { AdminRuntimeUnavailableScreen } from "../../../features/runtime/presentation/admin-runtime-unavailable-screen";
import { readAdminRuntimeSafely } from "../../../shared/data/admin-runtime-availability";
import { supabaseAdminRuntimeRepository } from "../../../shared/data/supabase-admin-runtime-repository";
import { getTranslations } from "../../../shared/i18n/server";

export default async function AdminCustomerServicePage() {
  const { raw, t } = await getTranslations();
  const result = await readAdminRuntimeSafely(() =>
    supabaseAdminRuntimeRepository.getCustomerServiceData(),
  );

  if (!result.available) {
    return (
      <AdminRuntimeUnavailableScreen
        routeTitle={raw("Customer Service")}
        eyebrow={t("runtime.unavailableEyebrow")}
        title={t("runtime.unavailableTitle")}
        body={t("runtime.unavailableBody")}
        hint={t("runtime.unavailableHint")}
        retryLabel={t("runtime.unavailableRetry")}
        retryHref="/customer-service"
      />
    );
  }

  return <AdminCustomerServiceScreen tickets={result.data.tickets} />;
}

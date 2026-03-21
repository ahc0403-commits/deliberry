import { MerchantSettingsScreen } from "../../../../features/settings/presentation/settings-screen";
import { getMerchantSettingsRuntimeData } from "../../../../shared/data/merchant-settings-runtime-service";

type MerchantSettingsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantSettingsPage({
  params,
}: MerchantSettingsPageProps) {
  const { storeId } = await params;
  const result = await getMerchantSettingsRuntimeData(storeId);

  return (
    <MerchantSettingsScreen
      storeId={storeId}
      initialData={result.data}
    />
  );
}

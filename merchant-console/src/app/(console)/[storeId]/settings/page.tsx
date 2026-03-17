import { MerchantSettingsScreen } from "../../../../features/settings/presentation/settings-screen";

type MerchantSettingsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantSettingsPage({
  params,
}: MerchantSettingsPageProps) {
  const { storeId } = await params;

  return <MerchantSettingsScreen storeId={storeId} />;
}

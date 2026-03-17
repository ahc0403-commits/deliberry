import { MerchantMenuScreen } from "../../../../features/menu/presentation/menu-screen";

type MerchantMenuPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function MerchantMenuPage({
  params,
}: MerchantMenuPageProps) {
  const { storeId } = await params;

  return <MerchantMenuScreen storeId={storeId} />;
}

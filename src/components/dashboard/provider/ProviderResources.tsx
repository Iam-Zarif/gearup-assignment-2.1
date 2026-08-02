import ProviderShell from "@/src/components/dashboard/provider/ProviderShell";
import { EarningsContent } from "@/src/components/dashboard/provider/ProviderEarningsContent";
import { EquipmentContent } from "@/src/components/dashboard/provider/ProviderEquipmentContent";
import { OrdersContent } from "@/src/components/dashboard/provider/ProviderOrdersContent";

export function ProviderEquipmentPage() {
  return (
    <ProviderShell>
      <EquipmentContent />
    </ProviderShell>
  );
}

export function ProviderOrdersPage() {
  return (
    <ProviderShell>
      <OrdersContent />
    </ProviderShell>
  );
}

export function ProviderEarningsPage() {
  return (
    <ProviderShell>
      <EarningsContent />
    </ProviderShell>
  );
}

import ProviderShell from "@/src/components/dashboard/provider/ProviderShell";
import CreateEquipmentForm from "./CreateEquipmentForm";

export default function CreateEquipmentPage() {
  return <ProviderShell><section className="mx-auto w-full space-y-6"><div><h1 className="text-3xl font-bold tracking-tight">Add equipment</h1><p className="mt-2 text-muted-foreground">Add new rental equipment to your inventory.</p></div><CreateEquipmentForm /></section></ProviderShell>;
}

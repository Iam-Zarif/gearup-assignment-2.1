import ProviderShell from "@/src/components/dashboard/provider/ProviderShell";
import PageHeader from "@/src/components/shared/PageHeader";
import CreateEquipmentForm from "./CreateEquipmentForm";

export default function CreateEquipmentPage() {
  return (
    <ProviderShell enableProviderData={false}>
      <section className="mx-auto w-full space-y-6">
        <PageHeader description="Add new rental equipment to your inventory." title="Add equipment" />
        <CreateEquipmentForm />
      </section>
    </ProviderShell>
  );
}

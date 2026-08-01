import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/provider/ProviderSidebar";
import CreateEquipmentForm from "./CreateEquipmentForm";



export default function CreateEquipmentPage() {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>

      <section className="mx-auto w-full space-y-6">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Equipment
          </h1>

          <p className="mt-2 text-muted-foreground">
            Add new rental equipment to your provider inventory.
          </p>
        </div>


        <CreateEquipmentForm />

      </section>

    </DashboardLayout>
  );
}
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderCard from "@/components/dashboard/admin/provider/ProviderCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


const providers = [
  {
    name: "Rahim Enterprise",
    email: "rahim@example.com",
    phone: "+8801700000000",
    status: "ACTIVE",
    equipmentCount: 12,
  },
  {
    name: "Agro Machinery BD",
    email: "agro@example.com",
    phone: "+8801800000000",
    status: "ACTIVE",
    equipmentCount: 8,
  },
  {
    name: "BuildTech Solutions",
    email: "buildtech@example.com",
    phone: "+8801900000000",
    status: "PENDING",
    equipmentCount: 5,
  },
  {
    name: "Farm Equipment Hub",
    email: "farmhub@example.com",
    phone: "+8801600000000",
    status: "ACTIVE",
    equipmentCount: 20,
  },
  {
    name: "Power Rental BD",
    email: "power@example.com",
    phone: "+8801500000000",
    status: "SUSPENDED",
    equipmentCount: 3,
  },
  {
    name: "Construction Rentals",
    email: "construction@example.com",
    phone: "+8801400000000",
    status: "ACTIVE",
    equipmentCount: 15,
  },
];


export default function ProvidersPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Providers
              <span className="ml-2 text-muted-foreground">
                ({providers.length})
              </span>
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage equipment providers and their listings.
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
        </div>

        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {providers.map((provider) => (
            <ProviderCard
              key={provider.email}
              {...provider}
              equipment={provider.equipmentCount}
            />
          ))}
        </div>

      </section>
    </DashboardLayout>
  );
}
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import GearCard from "@/components/dashboard/admin/gear/GearCard";


const gears = [
  {
    name: "Tractor Pro X",
    description:
      "Heavy-duty tractor suitable for farming and large agricultural operations.",
    category: "Agricultural Equipment",
    price: "$120",
    status: "AVAILABLE",
  },
  {
    name: "Excavator 320",
    description:
      "Powerful excavator designed for construction and digging projects.",
    category: "Construction Equipment",
    price: "$250",
    status: "AVAILABLE",
  },
  {
    name: "Industrial Generator",
    description:
      "High-capacity generator for industrial and commercial usage.",
    category: "Power Equipment",
    price: "$80",
    status: "RENTED",
  },
  {
    name: "Mini Loader",
    description:
      "Compact loader for small construction and landscaping tasks.",
    category: "Construction Equipment",
    price: "$90",
    status: "AVAILABLE",
  },
  {
    name: "Harvester Machine",
    description:
      "Modern harvesting equipment for agricultural productivity.",
    category: "Agricultural Equipment",
    price: "$300",
    status: "PENDING",
  },
  {
    name: "Water Pump",
    description:
      "Portable water pump for irrigation and farming needs.",
    category: "Agricultural Equipment",
    price: "$40",
    status: "AVAILABLE",
  },
];


export default function GearsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gears
              <span className="ml-2 text-muted-foreground">
                ({gears.length})
              </span>
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage all equipment listed on the GearUp platform.
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Gear
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
          {gears.map((gear) => (
            <GearCard
              key={gear.name}
              {...gear}
              price={0}
              
            />
          ))}
        </div>

      </section>
    </DashboardLayout>
  );
}
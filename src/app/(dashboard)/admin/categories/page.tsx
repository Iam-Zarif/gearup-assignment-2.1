import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import CategoryCard from "@/components/dashboard/admin/category/CategoryCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


const categories = [
  {
    name: "Agricultural Equipment",
    description:
      "Equipment used for farming, cultivation, harvesting, and agricultural operations.",
  },
  {
    name: "Construction Equipment",
    description:
      "Heavy machinery and tools required for construction and infrastructure projects.",
  },
  {
    name: "Transportation Equipment",
    description:
      "Vehicles and transport-related equipment available for rental services.",
  },
  {
    name: "Industrial Equipment",
    description:
      "Machines and tools designed for industrial and manufacturing purposes.",
  },
  {
    name: "Power Equipment",
    description:
      "Generators, power tools, and electrical equipment for different operations.",
  },
  {
    name: "Gardening Equipment",
    description:
      "Tools and equipment for gardening, landscaping, and maintenance work.",
  },
];


export default function CategoriesPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <section className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Categories
              <span className="ml-2 text-muted-foreground">
                ({categories.length})
              </span>
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage equipment categories for the GearUp platform.
            </p>
          </div>


          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
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
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              description={category.description}
              gears={0} // Placeholder value, replace with actual gear count if available
            />
          ))}
        </div>

      </section>
    </DashboardLayout>
  );
}
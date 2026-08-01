import { Card, CardContent } from "@/components/ui/card";
import { FolderTree } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Tractors",
  },
  {
    id: 2,
    name: "Harvesting Machines",
  },
  {
    id: 3,
    name: "Cultivation Equipment",
  },
  {
    id: 4,
    name: "Irrigation Tools",
  },
  {
    id: 5,
    name: "Power Tools",
  },
  {
    id: 6,
    name: "Agricultural Accessories",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Categories
        </h1>

        <p className="mt-2 text-muted-foreground">
          Explore equipment categories available on GearUp.
        </p>
      </div>


      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="
              cursor-pointer
              rounded-xl
              transition
              hover:shadow-md
              hover:border-primary/50
            "
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <FolderTree className="h-6 w-6" />
              </div>

              <h2 className="text-lg font-semibold">
                {category.name}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
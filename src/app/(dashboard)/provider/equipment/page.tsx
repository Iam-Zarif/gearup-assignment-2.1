import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/provider/ProviderSidebar";
import DataTable, { Column } from "@/src/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Equipment = {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  location: string;
  status: string;
};

const equipments: Equipment[] = [
  {
    id: "EQ-001",
    name: "John Deere Tractor",
    category: "Tractor",
    pricePerDay: 5000,
    location: "Dhaka",
    status: "AVAILABLE",
  },
  {
    id: "EQ-002",
    name: "Power Tiller",
    category: "Cultivation",
    pricePerDay: 3000,
    location: "Rajshahi",
    status: "RENTED",
  },
  {
    id: "EQ-003",
    name: "Harvester Machine",
    category: "Harvesting",
    pricePerDay: 8000,
    location: "Khulna",
    status: "AVAILABLE",
  },
];

const columns: Column<Equipment>[] = [
  {
    header: "Equipment",
    accessor: "name",
  },

  {
    header: "Category",
    accessor: "category",
  },

  {
    header: "Price / Day",
    cell: (row) => <span>৳{row.pricePerDay}</span>,
  },

  {
    header: "Location",
    accessor: "location",
  },

  {
    header: "Status",
    cell: (row) => (
      <Badge variant={row.status === "AVAILABLE" ? "default" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },

  {
    header: "Action",
    cell: () => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Edit
        </Button>

        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </div>
    ),
  },
];

export default function EquipmentPage() {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              My Equipment ({equipments.length})
            </h1>

            <p className="text-muted-foreground">
              Manage your listed rental equipment.
            </p>
          </div>

          <Button>Add Equipment</Button>
        </div>

        <DataTable columns={columns} data={equipments} />
      </section>
    </DashboardLayout>
  );
}

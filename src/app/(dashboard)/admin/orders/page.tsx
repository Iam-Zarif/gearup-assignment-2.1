import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

import DataTable, { Column } from "@/src/components/shared/DataTable";

import { Badge } from "@/components/ui/badge";


const orders = [
  {
    id: "ORD-001",
    customer: "Rahim Ahmed",
    gear: "John Deere Tractor",
    amount: "৳5000",
    status: "COMPLETED",
  },
  {
    id: "ORD-002",
    customer: "Karim Hasan",
    gear: "Power Tiller",
    amount: "৳3500",
    status: "PENDING",
  },
  {
    id: "ORD-003",
    customer: "Sadia Akter",
    gear: "Harvester Machine",
    amount: "৳8000",
    status: "CANCELLED",
  },
];


type Order = (typeof orders)[number];


const columns: Column<Order>[] = [

  {
    header: "Order ID",
    accessor: "id",
  },

  {
    header: "Customer",
    accessor: "customer",
  },

  {
    header: "Gear",
    accessor: "gear",
  },

  {
    header: "Amount",
    accessor: "amount",
  },

  {
    header: "Status",

    cell: (order) => (
      <Badge
        variant={
          order.status === "COMPLETED"
            ? "default"
            : order.status === "CANCELLED"
            ? "destructive"
            : "secondary"
        }
      >
        {order.status}
      </Badge>
    ),

  },

];


export default function OrdersPage() {

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>

      <section className="space-y-6">


        <div>

          <h1 className="text-3xl font-bold tracking-tight">

            Orders

            <span className="ml-2 text-muted-foreground">
              ({orders.length})
            </span>

          </h1>


          <p className="mt-1 text-muted-foreground">
            Manage all GearUp orders.
          </p>

        </div>



        <DataTable
          columns={columns}
          data={orders}
        />


      </section>

    </DashboardLayout>
  );
}
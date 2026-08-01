import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/provider/ProviderSidebar";
import { Badge } from "@/components/ui/badge";
import DataTable, { Column } from "@/src/components/shared/DataTable";


type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  equipmentName: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
};


const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Rahim Ahmed",
    customerEmail: "rahim@gmail.com",
    equipmentName: "Trekking Pole Set",
    quantity: 2,
    totalAmount: 360,
    status: "PENDING",
    createdAt: "2026-08-01",
  },
  {
    id: "ORD-002",
    customerName: "Karim Hasan",
    customerEmail: "karim@gmail.com",
    equipmentName: "Power Tiller",
    quantity: 1,
    totalAmount: 2500,
    status: "COMPLETED",
    createdAt: "2026-08-02",
  },
];


const columns: Column<Order>[] = [
  {
    header: "Order ID",
    accessor: "id",
  },

  {
    header: "Customer",
    cell: (row) => (
      <div>
        <p className="font-medium">
          {row.customerName}
        </p>

        <p className="text-sm text-muted-foreground">
          {row.customerEmail}
        </p>
      </div>
    ),
  },

  {
    header: "Equipment",
    accessor: "equipmentName",
  },

  {
    header: "Quantity",
    accessor: "quantity",
  },

  {
    header: "Amount",
    cell: (row) => (
      <span>
        ৳{row.totalAmount}
      </span>
    ),
  },

  {
    header: "Status",
    cell: (row) => (
      <Badge
        variant={
          row.status === "COMPLETED"
            ? "default"
            : "secondary"
        }
      >
        {row.status}
      </Badge>
    ),
  },

  {
    header: "Date",
    accessor: "createdAt",
  },
];


export default function OrdersPage() {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>

      <section className="space-y-5">

        <div>
          <h1 className="text-3xl font-bold">
            Orders ({orders.length})
          </h1>

          <p className="text-muted-foreground">
            Manage your equipment rental orders.
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
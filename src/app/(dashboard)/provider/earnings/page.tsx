import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/provider/ProviderSidebar";

import DataTable, { Column } from "@/src/components/shared/DataTable";

import { Badge } from "@/components/ui/badge";

type Earning = {
  id: string;
  orderId: string;
  equipmentName: string;
  customerName: string;
  amount: number;
  commission: number;
  status: string;
  date: string;
};

const earnings: Earning[] = [
  {
    id: "EARN-001",
    orderId: "ORD-1001",
    equipmentName: "Trekking Pole Set",
    customerName: "Rahim Ahmed",
    amount: 360,
    commission: 36,
    status: "PAID",
    date: "2026-08-01",
  },
  {
    id: "EARN-002",
    orderId: "ORD-1002",
    equipmentName: "Power Tiller",
    customerName: "Karim Hasan",
    amount: 2500,
    commission: 250,
    status: "PENDING",
    date: "2026-08-02",
  },
];

const columns: Column<Earning>[] = [
  {
    header: "Earning ID",
    accessor: "id",
  },

  {
    header: "Order ID",
    accessor: "orderId",
  },

  {
    header: "Equipment",
    accessor: "equipmentName",
  },

  {
    header: "Customer",
    accessor: "customerName",
  },

  {
    header: "Amount",
    cell: (row) => <span>৳{row.amount}</span>,
  },

  {
    header: "Commission",
    cell: (row) => (
      <span className="text-muted-foreground">৳{row.commission}</span>
    ),
  },

  {
    header: "Status",
    cell: (row) => (
      <Badge variant={row.status === "PAID" ? "default" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },

  {
    header: "Date",
    accessor: "date",
  },
];

export default function EarningsPage() {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Earnings ({earnings.length})</h1>

            <p className="text-muted-foreground">
              Track your rental income and payment history.
            </p>
          </div>

          <div className="rounded-xl border px-5 py-3">
            <p className="text-sm text-muted-foreground">Total Earnings</p>

            <p className="text-xl font-bold">
              ৳{earnings.reduce((sum, item) => sum + item.amount, 0)}
            </p>
          </div>
        </div>

        <DataTable columns={columns} data={earnings} />
      </section>
    </DashboardLayout>
  );
}

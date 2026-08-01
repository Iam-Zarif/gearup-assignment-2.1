import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable, { Column } from "@/src/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";


const payments = [
  {
    id: "PAY-001",
    customer: "Rahim Ahmed",
    orderId: "ORD-001",
    amount: "৳5000",
    method: "SSLCommerz",
    status: "PAID",
  },
  {
    id: "PAY-002",
    customer: "Karim Hasan",
    orderId: "ORD-002",
    amount: "৳3500",
    method: "Card",
    status: "PENDING",
  },
  {
    id: "PAY-003",
    customer: "Sadia Akter",
    orderId: "ORD-003",
    amount: "৳8000",
    method: "Mobile Banking",
    status: "FAILED",
  },
];


type Payment = (typeof payments)[number];


const columns: Column<Payment>[] = [

  {
    header: "Payment ID",
    accessor: "id",
  },

  {
    header: "Customer",
    accessor: "customer",
  },

  {
    header: "Order ID",
    accessor: "orderId",
  },

  {
    header: "Amount",
    accessor: "amount",
  },

  {
    header: "Method",
    accessor: "method",
  },

  {
    header: "Status",

    cell: (payment) => (
      <Badge
        variant={
          payment.status === "PAID"
            ? "default"
            : payment.status === "FAILED"
            ? "destructive"
            : "secondary"
        }
      >
        {payment.status}
      </Badge>
    ),

  },

];


export default function PaymentsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>

      <section className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Payments

            <span className="ml-2 text-muted-foreground">
              ({payments.length})
            </span>

          </h1>


          <p className="mt-1 text-muted-foreground">
            Monitor all GearUp payment transactions.
          </p>

        </div>


        <DataTable
          columns={columns}
          data={payments}
        />

      </section>

    </DashboardLayout>
  );
}
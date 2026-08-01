import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { Badge } from "@/components/ui/badge";
import DataTable, { Column } from "@/src/components/shared/DataTable";

const customers = [
  {
    name: "Rahim Ahmed",
    email: "rahim@gmail.com",
    phone: "+8801700000000",
    orders: 5,
    status: "ACTIVE",
  },
  {
    name: "Karim Hasan",
    email: "karim@gmail.com",
    phone: "+8801800000000",
    orders: 3,
    status: "ACTIVE",
  },
  {
    name: "Sadia Akter",
    email: "sadia@gmail.com",
    phone: "+8801900000000",
    orders: 8,
    status: "BLOCKED",
  },
];

type Customer = (typeof customers)[number];

const columns: Column<Customer>[] = [
  {
    header: "Name",
    accessor: "name",
  },

  {
    header: "Email",
    accessor: "email",
  },

  {
    header: "Phone",
    accessor: "phone",
  },

  {
    header: "Total Orders",
    accessor: "orders",
  },

  {
    header: "Status",

    cell: (customer) => (
      <Badge variant={customer.status === "ACTIVE" ? "default" : "destructive"}>
        {customer.status}
      </Badge>
    ),
  },
];

export default function CustomersPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Customers
            <span className="ml-2 text-muted-foreground">
              ({customers.length})
            </span>
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage all GearUp customers.
          </p>
        </div>

        <DataTable columns={columns} data={customers} />
      </section>
    </DashboardLayout>
  );
}

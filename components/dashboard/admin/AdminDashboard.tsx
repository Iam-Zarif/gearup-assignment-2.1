import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "./AdminSidebar";
import {
  Boxes,
  FolderTree,
  ShoppingCart,
  Users,
  Truck,
  DollarSign,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
  {
    title: "Total Categories",
    value: 0,
    icon: FolderTree,
  },
  {
    title: "Total Gears",
    value: 0,
    icon: Boxes,
  },
  {
    title: "Total Orders",
    value: 0,
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: 0,
    icon: Users,
  },
  {
    title: "Providers",
    value: 0,
    icon: Truck,
  },
  {
    title: "Revenue",
    value: "$0",
    icon: DollarSign,
  },
];
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
       <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </DashboardLayout>
  );
}
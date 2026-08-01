import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "./ProviderSidebar";

import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Equipment",
    value: "24",
    icon: Package,
    description: "Listed equipment",
  },
  {
    title: "Total Orders",
    value: "156",
    icon: ShoppingCart,
    description: "Completed rentals",
  },
  {
    title: "Total Earnings",
    value: "৳45,500",
    icon: DollarSign,
    description: "This month revenue",
  },
  {
    title: "Average Rating",
    value: "4.8",
    icon: Star,
    description: "Customer reviews",
  },
];

export default function ProviderDashboard() {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>
      <section className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Provider Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your equipment, orders, earnings and profile.
          </p>
        </div>


        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-xl"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-3">

                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </CardTitle>

                  <Icon className="h-5 w-5 text-primary" />

                </CardHeader>


                <CardContent>

                  <div className="text-3xl font-bold">
                    {item.value}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>

                </CardContent>

              </Card>
            );
          })}

        </div>


        {/* Recent Activity */}
        <Card className="rounded-xl">

          <CardHeader>
            <CardTitle>
              Recent Activity
            </CardTitle>
          </CardHeader>


          <CardContent>

            <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              Recent orders and updates will appear here.
            </div>

          </CardContent>

        </Card>


      </section>
    </DashboardLayout>
  );
}
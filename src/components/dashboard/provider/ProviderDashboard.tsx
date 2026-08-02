"use client";

import { DollarSign, Package, ShoppingCart } from "lucide-react";

import ProviderShell from "@/src/components/dashboard/provider/ProviderShell";
import { useProviderData } from "@/src/components/providers/ProviderProvider";
import PageHeader from "@/src/components/shared/PageHeader";
import StatusBadge from "@/src/components/shared/StatusBadge";

export default function ProviderDashboard() {
  return <ProviderShell><ProviderDashboardContent /></ProviderShell>;
}

function ProviderDashboardContent() {
  const { gear, orders, isLoading, error } = useProviderData();
  const revenue = orders.filter((order) => order.payment?.status === "COMPLETED").reduce((total, order) => total + Number(order.totalAmount), 0);
  const activeRentals = orders.filter((order) => order.status === "PICKED_UP").length;
  const pendingOrders = orders.filter((order) => order.status === "PLACED").length;
  const cards = [
    ["Equipment", gear.length, Package],
    ["Active rentals", activeRentals, ShoppingCart],
    ["Pending orders", pendingOrders, ShoppingCart],
    ["Rental revenue", `৳${revenue.toLocaleString()}`, DollarSign],
  ];

  return <section className="space-y-6">
    <PageHeader description="Live inventory and rental activity." title="Provider dashboard" />
    {error ? <p className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</p> : null}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([title, value, Icon]) => { const CardIcon = Icon as typeof Package; return <article className="rounded-xl border p-5" key={title as string}><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{title as string}</p><CardIcon className="h-5 w-5 text-primary" /></div><p className="mt-3 text-3xl font-semibold">{isLoading ? "—" : value as string | number}</p></article>; })}</div>
    <section className="rounded-xl border"><div className="border-b p-4 font-semibold">Recent orders</div><div className="divide-y">{orders.slice(0, 5).map((order) => <div className="flex items-center justify-between gap-4 p-4 text-sm" key={order.id}><div><p className="font-medium">{order.customer.name}</p><p className="text-muted-foreground">{order.items.map((item) => item.gearItem.name).join(", ")}</p></div><StatusBadge status={order.status} /></div>)}{!isLoading && !orders.length ? <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p> : null}</div></section>
  </section>;
}

"use client";

import { useProviderData } from "@/src/components/providers/ProviderProvider";
import PageHeader from "@/src/components/shared/PageHeader";
import StatusBadge from "@/src/components/shared/StatusBadge";
import {
  EmptyTable,
  RequestError,
} from "./ProviderContentHelpers";

export function EarningsContent() {
  const { orders, isLoading, error } = useProviderData();
  const activeOrders = orders.filter(
    (order) => order.payment?.status === "COMPLETED",
  );
  const earnings = activeOrders.reduce(
    (total, order) => total + Number(order.totalAmount),
    0,
  );

  return (
    <section className="space-y-6">
      <PageHeader
        action={
          <div className="rounded-xl border px-5 py-3">
            <p className="text-sm text-muted-foreground">Total revenue</p>
            <p className="text-xl font-bold">
              {isLoading ? "—" : `৳${earnings.toLocaleString()}`}
            </p>
          </div>
        }
        description="Revenue from completed Stripe payments."
        title="Earnings"
      />
      <RequestError error={error} />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeOrders.map((order) => (
              <tr className="border-t" key={order.id}>
                <td className="p-3">{order.id.slice(0, 8)}</td>
                <td className="p-3">{order.customer.name}</td>
                <td className="p-3">৳{order.totalAmount}</td>
                <td className="p-3">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
            {!isLoading && !activeOrders.length ? (
              <EmptyTable columns={4} message="No earnings yet." />
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

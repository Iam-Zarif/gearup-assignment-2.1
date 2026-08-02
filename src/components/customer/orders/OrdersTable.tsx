import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CustomerRental } from "@/src/types/customer";
import StatusBadge from "./StatusBadge";
import type { ReviewTarget } from "./types";

export default function OrdersTable({
  onReview,
  orders,
}: {
  onReview: (target: ReviewTarget) => void;
  orders: CustomerRental[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3">Equipment</th>
            <th className="p-3">Rental dates</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const canPay =
              order.status === "CONFIRMED" &&
              order.payment?.status === "PENDING";
            const isPaid =
              order.status === "PAID" || order.payment?.status === "COMPLETED";
            return (
              <tr className="border-t" key={order.id}>
                <td className="p-3">
                  {order.items.map((item) => (
                    <div className="mb-2 flex items-center gap-3" key={item.id}>
                      {item.gearItem.imageUrl ? (
                        <Image
                          alt={item.gearItem.name}
                          className="rounded object-cover"
                          height={44}
                          src={item.gearItem.imageUrl}
                          unoptimized
                          width={56}
                        />
                      ) : null}
                      <div>
                        <p className="font-medium">{item.gearItem.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  {new Date(order.startDate).toLocaleDateString()}
                  <br />
                  to {new Date(order.endDate).toLocaleDateString()}
                </td>
                <td className="p-3">৳{order.totalAmount}</td>
                <td className="p-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {canPay ? (
                      <Link href={`/payment?orderId=${order.id}`}>
                        <Button size="sm">Pay now</Button>
                      </Link>
                    ) : null}
                    {order.status === "RETURNED"
                      ? order.items.map((item) => (
                          <Button
                            key={item.id}
                            onClick={() =>
                              onReview({
                                gearId: item.gearItem.id,
                                rentalId: order.id,
                                gearName: item.gearItem.name,
                              })
                            }
                            size="sm"
                            variant="outline"
                          >
                            Review 
                          </Button>
                        ))
                      : null}
                    {isPaid ? <StatusBadge status="PAID" /> : null}
                    {!canPay && order.status !== "RETURNED" && !isPaid ? (
                      <span className="text-muted-foreground">
                        {order.status === "PLACED"
                          ? "Awaiting"
                          : "No action"}
                      </span>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
          {!orders.length ? (
            <tr>
              <td
                className="p-10 text-center text-muted-foreground"
                colSpan={5}
              >
                You have no rental orders yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useCallback, useMemo, useState } from "react";
import { Eye, MoreHorizontal, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProviderData } from "@/src/components/providers/ProviderProvider";
import DataTable from "@/src/components/shared/DataTable";
import DetailsDialog from "@/src/components/shared/DetailsDialog";
import PageHeader from "@/src/components/shared/PageHeader";
import StatusBadge from "@/src/components/shared/StatusBadge";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { updateProviderOrderStatus } from "@/src/services/provider/provider.service";
import type { ProviderOrder } from "@/src/types/admin";
import { ProviderImage } from "./ProviderImage";
import {
  Detail,
  InventoryMetric,
  Loader,
  RequestError,
} from "./ProviderContentHelpers";

export function OrdersContent() {
  const { orders, isLoading, error, refresh } = useProviderData();
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ProviderOrder | null>(null);

  const changeStatus = useCallback(
    async (
      id: string,
      status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED",
    ) => {
      try {
        await updateProviderOrderStatus(id, status);
        await refresh();
      } catch (requestError) {
        setActionError(getApiErrorMessage(requestError, "Unable to update order"));
      }
    },
    [refresh],
  );

  const columns = useMemo(
    () => [
      {
        header: "Customer",
        cell: (order: ProviderOrder) => (
          <div>
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-muted-foreground">{order.customer.email}</p>
          </div>
        ),
      },
      {
        header: "Equipment",
        cell: (order: ProviderOrder) => (
          <span className="font-medium">
            {order.items.map((item) => item.gearItem.name).join(", ")}
          </span>
        ),
      },
      {
        header: "Rental dates",
        cell: (order: ProviderOrder) => (
          <span className="text-muted-foreground">
            {new Date(order.startDate).toLocaleDateString()}
            <br />
            to {new Date(order.endDate).toLocaleDateString()}
          </span>
        ),
      },
      {
        header: "Payment",
        cell: (order: ProviderOrder) => (
          <StatusBadge status={order.payment?.status ?? "PENDING"} />
        ),
      },
      {
        header: "Status",
        cell: (order: ProviderOrder) => <StatusBadge status={order.status} />,
      },
      {
        header: "Actions",
        cell: (order: ProviderOrder) => (
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setSelectedOrder(order)}
              size="sm"
              variant="outline"
            >
              <Eye />
              View details
            </Button>
            <OrderActions order={order} onUpdate={changeStatus} />
          </div>
        ),
      },
    ],
    [changeStatus],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        description="Manage rental orders for your equipment."
        title={`Orders (${orders.length})`}
      />
      <RequestError error={actionError ?? error} />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
      <DetailsDialog
        description="Rental, payment, and current inventory information."
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        open={Boolean(selectedOrder)}
        title="Order details"
      >
        {selectedOrder ? <ProviderOrderDetails order={selectedOrder} /> : null}
      </DetailsDialog>
    </section>
  );
}

function OrderActions({
  order,
  onUpdate,
}: {
  order: ProviderOrder;
  onUpdate: (
    id: string,
    status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED",
  ) => Promise<void>;
}) {
  const canReturn =
    new Date(order.endDate).setHours(0, 0, 0, 0) <=
    new Date().setHours(0, 0, 0, 0);
  const action =
    order.status === "PLACED"
      ? { label: "Confirm", status: "CONFIRMED" as const }
      : order.status === "PAID"
      ? { label: "Mark picked up", status: "PICKED_UP" as const }
      : order.status === "PICKED_UP" && canReturn
      ? { label: "Mark returned", status: "RETURNED" as const }
      : null;

  if (
    action ||
    order.status === "PLACED" ||
    order.status === "CONFIRMED" ||
    order.status === "PICKED_UP"
  ) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon" variant="outline" />}>
          <MoreHorizontal />
          <span className="sr-only">Order actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {action ? (
            <DropdownMenuItem
              onClick={() => void onUpdate(order.id, action.status)}
            >
              {action.label}
            </DropdownMenuItem>
          ) : null}
          {order.status === "PICKED_UP" && !canReturn ? (
            <DropdownMenuItem disabled>
              Return available on end date
            </DropdownMenuItem>
          ) : null}
          {order.status === "PLACED" || order.status === "CONFIRMED" ? (
            <DropdownMenuItem
              onClick={() => void onUpdate(order.id, "CANCELLED")}
            >
              Cancel order
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}

function ProviderOrderDetails({ order }: { order: ProviderOrder }) {
  const firstItem = order.items[0]?.gearItem;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          {firstItem ? (
            <div className="relative overflow-hidden rounded-3xl border bg-muted aspect-video">
              <ProviderImage
                alt={firstItem.name}
                src={firstItem.imageUrl}
                wrapperClassName="relative h-full w-full"
                sizes="640px"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-3xl border bg-muted" />
          )}
          <div className="rounded-3xl border bg-muted/30 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Payment status</p>
                <StatusBadge status={order.payment?.status ?? "PENDING"} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order status</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Customer" value={order.customer.name} />
            <Detail label="Customer email" value={order.customer.email} />
            <Detail
              label="Rental starts"
              value={new Date(order.startDate).toLocaleDateString()}
            />
            <Detail
              label="Rental ends"
              value={new Date(order.endDate).toLocaleDateString()}
            />
            <Detail label="Order total" value={`৳${order.totalAmount}`} />
            <Detail label="Items" value={String(order.items.length)} />
          </div>
        </div>
      </div>
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <h3 className="font-semibold">Equipment in this order</h3>
        </div>
        <div className="space-y-3">
          {order.items.map((item) => (
            <article className="rounded-xl border p-4" key={item.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{item.gearItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ৳{item.gearItem.pricePerDay} per day
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Qty {item.quantity}</span>
                  <span>Subtotal ৳{item.subtotal}</span>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                <InventoryMetric label="Rented" value={String(item.quantity)} />
                <InventoryMetric
                  label="Available now"
                  value={String(item.gearItem.availableQuantity)}
                />
                <InventoryMetric
                  label="Total stock"
                  value={String(item.gearItem.stockQuantity)}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

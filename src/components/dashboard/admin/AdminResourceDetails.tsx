import Image from "next/image";

import type {
  AdminGear,
  AdminPayment,
  AdminRental,
  AdminReview,
  AdminResource,
  AdminResourceData,
  AdminUser,
  Category,
} from "@/src/types/admin";

export function ResourceDetails({
  item,
  resource,
}: {
  item: AdminResourceData[number];
  resource: AdminResource;
}) {
  if (resource === "customers" || resource === "providers") {
    const user = item as AdminUser;
    return (
      <DetailGrid
        fields={[
          ["Name", user.name],
          ["Email", user.email],
          ["Phone", user.phone ?? "Not provided"],
          ["Role", user.role],
          ["Status", user.status],
          ["Joined", new Date(user.createdAt).toLocaleDateString()],
        ]}
      />
    );
  }

  if (resource === "categories") {
    const category = item as Category;
    return (
      <div className="space-y-4">
        {category.imageUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
            <Image
              alt={category.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              src={category.imageUrl}
              unoptimized
            />
          </div>
        ) : null}
        <DetailGrid
          fields={[
            ["Name", category.name],
            ["Description", category.description ?? "Not provided"],
          ]}
        />
      </div>
    );
  }

  if (resource === "gears") {
    const gear = item as AdminGear;
    return (
      <div className="space-y-4">
        {gear.imageUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
            <Image
              alt={gear.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              src={gear.imageUrl}
              unoptimized
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
            No image provided
          </div>
        )}
        <DetailGrid
          fields={[
            ["Name", gear.name],
            ["Brand", gear.brand ?? "Not provided"],
            ["Description", gear.description ?? "Not provided"],
            ["Category", gear.category.name],
            ["Provider", gear.provider.name],
            ["Provider email", gear.provider.email],
            ["Price per day", `৳${gear.pricePerDay}`],
            [
              "Available quantity",
              `${gear.availableQuantity}/${gear.stockQuantity}`,
            ],
            ["Status", gear.status],
            [
              "Specifications",
              gear.specifications
                ? Object.entries(gear.specifications)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
                : "Not provided",
            ],
          ]}
        />
      </div>
    );
  }

  if (resource === "orders") {
    const order = item as AdminRental;
    return (
      <DetailGrid
        fields={[
          ["Order ID", order.id],
          ["Customer", order.customer.name],
          ["Customer email", order.customer.email],
          ["Gear", order.items.map((entry) => entry.gearItem.name).join(", ")],
          ["Total amount", `৳${order.totalAmount}`],
          ["Status", order.status],
        ]}
      />
    );
  }

  if (resource === "payments") {
    const payment = item as AdminPayment;
    return (
      <DetailGrid
        fields={[
          ["Payment ID", payment.id],
          ["Customer", payment.customer.name],
          ["Customer email", payment.customer.email],
          ["Order ID", payment.rentalOrder.id],
          ["Amount", `৳${payment.amount}`],
          ["Method", payment.method ?? "Not provided"],
          ["Status", payment.status],
        ]}
      />
    );
  }

  const review = item as AdminReview;
  return (
    <DetailGrid
      fields={[
        ["Customer", review.customer.name],
        ["Customer email", review.customer.email],
        ["Gear", review.gearItem.name],
        ["Rating", `${review.rating}/5`],
        ["Comment", review.comment ?? "No comment"],
      ]}
    />
  );
}

export function DetailGrid({ fields }: { fields: Array<[string, string]> }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div className="rounded-lg border p-3" key={label}>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </dt>
          <dd className="mt-1 wrap-break-word font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

import Image from "next/image";

import { adminService } from "@/src/services/admin/admin.service";
import StatusBadge from "@/src/components/shared/StatusBadge";
import type {
  AdminGear,
  AdminPayment,
  AdminRental,
  AdminReview,
  AdminUser,
  Category,
} from "@/src/types/admin";

type Resource =
  | "categories"
  | "customers"
  | "gears"
  | "orders"
  | "payments"
  | "providers"
  | "reviews";

type ResourceData =
  | AdminGear[]
  | AdminPayment[]
  | AdminRental[]
  | AdminReview[]
  | AdminUser[]
  | Category[];

const configuration: Record<Resource, { title: string; description: string }> =
  {
    categories: {
      title: "Categories",
      description: "Equipment categories available on GearUp.",
    },
    customers: {
      title: "Customers",
      description: "All registered customer accounts.",
    },
    gears: { title: "Gear", description: "All equipment listed on GearUp." },
    orders: {
      title: "Orders",
      description: "All rental orders across the platform.",
    },
    payments: {
      title: "Payments",
      description: "Payment transactions across the platform.",
    },
    providers: {
      title: "Providers",
      description: "All equipment provider accounts.",
    },
    reviews: {
      title: "Reviews",
      description: "Customer reviews for listed equipment.",
    },
  };

const headers: Record<Resource, string[]> = {
  categories: ["Image", "Name", "Description"],
  customers: ["Name", "Email", "Phone", "Status"],
  gears: ["Image", "Name", "Category", "Provider", "Price / day", "Status"],
  orders: ["Order", "Customer", "Gear", "Amount", "Status"],
  payments: ["Payment", "Customer", "Order", "Amount", "Method", "Status"],
  providers: ["Name", "Email", "Phone", "Status"],
  reviews: ["Customer", "Gear", "Rating", "Comment"],
};

const requests: Record<Resource, () => Promise<ResourceData>> = {
  categories: adminService.getCategories,
  customers: async () =>
    (await adminService.getUsers()).filter((user) => user.role === "CUSTOMER"),
  gears: adminService.getGear,
  orders: adminService.getRentals,
  payments: adminService.getPayments,
  providers: async () =>
    (await adminService.getUsers()).filter((user) => user.role === "PROVIDER"),
  reviews: adminService.getReviews,
};

function getColumns(resource: Resource, item: ResourceData[number]) {
  if (resource === "categories") {
    const category = item as Category;
    return [
      category.imageUrl ? (
        <Image
          alt={category.name}
          className="rounded object-cover"
          height={48}
          key={category.id}
          src={category.imageUrl}
          unoptimized
          width={64}
        />
      ) : (
        "No image"
      ),
      category.name,
      category.description ?? "—",
    ];
  }

  if (resource === "customers" || resource === "providers") {
    const user = item as AdminUser;
    return [
      user.name,
      user.email,
      user.phone ?? "—",
      <StatusBadge key={`${user.id}-status`} status={user.status} />,
    ];
  }

  if (resource === "gears") {
    const gear = item as AdminGear;
    return [
      gear.imageUrl ? (
        <Image
          alt={gear.name}
          className="rounded object-cover"
          height={48}
          key={gear.id}
          src={gear.imageUrl}
          unoptimized
          width={64}
        />
      ) : (
        "No image"
      ),
      gear.name,
      gear.category.name,
      gear.provider.name,
      `৳${gear.pricePerDay}`,
      <StatusBadge key={`${gear.id}-status`} status={gear.status} />,
    ];
  }

  if (resource === "orders") {
    const rental = item as AdminRental;
    return [
      rental.id.slice(0, 8),
      rental.customer.name,
      rental.items.map((entry) => entry.gearItem.name).join(", "),
      `৳${rental.totalAmount}`,
      <StatusBadge key={`${rental.id}-status`} status={rental.status} />,
    ];
  }

  if (resource === "payments") {
    const payment = item as AdminPayment;
    return [
      payment.id.slice(0, 8),
      payment.customer.name,
      payment.rentalOrder.id.slice(0, 8),
      `৳${payment.amount}`,
      payment.method ?? "—",
      <StatusBadge key={`${payment.id}-status`} status={payment.status} />,
    ];
  }

  const review = item as AdminReview;
  return [
    review.customer.name,
    review.gearItem.name,
    `${review.rating}/5`,
    review.comment ?? "—",
  ];
}

export type { Resource, ResourceData };
export { configuration, headers, requests, getColumns };

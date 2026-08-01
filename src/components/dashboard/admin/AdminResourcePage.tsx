"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import AdminShell from "@/src/components/dashboard/admin/AdminShell";
import { useAdmin } from "@/src/components/providers/AdminProvider";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { adminService } from "@/src/services/admin/admin.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  AdminGear,
  AdminPayment,
  AdminRental,
  AdminReview,
  AdminUser,
  Category,
} from "@/src/types/admin";

type Resource = "categories" | "customers" | "gears" | "orders" | "payments" | "providers" | "reviews";
type ResourceData = AdminGear[] | AdminPayment[] | AdminRental[] | AdminReview[] | AdminUser[] | Category[];

const configuration: Record<Resource, { title: string; description: string }> = {
  categories: { title: "Categories", description: "Equipment categories available on GearUp." },
  customers: { title: "Customers", description: "All registered customer accounts." },
  gears: { title: "Gear", description: "All equipment listed on GearUp." },
  orders: { title: "Orders", description: "All rental orders across the platform." },
  payments: { title: "Payments", description: "Payment transactions across the platform." },
  providers: { title: "Providers", description: "All equipment provider accounts." },
  reviews: { title: "Reviews", description: "Customer reviews for listed equipment." },
};

const requests: Record<Resource, () => Promise<ResourceData>> = {
  categories: adminService.getCategories,
  customers: async () => (await adminService.getUsers()).filter((user) => user.role === "CUSTOMER"),
  gears: adminService.getGear,
  orders: adminService.getRentals,
  payments: adminService.getPayments,
  providers: async () => (await adminService.getUsers()).filter((user) => user.role === "PROVIDER"),
  reviews: adminService.getReviews,
};

function getColumns(resource: Resource, item: ResourceData[number]) {
  if (resource === "categories") {
    const category = item as Category;
    return [category.name, category.description ?? "—"];
  }

  if (resource === "customers" || resource === "providers") {
    const user = item as AdminUser;
    return [user.name, user.email, user.phone ?? "—", user.status];
  }

  if (resource === "gears") {
    const gear = item as AdminGear;
    return [gear.name, gear.category.name, gear.provider.name, `৳${gear.pricePerDay}`, gear.status];
  }

  if (resource === "orders") {
    const rental = item as AdminRental;
    return [rental.id.slice(0, 8), rental.customer.name, rental.items.map((entry) => entry.gearItem.name).join(", "), `৳${rental.totalAmount}`, rental.status];
  }

  if (resource === "payments") {
    const payment = item as AdminPayment;
    return [payment.id.slice(0, 8), payment.customer.name, payment.rentalOrder.id.slice(0, 8), `৳${payment.amount}`, payment.method ?? "—", payment.status];
  }

  const review = item as AdminReview;
  return [review.customer.name, review.gearItem.name, `${review.rating}/5`, review.comment ?? "—"];
}

const headers: Record<Resource, string[]> = {
  categories: ["Name", "Description"],
  customers: ["Name", "Email", "Phone", "Status"],
  gears: ["Name", "Category", "Provider", "Price / day", "Status"],
  orders: ["Order", "Customer", "Gear", "Amount", "Status"],
  payments: ["Payment", "Customer", "Order", "Amount", "Method", "Status"],
  providers: ["Name", "Email", "Phone", "Status"],
  reviews: ["Customer", "Gear", "Rating", "Comment"],
};

export default function AdminResourcePage({ resource }: { resource: Resource }) {
  return <AdminShell><AdminResourceContent resource={resource} /></AdminShell>;
}

function AdminResourceContent({ resource }: { resource: Resource }) {
  const { refreshStats } = useAdmin();
  const [data, setData] = useState<ResourceData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ResourceData[number] | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { title, description } = configuration[resource];

  const loadResource = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await requests[resource]());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, `Unable to load ${title.toLowerCase()}`));
    } finally {
      setIsLoading(false);
    }
  }, [resource, title]);

  useEffect(() => {
    void Promise.resolve().then(loadResource);
  }, [loadResource]);

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const descriptionValue = String(formData.get("description") ?? "").trim();

    if (!name) {
      setCreateError("Category name is required");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const category = await adminService.createCategory({
        name,
        description: descriptionValue || null,
      });
      setData((current) => [category, ...current] as ResourceData);
      await refreshStats();
      setIsCreateOpen(false);
    } catch (requestError) {
      setCreateError(getApiErrorMessage(requestError, "Unable to create category"));
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title} ({data.length})</h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
        {resource === "categories" ? (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger render={<Button />}>Add category</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add category</DialogTitle>
                <DialogDescription>Create a reusable equipment category.</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={createCategory}>
                <div className="space-y-2"><Label htmlFor="category-name">Name</Label><Input id="category-name" name="name" /></div>
                <div className="space-y-2"><Label htmlFor="category-description">Description</Label><Input id="category-description" name="description" /></div>
                {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
                <Button className="w-full" disabled={isCreating} type="submit">{isCreating ? "Creating..." : "Create category"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      {isLoading ? <div className="h-64 animate-pulse rounded-xl bg-muted" /> : null}
      {error ? <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive"><p>{error}</p><Button className="mt-3" onClick={() => void loadResource()} size="sm" variant="outline">Try again</Button></div> : null}
      {!isLoading && !error ? (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr>{headers[resource].map((header) => <th className="px-4 py-3 font-medium" key={header}>{header}</th>)}<th className="px-4 py-3 font-medium">Actions</th></tr></thead>
            <tbody>
              {data.map((item, index) => (
                <tr className="border-t" key={(item as { id: string }).id ?? index}>
                  {getColumns(resource, item).map((value, columnIndex) => <td className="px-4 py-3" key={columnIndex}>{value}</td>)}
                  <td className="px-4 py-3"><Button onClick={() => setSelected(item)} size="sm" variant="outline">Details</Button></td>
                </tr>
              ))}
              {!data.length ? <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={headers[resource].length + 1}>No data found</td></tr> : null}
            </tbody>
          </table>
        </div>
      ) : null}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{title} details</DialogTitle><DialogDescription>Live data returned by the API.</DialogDescription></DialogHeader>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">{selected ? JSON.stringify(selected, null, 2) : ""}</pre>
        </DialogContent>
      </Dialog>
    </section>
  );
}

"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";

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
import ImageUpload from "@/src/components/shared/ImageUpload";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
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
    return [category.imageUrl ? <Image alt={category.name} className="rounded object-cover" height={48} key={category.id} src={category.imageUrl} unoptimized width={64} /> : "No image", category.name, category.description ?? "—"];
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
  categories: ["Image", "Name", "Description"],
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState<string | null>(null);
  const [categoryImageKey, setCategoryImageKey] = useState(0);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { title, description } = configuration[resource];
  const pageSize = 10;
  const filteredData = data.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pageData = filteredData.slice((page - 1) * pageSize, page * pageSize);

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

  useEffect(() => {
    setPage(1);
  }, [resource, search]);

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
        imageUrl: categoryImageUrl,
      });
      setData((current) => [category, ...current] as ResourceData);
      await refreshStats();
      setCategoryImageUrl(null);
      setCategoryImageKey((key) => key + 1);
      setIsCreateOpen(false);
    } catch (requestError) {
      setCreateError(getApiErrorMessage(requestError, "Unable to create category"));
    } finally {
      setIsCreating(false);
    }
  }

  async function updateUserStatus(user: AdminUser) {
    setActionError(null);
    try {
      const status = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      const updatedUser = await adminService.updateUserStatus(user.id, status);
      setData((current) => current.map((item) => (item as AdminUser).id === updatedUser.id ? updatedUser : item) as ResourceData);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, "Unable to update user status"));
    }
  }

  async function removeReview(review: AdminReview) {
    setActionError(null);
    try {
      await adminService.deleteReview(review.id);
      setData((current) => current.filter((item) => (item as AdminReview).id !== review.id) as ResourceData);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, "Unable to delete review"));
    }
  }

  async function removeCategory(category: Category) {
    setActionError(null);
    try {
      await adminService.deleteCategory(category.id);
      setData((current) => current.filter((item) => (item as Category).id !== category.id) as ResourceData);
      await refreshStats();
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, "Unable to delete category"));
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
                <div className="space-y-2"><Label>Category image</Label><ImageUpload key={categoryImageKey} onChange={setCategoryImageUrl} /></div>
                {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
                <Button className="w-full" disabled={isCreating} type="submit">{isCreating ? "Creating..." : "Create category"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      {isLoading ? <div className="h-64 animate-pulse rounded-xl bg-muted" /> : null}
      {error || actionError ? <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive"><p>{actionError ?? error}</p>{error ? <Button className="mt-3" onClick={() => void loadResource()} size="sm" variant="outline">Try again</Button> : null}</div> : null}
      {!isLoading && !error ? (
        <div className="space-y-4"><Input onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} value={search} /><div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr>{headers[resource].map((header) => <th className="px-4 py-3 font-medium" key={header}>{header}</th>)}<th className="px-4 py-3 font-medium">Actions</th></tr></thead>
            <tbody>
              {pageData.map((item, index) => (
                <tr className="border-t" key={(item as { id: string }).id ?? index}>
                  {getColumns(resource, item).map((value, columnIndex) => <td className="px-4 py-3" key={columnIndex}>{value}</td>)}
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-2"><Button onClick={() => setSelected(item)} size="sm" variant="outline">Details</Button>{resource === "customers" || resource === "providers" ? <Button onClick={() => void updateUserStatus(item as AdminUser)} size="sm" variant={(item as AdminUser).status === "ACTIVE" ? "destructive" : "default"}>{(item as AdminUser).status === "ACTIVE" ? "Suspend" : "Activate"}</Button> : null}{resource === "reviews" ? <Button onClick={() => setReviewToDelete(item as AdminReview)} size="sm" variant="destructive">Delete</Button> : null}{resource === "categories" ? <Button onClick={() => setCategoryToDelete(item as Category)} size="sm" variant="destructive">Delete</Button> : null}</div></td>
                </tr>
              ))}
              {!filteredData.length ? <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={headers[resource].length + 1}>No data found</td></tr> : null}
            </tbody>
          </table>
        </div><div className="flex items-center justify-between text-sm text-muted-foreground"><span>{filteredData.length} results</span><div className="flex gap-2"><Button disabled={page === 1} onClick={() => setPage((current) => current - 1)} size="sm" variant="outline">Previous</Button><span className="px-2 py-1">{page} / {totalPages}</span><Button disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} size="sm" variant="outline">Next</Button></div></div></div>
      ) : null}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{title} details</DialogTitle><DialogDescription>Live data returned by the API.</DialogDescription></DialogHeader>
          {selected ? <ResourceDetails item={selected} resource={resource} /> : null}
        </DialogContent>
      </Dialog>
      <ConfirmDialog description="This permanently removes the review from the platform." onConfirm={() => reviewToDelete ? removeReview(reviewToDelete) : Promise.resolve()} onOpenChange={(open) => !open && setReviewToDelete(null)} open={Boolean(reviewToDelete)} title="Delete review?" />
      <ConfirmDialog description={`This deletes ${categoryToDelete?.name ?? "this category"}. Categories with gear cannot be deleted.`} onConfirm={() => categoryToDelete ? removeCategory(categoryToDelete) : Promise.resolve()} onOpenChange={(open) => !open && setCategoryToDelete(null)} open={Boolean(categoryToDelete)} title="Delete category?" />
    </section>
  );
}

function ResourceDetails({ item, resource }: { item: ResourceData[number]; resource: Resource }) {
  if (resource === "customers" || resource === "providers") {
    const user = item as AdminUser;
    return <DetailGrid fields={[["Name", user.name], ["Email", user.email], ["Phone", user.phone ?? "Not provided"], ["Role", user.role], ["Status", user.status], ["Joined", new Date(user.createdAt).toLocaleDateString()]]} />;
  }

  if (resource === "categories") {
    const category = item as Category;
    return <div className="space-y-4">{category.imageUrl ? <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted"><Image alt={category.name} className="object-cover" fill sizes="(max-width: 768px) 100vw, 640px" src={category.imageUrl} unoptimized /></div> : null}<DetailGrid fields={[["Name", category.name], ["Description", category.description ?? "Not provided"]]} /></div>;
  }

  if (resource === "gears") {
    const gear = item as AdminGear;
    return <div className="space-y-4">{gear.imageUrl ? <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted"><Image alt={gear.name} className="object-cover" fill sizes="(max-width: 768px) 100vw, 640px" src={gear.imageUrl} unoptimized /></div> : <div className="flex aspect-video items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">No image provided</div>}<DetailGrid fields={[["Name", gear.name], ["Brand", gear.brand ?? "Not provided"], ["Description", gear.description ?? "Not provided"], ["Category", gear.category.name], ["Provider", gear.provider.name], ["Provider email", gear.provider.email], ["Price per day", `৳${gear.pricePerDay}`], ["Available quantity", `${gear.availableQuantity}/${gear.stockQuantity}`], ["Status", gear.status], ["Specifications", gear.specifications ? Object.entries(gear.specifications).map(([key, value]) => `${key}: ${value}`).join(", ") : "Not provided"]]} /></div>;
  }

  if (resource === "orders") {
    const order = item as AdminRental;
    return <DetailGrid fields={[["Order ID", order.id], ["Customer", order.customer.name], ["Customer email", order.customer.email], ["Gear", order.items.map((entry) => entry.gearItem.name).join(", ")], ["Total amount", `৳${order.totalAmount}`], ["Status", order.status]]} />;
  }

  if (resource === "payments") {
    const payment = item as AdminPayment;
    return <DetailGrid fields={[["Payment ID", payment.id], ["Customer", payment.customer.name], ["Customer email", payment.customer.email], ["Order ID", payment.rentalOrder.id], ["Amount", `৳${payment.amount}`], ["Method", payment.method ?? "Not provided"], ["Status", payment.status]]} />;
  }

  const review = item as AdminReview;
  return <DetailGrid fields={[["Customer", review.customer.name], ["Customer email", review.customer.email], ["Gear", review.gearItem.name], ["Rating", `${review.rating}/5`], ["Comment", review.comment ?? "No comment"]]} />;
}

function DetailGrid({ fields }: { fields: Array<[string, string]> }) {
  return <dl className="grid gap-3 sm:grid-cols-2">{fields.map(([label, value]) => <div className="rounded-lg border p-3" key={label}><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl>;
}

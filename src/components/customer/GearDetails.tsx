"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { createRental, getGearById, getGearReviews } from "@/src/services/customer/customer.service";
import { useAuth } from "@/src/context/AuthContext";
import type { CustomerGear, CustomerReview } from "@/src/types/customer";

export default function GearDetails({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [gear, setGear] = useState<CustomerGear | null>(null);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rentalError, setRentalError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    void Promise.all([getGearById(id), getGearReviews(id)]).then(([nextGear, nextReviews]) => { if (isMounted) { setGear(nextGear); setReviews(nextReviews); setIsLoading(false); } }, (requestError: unknown) => { if (isMounted) { setError(getApiErrorMessage(requestError, "Unable to load equipment details")); setIsLoading(false); } });
    return () => { isMounted = false; };
  }, [id]);

  async function submitRental(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gear) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "CUSTOMER") { setRentalError("Only customer accounts can create rental orders."); return; }
    const values = new FormData(event.currentTarget);
    const startDate = String(values.get("startDate") ?? "");
    const endDate = String(values.get("endDate") ?? "");
    const quantity = Number(values.get("quantity"));
    if (!startDate || !endDate || !quantity) { setRentalError("Select rental dates and quantity."); return; }
    if (endDate < startDate) { setRentalError("End date cannot be before start date."); return; }
    setIsSubmitting(true);
    setRentalError(null);
    try { const rental = await createRental({ startDate, endDate, items: [{ gearItemId: gear.id, quantity }] }); router.push(`/payment?orderId=${rental.id}`); } catch (requestError) { setRentalError(getApiErrorMessage(requestError, "Unable to create rental order")); } finally { setIsSubmitting(false); }
  }

  if (isLoading) return <main className="mx-auto max-w-7xl px-4 py-10"><div className="h-96 animate-pulse rounded-xl bg-muted" /></main>;
  if (error || !gear) return <main className="mx-auto max-w-7xl px-4 py-10"><div className="rounded-xl bg-destructive/10 p-4 text-destructive">{error ?? "Equipment not found."}</div></main>;
  const today = new Date().toISOString().slice(0, 10);
  const available = gear.status === "AVAILABLE" && gear.availableQuantity > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
            {gear.imageUrl ? <Image alt={gear.name} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 50vw" src={gear.imageUrl} unoptimized /> : <div className="flex h-full items-center justify-center text-muted-foreground">No image provided</div>}
          </div>
          <div><p className="text-sm text-primary">{gear.category.name}</p><h1 className="mt-1 text-4xl font-bold">{gear.name}</h1><p className="mt-2 text-muted-foreground">{gear.brand}</p><p className="mt-5 leading-7 text-muted-foreground">{gear.description ?? "No description provided."}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">{Object.entries(gear.specifications ?? {}).map(([label, value]) => <div className="rounded-lg border p-3" key={label}><p className="text-xs uppercase text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>)}</div>
          <div className="rounded-xl border p-4"><p className="font-semibold">Provider</p><p className="mt-2">{gear.provider.name}</p><p className="text-sm text-muted-foreground">{gear.provider.email}</p>{gear.provider.phone ? <p className="text-sm text-muted-foreground">{gear.provider.phone}</p> : null}</div>
        </div>
        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between"><div><p className="text-3xl font-bold">৳{gear.pricePerDay}<span className="text-base font-normal text-muted-foreground"> / day</span></p><p className="mt-2 text-sm text-muted-foreground">{gear.availableQuantity} of {gear.stockQuantity} available</p></div><span className="rounded-full bg-muted px-3 py-1 text-sm">{available ? "Available" : "Unavailable"}</span></div>
          <form className="mt-6 space-y-4" onSubmit={submitRental}>
            <label className="block text-sm font-medium">Start date<Input className="mt-2" min={today} name="startDate" required type="date" /></label>
            <label className="block text-sm font-medium">End date<Input className="mt-2" min={today} name="endDate" required type="date" /></label>
            <label className="block text-sm font-medium">Quantity<Input className="mt-2" defaultValue="1" max={gear.availableQuantity} min="1" name="quantity" required type="number" /></label>
            {rentalError ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{rentalError}</p> : null}
            <Button className="w-full" disabled={!available || isSubmitting} type="submit">{isSubmitting ? "Creating rental..." : (available ? "Rent now" : "Unavailable")}</Button>
          </form>
        </aside>
      </div>
      <section className="mt-12"><h2 className="text-2xl font-bold">Customer reviews</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{reviews.map((review) => <article className="rounded-xl border p-4" key={review.id}><div className="flex justify-between"><p className="font-medium">{review.customer.name}</p><span>{review.rating}/5</span></div><p className="mt-2 text-sm text-muted-foreground">{review.comment ?? "No comment"}</p></article>)}{!reviews.length ? <p className="text-muted-foreground">No reviews yet.</p> : null}</div></section>
    </main>
  );
}

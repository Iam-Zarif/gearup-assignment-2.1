"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { getCategories } from "@/src/services/category/category.service";
import { getGear } from "@/src/services/customer/customer.service";
import type { Category } from "@/src/types/admin";
import type { CustomerGear } from "@/src/types/customer";

export default function GearCatalog({ featured = false }: { featured?: boolean }) {
  const [gear, setGear] = useState<CustomerGear[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGear = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getGear({ searchTerm: searchTerm || undefined, categoryId: categoryId || undefined, availability: "available", limit: featured ? 4 : 24 });
      setGear(result.gear);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load equipment"));
    } finally { setIsLoading(false); }
  }, [categoryId, featured, searchTerm]);

  useEffect(() => { void Promise.resolve().then(loadGear); }, [loadGear]);
  useEffect(() => { void getCategories().then(setCategories).catch(() => undefined); }, []);

  return <section className={featured ? "mx-auto max-w-7xl px-4 py-12" : ""}><div className={featured ? "mb-8 flex items-end justify-between gap-4" : "mb-6"}>{featured ? <div><h2 className="text-3xl font-bold tracking-tight">Featured equipment</h2><p className="mt-2 text-muted-foreground">Browse gear from trusted providers.</p></div> : <div className="grid gap-3 sm:grid-cols-3"><Input onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search equipment..." value={searchTerm} /><select className="h-9 rounded-md border bg-background px-3 text-sm" onChange={(event) => setCategoryId(event.target.value)} value={categoryId}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><Button onClick={() => void loadGear()} variant="outline">Apply filters</Button></div>}{featured ? <Link href="/gear"><Button variant="outline">View all</Button></Link> : null}</div>{isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: featured ? 4 : 8 }, (_, index) => <div className="h-80 animate-pulse rounded-xl bg-muted" key={index} />)}</div> : null}{error ? <div className="rounded-xl bg-destructive/10 p-4 text-destructive"><p>{error}</p><Button className="mt-3" onClick={() => void loadGear()} size="sm" variant="outline">Try again</Button></div> : null}{!isLoading && !error ? <><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{gear.map((item) => <GearCard gear={item} key={item.id} />)}{!gear.length ? <p className="col-span-full rounded-xl border p-8 text-center text-muted-foreground">No equipment found.</p> : null}</div>{!featured ? <p className="mt-4 text-sm text-muted-foreground">{gear.length} equipment items found.</p> : null}</> : null}</section>;
}

function GearCard({ gear }: { gear: CustomerGear }) {
  const isAvailable = gear.status === "AVAILABLE" && gear.availableQuantity > 0;
  return <article className="overflow-hidden rounded-xl border bg-card transition hover:shadow-lg"><div className="relative aspect-[4/3] bg-muted">{gear.imageUrl ? <Image alt={gear.name} className="object-cover" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={gear.imageUrl} unoptimized /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>}<span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs font-medium">{isAvailable ? "Available" : "Unavailable"}</span></div><div className="space-y-3 p-4"><div><p className="text-sm text-muted-foreground">{gear.category.name}</p><h3 className="line-clamp-1 text-lg font-semibold">{gear.name}</h3><p className="text-sm text-muted-foreground">{gear.brand ?? ""}</p></div><p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{gear.description ?? "No description provided."}</p><div className="flex items-center justify-between"><span className="text-lg font-bold">৳{gear.pricePerDay}<span className="text-sm font-normal text-muted-foreground"> / day</span></span><span className="text-xs text-muted-foreground">{gear.availableQuantity} available</span></div><Link className="block" href={`/gear/${gear.id}`}><Button className="w-full" variant={isAvailable ? "default" : "outline"}>{isAvailable ? "View & rent" : "View details"}</Button></Link></div></article>;
}

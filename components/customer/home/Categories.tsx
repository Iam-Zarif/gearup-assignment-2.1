"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { getCategories } from "@/src/services/category/category.service";
import type { Category } from "@/src/types/admin";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void getCategories().then(
      (nextCategories) => {
        if (isMounted) {
          setCategories(nextCategories);
          setIsLoading(false);
        }
      },
      (requestError: unknown) => {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, "Unable to load categories"));
          setIsLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  return <section className="mx-auto max-w-7xl px-4 py-12"><div className="mb-8"><h2 className="text-3xl font-bold tracking-tight">Categories</h2><p className="mt-2 text-muted-foreground">Explore equipment categories available on GearUp.</p></div>{isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" key={index} />)}</div> : null}{error ? <p className="rounded-xl bg-destructive/10 p-4 text-destructive">{error}</p> : null}{!isLoading && !error ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => <article className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm transition hover:shadow-lg" key={category.id}>{category.imageUrl ? <Image alt={category.name} className="object-cover transition duration-300 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={category.imageUrl} unoptimized /> : null}<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4"><h3 className="text-xl font-semibold text-white">{category.name}</h3>{category.description ? <p className="mt-1 line-clamp-2 text-sm text-white/80">{category.description}</p> : null}</div></article>)}{!categories.length ? <p className="col-span-full rounded-xl border p-8 text-center text-muted-foreground">No categories available.</p> : null}</div> : null}</section>;
}

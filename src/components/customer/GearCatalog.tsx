"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { getCategories } from "@/src/services/category/category.service";
import { getGear } from "@/src/services/customer/customer.service";
import type { Category } from "@/src/types/admin";
import type { CustomerGear } from "@/src/types/customer";

export default function GearCatalog({
  featured = false,
}: {
  featured?: boolean;
}) {
  const [gear, setGear] = useState<CustomerGear[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPage: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGear = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getGear({
        searchTerm: searchTerm || undefined,
        categoryId: categoryId || undefined,
        brand: brand || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sort.startsWith("price") ? "pricePerDay" : undefined,
        sortOrder:
          sort === "price-low"
            ? "asc"
            : sort === "price-high"
              ? "desc"
              : undefined,
        availability: "available",
        page,
        limit: featured ? 4 : 12,
      });
      setGear(result.gear);
      setPagination(
        result.meta ?? { page: 1, total: result.gear.length, totalPage: 1 },
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load equipment"));
    } finally {
      setIsLoading(false);
    }
  }, [brand, categoryId, featured, maxPrice, minPrice, page, searchTerm, sort]);

  useEffect(() => {
    void Promise.resolve().then(loadGear);
  }, [loadGear]);
  useEffect(() => {
    void getCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  function resetFilters() {
    setSearchTerm("");
    setCategoryId("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSort("latest");
    setPage(1);
  }

  if (featured)
    return (
      <FeaturedCatalog
        error={error}
        gear={gear}
        isLoading={isLoading}
        onRetry={loadGear}
      />
    );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 ">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            All gears
          </h1>
        </div>
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 pl-10"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, brand, or activity"
            value={searchTerm}
          />
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="size-4" />
              Filters
            </div>
            <Button
              className="h-auto px-0"
              onClick={resetFilters}
              size="sm"
              variant="link"
            >
              <X />
              Clear
            </Button>
          </div>
          <div className="mt-5 space-y-5">
            <FilterField label="Category">
              <Select
                onValueChange={(value) => {
                  setCategoryId(value ?? "");
                  setPage(1);
                }}
                value={categoryId}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue>
                    {categories.find((category) => category.id === categoryId)
                      ?.name ?? "All categories"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
            <FilterField label="Brand">
              <Input
                onChange={(event) => {
                  setBrand(event.target.value);
                  setPage(1);
                }}
                placeholder="e.g. Nike"
                value={brand}
              />
            </FilterField>
            <FilterField label="Daily price">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  min="0"
                  onChange={(event) => {
                    setMinPrice(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Min"
                  type="number"
                  value={minPrice}
                />
                <Input
                  min="0"
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Max"
                  type="number"
                  value={maxPrice}
                />
              </div>
            </FilterField>
            <FilterField label="Sort by">
              <Select
                onValueChange={(value) => {
                  setSort(value ?? "latest");
                  setPage(1);
                }}
                value={sort}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Newest listings</SelectItem>
                  <SelectItem value="price-low">Price: low to high</SelectItem>
                  <SelectItem value="price-high">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>
          </div>
        </aside>
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Available equipment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLoading
                  ? "Loading listings..."
                  : `${pagination.total} items found`}
              </p>
            </div>
          </div>
          <CatalogContent
            error={error}
            gear={gear}
            isLoading={isLoading}
            onRetry={loadGear}
          />
          {!isLoading && !error && pagination.totalPage > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                size="icon"
                variant="outline"
              >
                <ChevronLeft />
                <span className="sr-only">Previous page</span>
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPage}
              </span>
              <Button
                disabled={page === pagination.totalPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                size="icon"
                variant="outline"
              >
                <ChevronRight />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FilterField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}

function FeaturedCatalog({
  error,
  gear,
  isLoading,
  onRetry,
}: {
  error: string | null;
  gear: CustomerGear[];
  isLoading: boolean;
  onRetry: () => Promise<void>;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured equipment
          </h2>
          <p className="mt-2 text-muted-foreground">
            Browse gear from trusted providers.
          </p>
        </div>
        <Link href="/gear">
          <Button variant="outline">View all</Button>
        </Link>
      </div>
      {isLoading || error || !gear.length ? <CatalogContent error={error} gear={gear} isLoading={isLoading} onRetry={onRetry} /> : <Carousel autoPlay><CarouselContent>{gear.map((item) => <CarouselItem key={item.id}><GearCard gear={item} /></CarouselItem>)}</CarouselContent></Carousel>}
    </section>
  );
}

function CatalogContent({
  error,
  gear,
  isLoading,
  onRetry,
}: {
  error: string | null;
  gear: CustomerGear[];
  isLoading: boolean;
  onRetry: () => Promise<void>;
}) {
  if (isLoading)
    return (
      <div className="grid gap-5 lg:grid-cols-3 grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="h-96 animate-pulse rounded-2xl bg-muted"
            key={index}
          />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="rounded-2xl bg-destructive/10 p-5 text-destructive">
        <p>{error}</p>
        <Button
          className="mt-3"
          onClick={() => void onRetry()}
          size="sm"
          variant="outline"
        >
          Try again
        </Button>
      </div>
    );
  if (!gear.length)
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <h3 className="font-semibold">No equipment found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try broadening your filters or searching for something else.
        </p>
      </div>
    );
  return (
    <div className="grid gap-5 lg:grid-cols-3 grid-cols-2 ">
      {gear.map((item) => (
        <GearCard gear={item} key={item.id} />
      ))}
    </div>
  );
}

function GearCard({ gear }: { gear: CustomerGear }) {
  const isAvailable = gear.status === "AVAILABLE" && gear.availableQuantity > 0;
  return (
    <Card className="gap-0 py-0 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {gear.imageUrl ? (
          <Image
            alt={gear.name}
            className="object-cover transition duration-300 group-hover/card:scale-105"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={gear.imageUrl}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}
        <Badge
          className="absolute right-3 top-3 bg-background/95 text-foreground shadow-sm"
          variant="outline"
        >
          {isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>
      <CardContent className="space-y-3 px-4 pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {gear.category.name}
          </p>
          <h3 className="mt-1 line-clamp-1 text-lg font-semibold">
            {gear.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {gear.brand || "Independent provider"}
          </p>
        </div>
        <p className="line-clamp-2  text-sm text-muted-foreground">
          {gear.description || "Quality equipment ready for your next outing."}
        </p>
        <div className="flex items-end justify-between">
          <p className="text-xl font-bold">
            ৳{gear.pricePerDay}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {gear.availableQuantity} available
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-4 p-4">
        <Link className="w-full" href={`/gear/${gear.id}`}>
          <Button
            className="w-full"
            variant={isAvailable ? "default" : "outline"}
          >
            {isAvailable ? "View & rent" : "View details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

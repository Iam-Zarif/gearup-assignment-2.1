"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import CatalogContent from "@/src/components/customer/catalog/CatalogContent";
import FeaturedCatalog from "@/src/components/customer/catalog/FeaturedCatalog";
import SharedPagination from "@/src/components/shared/Pagination";

export default function GearCatalog({
  featured = false,
}: {
  featured?: boolean;
}) {
  const router = useRouter();
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

  const handleViewGear = useCallback(
    (selectedGear: { id: string }) => {
      router.push(`/gear/${selectedGear.id}`);
    },
    [router],
  );

  if (featured) {
    return (
      <FeaturedCatalog
        error={error}
        gear={gear}
        isLoading={isLoading}
        onRetry={loadGear}
        onView={handleViewGear}
      />
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
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
            onView={handleViewGear}
          />

          {!isLoading && !error && pagination.totalPage > 1 ? (
            <SharedPagination
              page={pagination.page}
              total={pagination.total}
              totalPage={pagination.totalPage}
              onPageChange={setPage}
            />
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

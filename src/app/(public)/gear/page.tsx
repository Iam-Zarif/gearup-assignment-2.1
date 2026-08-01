"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Equipments from "@/components/customer/home/Equipments";


const totalEquipments = 48;

export default function GearPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div
          className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
          "
        >
          {/* Title */}

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Equipment
              <span className="ml-2 text-muted-foreground">
                ({totalEquipments})
              </span>
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse and rent equipment from trusted providers.
            </p>
          </div>

          {/* Search + Sort */}

          <div
            className="
            flex
            flex-col
            gap-3
            sm:flex-row
            "
          >
            <div className="relative">
              <Search
                className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
                "
              />

              <Input
                placeholder="Search equipment..."
                className="
                h-10
                w-full
                rounded-xl
                pl-10
                sm:w-72
                "
              />
            </div>

            <Select defaultValue="latest">
              <SelectTrigger
                className="
                h-10
                w-full
                rounded-xl
                sm:w-48
                "
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />

                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>

                <SelectItem value="price-low">Price Low to High</SelectItem>

                <SelectItem value="price-high">Price High to Low</SelectItem>

                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Equipments />
      </section>
    </main>
  );
}

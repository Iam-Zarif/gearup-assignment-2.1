import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import SharedGearCard from "@/src/components/shared/GearCard";
import type { CustomerGear } from "@/src/types/customer";
import CatalogContent from "./CatalogContent";

export default function FeaturedCatalog({
  error,
  gear,
  isLoading,
  onRetry,
  onView,
}: {
  error: string | null;
  gear: CustomerGear[];
  isLoading: boolean;
  onRetry: () => Promise<void>;
  onView: (gear: { id: string }) => void;
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

      {isLoading || error || !gear.length ? (
        <CatalogContent
          error={error}
          gear={gear}
          isLoading={isLoading}
          onRetry={onRetry}
          onView={onView}
        />
      ) : (
        <Carousel autoPlay>
          <CarouselContent>
            {gear.map((item) => (
              <CarouselItem key={item.id}>
                <SharedGearCard gear={item} onView={onView} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </section>
  );
}

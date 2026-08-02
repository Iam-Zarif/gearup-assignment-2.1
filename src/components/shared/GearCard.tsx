import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Package, Tag, Boxes } from "lucide-react";

export type Gear = {
  id: string;
  name: string;
  brand?: string | null;
  description?: string | null;
  pricePerDay: number | string;
  stockQuantity?: number;
  availableQuantity?: number;
  imageUrl?: string | null;
  status?: string;

  category?: {
    name: string;
  };
};

interface GearCardProps {
  gear: Gear;
  onView?: (gear: Gear) => void;
}

export default function GearCard({ gear, onView }: GearCardProps) {
  const isAvailable =
    gear.status === "AVAILABLE" && Number(gear.availableQuantity ?? 0) > 0;

  return (
    <Card className="gap-0 overflow-hidden rounded-xl py-0 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 w-full bg-muted">
        <Image
          src={gear.imageUrl || "/placeholder.png"}
          alt={gear.name}
          fill
          sizes="(max-width:768px) 100vw, 300px"
          className="object-cover"
        />
        <Badge
          className="absolute right-3 top-3 bg-background/95 text-foreground shadow-sm"
          variant="outline"
        >
          {isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="line-clamp-1 text-lg">{gear.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {gear.brand || "Independent provider"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {gear.description || "Quality equipment ready for your next outing."}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-primary" />
          {gear.category?.name || "Uncategorized"}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Boxes className="h-4 w-4 text-primary" />
          Available: {gear.availableQuantity ?? 0}/{gear.stockQuantity ?? 0}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">৳{gear.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={() => onView?.(gear)}>
          <Package className="mr-2 h-4 w-4" />
          {isAvailable ? "View & rent" : "View details"}
        </Button>
      </CardFooter>
    </Card>
  );
}

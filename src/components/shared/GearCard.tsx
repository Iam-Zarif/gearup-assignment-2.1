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
  brand: string;
  description: string;
  pricePerDay: number;
  stockQuantity: number;
  availableQuantity: number;
  imageUrl: string;

  category?: {
    name: string;
  };
};

interface GearCardProps {
  gear: Gear;
  onView?: (gear: Gear) => void;
}

export default function GearCard({ gear, onView }: GearCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl transition hover:shadow-lg">
      <div className="relative h-52 w-full bg-muted">
        <Image
          src={gear.imageUrl || "/placeholder.png"}
          alt={gear.name}
          fill
          sizes="(max-width:768px) 100vw, 300px"
          className="object-cover"
        />
      </div>

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg line-clamp-1">{gear.name}</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">{gear.brand}</p>
          </div>

          <Badge>Available</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {gear.description}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-primary" />

          {gear.category?.name || "Uncategorized"}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Boxes className="h-4 w-4 text-primary" />
          Available:
          {gear.availableQuantity}/{gear.stockQuantity}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">৳{gear.pricePerDay}</span>

          <span className="text-sm text-muted-foreground">/day</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={() => onView?.(gear)}>
          <Package className="mr-2 h-4 w-4" />
          Rent Now
        </Button>
      </CardFooter>
    </Card>
  );
}

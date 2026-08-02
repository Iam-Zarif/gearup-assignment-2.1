import { Button } from "@/components/ui/button";
import SharedGearCard from "@/src/components/shared/GearCard";
import type { CustomerGear } from "@/src/types/customer";

export default function CatalogContent({
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
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="h-96 animate-pulse rounded-2xl bg-muted"
            key={index}
          />
        ))}
      </div>
    );
  }

  if (error) {
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
  }

  if (!gear.length) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <h3 className="font-semibold">No equipment found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try broadening your filters or searching for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
      {gear.map((item) => (
        <SharedGearCard key={item.id} gear={item} onView={onView} />
      ))}
    </div>
  );
}

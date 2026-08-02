import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProviderPaginationProps {
  page: number;
  totalPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function ProviderPagination({
  page,
  totalPage,
  total,
  onPageChange,
}: ProviderPaginationProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <p className="text-sm text-muted-foreground">{total} total items</p>
      <Button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        size="icon"
        variant="outline"
      >
        <ChevronLeft />
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {totalPage}
      </span>
      <Button
        disabled={page === totalPage}
        onClick={() => onPageChange(page + 1)}
        size="icon"
        variant="outline"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  page: number;
  totalPage: number;
  total: number;
  limit?: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (value: string | null) => void;
  showLimitSelector?: boolean;
  totalLabel?: string;
}

export default function Pagination({
  page,
  totalPage,
  total,
  limit = 10,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
  totalLabel = "total items",
}: PaginationProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total} {totalLabel}
      </p>

      <div className="flex items-center gap-3">
        {showLimitSelector ? (
          <Select
            onValueChange={(value) => {
              onLimitChange?.(value ?? null);
            }}
            value={String(limit)}
          >
            <SelectTrigger className="h-9 w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 / page</SelectItem>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
            </SelectContent>
          </Select>
        ) : null}

        <Button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          size="icon"
          variant="outline"
        >
          <ChevronLeft />
          <span className="sr-only">Previous page</span>
        </Button>

        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {page} / {totalPage || 1}
        </span>

        <Button
          disabled={page >= totalPage}
          onClick={() => onPageChange(page + 1)}
          size="icon"
          variant="outline"
        >
          <ChevronRight />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}

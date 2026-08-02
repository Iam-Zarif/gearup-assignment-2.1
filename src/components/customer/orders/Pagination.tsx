import SharedPagination from "@/src/components/shared/Pagination";
import type { PaginationMeta } from "./types";

export default function Pagination({
  limit,
  meta,
  onLimitChange,
  onPageChange,
}: {
  limit: number;
  meta: PaginationMeta;
  onLimitChange: (value: string | null) => void;
  onPageChange: (page: number) => void;
}) {
  return (
    <SharedPagination
      limit={limit}
      page={meta.page}
      showLimitSelector
      total={meta.total}
      totalLabel="total results"
      totalPage={meta.totalPage}
      onLimitChange={(value) => onLimitChange(value)}
      onPageChange={onPageChange}
    />
  );
}

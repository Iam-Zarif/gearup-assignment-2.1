import SharedPagination from "@/src/components/shared/Pagination";

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
    <SharedPagination
      page={page}
      total={total}
      totalPage={totalPage}
      onPageChange={onPageChange}
    />
  );
}

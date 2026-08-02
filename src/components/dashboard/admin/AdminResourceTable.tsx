import { Button } from "@/components/ui/button";
import type {
  AdminReview,
  AdminResourceTableProps,
  AdminUser,
  Category,
} from "@/src/types/admin";
import { getColumns } from "./AdminResourceConfig";

export default function AdminResourceTable({
  resource,
  title,
  headers,
  filteredData,
  pageData,
  page,
  totalPages,
  search,
  onSearchChange,
  onPageChange,
  onSelect,
  onUpdateUserStatus,
  onReviewDelete,
  onCategoryDelete,
}: AdminResourceTableProps) {
  return (
    <div className="space-y-4">
      <input
        className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={`Search ${title.toLowerCase()}...`}
        value={search}
      />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              {headers.map((header) => (
                <th className="px-4 py-3 font-medium" key={header}>
                  {header}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, index) => (
              <tr className="border-t" key={(item as { id?: string }).id ?? index}>
                {getColumns(resource, item).map((value, columnIndex) => (
                  <td className="px-4 py-3" key={columnIndex}>
                    {value}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => onSelect(item)}
                      size="sm"
                      variant="outline"
                    >
                      Details
                    </Button>
                    {(resource === "customers" || resource === "providers") && (
                      <Button
                        onClick={() => onUpdateUserStatus(item as AdminUser)}
                        size="sm"
                        variant={
                          (item as AdminUser).status === "ACTIVE"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {(item as AdminUser).status === "ACTIVE"
                          ? "Suspend"
                          : "Activate"}
                      </Button>
                    )}
                    {resource === "reviews" && (
                      <Button
                        onClick={() => onReviewDelete(item as AdminReview)}
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    )}
                    {resource === "categories" && (
                      <Button
                        onClick={() => onCategoryDelete(item as Category)}
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!filteredData.length ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-muted-foreground"
                  colSpan={headers.length + 1}
                >
                  No data found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredData.length} results</span>
        <div className="flex gap-2">
          <Button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <span className="px-2 py-1">
            {page} / {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

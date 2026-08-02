import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PaginationMeta } from "./types";

export default function Pagination({ limit, meta, onLimitChange, onPageChange }: { limit: number; meta: PaginationMeta; onLimitChange: (value: string | null) => void; onPageChange: (page: number) => void }) {
  return <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">{meta.total} total results</p><div className="flex items-center gap-3"><Select onValueChange={onLimitChange} value={String(limit)}><SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5 / page</SelectItem><SelectItem value="10">10 / page</SelectItem><SelectItem value="20">20 / page</SelectItem></SelectContent></Select><Button disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)} size="icon" variant="outline"><ChevronLeft /><span className="sr-only">Previous page</span></Button><span className="whitespace-nowrap text-sm text-muted-foreground">{meta.page} / {meta.totalPage || 1}</span><Button disabled={meta.page >= meta.totalPage} onClick={() => onPageChange(meta.page + 1)} size="icon" variant="outline"><ChevronRight /><span className="sr-only">Next page</span></Button></div></div>;
}

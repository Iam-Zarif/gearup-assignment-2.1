import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  AVAILABLE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  COMPLETED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  PICKED_UP: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  PAID: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  PLACED: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  RETURNED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  UNAVAILABLE: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  SUSPENDED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-destructive/10 text-destructive",
  FAILED: "bg-destructive/10 text-destructive",
};

export default function StatusBadge({ className, status }: { className?: string; status: string }) {
  return <span className={cn("inline-flex rounded-full px-2 py-1 text-xs font-medium", statusClasses[status] ?? "bg-muted text-muted-foreground", className)}>{status.replaceAll("_", " ")}</span>;
}

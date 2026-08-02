import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function FormInput({
  defaultValue,
  label,
  min,
  name,
  type = "text",
}: {
  defaultValue: string | number;
  label: string;
  min?: string;
  name: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        min={min}
        name={name}
        required
        type={type}
      />
    </div>
  );
}

export function Loader() {
  return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
}

export function RequestError({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry?: () => void;
}) {
  return error ? (
    <div className="space-y-2 rounded-lg bg-destructive/10 p-4 text-destructive">
      <p>{error}</p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="outline">
          Try again
        </Button>
      )}
    </div>
  ) : null;
}

export function EmptyTable({
  columns,
  message,
}: {
  columns: number;
  message: string;
}) {
  return (
    <tr>
      <td
        className="p-8 text-center text-muted-foreground"
        colSpan={columns}
      >
        {message}
      </td>
    </tr>
  );
}

export function Detail({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

export function InventoryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/60 p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

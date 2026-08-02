import type { ReactNode } from "react";

export default function PageHeader({ action, description, title }: { action?: ReactNode; description: string; title: ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-1 text-muted-foreground">{description}</p></div>{action ? <div className="shrink-0">{action}</div> : null}</div>;
}

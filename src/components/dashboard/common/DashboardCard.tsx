import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function DashboardCard({
  title,
  description,
  icon,
  children,
}: Props) {
  return (
    <div className="rounded-xl border bg-background p-5 space-y-3 hover:shadow-md transition">
      
      {icon && (
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>


      {children}

    </div>
  );
}
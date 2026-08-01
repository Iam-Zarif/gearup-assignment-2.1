import { ReactNode } from "react";

interface Props {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function DashboardLayout({
  sidebar,
  children,
}: Props) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="flex gap-6">
        {sidebar}

        <main className="min-h-[calc(100vh-120px)] w-full rounded-xl border bg-background p-6">
          {children}
        </main>
      </div>
    </section>
  );
}
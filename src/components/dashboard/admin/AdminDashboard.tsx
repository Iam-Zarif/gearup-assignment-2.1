"use client";

import AdminShell from "@/src/components/dashboard/admin/AdminShell";
import { useAdmin } from "@/src/components/providers/AdminProvider";

export default function AdminDashboard() {
  return (
    <AdminShell>
      <AdminDashboardContent />
    </AdminShell>
  );
}

function AdminDashboardContent() {
  const { stats, isLoading, error } = useAdmin();
  const cards = [
    ["Users", stats?.users],
    ["Customers", stats?.customers],
    ["Providers", stats?.providers],
    ["Categories", stats?.categories],
    ["Active gear", stats?.activeGear],
    ["Rental orders", stats?.rentals],
    ["Completed revenue", stats ? `৳${stats.revenue}` : undefined],
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="mt-1 text-muted-foreground">A live view of GearUp platform activity.</p>
      </div>
      {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <article className="rounded-xl border bg-card p-5" key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{isLoading ? "—" : value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useAuth } from "@/src/context/AuthContext";
import AdminDashboard from "@/src/components/dashboard/admin/AdminDashboard";
import ProviderDashboard from "@/src/components/dashboard/provider/ProviderDashboard";
import CustomerHome from "@/components/customer/home/CustomerHome";
import DynamicLoader from "@/src/components/shared/DynamicLoader";

export default function Home() {
  const { user, role, isLoading } = useAuth();
  const resolvedRole = user?.role ?? role;

  if (isLoading && !resolvedRole) {
    return (
      <div className="min-h-screen bg-background">
        <DynamicLoader
          sections={[
            { kind: "hero" },
            { kind: "cards", cards: 2 },
          ]}
        />
      </div>
    );
  }

  if (resolvedRole === "ADMIN") {
    return <AdminDashboard />;
  }

  if (resolvedRole === "PROVIDER") {
    return <ProviderDashboard />;
  }

  return <CustomerHome />;

  return null;
}

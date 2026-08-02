"use client";

import { useAuth } from "@/src/context/AuthContext";
import AdminDashboard from "@/src/components/dashboard/admin/AdminDashboard";
import ProviderDashboard from "@/src/components/dashboard/provider/ProviderDashboard";
import CustomerHome from "@/components/customer/home/CustomerHome";
import DynamicLoader from "@/src/components/shared/DynamicLoader";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
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

  if (!user) {
    return <CustomerHome />;
  }

  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (user.role === "PROVIDER") {
    return <ProviderDashboard />;
  }

  if (user.role === "CUSTOMER") {
    return <CustomerHome />;
  }

  return null;
}

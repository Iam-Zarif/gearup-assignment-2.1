"use client";

import { useAuth } from "@/src/context/AuthContext";
import AdminDashboard from "@/src/components/dashboard/admin/AdminDashboard";
import ProviderDashboard from "@/src/components/dashboard/provider/ProviderDashboard";
import CustomerHome from "@/components/customer/home/CustomerHome";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
  }

  if (!user) {
    return <CustomerHome />
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

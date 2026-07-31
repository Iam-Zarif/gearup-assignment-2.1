"use client";

import { useAuth } from "@/src/context/AuthContext";

import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import ProviderDashboard from "@/components/dashboard/provider/ProviderDashboard";
import CustomerHome from "@/components/customer/CustomerHome";

export default function Home() {
  const { user, isLoading } = useAuth();
  console.log("user", user);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <main>
         landing page
      </main>
    );
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
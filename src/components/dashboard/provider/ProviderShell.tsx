"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/provider/ProviderSidebar";
import RoleGuard from "@/src/components/auth/RoleGuard";
import ProviderProvider from "@/src/components/providers/ProviderProvider";

export default function ProviderShell({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["PROVIDER"]}><ProviderProvider><DashboardLayout sidebar={<ProviderSidebar />}>{children}</DashboardLayout></ProviderProvider></RoleGuard>;
}

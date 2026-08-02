"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/provider/ProviderSidebar";
import RoleGuard from "@/src/components/auth/RoleGuard";
import ProviderProvider from "@/src/components/providers/ProviderProvider";

export default function ProviderShell({
  children,
  enableProviderData = true,
}: {
  children: React.ReactNode;
  enableProviderData?: boolean;
}) {
  const layout = (
    <DashboardLayout sidebar={<ProviderSidebar />}>
      {children}
    </DashboardLayout>
  );

  return (
    <RoleGuard allowedRoles={["PROVIDER"]]}>
      {enableProviderData ? <ProviderProvider>{layout}</ProviderProvider> : layout}
    </RoleGuard>
  );
}

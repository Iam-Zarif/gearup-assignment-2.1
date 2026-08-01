"use client";

import AdminProvider from "@/src/components/providers/AdminProvider";
import RoleGuard from "@/src/components/auth/RoleGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <AdminProvider>
        <DashboardLayout sidebar={<AdminSidebar />}>{children}</DashboardLayout>
      </AdminProvider>
    </RoleGuard>
  );
}

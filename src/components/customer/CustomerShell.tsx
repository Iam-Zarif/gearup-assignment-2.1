"use client";

import RoleGuard from "@/src/components/auth/RoleGuard";

export default function CustomerShell({ children }: { children: React.ReactNode }) { return <RoleGuard allowedRoles={["CUSTOMER"]}>{children}</RoleGuard>; }

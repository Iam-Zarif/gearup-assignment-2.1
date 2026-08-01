"use client";

import { useAuth } from "@/src/context/AuthContext";

type Props = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: Props) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading account...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <section className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-3 text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </section>
    );
  }

  return children;
}

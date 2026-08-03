"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getMyRentals } from "@/src/services/customer/customer.service";
import TopNavLogo from "./TopNavLogo";
import TopNavLinks from "./TopNavLinks";
import TopNavRoleBadge from "./TopNavRoleBadge";
import TopNavUserMenu from "./TopNavUserMenu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

const CUSTOMER_LINKS: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Equipment",
    href: "/gear",
  },
];

const PROVIDER_LINKS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/provider",
  },
];

const ADMIN_LINKS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
  },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, role, isLoading, logout } = useAuth();
  const resolvedRole = user?.role ?? role;
  const [orderCount, setOrderCount] = useState(0);
  const [hasFetchedOrderCount, setHasFetchedOrderCount] = useState(false);

  useEffect(() => {
    if (resolvedRole !== "CUSTOMER") {
      setOrderCount(0);
      setHasFetchedOrderCount(false);
      return;
    }

    if (pathname !== "/orders" && pathname !== "/profile") {
      return;
    }

    if (hasFetchedOrderCount) {
      return;
    }

    let mounted = true;

    getMyRentals({ page: 1, limit: 1 })
      .then((result) => {
        if (!mounted) return;
        setOrderCount(result.meta?.total ?? result.rentals.length);
      })
      .catch(() => {
        if (!mounted) return;
        setOrderCount(0);
      })
      .finally(() => {
        if (mounted) setHasFetchedOrderCount(true);
      });

    return () => {
      mounted = false;
    };
  }, [pathname, resolvedRole, hasFetchedOrderCount]);

  const HIDDEN_ROUTES = ["/login", "/register"];

  if (HIDDEN_ROUTES.includes(pathname)) {
    return null;
  }

  if (isLoading && !resolvedRole) {
    return (
      <header className="h-16 border-b flex items-center px-6">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
      </header>
    );
  }

  const isDashboardUser = resolvedRole === "ADMIN" || resolvedRole === "PROVIDER";

  const links =
    resolvedRole === "ADMIN"
      ? ADMIN_LINKS
      : resolvedRole === "PROVIDER"
        ? PROVIDER_LINKS
        : CUSTOMER_LINKS;

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <TopNavLogo />

        {isDashboardUser ? (
          <TopNavRoleBadge role={resolvedRole ?? ""} />
        ) : (
          <TopNavLinks
            links={links}
            activePath={pathname}
            showCustomerCart={resolvedRole === "CUSTOMER"}
            showOrderCount={hasFetchedOrderCount}
            orderCount={orderCount}
          />
        )}

        {isDashboardUser ? (
          <Button
            variant="destructive"
            onClick={() => void handleLogout()}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        ) : (
          <div className="hidden md:flex items-center">
            <TopNavUserMenu user={user} onLogout={handleLogout} />
          </div>
        )}
      </div>
    </header>
  );
}

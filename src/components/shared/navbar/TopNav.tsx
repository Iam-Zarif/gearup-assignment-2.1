"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, UserCircle, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getMyRentals } from "@/src/services/customer/customer.service";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const { user, isLoading, logout } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    void Promise.resolve().then(() => {
      if (user?.role !== "CUSTOMER") {
        setOrderCount(0);
        return;
      }

      getMyRentals({ page: 1, limit: 1 })
        .then((result) => setOrderCount(result.meta?.total ?? result.rentals.length))
        .catch(() => setOrderCount(0));
    });
  }, [pathname, user?.role]);

  const HIDDEN_ROUTES = ["/login", "/register"];

  if (HIDDEN_ROUTES.includes(pathname)) {
    return null;
  }

  if (isLoading) {
    return (
      <header className="h-16 border-b flex items-center px-6">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
      </header>
    );
  }

  const isDashboardUser = user?.role === "ADMIN" || user?.role === "PROVIDER";

  const links =
    user?.role === "ADMIN"
      ? ADMIN_LINKS
      : user?.role === "PROVIDER"
        ? PROVIDER_LINKS
        : CUSTOMER_LINKS;

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <header
      className="
      sticky
      top-0
      z-50
      w-full
      border-b
      bg-background/80
      backdrop-blur
      "
    >
      <div
        className="mx-auto
        flex
        h-16
        max-w-7xl
        items-center
        justify-between
        px-4
        "
      >
        {/* Logo */}

        <Link
          href="/"
          className="
          text-xl
          font-bold
          tracking-tight
          "
        >
          GearUp
        </Link>

        {/* Admin / Provider */}

        {isDashboardUser ? (
          <Badge
            variant="default"
            className="
            px-4
            py-3
            text-sm
            font-semibold
            "
          >
            {user.role}
          </Badge>
        ) : (
          /* Customer Navigation */

          <nav
            className="
            hidden
            md:flex
            items-center
            gap-6
            "
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}

            {user?.role === "CUSTOMER" && (
              <Link href="/orders" className="relative">
                <ShoppingCart size={20} />

                <Badge
                  className="
                  absolute
                  -right-3
                  -top-3
                  h-5
                  px-1
                  text-xs
                  "
                >
                  {orderCount}
                </Badge>
              </Link>
            )}
          </nav>
        )}

        {/* Right Side */}

        {isDashboardUser ? (
          <Button
            variant="destructive"
            onClick={() => void handleLogout()}
            className="
            flex
            items-center
            gap-2
            "
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        ) : (
          <div
            className="
            hidden
            md:flex
            items-center
            "
          >
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => void handleLogout()}>
                    <LogOut
                      className="
                      mr-2
                      h-4
                      w-4
                      "
                    />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

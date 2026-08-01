"use client";

import Link from "next/link";
import { Menu, ShoppingCart, UserCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  {
    label: "Categories",
    href: "/category",
  },
];

const PROVIDER_LINKS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/provider",
  },
  {
    label: "My Equipment",
    href: "/dashboard/provider/equipment",
  },
];

const ADMIN_LINKS: NavItem[] = [
  {
    label: "Admin",
    href: "/dashboard/admin",
  },
];

export default function TopNavbar() {
  const pathname = usePathname();

  const { user, isLoading, logout } = useAuth();

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
        className="
        mx-auto
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

        {/* Desktop Navigation */}

        <nav
          className="
          hidden
          md:flex
          items-center
          gap-6
          "
        >
          {links.map((item: NavItem) => (
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
                0
              </Badge>
            </Link>
          )}
        </nav>


        <div
          className="
          hidden
          md:flex
          items-center
          gap-3
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
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
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

        {/* Mobile Menu */}

        <Sheet>
          <SheetTrigger
            className="
    md:hidden
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-md
    hover:bg-muted
  "
          >
            <Menu size={24} />
          </SheetTrigger>

          <SheetContent side="right">
            <nav
              className="
              flex
              flex-col
              gap-5
              mt-10
              "
            >
              {links.map((item: NavItem) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-lg font-medium",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {user?.role === "CUSTOMER" && (
                <Link
                  href="/orders"
                  className="
                    flex
                    items-center
                    gap-2
                    text-lg
                    font-medium
                    "
                >
                  <ShoppingCart size={20} />
                  Orders
                </Link>
              )}

              {user && (
                <Button variant="destructive" onClick={logout}>
                  Logout
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

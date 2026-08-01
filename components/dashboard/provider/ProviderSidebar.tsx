"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  PlusCircle,
  DollarSign,
  UserCircle,
  Settings,
} from "lucide-react";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard/provider",
    icon: LayoutDashboard,
  },
  {
    title: "My Equipment",
    href: "/dashboard/provider/equipment",
    icon: Boxes,
  },
  {
    title: "Add Equipment",
    href: "/dashboard/provider/equipment/create",
    icon: PlusCircle,
  },
  {
    title: "Orders",
    href: "/dashboard/provider/orders",
    icon: ClipboardList,
  },
  {
    title: "Earnings",
    href: "/dashboard/provider/earnings",
    icon: DollarSign,
  },
  {
    title: "Profile",
    href: "/dashboard/provider/profile",
    icon: UserCircle,
  },
  {
    title: "Settings",
    href: "/dashboard/provider/settings",
    icon: Settings,
  },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 h-[88vh] max-w-[16rem] w-full rounded-xl border bg-background p-3">
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
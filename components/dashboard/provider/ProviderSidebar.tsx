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
} from "lucide-react";

const items = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "My Equipment",
    href: "/provider/equipment",
    icon: Boxes,
  },
  {
    title: "Add Equipment",
    href: "/provider/create-equipment",
    icon: PlusCircle,
  },
  {
    title: "Orders",
    href: "/provider/orders",
    icon: ClipboardList,
  },
  {
    title: "Earnings",
    href: "/provider/earnings",
    icon: DollarSign,
  },
  {
    title: "Profile",
    href: "/provider/profile",
    icon: UserCircle,
  },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-20 h-[88vh] max-w-[16rem] w-full rounded-xl border bg-background p-3">
      <nav className="space-y-1">
        {items?.map((item) => {
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
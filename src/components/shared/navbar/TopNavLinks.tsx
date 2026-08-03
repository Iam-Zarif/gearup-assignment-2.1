import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

interface TopNavLinksProps {
  links: NavItem[];
  activePath: string;
  showOrderCount: boolean;
  orderCount: number;
  showCustomerCart: boolean;
}

export default function TopNavLinks({
  links,
  activePath,
  showOrderCount,
  orderCount,
  showCustomerCart,
}: TopNavLinksProps) {
  function isActive(href: string) {
    if (href === "/") {
      return activePath === "/";
    }

    return activePath === href || activePath.startsWith(`${href}/`);
  }

  return (
    <nav className="hidden md:flex items-center gap-6">
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

      {showCustomerCart ? (
        <Link href="/orders" className="relative">
          <ShoppingCart size={20} />

          {showOrderCount ? (
            <Badge className="absolute -right-3 -top-3 h-5 px-1 text-xs">
              {orderCount}
            </Badge>
          ) : null}
        </Link>
      ) : null}
    </nav>
  );
}

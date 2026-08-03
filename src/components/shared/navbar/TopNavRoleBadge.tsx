import { Badge } from "@/components/ui/badge";

interface TopNavRoleBadgeProps {
  role: string;
}

export default function TopNavRoleBadge({ role }: TopNavRoleBadgeProps) {
  return (
    <Badge variant="default" className="px-4 py-3 text-sm font-semibold">
      {role}
    </Badge>
  );
}

import DashboardCard from "@/src/components/dashboard/common/DashboardCard";
import { FolderTree } from "lucide-react";


interface Props {
  name: string;
  description: string;
  gears: number;
}


export default function CategoryCard({
  name,
  description,
  gears,
}: Props) {

  return (
    <DashboardCard
      title={name}
      description={description}
      icon={<FolderTree />}
    >

      <p className="text-sm text-muted-foreground">
        Equipment: {gears}
      </p>

    </DashboardCard>
  );
}
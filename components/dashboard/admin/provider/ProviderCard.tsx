import DashboardCard from "@/src/components/dashboard/common/DashboardCard";
import { Truck } from "lucide-react";


interface Props {
  name:string;
  email:string;
  equipment:number;
}


export default function ProviderCard({
  name,
  email,
  equipment,
}:Props){

  return (
    <DashboardCard
      title={name}
      description={email}
      icon={<Truck />}
    >

      <p className="text-sm text-muted-foreground">
        Equipment Listed: {equipment}
      </p>

    </DashboardCard>
  );
}
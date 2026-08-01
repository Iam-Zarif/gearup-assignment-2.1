import DashboardCard from "@/src/components/dashboard/common/DashboardCard";
import { Boxes } from "lucide-react";


interface Props {
  name:string;
  category:string;
  price:number;
  status:string;
}


export default function GearCard({
  name,
  category,
  price,
  status,
}:Props){

  return (
    <DashboardCard
      title={name}
      description={category}
      icon={<Boxes />}
    >

      <div className="flex justify-between text-sm">
        <span>
          Price: ৳{price}
        </span>

        <span>
          {status}
        </span>
      </div>

    </DashboardCard>
  );
}
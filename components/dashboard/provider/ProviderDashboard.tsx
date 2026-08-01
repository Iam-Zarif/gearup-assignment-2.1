import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "./ProviderSidebar";


export default function ProviderDashboard() {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>
      <h1 className="text-3xl font-bold">
        Provider Dashboard
      </h1>
    </DashboardLayout>
  );
}
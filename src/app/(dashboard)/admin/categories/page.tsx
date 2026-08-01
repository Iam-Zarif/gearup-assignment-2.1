import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function CategoriesPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      
    
    <div className="flex min-h-100 items-center justify-center rounded-xl border bg-background">
      <h1 className="text-3xl font-bold">
        Categories Coming Soon
      </h1>
    </div>
    </DashboardLayout>
  );
}
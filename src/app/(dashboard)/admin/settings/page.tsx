import AdminSidebar from '@/components/dashboard/admin/AdminSidebar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'


const SettingsPage = () => {
  return (
  <DashboardLayout sidebar={<AdminSidebar />}>
     <div>Settings page</div>
     </DashboardLayout>
  )
}

export default SettingsPage
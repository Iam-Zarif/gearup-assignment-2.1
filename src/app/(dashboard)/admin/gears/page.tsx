import AdminSidebar from '@/components/dashboard/admin/AdminSidebar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const GearsPage = () => {
  return (
    
   
         <DashboardLayout sidebar={<AdminSidebar />}>
          <p>Gear page</p>
         </DashboardLayout>
  )
}

export default GearsPage
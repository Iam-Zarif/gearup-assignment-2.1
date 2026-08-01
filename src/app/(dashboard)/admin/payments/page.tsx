import AdminSidebar from '@/components/dashboard/admin/AdminSidebar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'


const PaymentsPage = () => {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
       <div>Payments page</div>
       </DashboardLayout>
  )
}

export default PaymentsPage
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'


const ReviewsPage = () => {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
       <div>Reviews page</div>
       </DashboardLayout>
  )
}

export default ReviewsPage
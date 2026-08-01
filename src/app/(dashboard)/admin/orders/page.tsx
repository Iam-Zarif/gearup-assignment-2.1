import AdminSidebar from '@/components/dashboard/admin/AdminSidebar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import React from 'react'

const OrdersPage = () => {
  return (
   <DashboardLayout sidebar={<AdminSidebar />}>
    <div>OrdersPage</div>
    </DashboardLayout>
  )
}

export default OrdersPage
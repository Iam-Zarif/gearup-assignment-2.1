import AdminSidebar from '@/components/dashboard/admin/AdminSidebar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import React from 'react'

const CustomersPage = () => {
  return (
     <DashboardLayout sidebar={<AdminSidebar />}>
    <div>CustomersPage</div>
    </DashboardLayout>
  )
}

export default CustomersPage
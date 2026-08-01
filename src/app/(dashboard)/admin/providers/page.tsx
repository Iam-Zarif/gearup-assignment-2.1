import AdminSidebar from '@/components/dashboard/admin/AdminSidebar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import React from 'react'

const ProvidersPage = () => {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
       <div>Providers page</div>
       </DashboardLayout>
  )
}

export default ProvidersPage
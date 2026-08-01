import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ProviderSidebar from '@/components/dashboard/provider/ProviderSidebar'


const EquipmentPage = () => {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>
         
       <div className="flex min-h-100 items-center justify-center ">
         <h1 className="text-3xl font-bold">
        Equipment Page
         </h1>
       </div>
       </DashboardLayout>
  )
}

export default EquipmentPage
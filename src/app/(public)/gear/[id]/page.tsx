import GearDetails from "@/src/components/customer/GearDetails";

export default async function GearDetailsPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <GearDetails id={id} />; }

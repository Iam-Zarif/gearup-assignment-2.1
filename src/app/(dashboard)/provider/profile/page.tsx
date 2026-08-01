import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/provider/ProviderSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";

const provider = {
  name: "Rahim Traders",
  email: "rahim@gmail.com",
  phone: "+8801700000000",
  address: "Dhaka, Bangladesh",
  businessName: "Rahim Equipment Rental",
  status: "ACTIVE",
  totalEquipment: 12,
  totalOrders: 45,
  joinedDate: "January 2026",
};

export default function ProfilePage() {
  return (
    <DashboardLayout sidebar={<ProviderSidebar />}>
      <section className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Provider Profile</h1>

          <p className="text-muted-foreground">
            Manage your provider account information.
          </p>
        </div>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">
                  {provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <CardTitle className="text-xl">{provider.name}</CardTitle>

                <CardDescription>{provider.businessName}</CardDescription>
              </div>
            </div>

            <Badge>{provider.status}</Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Mail className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>

                  <p className="font-medium">{provider.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Phone className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>

                  <p className="font-medium">{provider.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Building2 className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Business</p>

                  <p className="font-medium">{provider.businessName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <MapPin className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Address</p>

                  <p className="font-medium">{provider.address}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Total Equipment</p>

                <p className="text-2xl font-bold">{provider.totalEquipment}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Total Orders</p>

                <p className="text-2xl font-bold">{provider.totalOrders}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Joined</p>

                <p className="font-semibold">{provider.joinedDate}</p>
              </div>
            </div>

            <Button>Edit Profile</Button>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}

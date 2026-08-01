import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, CalendarDays } from "lucide-react";

const customer = {
  name: "Mostofa Fatin",
  email: "mostofa@gmail.com",
  phone: "+8801700000000",
  address: "Dhaka, Bangladesh",
  role: "CUSTOMER",
  joinedAt: "January 2026",
  totalOrders: 12,
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

          <p className="mt-2 text-muted-foreground">
            Manage your account information.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* User Card */}

          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div
                className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-primary/10
                text-primary
                "
              >
                <User className="h-12 w-12" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">{customer.name}</h2>

              <Badge className="mt-3">{customer.role}</Badge>

              <p className="mt-4 text-sm text-muted-foreground">
                Total Orders: {customer.totalOrders}
              </p>
            </CardContent>
          </Card>

          {/* Details */}

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>

                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>

                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">Address</p>

                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>

                  <p className="font-medium">{customer.joinedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

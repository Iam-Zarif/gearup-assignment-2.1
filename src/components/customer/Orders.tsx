"use client";

import Image from "next/image";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

import DataTable, {
  Column,
} from "@/src/components/shared/DataTable";


type Order = {
  id: string;
  gear: string;
  image: string;
  provider: string;
  quantity: number;
  price: number;
  status: string;
  startDate: string;
  endDate: string;
};


const orders: Order[] = [
  {
    id: "ORD-001",
    gear: "John Deere Tractor",
    image: "/gear/tractor.jpg",
    provider: "Rahim Agro",
    quantity: 1,
    price: 5000,
    status: "PENDING",
    startDate: "2026-08-01",
    endDate: "2026-08-03",
  },
  {
    id: "ORD-002",
    gear: "Power Tiller",
    image: "/gear/tiller.jpg",
    provider: "Green Farm",
    quantity: 2,
    price: 6000,
    status: "COMPLETED",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
  },
  {
    id: "ORD-003",
    gear: "Harvester Machine",
    image: "/gear/harvester.jpg",
    provider: "Agro Solution",
    quantity: 1,
    price: 8000,
    status: "FAILED",
    startDate: "2026-07-20",
    endDate: "2026-07-22",
  },
];


const columns: Column<Order>[] = [
  {
    header: "Equipment",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.image}
          alt={row.gear}
          width={45}
          height={45}
          className="rounded-lg object-cover"
        />

        <div>
          <p className="font-medium">
            {row.gear}
          </p>

          <p className="text-sm text-muted-foreground">
            {row.provider}
          </p>
        </div>
      </div>
    ),
  },

  {
    header: "Quantity",
    accessor: "quantity",
  },

  {
    header: "Rental Period",
    cell: (row) => (
      <div className="text-sm">
        <p>{row.startDate}</p>
        <p className="text-muted-foreground">
          to {row.endDate}
        </p>
      </div>
    ),
  },

  {
    header: "Amount",
    cell: (row) => (
      <span>
        ৳{row.price}
      </span>
    ),
  },

  {
    header: "Status",
    cell: (row) => (
      <Badge
        variant={
          row.status === "COMPLETED"
            ? "default"
            : row.status === "FAILED"
              ? "destructive"
              : "secondary"
        }
      >
        {row.status}
      </Badge>
    ),
  },
];


function OrderTable({
  status,
}: {
  status: string;
}) {

  const filteredOrders =
    orders.filter(
      (order) =>
        order.status === status
    );


  return (
    <DataTable
      columns={columns}
      data={filteredOrders}
    />
  );
}



export default function Orders() {

  return (
    <main className="min-h-screen bg-background">

      <section className="mx-auto max-w-7xl px-4 py-10 space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Orders
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your equipment rental orders.
          </p>
        </div>


        <Tabs
          defaultValue="PENDING"
          className="w-full"
        >

          <TabsList>
            <TabsTrigger value="PENDING">
              Pending
            </TabsTrigger>

            <TabsTrigger value="COMPLETED">
              Completed
            </TabsTrigger>

            <TabsTrigger value="FAILED">
              Failed
            </TabsTrigger>
          </TabsList>


          <TabsContent value="PENDING">
            <OrderTable status="PENDING" />
          </TabsContent>


          <TabsContent value="COMPLETED">
            <OrderTable status="COMPLETED" />
          </TabsContent>


          <TabsContent value="FAILED">
            <OrderTable status="FAILED" />
          </TabsContent>


        </Tabs>

      </section>

    </main>
  );
}
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable, { Column } from "@/src/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const reviews = [
  {
    id: "REV-001",
    customer: "Rahim Ahmed",
    gear: "John Deere Tractor",
    rating: 5,
    comment: "Excellent equipment condition.",
    status: "APPROVED",
  },
  {
    id: "REV-002",
    customer: "Karim Hasan",
    gear: "Power Tiller",
    rating: 4,
    comment: "Good performance but delivery was late.",
    status: "APPROVED",
  },
  {
    id: "REV-003",
    customer: "Sadia Akter",
    gear: "Harvester Machine",
    rating: 2,
    comment: "Not satisfied with service.",
    status: "PENDING",
  },
];

type Review = (typeof reviews)[number];

const columns: Column<Review>[] = [
  {
    header: "Review ID",
    accessor: "id",
  },

  {
    header: "Customer",
    accessor: "customer",
  },

  {
    header: "Gear",
    accessor: "gear",
  },

  {
    header: "Rating",
    cell: (review) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{review.rating}/5</span>
      </div>
    ),
  },

  {
    header: "Comment",
    accessor: "comment",
  },

  {
    header: "Status",

    cell: (review) => (
      <Badge variant={review.status === "APPROVED" ? "default" : "secondary"}>
        {review.status}
      </Badge>
    ),
  },
];

export default function ReviewsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reviews
            <span className="ml-2 text-muted-foreground">
              ({reviews.length})
            </span>
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage customer reviews and ratings.
          </p>
        </div>

        <DataTable columns={columns} data={reviews} />
      </section>
    </DashboardLayout>
  );
}

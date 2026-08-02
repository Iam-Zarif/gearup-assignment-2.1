export type AdminStats = {
  users: number;
  providers: number;
  customers: number;
  categories: number;
  gear: number;
  activeGear: number;
  rentals: number;
  revenue: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER" | "PROVIDER";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
};

export type AdminGear = {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  pricePerDay: string;
  stockQuantity: number;
  availableQuantity: number;
  imageUrl: string | null;
  specifications: Record<string, string> | null;
  status: string;
  category: { name: string };
  provider: Pick<AdminUser, "name" | "email">;
};

export type AdminRental = {
  id: string;
  totalAmount: string;
  status: string;
  customer: Pick<AdminUser, "name" | "email">;
  items: Array<{ gearItem: { name: string } }>;
};

export type AdminPayment = {
  id: string;
  amount: string;
  method: string | null;
  status: string;
  customer: Pick<AdminUser, "name" | "email">;
  rentalOrder: { id: string };
};

export type AdminReview = {
  id: string;
  rating: number;
  comment: string | null;
  customer: Pick<AdminUser, "name" | "email">;
  gearItem: { name: string };
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export type ProviderGear = {
  id: string;
  name: string;
  pricePerDay: string;
  stockQuantity: number;
  availableQuantity: number;
  status: string;
  imageUrl: string | null;
  specifications: Record<string, string> | null;
  category: { name: string };
};

export type ProviderOrder = {
  id: string;
  status: "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  totalAmount: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  payment: { status: "PENDING" | "COMPLETED" | "FAILED" } | null;
  customer: { name: string; email: string };
  items: Array<{ id: string; quantity: number; subtotal: string; gearItem: { name: string; pricePerDay: string; availableQuantity: number; stockQuantity: number; imageUrl: string | null } }>;
};

// Admin Resource Management Types
export type AdminResource =
  | "categories"
  | "customers"
  | "gears"
  | "orders"
  | "payments"
  | "providers"
  | "reviews";

export type AdminResourceData =
  | AdminGear[]
  | AdminPayment[]
  | AdminRental[]
  | AdminReview[]
  | AdminUser[]
  | Category[];

export type AdminResourceConfig = {
  title: string;
  description: string;
};

export type AdminCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isCreating: boolean;
  error: string | null;
  imageKey: number;
  onImageChange: (value: string | null) => void;
};

export type AdminResourceTableProps = {
  resource: AdminResource;
  title: string;
  headers: string[];
  filteredData: (AdminGear | AdminPayment | AdminRental | AdminReview | AdminUser | Category)[];
  pageData: (AdminGear | AdminPayment | AdminRental | AdminReview | AdminUser | Category)[];
  page: number;
  totalPages: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSelect: (item: AdminResourceData[number]) => void;
  onUpdateUserStatus: (user: AdminUser) => void;
  onReviewDelete: (review: AdminReview) => void;
  onCategoryDelete: (category: Category) => void;
};

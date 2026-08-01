export type AdminStats = {
  users: number;
  providers: number;
  customers: number;
  categories: number;
  gear: number;
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
  pricePerDay: string;
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
};

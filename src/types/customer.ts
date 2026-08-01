export type ApiResponse<T> = { data: T; meta?: { page: number; limit: number; total: number; totalPage: number } };

export type CustomerGear = {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  pricePerDay: string;
  stockQuantity: number;
  availableQuantity: number;
  imageUrl: string | null;
  specifications: Record<string, string> | null;
  status: "AVAILABLE" | "UNAVAILABLE";
  category: { id: string; name: string };
  provider: { id: string; name: string; email: string; phone: string | null; address: string | null };
  reviews?: CustomerReview[];
};

export type CustomerRental = {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  status: "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  createdAt: string;
  items: Array<{ id: string; quantity: number; subtotal: string; gearItem: CustomerGear; provider: { name: string; email: string } }>;
  payment: CustomerPayment | null;
};

export type CustomerPayment = {
  id: string;
  rentalOrderId: string;
  transactionId: string | null;
  amount: string;
  method: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  rentalOrder: CustomerRental;
};

export type CustomerReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { id: string; name: string; email: string };
  gearItem?: { id: string; name: string };
};

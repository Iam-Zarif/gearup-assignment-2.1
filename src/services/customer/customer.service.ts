import { axiosInstance } from "@/src/lib/axios";
import type { ApiResponse, CustomerGear, CustomerPayment, CustomerRental, CustomerReview } from "@/src/types/customer";

export async function getGear(params: Record<string, string | number | undefined> = {}) {
  const response = await axiosInstance.get<ApiResponse<CustomerGear[]>>("/gear", { params });
  return { gear: response.data.data, meta: response.data.meta };
}

export async function getGearById(id: string) {
  const response = await axiosInstance.get<ApiResponse<CustomerGear>>(`/gear/${id}`);
  return response.data.data;
}

export async function createRental(payload: { startDate: string; endDate: string; items: Array<{ gearItemId: string; quantity: number }> }) {
  const response = await axiosInstance.post<ApiResponse<CustomerRental>>("/rentals", payload);
  return response.data.data;
}

export async function getMyRentals(params: { page: number; limit: number }) {
  const response = await axiosInstance.get<ApiResponse<CustomerRental[]>>("/rentals", { params });
  return { rentals: response.data.data, meta: response.data.meta };
}

export async function createPaymentSession(rentalOrderId: string) {
  const response = await axiosInstance.post<ApiResponse<{ checkoutUrl: string | null; sessionId: string; payment: CustomerPayment }>>("/payments/create", { rentalOrderId });
  return response.data.data;
}

export async function confirmPayment(sessionId: string) {
  const response = await axiosInstance.post<ApiResponse<CustomerPayment>>("/payments/confirm", { sessionId });
  return response.data.data;
}

export async function completeStripePayment(sessionId: string) {
  const response = await axiosInstance.get<ApiResponse<CustomerPayment>>("/payments/success", { params: { session_id: sessionId } });
  return response.data.data;
}

export async function getMyPayments(params: { page: number; limit: number }) {
  const response = await axiosInstance.get<ApiResponse<CustomerPayment[]>>("/payments", { params });
  return { payments: response.data.data, meta: response.data.meta };
}

export async function getGearReviews(gearItemId: string) {
  const response = await axiosInstance.get<ApiResponse<CustomerReview[]>>("/reviews", { params: { gearItemId } });
  return response.data.data;
}

export async function createReview(payload: { gearItemId: string; rentalOrderId: string; rating: number; comment?: string }) {
  const response = await axiosInstance.post<ApiResponse<CustomerReview>>("/reviews", payload);
  return response.data.data;
}

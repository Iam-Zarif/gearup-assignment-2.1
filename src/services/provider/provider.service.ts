import { axiosInstance } from "@/src/lib/axios";
import type { ProviderGear, ProviderOrder } from "@/src/types/admin";

export type CreateGearPayload = {
  categoryId: string;
  name: string;
  brand?: string;
  description?: string;
  pricePerDay: number;
  stockQuantity: number;
  availableQuantity?: number;
  imageUrl?: string;
  specifications?: Record<string, string>;
};

export type UpdateGearPayload = Partial<CreateGearPayload> & {
  status?: "AVAILABLE" | "UNAVAILABLE";
};

export async function createProviderGear(payload: CreateGearPayload) {
  return axiosInstance.post("/provider/gear", payload);
}

type ApiResponse<T> = { data: T };

export async function getProviderGear(): Promise<ProviderGear[]> {
  const response = await axiosInstance.get<ApiResponse<ProviderGear[]>>("/provider/gear");
  return response.data.data;
}

export async function deleteProviderGear(id: string): Promise<void> {
  await axiosInstance.delete(`/provider/gear/${id}`);
}

export async function updateProviderGear(id: string, payload: UpdateGearPayload) {
  const response = await axiosInstance.put<ApiResponse<ProviderGear>>(`/provider/gear/${id}`, payload);
  return response.data.data;
}

export async function updateProviderProfile(payload: { name?: string; phone?: string; address?: string; profilePhoto?: string }) {
  const response = await axiosInstance.patch<ApiResponse<{ id: string; name: string; email: string; phone: string | null; address: string | null; profilePhoto: string | null; role: string }>>("/auth/me", payload);
  return response.data.data;
}

export async function getProviderOrders(): Promise<ProviderOrder[]> {
  const response = await axiosInstance.get<ApiResponse<ProviderOrder[]>>("/provider/orders");
  return response.data.data;
}

export async function updateProviderOrderStatus(id: string, status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED") {
  const response = await axiosInstance.patch<ApiResponse<ProviderOrder>>(`/provider/orders/${id}`, { status });
  return response.data.data;
}

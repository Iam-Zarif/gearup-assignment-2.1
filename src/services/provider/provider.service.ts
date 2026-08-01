import { axiosInstance } from "@/src/lib/axios";

export type CreateGearPayload = {
  categoryId: string;
  name: string;
  brand?: string;
  description?: string;
  pricePerDay: number;
  stockQuantity: number;
  availableQuantity?: number;
  imageUrl?: string;
};

export async function createProviderGear(payload: CreateGearPayload) {
  return axiosInstance.post("/provider/gear", payload);
}

import { axiosInstance } from "@/src/lib/axios";
import type { Category } from "@/src/types/admin";

type ApiResponse<T> = { data: T };

export async function getCategories(): Promise<Category[]> {
  const response = await axiosInstance.get<ApiResponse<Category[]>>("/categories");
  return response.data.data;
}

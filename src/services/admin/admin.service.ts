import { axiosInstance } from "@/src/lib/axios";
import type {
  AdminGear,
  AdminPayment,
  AdminRental,
  AdminReview,
  AdminStats,
  AdminUser,
  Category,
} from "@/src/types/admin";

type ApiResponse<T> = { data: T };

async function getData<T>(url: string): Promise<T> {
  const response = await axiosInstance.get<ApiResponse<T>>(url);
  return response.data.data;
}

export const adminService = {
  getStats: () => getData<AdminStats>("/admin/stats"),
  getUsers: () => getData<AdminUser[]>("/admin/users"),
  getGear: () => getData<AdminGear[]>("/admin/gear"),
  getRentals: () => getData<AdminRental[]>("/admin/rentals"),
  getPayments: () => getData<AdminPayment[]>("/admin/payments"),
  getReviews: () => getData<AdminReview[]>("/admin/reviews"),
  getCategories: () => getData<Category[]>("/categories"),
  createCategory: async (payload: Pick<Category, "name" | "description" | "imageUrl">) => {
    const response = await axiosInstance.post<ApiResponse<Category>>("/categories", payload);
    return response.data.data;
  },
  updateCategory: async (id: string, payload: Pick<Category, "name" | "description" | "imageUrl">) => {
    const response = await axiosInstance.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
    return response.data.data;
  },
  deleteCategory: async (id: string) => {
    await axiosInstance.delete(`/categories/${id}`);
  },
  deleteReview: async (id: string) => {
    await axiosInstance.delete(`/reviews/${id}`);
  },
  updateUserStatus: async (id: string, status: AdminUser["status"]) => {
    const response = await axiosInstance.patch<ApiResponse<AdminUser>>(
      `/admin/users/${id}`,
      { status },
    );
    return response.data.data;
  },
};

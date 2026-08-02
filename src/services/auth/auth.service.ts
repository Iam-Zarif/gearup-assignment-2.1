import { axiosInstance } from "@/src/lib/axios";


export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}


export const registerUser = async (
  payload: RegisterPayload
) => {
  const response = await axiosInstance.post(
    "/auth/register",
    payload
  );

  return response.data;
};


export const loginUser = async (
  payload:{
    email:string;
    password:string;
  }
)=>{
  const response = await axiosInstance.post(
    "/auth/login",
    payload
  );

  return response.data;
};

export async function updateProfile(payload: { name?: string; phone?: string; address?: string; profilePhoto?: string }) {
  const response = await axiosInstance.patch("/auth/me", payload);
  return response.data.data;
}

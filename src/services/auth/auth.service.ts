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
  console.log("registerUser response:", response.data);

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


import { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
  errorDetails?: Array<{ message?: string }>;
};

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    return data?.errorDetails?.[0]?.message ?? data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

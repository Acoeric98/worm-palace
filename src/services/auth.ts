import { apiFetch } from "@/lib/api";

export interface RegisterBody {
  username: string;
  password: string;
  data?: any;
}

export interface RegisterResponse {
  status: string;
}

export async function registerUser(body: RegisterBody): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/register", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export interface LoginBody {
  username: string;
  password: string;
}

export async function loginUser<T = any>(body: LoginBody): Promise<T> {
  return apiFetch<T>("/api/login", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

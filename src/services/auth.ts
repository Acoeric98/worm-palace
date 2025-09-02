import { apiFetch } from "@/lib/api";

export interface RegisterBody {
  username: string;
  password: string;
  data?: Record<string, unknown>;
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

export async function loginUser<T = unknown>(body: LoginBody): Promise<T> {
  return apiFetch<T>("/api/login", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export interface SaveBody {
  username: string;
  password: string;
  data: Record<string, unknown>;
}

export async function saveUser(body: SaveBody): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/save", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

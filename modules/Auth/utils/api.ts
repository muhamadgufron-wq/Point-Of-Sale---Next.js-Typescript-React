import { api } from "@/lib/api";
import type { TokenResponse, User } from "../types";

export async function loginApi(params: URLSearchParams): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data;
}

export async function getMeApi(token: string): Promise<User> {
  const res = await api.get<User>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

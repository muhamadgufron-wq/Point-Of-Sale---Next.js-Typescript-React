export type UserRole = "KASIR" | "OWNER";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

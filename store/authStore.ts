import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get("token") || null,
      isAuthenticated: !!Cookies.get("token"),

      setAuth: (user: User, token: string) => {
        // Simpan token di Cookie (berlaku 7 hari) untuk dibaca Middleware
        Cookies.set("token", token, { expires: 7, sameSite: "strict" });
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        Cookies.remove("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
    }),
    {
      name: "pos-auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

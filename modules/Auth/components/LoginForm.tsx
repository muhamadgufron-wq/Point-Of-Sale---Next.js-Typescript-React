"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi, getMeApi } from "../utils/api";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Lock, User as UserIcon } from "lucide-react";
import { gooeyToast } from "goey-toast";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      gooeyToast.warning("Username dan password tidak boleh kosong!");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", username.trim());
      params.append("password", password);

      const tokenData = await loginApi(params);
      const userData = await getMeApi(tokenData.access_token);

      setAuth(userData, tokenData.access_token);

      gooeyToast.success(`Selamat datang kembali, ${userData.username}!`);
      router.push("/pos");
    } catch (err: unknown) {
      let message = "Login gagal. Silakan periksa username & password.";
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response;
        if (res?.data?.detail) {
          message = res.data.detail;
        }
      }
      gooeyToast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Username
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
            <UserIcon className="w-4 h-4" />
          </div>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Contoh: owner_neneng"
            disabled={loading}
            className="pl-9 h-10 rounded-xl bg-white text-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Password
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
            <Lock className="w-4 h-4" />
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            disabled={loading}
            className="pl-9 h-10 rounded-xl bg-white text-sm"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all gap-2 text-sm mt-2"
      >
        {loading ? (
          <>
            <Spinner className="w-4 h-4" />
            Memverifikasi...
          </>
        ) : (
          "Masuk ke Kasir"
        )}
      </Button>
    </form>
  );
}

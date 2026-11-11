"use client";

import { Store } from "lucide-react";
import { LoginForm } from "./components/LoginForm";

export function AuthView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
        {/* Header Toko */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30">
            <Store className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Warung Umi Neneng</h1>
          <p className="text-sm text-slate-500 mt-1">
            Masuk ke sistem kasir & kelola transaksi warung
          </p>
        </div>

        {/* Form Login Modul */}
        <LoginForm />

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Kredensial default seeder: <br />
            <span className="font-mono text-slate-600">owner_neneng</span> /{" "}
            <span className="font-mono text-slate-600">OwnerNeneng123!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

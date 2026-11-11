"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatRupiah } from "@/lib/utils";
import { checkoutTransactionApi } from "../utils/api";
import { getQuickCashPresets } from "../utils/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputanRupiah } from "@/components/ui/InputanRupiah";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Banknote, CheckCircle2, AlertCircle } from "lucide-react";
import { gooeyToast } from "goey-toast";
import type { TransactionRead } from "@/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transaction: TransactionRead) => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  const [uangBayar, setUangBayar] = useState<number>(totalPrice);
  const [loading, setLoading] = useState(false);

  const uangKembali = uangBayar - totalPrice;
  const isEnough = uangBayar >= totalPrice;
  const presets = getQuickCashPresets(totalPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnough) {
      gooeyToast.error("Jumlah uang pembayaran masih kurang!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        uang_bayar: uangBayar,
        tipe_pembayaran: "CASH",
        items: items.map((i) => ({
          id_product: i.product.id,
          quantity: i.quantity,
        })),
      };

      const transaction = await checkoutTransactionApi(payload);

      gooeyToast.success("Transaksi kasir berhasil disimpan!");
      clearCart();
      onClose();
      onSuccess(transaction);
    } catch (err: unknown) {
      let msg = "Gagal memproses transaksi kasir.";
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response;
        if (res?.data?.detail) {
          msg = res.data.detail;
        }
      }
      gooeyToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-800">
              Pembayaran Kasir (Tunai)
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Total Tagihan */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Total Tagihan
            </span>
            <p className="text-3xl font-black text-emerald-700 mt-1">
              {formatRupiah(totalPrice)}
            </p>
          </div>

          {/* Quick Cash Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Pilihan Uang Cepat (Klik)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant={uangBayar === preset.value ? "default" : "outline"}
                  onClick={() => setUangBayar(preset.value)}
                  className={`h-9 text-xs font-bold rounded-xl transition-all ${
                    uangBayar === preset.value
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {preset.label === "Uang Pas" ? preset.label : `Rp ${preset.label}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Nominal Pembayaran Manual */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">
              Nominal Uang Diterima (Rp)
            </label>
            <InputanRupiah
              size="lg"
              value={uangBayar}
              onChange={(val) => setUangBayar(val)}
              placeholder="0"
              className="h-11 rounded-xl bg-white"
            />
          </div>

          {/* Kalkulasi Kembalian */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              isEnough
                ? "bg-slate-50 border-slate-200 text-slate-800"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {isEnough ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">
                {isEnough ? "Uang Kembalian" : "Uang Masih Kurang"}
              </span>
            </div>
            <span
              className={`text-lg font-black ${
                isEnough ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {formatRupiah(Math.abs(uangKembali))}
            </span>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!isEnough || loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-1.5" />
                  Memproses...
                </>
              ) : (
                "Selesaikan Pembayaran"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

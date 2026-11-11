"use client";

import { useRef } from "react";
import { formatRupiah, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, CheckCircle, Plus } from "lucide-react";
import type { TransactionRead } from "@/types";

interface ReceiptModalProps {
  transaction: TransactionRead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ transaction, isOpen, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <DialogTitle className="text-base font-bold text-slate-900">
              Transaksi Kasir Sukses!
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Printable Receipt Paper */}
        <div className="py-2">
          <div
            ref={receiptRef}
            className="bg-slate-50 p-5 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 space-y-3.5 print:p-0 print:border-none print:shadow-none print:bg-white"
          >
            {/* Header Toko */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                WARUNG UMI NENENG
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Jl. Raya Warung Berkah No. 01
              </p>
              <p className="text-[10px] text-slate-400">Telp: 0812-3456-7890</p>
            </div>

            {/* Info Transaksi */}
            <div className="text-[10px] space-y-1 text-slate-500 border-b border-dashed border-slate-300 pb-2.5">
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="font-bold text-slate-800">
                  {transaction.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{formatDate(transaction.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-700 font-bold">{transaction.status}</span>
              </div>
            </div>

            {/* Daftar Produk */}
            <div className="space-y-2 border-b border-dashed border-slate-300 pb-2.5">
              {transaction.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-[11px]">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">Item #{item.id_product}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.quantity} x {formatRupiah(item.harga_produk)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Rincian Total & Uang Bayar */}
            <div className="space-y-1.5 text-xs pt-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>TOTAL:</span>
                <span>{formatRupiah(transaction.total_transaksi)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>BAYAR (TUNAI):</span>
                <span>{formatRupiah(transaction.uang_bayar)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>KEMBALI:</span>
                <span>{formatRupiah(transaction.uang_kembali)}</span>
              </div>
            </div>

            {/* Footer Nota */}
            <div className="text-center pt-2.5 border-t border-dashed border-slate-300 text-[10px] text-slate-400">
              <p>Terima Kasih Atas Kunjungan Anda!</p>
              <p className="text-[9px] mt-0.5">Barang yang dibeli tidak dapat ditukar</p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1 gap-1.5 text-xs font-semibold"
          >
            <Printer className="w-4 h-4" />
            Cetak Struk
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Transaksi Baru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

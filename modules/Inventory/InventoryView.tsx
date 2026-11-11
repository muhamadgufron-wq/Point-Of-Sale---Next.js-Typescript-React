"use client";

import { useEffect, useState, useCallback } from "react";
import { StockInTable } from "./components/StockInTable";
import { StockInDialog } from "./components/StockInDialog";
import { getStockInListApi } from "./utils/api";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Boxes, ArrowDownToLine, ReceiptText } from "lucide-react";
import type { StockInRead } from "./types";

export function InventoryView() {
  const [records, setRecords] = useState<StockInRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchStockInList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStockInListApi();
      setRecords(data);
    } catch (err) {
      console.error("Gagal mengambil riwayat stok masuk:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getStockInListApi()
      .then((data) => {
        if (active) {
          setRecords(data);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil riwayat stok masuk:", err);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const totalPengeluaranModal = records.reduce(
    (sum, r) => sum + (r.total_biaya || 0),
    0
  );

  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Modul */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Inventaris & Stok Masuk (Kulakan)
              </h1>
              <p className="text-xs text-slate-500">
                Pencatatan faktur barang masuk dari supplier dengan auto Moving-Average modal
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Catat Stok Masuk Baru
          </Button>
        </div>

        {/* Statistik Ringkas Kulakan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Faktur Kulakan</p>
              <p className="text-2xl font-black text-slate-800 mt-1">
                {records.length} Faktur
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <ReceiptText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Pengeluaran Kulakan</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {formatRupiah(totalPengeluaranModal)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownToLine className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tabel Riwayat Kulakan */}
        <StockInTable records={records} loading={loading} />

      {/* Modal Dialog Form Kulakan Baru */}
      <StockInDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchStockInList}
      />
    </div>
  );
}

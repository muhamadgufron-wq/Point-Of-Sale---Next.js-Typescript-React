"use client";

import { formatRupiah, formatDate } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Boxes, Calendar, Truck } from "lucide-react";
import type { StockInRead } from "../types";

interface StockInTableProps {
  records: StockInRead[];
  loading: boolean;
}

export function StockInTable({ records, loading }: StockInTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
      <ScrollArea
        className="w-full max-h-[calc(100vh-23rem)] min-h-[300px]"
        clampContentMinWidth={false}
      >
        <Table containerClassName="overflow-visible" className="w-full min-w-[700px]">
          <TableHeader className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10">
            <TableRow className="bg-slate-50/90 hover:bg-slate-50/90 border-b border-slate-200">
              <TableHead className="font-bold text-slate-700 py-3.5 px-4 whitespace-nowrap bg-slate-50/90">Tanggal Masuk</TableHead>
              <TableHead className="font-bold text-slate-700 py-3.5 px-4 whitespace-nowrap bg-slate-50/90">Supplier / Agen</TableHead>
              <TableHead className="font-bold text-slate-700 py-3.5 px-4 whitespace-nowrap bg-slate-50/90">Catatan</TableHead>
              <TableHead className="font-bold text-slate-700 py-3.5 px-4 whitespace-nowrap bg-slate-50/90 text-center">Jumlah Barang</TableHead>
              <TableHead className="font-bold text-slate-700 py-3.5 px-4 whitespace-nowrap bg-slate-50/90 text-right">Total Biaya Kulakan</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="h-12 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Boxes className="w-6 h-6 text-slate-300 mb-1" />
                    <p className="text-sm font-semibold">Belum Ada Riwayat Kulakan</p>
                    <p className="text-xs text-slate-400">
                      Klik tombol &quot;Catat Stok Masuk&quot; untuk mencatat faktur kulakan baru.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((rec) => (
                <TableRow key={rec.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs">{formatDate(rec.created_at)}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-800 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{rec.supplier || "Supplier Umum"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                    {rec.note || "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold">
                      {rec.items?.length || 0} macam barang
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right text-emerald-700 font-bold text-sm">
                    {formatRupiah(rec.total_biaya)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

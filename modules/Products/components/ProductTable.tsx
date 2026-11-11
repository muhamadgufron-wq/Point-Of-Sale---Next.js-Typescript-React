"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "@/lib/utils";
import { deleteProductApi } from "../utils/api";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogKonfirmasi,
  DialogKonfirmasiAction,
  DialogKonfirmasiCancel,
  DialogKonfirmasiContent,
  DialogKonfirmasiDescription,
  DialogKonfirmasiFooter,
  DialogKonfirmasiHeader,
  DialogKonfirmasiTitle,
} from "@/components/ui/DialogKonfirmasi";
import { Edit2, Trash2 } from "lucide-react";
import { gooeyToast } from "goey-toast";
import type { Product, PaginationMeta } from "../types";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEditProduct: (product: Product) => void;
  onRefresh: () => void;
}

export function ProductTable({
  products,
  loading,
  meta,
  onPageChange,
  onEditProduct,
  onRefresh,
}: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleDelete = async () => {
    if (!productToDelete) return;
    const product = productToDelete;
    setDeletingId(product.id);
    try {
      await deleteProductApi(product.id);
      gooeyToast.success(`Produk "${product.name}" berhasil dihapus!`);
      onRefresh();
    } catch {
      gooeyToast.error("Gagal menghapus produk. Pastikan kamu login sebagai Owner.");
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Produk",
        cell: ({ row }) => (
          <span className="font-bold text-slate-800">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "harga_modal",
        header: () => <div className="text-right">Harga Modal</div>,
        cell: ({ row }) => (
          <div className="text-right text-slate-600 font-medium">
            {formatRupiah(row.original.harga_modal)}
          </div>
        ),
      },
      {
        accessorKey: "harga_jual",
        header: () => <div className="text-right">Harga Jual</div>,
        cell: ({ row }) => (
          <div className="text-right text-emerald-700 font-bold">
            {formatRupiah(row.original.harga_jual)}
          </div>
        ),
      },
      {
        id: "margin",
        header: () => <div className="text-right">Estimasi Margin</div>,
        cell: ({ row }) => {
          const margin = row.original.harga_jual - row.original.harga_modal;
          return (
            <div
              className={`text-right font-medium ${
                margin >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {formatRupiah(margin)}
            </div>
          );
        },
      },
      {
        accessorKey: "stock",
        header: () => <div className="text-center">Status Stok</div>,
        cell: ({ row }) => {
          const stock = row.original.stock;
          const isOutOfStock = stock <= 0;
          const isLowStock = stock > 0 && stock <= 5;

          return (
            <div className="flex justify-center">
              <Badge
                variant={
                  isOutOfStock
                    ? "destructive"
                    : isLowStock
                    ? "secondary"
                    : "default"
                }
                className={
                  isOutOfStock
                    ? "bg-rose-100 text-rose-700 hover:bg-rose-100"
                    : isLowStock
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                }
              >
                {isOutOfStock
                  ? "Habis (0)"
                  : isLowStock
                  ? `Sisa ${stock}`
                  : `${stock} pcs`}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEditProduct(product)}
                className="text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                title="Edit Produk"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={deletingId === product.id}
                onClick={() => setProductToDelete(product)}
                className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                title="Hapus Produk"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [deletingId, onEditProduct]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="Tidak ada produk ditemukan"
        pagination={{
          page: meta.page,
          limit: meta.limit,
          total_page: meta.total_page,
          total_data: meta.total_data,
          onPageChange,
        }}
      />
      <DialogKonfirmasi
        open={productToDelete !== null}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogKonfirmasiContent>
          <DialogKonfirmasiHeader>
            <DialogKonfirmasiTitle>Hapus produk?</DialogKonfirmasiTitle>
            <DialogKonfirmasiDescription>
              Produk &quot;{productToDelete?.name}&quot; akan dinonaktifkan dari katalog.
            </DialogKonfirmasiDescription>
          </DialogKonfirmasiHeader>
          <DialogKonfirmasiFooter>
            <DialogKonfirmasiCancel disabled={deletingId !== null}>
              Batal
            </DialogKonfirmasiCancel>
            <DialogKonfirmasiAction
              onClick={handleDelete}
              disabled={deletingId !== null}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deletingId !== null ? "Menghapus..." : "Hapus Produk"}
            </DialogKonfirmasiAction>
          </DialogKonfirmasiFooter>
        </DialogKonfirmasiContent>
      </DialogKonfirmasi>
    </>
  );
}

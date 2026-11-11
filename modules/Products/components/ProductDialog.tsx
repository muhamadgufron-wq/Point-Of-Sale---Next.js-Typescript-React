"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "../utils/validation";
import { createProductApi, updateProductApi } from "../utils/api";
import { getCategoryResourcesApi } from "@/modules/Categories/utils/api";
import { formatRupiah } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  type DialogContentSize,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputanRupiah } from "@/components/ui/InputanRupiah";
import { InputSearchSelect } from "@/components/ui/InputSearchSelect";
import {
  InputQty,
  InputQtyGroup,
  InputQtyDecrement,
  InputQtyIncrement,
  InputQtyInput,
} from "@/components/ui/InputQty";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { gooeyToast } from "goey-toast";
import type { Product } from "../types";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingProduct?: Product | null;
  size?: DialogContentSize;
}

export function ProductDialog({
  isOpen,
  onClose,
  onSuccess,
  editingProduct,
  size,
}: ProductDialogProps) {
  const [loading, setLoading] = useState(false);

  const isEdit = !!editingProduct;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      id_category: null,
      harga_modal: 0,
      harga_jual: 0,
      stock: 0,
    },
  });

  const hargaModal = watch("harga_modal") || 0;
  const hargaJual = watch("harga_jual") || 0;
  const marginProfit = hargaJual - hargaModal;

  // Sync form dengan data editing
  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        id_category: editingProduct.id_category,
        harga_modal: editingProduct.harga_modal,
        harga_jual: editingProduct.harga_jual,
        stock: editingProduct.stock,
      });
    } else {
      reset({
        name: "",
        id_category: null,
        harga_modal: 0,
        harga_jual: 0,
        stock: 0,
      });
    }
  }, [editingProduct, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      if (isEdit && editingProduct) {
        await updateProductApi(editingProduct.id, values);
        gooeyToast.success(`Produk "${values.name}" berhasil diperbarui!`);
      } else {
        await createProductApi(values);
        gooeyToast.success(`Produk "${values.name}" berhasil ditambahkan!`);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      let msg = "Gagal menyimpan produk.";
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
      <DialogContent size={size ?? "md"} className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            {isEdit ? "Edit Data Produk" : "Tambah Produk Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Nama Produk */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Nama Produk *
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Contoh: Beras Ramos 5kg"
              disabled={loading}
              className="bg-white"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Kategori Dropdown */}
          <div className="space-y-1">
            <Label htmlFor="id_category" className="text-xs font-semibold text-slate-700">
              Kategori
            </Label>
            <Controller
              control={control}
              name="id_category"
              render={({ field }) => (
                <InputSearchSelect
                  id="id_category"
                  options={getCategoryResourcesApi}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pilih Kategori (Opsional)"
                  showClear
                  disabled={loading}
                />
              )}
            />
          </div>

          {/* Harga Modal & Harga Jual Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="harga_modal" className="text-xs font-semibold text-slate-700">
                Harga Modal (Rp) *
              </Label>
              <Controller
                control={control}
                name="harga_modal"
                render={({ field }) => (
                  <InputanRupiah
                    id="harga_modal"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loading}
                    className="bg-white"
                  />
                )}
              />
              {errors.harga_modal && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {errors.harga_modal.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="harga_jual" className="text-xs font-semibold text-slate-700">
                Harga Jual (Rp) *
              </Label>
              <Controller
                control={control}
                name="harga_jual"
                render={({ field }) => (
                  <InputanRupiah
                    id="harga_jual"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loading}
                    className="bg-white"
                  />
                )}
              />
              {errors.harga_jual && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.harga_jual.message}</p>
              )}
            </div>
          </div>

          {/* Profit Preview */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="text-slate-500">Estimasi Keuntungan / Item:</span>
            <span
              className={`font-bold ${marginProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              {formatRupiah(marginProfit)}
            </span>
          </div>

          {/* Stok Fisik */}
          <div className="space-y-1">
            <Label htmlFor="stock" className="text-xs font-semibold text-slate-700">
              Jumlah Stok Fisik *
            </Label>
            <Controller
              control={control}
              name="stock"
              render={({ field }) => (
                <InputQty
                  id="stock"
                  value={field.value ?? 0}
                  onValueChange={(val) => field.onChange(val ?? 0)}
                  min={0}
                  disabled={loading}
                  size="default"
                >
                  <InputQtyGroup className="bg-white">
                    <InputQtyDecrement />
                    <InputQtyInput placeholder="0" />
                    <InputQtyIncrement />
                  </InputQtyGroup>
                </InputQty>
              )}
            />
            {errors.stock && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.stock.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-1.5" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Produk"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

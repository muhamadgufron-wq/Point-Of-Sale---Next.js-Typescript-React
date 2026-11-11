"use client";

import { useEffect, useState } from "react";
import { createStockInApi } from "../utils/api";
import { getProductsApi } from "@/modules/Products/utils/api";
import { formatRupiah } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputanRupiah } from "@/components/ui/InputanRupiah";
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
import { Plus, Trash2, Boxes } from "lucide-react";
import { gooeyToast } from "goey-toast";
import type { Product } from "@/modules/Products/types";
import type { StockInItemCreate } from "../types";

interface StockInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StockInDialog({ isOpen, onClose, onSuccess }: StockInDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<StockInItemCreate[]>([
    { id_product: 0, qty: 1, harga_beli: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  // Load produk untuk dropdown pilihan barang kulakan
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getProductsApi({ page: 1, limit: 100 });
        setProducts(res.data || []);
        if (res.data?.length > 0 && items[0].id_product === 0) {
          setItems([{ id_product: res.data[0].id, qty: 1, harga_beli: res.data[0].harga_modal }]);
        }
      } catch (err) {
        console.error("Gagal mengambil data produk untuk stock in:", err);
      }
    }
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const handleAddItem = () => {
    const defaultProduct = products[0];
    setItems([
      ...items,
      {
        id_product: defaultProduct ? defaultProduct.id : 0,
        qty: 1,
        harga_beli: defaultProduct ? defaultProduct.harga_modal : 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      gooeyToast.warning("Minimal harus ada 1 barang dalam faktur kulakan!");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof StockInItemCreate,
    value: number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-fill harga beli jika produk diganti
    if (field === "id_product") {
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        updated[index].harga_beli = selectedProduct.harga_modal;
      }
    }

    setItems(updated);
  };

  const totalBiayaKulakan = items.reduce(
    (sum, item) => sum + (item.qty * item.harga_beli || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    for (const item of items) {
      if (!item.id_product) {
        gooeyToast.error("Silakan pilih produk yang valid!");
        return;
      }
      if (item.qty <= 0) {
        gooeyToast.error("Jumlah barang masuk (qty) harus lebih dari 0!");
        return;
      }
      if (item.harga_beli < 0) {
        gooeyToast.error("Harga beli modal tidak boleh negatif!");
        return;
      }
    }

    setLoading(true);
    try {
      await createStockInApi({
        supplier: supplier.trim() || undefined,
        note: note.trim() || undefined,
        items,
      });

      gooeyToast.success("Faktur stok masuk berhasil disimpan! Modal & stok telah diperbarui.");
      setSupplier("");
      setNote("");
      setItems([{ id_product: products[0]?.id || 0, qty: 1, harga_beli: 0 }]);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      let msg = "Gagal mencatat stok masuk.";
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
      <DialogContent className="sm:max-w-xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Catat Stok Masuk / Kulakan Barang
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Supplier & Catatan */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">
                Nama Supplier / Agen
              </Label>
              <Input
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Contoh: PT Sumber Berkah"
                disabled={loading}
                className="bg-white"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">
                Catatan / No. Faktur
              </Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Nota #INV-9921"
                disabled={loading}
                className="bg-white"
              />
            </div>
          </div>

          {/* Daftar Barang Kulakan */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-slate-800">
                Daftar Barang Masuk
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="h-7 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Baris
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
                >
                  {/* Select Produk */}
                  <div className="flex-2 min-w-0">
                    <select
                      value={item.id_product}
                      onChange={(e) =>
                        handleItemChange(idx, "id_product", Number(e.target.value))
                      }
                      disabled={loading}
                      className="w-full h-8 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:border-emerald-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stok: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input Qty */}
                  <div className="w-28 shrink-0">
                    <InputQty
                      size="sm"
                      min={1}
                      value={item.qty}
                      onValueChange={(val) =>
                        handleItemChange(idx, "qty", val ?? 1)
                      }
                      disabled={loading}
                    >
                      <InputQtyGroup className="bg-white h-8">
                        <InputQtyDecrement />
                        <InputQtyInput className="text-xs" />
                        <InputQtyIncrement />
                      </InputQtyGroup>
                    </InputQty>
                  </div>

                  {/* Input Harga Beli */}
                  <div className="w-36 shrink-0">
                    <InputanRupiah
                      size="sm"
                      value={item.harga_beli}
                      onChange={(val) =>
                        handleItemChange(idx, "harga_beli", val)
                      }
                      placeholder="Harga Beli"
                      disabled={loading}
                      className="bg-white h-8"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="w-24 text-right text-xs font-bold text-slate-700 truncate">
                    {formatRupiah(item.qty * item.harga_beli)}
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Total Modal Kulakan Card */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-emerald-800">
                Total Biaya Kulakan
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Stok otomatis ditambah & modal dihitung via Moving Average
              </p>
            </div>
            <span className="text-2xl font-black text-emerald-700">
              {formatRupiah(totalBiayaKulakan)}
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
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-1.5" />
                  Menyimpan Faktur...
                </>
              ) : (
                "Simpan Faktur Kulakan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

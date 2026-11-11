"use client";

import { useCartStore } from "@/store/cartStore";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import {
  InputQty,
  InputQtyGroup,
  InputQtyDecrement,
  InputQtyIncrement,
  InputQtyInput,
} from "@/components/ui/InputQty";

interface CartSidebarProps {
  onOpenPaymentModal: () => void;
}

export function CartSidebar({ onOpenPaymentModal }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } =
    useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const isEmpty = items.length === 0;

  return (
    <aside className="w-full lg:w-96 bg-white border border-slate-200/90 rounded-2xl flex flex-col h-[calc(100vh-6.5rem)] shadow-xs sticky top-20 overflow-hidden">
      {/* Header Cart */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Keranjang Kasir</h2>
            <p className="text-[11px] text-slate-500">{totalItems} item dipilih</p>
          </div>
        </div>

        {!isEmpty && (
          <Button
            variant="ghost"
            size="xs"
            onClick={clearCart}
            className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 gap-1 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Keranjang Kosong</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Klik produk di katalog untuk menambahkan ke transaksi kasir.
            </p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={item.product.id}>
              {idx > 0 && <Separator className="my-2.5 bg-slate-100" />}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {formatRupiah(item.product.harga_jual)}
                  </p>
                </div>
                <p className="text-xs font-extrabold text-emerald-700 shrink-0">
                  {formatRupiah(item.subtotal)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-2">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeItem(item.product.id)}
                  className="text-slate-400 hover:text-rose-500"
                  title="Hapus item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>

                <div className="w-28">
                  <InputQty
                    size="sm"
                    min={1}
                    max={item.product.stock}
                    value={item.quantity}
                    onValueChange={(val) => {
                      if (val !== null && val > 0) {
                        updateQuantity(item.product.id, val);
                      }
                    }}
                  >
                    <InputQtyGroup className="bg-slate-50 border-slate-200">
                      <InputQtyDecrement />
                      <InputQtyInput className="font-bold text-xs" />
                      <InputQtyIncrement disabled={item.quantity >= item.product.stock} />
                    </InputQtyGroup>
                  </InputQty>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Total & Checkout Button */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-slate-500">Total Pembayaran</span>
          <span className="text-lg font-black text-slate-900">
            {formatRupiah(totalPrice)}
          </span>
        </div>

        <Button
          onClick={onOpenPaymentModal}
          disabled={isEmpty}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all gap-2 text-sm"
        >
          Bayar Sekarang ({totalItems})
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </aside>
  );
}

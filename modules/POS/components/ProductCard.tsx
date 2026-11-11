"use client";

import { useCartStore } from "@/store/cartStore";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, PackageX, Check } from "lucide-react";
import { gooeyToast } from "goey-toast";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const cartItem = cartItems.find((i) => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      gooeyToast.error("Stok barang ini sudah habis!");
      return;
    }

    const success = addItem(product);
    if (success) {
      gooeyToast.success(`${product.name} ditambahkan`);
    } else {
      gooeyToast.error(`Stok fisik tersisa ${product.stock}`);
    }
  };

  return (
    <div
      onClick={!isOutOfStock ? handleAddToCart : undefined}
      className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 select-none flex flex-col justify-between ${
        isOutOfStock
          ? "border-slate-200 opacity-60 cursor-not-allowed bg-slate-50/80"
          : "border-slate-200/90 hover:border-emerald-500/80 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer active:scale-[0.98]"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant={
              isOutOfStock
                ? "destructive"
                : product.stock <= 5
                ? "secondary"
                : "default"
            }
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
              isOutOfStock
                ? "bg-rose-100 text-rose-700 hover:bg-rose-100"
                : product.stock <= 5
                ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                : "bg-slate-100 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isOutOfStock ? "Habis" : `Sisa ${product.stock}`}
          </Badge>

          {inCartQty > 0 && (
            <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              {inCartQty} di cart
            </Badge>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
      </div>

      {/* Price & Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Harga</p>
          <p className="text-base font-extrabold text-emerald-600">
            {formatRupiah(product.harga_jual)}
          </p>
        </div>

        <Button
          type="button"
          size="icon-sm"
          disabled={isOutOfStock}
          className={`rounded-xl transition-all ${
            isOutOfStock
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white shadow-xs"
          }`}
        >
          {isOutOfStock ? (
            <PackageX className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2.5]" />
          )}
        </Button>
      </div>
    </div>
  );
}

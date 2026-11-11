"use client";

import { useEffect, useState, useCallback } from "react";
import { CategoryTabs } from "@/modules/Categories/components/CategoryTabs";
import { ProductCard } from "./components/ProductCard";
import { CartSidebar } from "./components/CartSidebar";
import { PaymentModal } from "./components/PaymentModal";
import { ReceiptModal } from "./components/ReceiptModal";
import { fetchPosProductsApi } from "./utils/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, PackageOpen } from "lucide-react";
import type { Product, TransactionRead } from "@/types";

export function POSView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<TransactionRead | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPosProductsApi({
        page: 1,
        limit: 100,
        search: debouncedSearch,
        id_category: selectedCategoryId,
      });
      setProducts(data);
    } catch (err) {
      console.error("Gagal mengambil data produk POS:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategoryId]);

  useEffect(() => {
    let active = true;

    fetchPosProductsApi({
      page: 1,
      limit: 100,
      search: debouncedSearch,
      id_category: selectedCategoryId,
    })
      .then((data) => {
        if (active) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data produk POS:", err);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, selectedCategoryId]);

  const handleTransactionSuccess = (transaction: TransactionRead) => {
    setLastTransaction(transaction);
    setIsReceiptOpen(true);
    fetchProducts();
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sisi Kiri: Katalog Produk & Filter */}
          <div className="flex-1 w-full space-y-4">
            {/* Search Bar & Kategori */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama barang (contoh: Beras, Kopi, Minyak)..."
                  className="pl-9 h-10 rounded-xl bg-white text-xs"
                />
              </div>

              {/* Category Tabs Modul Categories */}
              <CategoryTabs
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </div>

            {/* Grid Produk */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-2xl bg-white/70" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <PackageOpen className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Produk Tidak Ditemukan</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Tidak ada barang yang cocok dengan kata kunci atau kategori yang dipilih.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Sisi Kanan: Keranjang Kasir (Cart Sidebar) */}
          <CartSidebar onOpenPaymentModal={() => setIsPaymentOpen(true)} />
        </div>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handleTransactionSuccess}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={lastTransaction}
      />
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { CategoryTabs } from "@/modules/Categories/components/CategoryTabs";
import { ProductTable } from "./components/ProductTable";
import { ProductDialog } from "./components/ProductDialog";
import { getProductsApi } from "./utils/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Package } from "lucide-react";
import type { Product, PaginationMeta } from "./types";

export function ProductView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total_data: 0,
    total_page: 1,
  });

  // Modal dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductsApi({
        page,
        limit: 10,
        search: debouncedSearch,
        id_category: selectedCategoryId,
      });
      setProducts(res.data || []);
      setMeta(res.meta);
    } catch (err) {
      console.error("Gagal mengambil daftar produk:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedCategoryId]);

  useEffect(() => {
    let active = true;

    getProductsApi({
      page,
      limit: 10,
      search: debouncedSearch,
      id_category: selectedCategoryId,
    })
      .then((res) => {
        if (active) {
          setProducts(res.data || []);
          setMeta(res.meta);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil daftar produk:", err);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page, debouncedSearch, selectedCategoryId]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Modul */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Katalog Master Produk</h1>
            <p className="text-xs text-slate-500">
              Kelola daftar produk, harga modal, harga jual, dan kategori barang
            </p>
          </div>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Tambah Produk Baru
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari produk berdasarkan nama..."
            className="pl-9 h-10 rounded-xl bg-white text-xs"
          />
        </div>

        <CategoryTabs
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setPage(1);
          }}
        />
      </div>

      {/* Tabel Produk */}
      <ProductTable
        products={products}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        onEditProduct={handleOpenEdit}
        onRefresh={fetchProducts}
      />

      {/* Modal Dialog Form Tambah/Edit */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchProducts}
        editingProduct={editingProduct}
        size="lg"
      />
    </div>
  );
}

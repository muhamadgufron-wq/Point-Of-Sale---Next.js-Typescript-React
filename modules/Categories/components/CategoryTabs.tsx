"use client";

import { useEffect, useState } from "react";
import { getCategoryResourcesApi } from "../utils/api";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryResource } from "../types";

interface CategoryTabsProps {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export function CategoryTabs({
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  const [categories, setCategories] = useState<CategoryResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategoryResourcesApi();
        setCategories(data);
      } catch (err) {
        console.error("Gagal mengambil resource kategori:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const currentValue = selectedCategoryId === null ? "all" : String(selectedCategoryId);

  if (loading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Skeleton className="w-24 h-8 rounded-lg" />
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-28 h-8 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <Tabs
        value={currentValue}
        onValueChange={(val) =>
          onSelectCategory(val === "all" ? null : Number(val))
        }
      >
        <TabsList className="bg-slate-100/90 p-1 rounded-xl">
          <TabsTab value="all" className="text-xs px-3 py-1.5 font-semibold">
            Semua Produk
          </TabsTab>
          {categories.map((cat) => (
            <TabsTab
              key={cat.id}
              value={String(cat.id)}
              className="text-xs px-3 py-1.5 font-semibold"
            >
              {cat.label}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

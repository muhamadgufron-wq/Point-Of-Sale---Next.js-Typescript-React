import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface POSFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  id_category?: number | null;
}

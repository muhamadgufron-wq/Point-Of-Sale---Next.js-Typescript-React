export interface Product {
  id: number;
  id_category: number | null;
  name: string;
  harga_modal: number;
  harga_jual: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface PaginationMeta {
  total_data: number;
  total_page: number;
  page: number;
  limit: number;
}

export interface ProductListResponse {
  message: string;
  data: Product[];
  meta: PaginationMeta;
}

export interface InventoryFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  id_category?: number | null;
}

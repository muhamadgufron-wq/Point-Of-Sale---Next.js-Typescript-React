import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type {
  Product,
  ProductListResponse,
  InventoryFilterParams,
} from "../types";
import type { ProductFormValues } from "./validation";

export async function getProductsApi(
  params: InventoryFilterParams
): Promise<ProductListResponse> {
  const queryParams: Record<string, string | number> = {
    page: params.page || 1,
    limit: params.limit || 10,
  };

  if (params.search?.trim()) {
    queryParams.search = params.search.trim();
  }
  if (params.id_category !== null && params.id_category !== undefined) {
    queryParams.id_category = params.id_category;
  }

  const res = await api.get<ProductListResponse>("/products/", {
    params: queryParams,
  });
  return res.data;
}

export async function createProductApi(data: ProductFormValues): Promise<Product> {
  const res = await api.post<Product>("/products/", {
    ...data,
    is_active: true,
  });
  return res.data;
}

export async function updateProductApi(
  id: number,
  data: Partial<ProductFormValues>
): Promise<Product> {
  const res = await api.patch<ApiResponse<Product>>(`/products/${id}`, data);
  return res.data.data;
}

export async function deleteProductApi(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

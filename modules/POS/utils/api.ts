import { api } from "@/lib/api";
import type {
  Product,
  ProductListResponse,
  TransactionRead,
  TransactionCreate,
  ApiResponse,
} from "@/types";
import type { POSFilterParams } from "../types";

export async function fetchPosProductsApi(params: POSFilterParams): Promise<Product[]> {
  const queryParams: Record<string, string | number> = {
    page: params.page || 1,
    limit: params.limit || 100,
  };

  if (params.search?.trim()) {
    queryParams.search = params.search.trim();
  }
  if (params.id_category !== null && params.id_category !== undefined) {
    queryParams.id_category = params.id_category;
  }

  const res = await api.get<ProductListResponse>("/products/", { params: queryParams });
  return res.data.data || [];
}

export async function checkoutTransactionApi(
  payload: TransactionCreate
): Promise<TransactionRead> {
  const res = await api.post<ApiResponse<TransactionRead>>("/transactions/", payload);
  return res.data.data;
}

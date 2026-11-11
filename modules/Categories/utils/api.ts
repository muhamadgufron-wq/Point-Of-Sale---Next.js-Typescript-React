import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type { Category, CategoryResource } from "../types";

export async function getCategoryResourcesApi(): Promise<CategoryResource[]> {
  const res = await api.get<ApiResponse<CategoryResource[]>>("/category/resource");
  return res.data.data || [];
}

export async function getCategoriesApi(): Promise<Category[]> {
  const res = await api.get<ApiResponse<Category[]>>("/category/");
  return res.data.data || [];
}

import { api } from "@/lib/api";
import type {
  StockInRead,
  StockInCreate,
  StockInListResponse,
  StockInResponse,
} from "../types";

export async function getStockInListApi(): Promise<StockInRead[]> {
  const res = await api.get<StockInListResponse>("/inventory/stock-in/");
  return res.data.data || [];
}

export async function createStockInApi(data: StockInCreate): Promise<StockInRead> {
  const res = await api.post<StockInResponse>("/inventory/stock-in/", data);
  return res.data.data;
}

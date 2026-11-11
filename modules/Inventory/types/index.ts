export interface StockInItemCreate {
  id_product: number;
  qty: number;
  harga_beli: number;
}

export interface StockInCreate {
  supplier?: string | null;
  note?: string | null;
  items: StockInItemCreate[];
}

export interface StockInItemRead {
  id: number;
  id_product: number;
  qty: number;
  harga_beli: number;
  total: number;
  created_at: string;
}

export interface StockInRead {
  id: string;
  id_user: string;
  supplier?: string | null;
  note?: string | null;
  total_biaya: number;
  created_at: string;
  items: StockInItemRead[];
}

export interface StockInListResponse {
  message: string;
  data: StockInRead[];
}

export interface StockInResponse {
  message: string;
  data: StockInRead;
}

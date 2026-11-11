export type UserRole = "KASIR" | "OWNER";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CategoryResource {
  id: number;
  label: string;
}

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

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface TransactionItemCreate {
  id_product: number;
  quantity: number;
}

export interface TransactionCreate {
  uang_bayar: number;
  tipe_pembayaran: string;
  items: TransactionItemCreate[];
}

export interface TransactionItemRead {
  id: number;
  id_product: number;
  quantity: number;
  harga_produk: number;
  total: number;
}

export interface TransactionRead {
  id: string;
  id_user: string;
  total_transaksi: number;
  uang_bayar: number;
  uang_kembali: number;
  tipe_pembayaran: string;
  status: "COMPLETED" | "CANCELLED";
  alasan_pembatalan?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  items: TransactionItemRead[];
}

export interface TransactionReceiptRead {
  id_transaction: string;
  store_name: string;
  kasir: string;
  status: string;
  created_at: string;
  total_transaksi: number;
  uang_bayar: number;
  uang_kembali: number;
  receipt_text: string;
}

export interface TopProduct {
  id_product: number;
  nama_produk: string;
  total_terjual: number;
  total_pendapatan: number;
}

export interface ReportSummary {
  start_date?: string | null;
  end_date?: string | null;
  total_omset: number;
  total_profit: number;
  total_transaksi: number;
  total_produk_terjual: number;
  top_produk: TopProduct[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

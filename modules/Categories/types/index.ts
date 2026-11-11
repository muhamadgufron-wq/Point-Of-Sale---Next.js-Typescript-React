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

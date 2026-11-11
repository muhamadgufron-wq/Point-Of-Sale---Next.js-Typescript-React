import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .max(100, "Nama produk maksimal 100 karakter"),
  id_category: z.number().nullable().optional(),
  harga_modal: z.number().min(0, "Harga modal tidak boleh negatif"),
  harga_jual: z.number().min(0, "Harga jual tidak boleh negatif"),
  stock: z
    .number()
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

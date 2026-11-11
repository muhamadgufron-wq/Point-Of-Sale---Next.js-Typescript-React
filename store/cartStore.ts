import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.product.id === product.id);

        if (existingIndex > -1) {
          const currentItem = items[existingIndex];
          // Validasi stok fisik produk
          if (currentItem.quantity + 1 > product.stock) {
            return false;
          }
          const updatedItems = [...items];
          const newQty = currentItem.quantity + 1;
          updatedItems[existingIndex] = {
            ...currentItem,
            quantity: newQty,
            subtotal: newQty * product.harga_jual,
          };
          set({ items: updatedItems });
          return true;
        } else {
          if (product.stock < 1) {
            return false;
          }
          set({
            items: [
              ...items,
              {
                product,
                quantity: 1,
                subtotal: product.harga_jual,
              },
            ],
          });
          return true;
        }
      },

      removeItem: (productId: number) => {
        set({
          items: get().items.filter((i) => i.product.id !== productId),
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.product.id === productId);
        if (existingIndex > -1) {
          const product = items[existingIndex].product;
          if (quantity > product.stock) {
            return;
          }
          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...items[existingIndex],
            quantity,
            subtotal: quantity * product.harga_jual,
          };
          set({ items: updatedItems });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.subtotal, 0);
      },
    }),
    {
      name: "pos-cart-storage",
    }
  )
);

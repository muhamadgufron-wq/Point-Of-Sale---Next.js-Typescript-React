import {
  ShoppingCart,
  Package,
  Boxes,
  BarChart3,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface SubMenuItem {
  title: string;
  href: string;
  icon?: LucideIcon;
}

export interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  roles: UserRole[];
  children?: SubMenuItem[]; // Submenu / Nested menu di bawahnya
}

export interface MenuGroup {
  groupLabel: string;
  items: MenuItem[];
}

export const sidebarMenuGroups: MenuGroup[] = [
  {
    groupLabel: "Operasional",
    items: [
      {
        title: "Kasir (POS)",
        href: "/pos",
        icon: ShoppingCart,
        roles: ["KASIR", "OWNER"],
      },
    ],
  },
  {
    groupLabel: "Manajemen Toko",
    items: [
      {
        title: "Master",
        icon: Package,
        roles: ["OWNER"],
        children: [
          {
            title: "Produk",
            href: "/products",
            icon: Package,
          },
          {
            title: "Kategori",
            href: "/categories",
            icon: Package,
          },
          {
            title: "Stok Masuk (Kulakan)",
            href: "/inventory",
            icon: Boxes,
          },
        ],
      },
      {
        title: "Laporan & Riwayat",
        icon: BarChart3,
        roles: ["OWNER"],
        children: [
          {
            title: "Laporan & Omset",
            href: "/reports",
            icon: BarChart3,
          },
          {
            title: "Riwayat Transaksi",
            href: "/transactions",
            icon: ReceiptText,
          },
        ],
      },
    ],
  },
];

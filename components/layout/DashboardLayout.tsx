"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Halaman login tidak menggunakan sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-slate-100/70 flex flex-col min-h-screen">
        {/* Header Bar dengan Tombol Toggle Sidebar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-md">
          <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-xs font-semibold text-slate-500">
            Warung Umi Neneng POS
          </span>
        </header>

        {/* Konten Halaman */}
        <div className="flex-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

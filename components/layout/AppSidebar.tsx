"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { sidebarMenuGroups } from "@/lib/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  DialogKonfirmasi,
  DialogKonfirmasiAction,
  DialogKonfirmasiCancel,
  DialogKonfirmasiContent,
  DialogKonfirmasiDescription,
  DialogKonfirmasiFooter,
  DialogKonfirmasiHeader,
  DialogKonfirmasiTitle,
} from "@/components/ui/DialogKonfirmasi";
import { Store, LogOut, User, ChevronRight } from "lucide-react";
import { useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const userRole = user?.role || "KASIR";
  const isOwner = userRole === "OWNER";

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      {/* Header: Logo & Brand Warung */}
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div
            data-sidebar="brand-info"
            className="flex flex-col truncate group-data-[collapsible=icon]:hidden"
          >
            <span className="text-sm font-bold text-slate-800 truncate leading-tight">
              Warung Umi Neneng
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Point of Sale System
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigasi Menu dari lib/menu.ts */}
      <SidebarContent className="px-2 py-3 space-y-4">
        {sidebarMenuGroups.map((group) => {
          // Filter item sesuai hak akses user (Role-Based)
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(userRole)
          );

          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.groupLabel}>
              <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                {group.groupLabel}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isParentActive =
                      item.href === pathname ||
                      item.children?.some((c) => c.href === pathname);

                    return (
                      <SidebarMenuItem key={item.title}>
                        {/* Jika item tunggal (tanpa submenu) */}
                        {!hasChildren ? (
                          <SidebarMenuButton
                            render={<Link href={item.href || "#"} />}
                            isActive={pathname === item.href}
                            tooltip={item.title}
                            className={
                              pathname === item.href
                                ? "bg-emerald-50 text-emerald-700 font-semibold"
                                : "text-slate-600 hover:bg-slate-100"
                            }
                          >
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        ) : (
                          /* Jika memiliki Submenu (Nested Menu) */
                          <Collapsible
                            defaultOpen={isParentActive}
                            className="group/collapsible"
                          >
                            <CollapsibleTrigger
                              render={
                                <SidebarMenuButton
                                  tooltip={item.title}
                                  isActive={isParentActive}
                                  className={
                                    isParentActive
                                      ? "text-emerald-700 font-bold"
                                      : "text-slate-700 font-medium"
                                  }
                                />
                              }
                            >
                              <item.icon className="w-4 h-4 shrink-0 text-emerald-600" />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto w-4 h-4 shrink-0 transition-transform duration-200 group-data-open/collapsible:rotate-90 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.children?.map((subItem) => {
                                  const isSubActive = pathname === subItem.href;
                                  return (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton
                                        render={<Link href={subItem.href} />}
                                        isActive={isSubActive}
                                        className={
                                          isSubActive
                                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }
                                      >
                                        {subItem.icon && (
                                          <subItem.icon className="w-3.5 h-3.5 shrink-0" />
                                        )}
                                        <span>{subItem.title}</span>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Footer Profil & Logout */}
      <SidebarFooter className="p-3 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div
              data-sidebar="user-info"
              className="flex flex-col truncate group-data-[collapsible=icon]:hidden"
            >
              <span className="text-xs font-bold text-slate-800 truncate">
                {user?.username || "Kasir"}
              </span>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  isOwner ? "text-purple-600" : "text-emerald-600"
                }`}
              >
                {userRole}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            title="Keluar / Logout"
            data-sidebar="logout-btn"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </SidebarFooter>

      <DialogKonfirmasi
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <DialogKonfirmasiContent>
          <DialogKonfirmasiHeader>
            <DialogKonfirmasiTitle>Keluar dari aplikasi?</DialogKonfirmasiTitle>
            <DialogKonfirmasiDescription>
              Sesi kamu akan diakhiri dan kamu perlu login kembali untuk masuk.
            </DialogKonfirmasiDescription>
          </DialogKonfirmasiHeader>
          <DialogKonfirmasiFooter>
            <DialogKonfirmasiCancel>Batal</DialogKonfirmasiCancel>
            <DialogKonfirmasiAction
              onClick={logout}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Keluar
            </DialogKonfirmasiAction>
          </DialogKonfirmasiFooter>
        </DialogKonfirmasiContent>
      </DialogKonfirmasi>

      <SidebarRail />
    </Sidebar>
  );
}

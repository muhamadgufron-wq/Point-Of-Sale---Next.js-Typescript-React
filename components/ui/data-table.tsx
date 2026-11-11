"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTablePaginationProps {
  page: number;
  limit?: number;
  total_page: number;
  total_data: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  pagination?: DataTablePaginationProps;
  emptyMessage?: string;
  className?: string;
  maxHeight?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "ellipsis", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
  }

  return pages;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  pagination,
  emptyMessage = "Tidak ada data yang ditemukan",
  className,
  maxHeight,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.total_page ?? 1,
  });

  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;
  const totalData = pagination?.total_data ?? data.length;
  const totalPage = pagination?.total_page ?? 1;

  const from = totalData === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalData);
  const pageNumbers = getPageNumbers(page, totalPage);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col",
        className
      )}
    >
      <ScrollArea
        className={cn(
          "w-full",
          maxHeight || "max-h-[calc(100vh-21rem)] min-h-[300px]"
        )}
        clampContentMinWidth={false}
      >
        <Table containerClassName="overflow-visible" className="w-full min-w-[750px]">
          <TableHeader className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 shadow-2xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50/90 hover:bg-slate-50/90 border-b border-slate-200">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-bold text-slate-700 py-3.5 px-4 whitespace-nowrap bg-slate-50/90"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              // Skeleton rows saat loading
              [...Array(limit > 10 ? 10 : limit || 5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx} className="h-12 px-4">
                      <div className="h-4 bg-slate-100 rounded-md animate-pulse w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty State
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-36 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-6 h-6 text-slate-300" />
                    <p className="text-sm font-semibold">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Footer: Keterangan Jumlah Data & Komponen Pagination */}
      {pagination && (
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/60">
          <div>
            Menampilkan{" "}
            <strong className="text-slate-800">
              {from} - {to}
            </strong>{" "}
            dari <strong className="text-slate-800">{totalData}</strong> data
            {totalPage > 1 && (
              <span className="text-slate-400 ml-1">
                (Halaman {page} dari {totalPage})
              </span>
            )}
          </div>

          {totalPage > 1 && (
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1">
                {/* Tombol Sebelumnya */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text="Sebelumnya"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1 && !loading) {
                        pagination.onPageChange(page - 1);
                      }
                    }}
                    className={cn(
                      page <= 1 || loading
                        ? "pointer-events-none opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>

                {/* Nomor-nomor Halaman */}
                {pageNumbers.map((p, idx) => {
                  if (p === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  const isActive = p === page;

                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={isActive}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isActive && !loading) {
                            pagination.onPageChange(p);
                          }
                        }}
                        className={cn(
                          loading ? "pointer-events-none opacity-50" : "cursor-pointer"
                        )}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Tombol Berikutnya */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    text="Berikutnya"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPage && !loading) {
                        pagination.onPageChange(page + 1);
                      }
                    }}
                    className={cn(
                      page >= totalPage || loading
                        ? "pointer-events-none opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}

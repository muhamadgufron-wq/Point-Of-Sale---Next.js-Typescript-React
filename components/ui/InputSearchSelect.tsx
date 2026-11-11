"use client";

import * as React from "react";
import {
  InputSearch,
  InputSearchInput,
  InputSearchPopup,
  InputSearchList,
  InputSearchItem,
  InputSearchEmpty,
} from "@/components/ui/InputSearch";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export interface SearchOption {
  id: number | string;
  label: string;
}

export interface InputSearchSelectProps<T extends SearchOption = SearchOption> {
  /**
   * Data opsi dropdown.
   * Bisa berupa array data langsung [{ id, label }]
   * ATAU fungsi API yang me-return Promise<T[]> (misal: getCategoryResourcesApi).
   */
  options: T[] | ((query?: string) => Promise<T[]>);
  /**
   * Nilai yang dipilih (bisa ID: number/string, atau object T, atau null)
   */
  value?: number | string | T | null;
  /**
   * Callback saat nilai berubah.
   * Mengembalikan ID terpilih (number | string | null) dan object option lengkap.
   */
  onChange?: (
    value: number | string | null,
    selectedOption?: T | null
  ) => void;
  /**
   * Callback saat user mencari / memfilter (sudah didebounce)
   */
  onSearch?: (query: string) => void;
  /**
   * Delay waktu tunggu debounce dalam milidetik (default: 400ms)
   */
  debounceMs?: number;
  placeholder?: string;
  emptyMessage?: string;
  showClear?: boolean;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  startAddon?: React.ReactNode;
  className?: string;
  popupClassName?: string;
  id?: string;
  name?: string;
  openOnInputClick?: boolean;
}

export function InputSearchSelect<T extends SearchOption = SearchOption>({
  options,
  value,
  onChange,
  onSearch,
  debounceMs = 400,
  placeholder = "Pilih opsi...",
  emptyMessage = "Tidak ada hasil ditemukan",
  showClear = true,
  disabled = false,
  size = "default",
  startAddon,
  className,
  popupClassName,
  id,
  name,
  openOnInputClick = true,
}: InputSearchSelectProps<T>): React.ReactElement {
  const [items, setItems] = React.useState<T[]>(() => {
    return Array.isArray(options) ? options : [];
  });
  const [loading, setLoading] = React.useState<boolean>(
    typeof options === "function"
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  React.useEffect(() => {
    let isMounted = true;

    if (typeof options === "function") {
      setLoading(true);
      options(debouncedQuery)
        .then((data) => {
          if (isMounted) {
            setItems(Array.isArray(data) ? data : []);
          }
        })
        .catch((err) => {
          console.error("Gagal memuat opsi InputSearchSelect:", err);
          if (isMounted) {
            setItems([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    } else if (Array.isArray(options)) {
      setItems(options);
      setLoading(false);
    }

    onSearch?.(debouncedQuery);

    return () => {
      isMounted = false;
    };
  }, [options, debouncedQuery, onSearch]);

  // Cari item yang sesuai dengan value yang diberikan
  const selectedItem = React.useMemo(() => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "object" && "id" in value) {
      return value as T;
    }
    return items.find((item) => String(item.id) === String(value)) ?? null;
  }, [items, value]);

  const handleValueChange = (val: T | null) => {
    if (!val) {
      onChange?.(null, null);
    } else {
      onChange?.(val.id, val);
    }
  };

  return (
    <InputSearch
      items={items}
      value={selectedItem}
      onValueChange={handleValueChange}
      onInputValueChange={(inputValue, details) => {
        if (
          details.reason === "input-change" ||
          details.reason === "input-clear"
        ) {
          setSearchQuery(inputValue);
        }
      }}
      itemToStringLabel={(item) => (item ? String(item.label) : "")}
      isItemEqualToValue={(a, b) =>
        a && b ? String(a.id) === String(b.id) : a === b
      }
      disabled={disabled || loading}
      openOnInputClick={openOnInputClick}
      name={name}
    >
      <InputSearchInput
        id={id}
        size={size}
        placeholder={loading ? "Memuat..." : placeholder}
        showClear={showClear && !loading && !disabled}
        startAddon={
          loading ? (
            <Spinner className="size-3.5 text-muted-foreground" />
          ) : (
            startAddon
          )
        }
        className={className}
        disabled={disabled || loading}
      />
      <InputSearchPopup
        className={cn(
          "z-[60] min-w-(--anchor-width) max-w-[calc(100vw-2rem)]",
          popupClassName
        )}
      >
        <InputSearchEmpty>{emptyMessage}</InputSearchEmpty>
        <InputSearchList>
          {(item: T) => (
            <InputSearchItem key={item.id} value={item}>
              {item.label}
            </InputSearchItem>
          )}
        </InputSearchList>
      </InputSearchPopup>
    </InputSearch>
  );
}

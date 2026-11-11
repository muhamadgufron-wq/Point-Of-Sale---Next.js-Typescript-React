"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputanRupiahProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size"
  > {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
  size?: "sm" | "default" | "lg";
  showPrefix?: boolean;
  prefix?: string;
}

/**
 * Format angka murni ke format ribuan Indonesia (contoh: 15000 -> "15.000")
 */
function formatNumberWithDots(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val) || val === 0) {
    return "";
  }
  return new Intl.NumberFormat("id-ID").format(val);
}

/**
 * Bersihkan string dari karakter non-digit dan ubah ke number murni
 */
function cleanStringToNumber(str: string): number {
  const digitsOnly = str.replace(/\D/g, "");
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

export const InputanRupiah = React.forwardRef<HTMLInputElement, InputanRupiahProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onValueChange,
      size = "default",
      showPrefix = true,
      prefix = "Rp",
      disabled = false,
      placeholder = "0",
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Internal state untuk display value
    const [displayVal, setDisplayVal] = React.useState<string>(() => {
      const initial = value !== undefined ? value : defaultValue;
      return formatNumberWithDots(initial);
    });

    // Sinkronisasi jika value dari prop luar berubah (misal dari form reset atau state change)
    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayVal(formatNumberWithDots(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawText = e.target.value;
      const numericVal = cleanStringToNumber(rawText);

      // Tampilkan dengan format titik jika > 0, atau kosong jika 0
      const formatted = numericVal > 0 ? new Intl.NumberFormat("id-ID").format(numericVal) : "";
      setDisplayVal(formatted);

      // Panggil callback
      onChange?.(numericVal);
      onValueChange?.(numericVal);
    };

    // Styling varian ukuran
    const sizeClasses = {
      sm: "h-8 text-xs px-2.5",
      default: "h-9 text-sm px-3",
      lg: "h-11 text-base px-4 font-semibold",
    };

    const prefixSizes = {
      sm: "text-xs pl-2.5 pr-1.5",
      default: "text-xs pl-3 pr-2",
      lg: "text-sm pl-4 pr-2 font-bold",
    };

    return (
      <div
        className={cn(
          "relative flex items-center w-full rounded-xl border border-input bg-background shadow-xs/5 transition-all",
          "focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20",
          disabled && "opacity-50 pointer-events-none bg-slate-50",
          className
        )}
      >
        {showPrefix && (
          <span
            className={cn(
              "shrink-0 font-semibold text-slate-400 select-none",
              prefixSizes[size]
            )}
          >
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={displayVal}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground",
            showPrefix ? "pl-0" : "",
            sizeClasses[size]
          )}
          {...props}
        />
      </div>
    );
  }
);

InputanRupiah.displayName = "InputanRupiah";
export { InputanRupiah as InputRupiah };

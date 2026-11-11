import { useEffect, useState } from "react";

/**
 * Custom hook untuk melakukan debounce pada sebuah nilai (value).
 * Sangat efektif untuk input search agar tidak membebani server
 * dengan request API berulang setiap kali user mengetik.
 *
 * @param value Nilai yang ingin di-debounce
 * @param delay Waktu tunda dalam milidetik (default: 400ms)
 * @returns Nilai setelah masa tunda berakhir
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

import { useState, useCallback } from "react";

export type DisplayCurrency = "USD" | "UYU";

const STORAGE_KEY = "displayCurrency";

/** Moneda en la que se muestran los números (persistida por dispositivo). */
export function useDisplayCurrency(): [DisplayCurrency, (c: DisplayCurrency) => void] {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "UYU" ? "UYU" : "USD";
    } catch {
      return "USD";
    }
  });

  const setCurrency = useCallback((c: DisplayCurrency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // sin storage disponible, queda solo en memoria
    }
  }, []);

  return [currency, setCurrency];
}

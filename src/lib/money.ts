// Helpers de moneda (USD / UYU)

export function formatCurrency(amount: number, currency: string = "USD"): string {
  if (currency === "UYU") {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number
): number {
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === "USD" && toCurrency === "UYU") return amount * exchangeRate;
  if (fromCurrency === "UYU" && toCurrency === "USD") return exchangeRate > 0 ? amount / exchangeRate : 0;
  return amount;
}

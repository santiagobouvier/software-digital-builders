import { formatCurrency } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { DisplayCurrency } from "@/hooks/useDisplayCurrency";

interface DualAmountProps {
  /** Monto normalizado a USD */
  usd: number;
  /** Cotización USD → UYU */
  rate: number;
  /** Moneda elegida para el número principal; la otra va abajo en chico */
  displayCurrency: DisplayCurrency;
  className?: string;
}

export const DualAmount = ({ usd, rate, displayCurrency, className }: DualAmountProps) => {
  const primary = displayCurrency === "USD" ? usd : usd * rate;
  const secondary = displayCurrency === "USD" ? usd * rate : usd;
  const secondaryCurrency = displayCurrency === "USD" ? "UYU" : "USD";

  return (
    <div className="min-w-0">
      <p className={cn("text-lg sm:text-xl font-bold font-mono truncate", className)}>
        {formatCurrency(primary, displayCurrency)}
      </p>
      <p className="text-[11px] font-mono text-muted-foreground truncate">
        {formatCurrency(secondary, secondaryCurrency)}
      </p>
    </div>
  );
};

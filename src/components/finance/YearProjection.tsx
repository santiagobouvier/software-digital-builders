import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/money";
import { cn } from "@/lib/utils";
import { CalendarRange, TrendingDown, TrendingUp } from "lucide-react";
import { parseISO } from "date-fns";
import type { DisplayCurrency } from "@/hooks/useDisplayCurrency";
import {
  Transaction,
  ClientPlan,
  MONTH_LABELS,
} from "@/types/finance";

const MONTH_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"];

interface MonthDatum {
  month: string;
  index: number;
  cobrado: number;
  proyectado: number;
  total: number;
  isPast: boolean;
}

interface YearProjectionProps {
  transactions: Transaction[];
  plans: ClientPlan[];
  rate: number;
  displayCurrency: DisplayCurrency;
  /** Convierte un monto a USD */
  toUSD: (amount: number, currency: string) => number;
}

export const YearProjection = ({
  transactions,
  plans,
  rate,
  displayCurrency,
  toUSD,
}: YearProjectionProps) => {
  const { data, totalYear, weakMonths, strongMonths } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    const actual = new Array(12).fill(0);
    const projected = new Array(12).fill(0);

    // Real: cobros pagados este año, por mes de pago
    for (const tx of transactions) {
      if (tx.type !== "income" || tx.status !== "paid" || !tx.paid_date) continue;
      const d = parseISO(tx.paid_date);
      if (d.getFullYear() !== year) continue;
      actual[d.getMonth()] += toUSD(tx.amount, tx.currency);
    }

    // Pendientes: los vencidos y los del mes actual van al mes actual;
    // los futuros SIN plan van a su mes (los de plan los cubre la proyección de planes)
    for (const tx of transactions) {
      if (tx.type !== "income" || tx.status !== "pending") continue;
      const d = parseISO(tx.due_date);
      const usd = toUSD(tx.amount, tx.currency);
      if (d.getFullYear() < year || (d.getFullYear() === year && d.getMonth() <= currentMonth)) {
        projected[currentMonth] += usd;
      } else if (d.getFullYear() === year && !tx.plan_id) {
        projected[d.getMonth()] += usd;
      }
    }

    // Planes activos: proyección de meses futuros de este año
    for (const plan of plans) {
      if (plan.status !== "active") continue;
      const usd = toUSD(plan.amount, plan.currency);
      const nextDue = parseISO(plan.next_due_date);

      if (plan.billing_cycle === "monthly") {
        const firstMonth =
          nextDue.getFullYear() === year
            ? Math.max(nextDue.getMonth(), currentMonth + 1)
            : 12;
        for (let m = firstMonth; m < 12; m++) {
          projected[m] += usd;
        }
      } else {
        const renewalMonth = (plan.renewal_month ?? nextDue.getMonth() + 1) - 1;
        if (renewalMonth > currentMonth && nextDue.getFullYear() === year) {
          projected[renewalMonth] += usd;
        }
      }
    }

    const factor = displayCurrency === "USD" ? 1 : rate;
    const data: MonthDatum[] = MONTH_SHORT.map((month, i) => ({
      month,
      index: i,
      cobrado: actual[i] * factor,
      proyectado: projected[i] * factor,
      total: (actual[i] + projected[i]) * factor,
      isPast: i < currentMonth,
    }));

    const totalYear = data.reduce((sum, d) => sum + d.total, 0);
    const avg = totalYear / 12;

    const weakMonths = data.filter((d) => d.total < avg * 0.6).map((d) => d.index);
    const strongMonths = data.filter((d) => d.total > avg * 1.4 && d.total > 0).map((d) => d.index);

    return { data, totalYear, weakMonths, strongMonths };
  }, [transactions, plans, displayCurrency, rate, toUSD]);

  const compact = (v: number) =>
    new Intl.NumberFormat(displayCurrency === "UYU" ? "es-UY" : "en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(v);

  const secondaryCurrency: DisplayCurrency = displayCurrency === "USD" ? "UYU" : "USD";
  const toSecondary = (v: number) => (displayCurrency === "USD" ? v * rate : v / rate);

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-primary" />
            Proyección {new Date().getFullYear()}
          </CardTitle>
          <div className="text-right">
            <p className="font-mono font-bold">
              {formatCurrency(totalYear, displayCurrency)}
              <span className="text-xs font-normal text-muted-foreground ml-1">este año</span>
            </p>
            <p className="text-[11px] font-mono text-muted-foreground">
              {formatCurrency(toSecondary(totalYear), secondaryCurrency)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Leyenda */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
            Cobrado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/35 border border-primary/60 border-dashed" />
            Proyectado
          </span>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <div className="h-[240px] w-full min-w-[520px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barCategoryGap="25%">
              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={compact}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.25 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as MonthDatum;
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
                      <p className="font-medium text-foreground mb-1">
                        {MONTH_LABELS[d.index]}
                      </p>
                      {d.cobrado > 0 && (
                        <p className="text-muted-foreground">
                          Cobrado:{" "}
                          <span className="font-mono text-foreground">
                            {formatCurrency(d.cobrado, displayCurrency)}
                          </span>
                        </p>
                      )}
                      {d.proyectado > 0 && (
                        <p className="text-muted-foreground">
                          Proyectado:{" "}
                          <span className="font-mono text-foreground">
                            {formatCurrency(d.proyectado, displayCurrency)}
                          </span>
                        </p>
                      )}
                      <p className="text-muted-foreground mt-1 pt-1 border-t border-border/50">
                        Total:{" "}
                        <span className="font-mono font-medium text-foreground">
                          {formatCurrency(d.total, displayCurrency)}
                        </span>
                        <span className="font-mono text-muted-foreground ml-1">
                          ({formatCurrency(toSecondary(d.total), secondaryCurrency)})
                        </span>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="cobrado"
                stackId="mes"
                fill="hsl(var(--primary))"
                isAnimationActive={false}
              />
              <Bar
                dataKey="proyectado"
                stackId="mes"
                fill="hsl(var(--primary))"
                fillOpacity={0.35}
                stroke="hsl(var(--primary))"
                strokeOpacity={0.6}
                strokeDasharray="3 3"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lectura de meses */}
        {(weakMonths.length > 0 || strongMonths.length > 0) && (
          <div className="space-y-1.5 text-xs">
            {weakMonths.length > 0 && (
              <p className="flex items-start gap-1.5 text-muted-foreground">
                <TrendingDown className="h-3.5 w-3.5 text-warning mt-0.5 flex-shrink-0" />
                <span>
                  <span className="text-warning font-medium">Meses flojos</span>{" "}
                  (hay que salir a buscar trabajo):{" "}
                  {weakMonths.map((i) => MONTH_LABELS[i]).join(", ")}
                </span>
              </p>
            )}
            {strongMonths.length > 0 && (
              <p className="flex items-start gap-1.5 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                <span>
                  <span className="text-success font-medium">Meses fuertes</span>{" "}
                  (margen para enfocarse en otra cosa):{" "}
                  {strongMonths.map((i) => MONTH_LABELS[i]).join(", ")}
                </span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

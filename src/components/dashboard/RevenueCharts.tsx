import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon, BarChart3, Crown } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";
import { useNavigate } from "react-router-dom";

interface ClientRevenue {
  clientName: string;
  clientId: string;
  mrr: number;
  setup: number;
  annual: number;
  currency: string;
}

interface CategoryRevenue {
  category: string;
  label: string;
  mrr: number;
  count: number;
}

interface RevenueChartsProps {
  clientRevenues: ClientRevenue[];
  categoryRevenues: CategoryRevenue[];
  displayCurrency: string;
}

const CATEGORY_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(210 80% 60%)",
  "hsl(280 60% 60%)",
];

const CATEGORY_LABELS: Record<string, string> = {
  bot_whatsapp: "Bot WhatsApp",
  bot_interno: "Bot Interno",
  web_rapida: "Web Rápida",
  web_autogestionable: "Web Autogestionable",
  otro: "Otro",
};

export const RevenueCharts = ({
  clientRevenues,
  categoryRevenues,
  displayCurrency,
}: RevenueChartsProps) => {
  const navigate = useNavigate();

  // Top 5 clients by MRR
  const topClients = useMemo(
    () => [...clientRevenues].sort((a, b) => b.mrr - a.mrr).slice(0, 5),
    [clientRevenues]
  );

  const topClientsData = topClients.map((c) => ({
    name: c.clientName.length > 15 ? c.clientName.slice(0, 15) + "…" : c.clientName,
    fullName: c.clientName,
    Mensual: Math.round(c.mrr),
    Setup: Math.round(c.setup),
    clientId: c.clientId,
  }));

  // Pie chart data for category
  const pieData = categoryRevenues
    .filter((c) => c.mrr > 0)
    .map((c) => ({
      name: c.label,
      value: Math.round(c.mrr),
      count: c.count,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border border-border bg-card/95 backdrop-blur-sm p-3 shadow-lg text-xs">
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold">
              {formatCurrency(entry.value, displayCurrency)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    return (
      <div className="rounded-lg border border-border bg-card/95 backdrop-blur-sm p-3 shadow-lg text-xs">
        <p className="font-semibold mb-1">{data.name}</p>
        <p className="text-muted-foreground">
          MRR: <span className="font-semibold text-foreground">{formatCurrency(data.value, displayCurrency)}</span>
        </p>
        <p className="text-muted-foreground">
          Suscripciones: <span className="font-semibold text-foreground">{data.payload.count}</span>
        </p>
      </div>
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Revenue by Category - Pie Chart */}
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Ingresos por servicio
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs text-muted-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[240px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <PieChartIcon className="h-8 w-8 opacity-30" />
              <p className="text-sm">Sin datos de ingresos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Clients by Revenue - Bar Chart */}
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-4 w-4 text-warning" />
              Top clientes por ingreso
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              MRR {displayCurrency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {topClientsData.length > 0 ? (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClientsData} layout="vertical" barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    width={110}
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="Mensual"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[240px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <BarChart3 className="h-8 w-8 opacity-30" />
              <p className="text-sm">Sin clientes con suscripciones</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { CATEGORY_LABELS };

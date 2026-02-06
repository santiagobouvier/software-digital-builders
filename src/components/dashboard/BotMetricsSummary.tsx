import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquareText, Users, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type DateFilter = "today" | "7days" | "30days";

interface DailyStats {
  date: string;
  msg_out: number;
  handoff: number;
}

interface BotMetricsSummaryProps {
  companyId: string;
}

export const BotMetricsSummary = ({ companyId }: BotMetricsSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("7days");
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [totals, setTotals] = useState({ msg_out: 0, handoff: 0 });

  useEffect(() => {
    if (!companyId || !isOpen) return;
    fetchStats();
  }, [companyId, dateFilter, isOpen]);

  const getDateRange = () => {
    const today = new Date();
    switch (dateFilter) {
      case "today":
        return { start: today, end: today };
      case "7days":
        return { start: subDays(today, 6), end: today };
      case "30days":
        return { start: subDays(today, 29), end: today };
    }
  };

  const fetchStats = async () => {
    const { start, end } = getDateRange();

    const { data } = await supabase
      .from("events_daily")
      .select("*")
      .eq("company_id", companyId)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))
      .order("date", { ascending: true });

    if (data) {
      const grouped: Record<string, DailyStats> = {};
      
      data.forEach((event: any) => {
        if (!grouped[event.date]) {
          grouped[event.date] = { date: event.date, msg_out: 0, handoff: 0 };
        }
        grouped[event.date].msg_out += event.msg_out_count || 0;
        grouped[event.date].handoff += event.handoff_count || 0;
      });

      const statsArray = Object.values(grouped);
      setStats(statsArray);

      const newTotals = statsArray.reduce(
        (acc, day) => ({
          msg_out: acc.msg_out + day.msg_out,
          handoff: acc.handoff + day.handoff,
        }),
        { msg_out: 0, handoff: 0 }
      );
      setTotals(newTotals);
    }
  };

  const chartData = stats.map((s) => ({
    name: format(new Date(s.date), "dd MMM", { locale: es }),
    Respuestas: s.msg_out,
    Derivaciones: s.handoff,
  }));

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card variant="elevated">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-2 cursor-pointer hover:bg-muted/10 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Métricas de bots
              </CardTitle>
              <div className="flex items-center gap-2">
                {!isOpen && (
                  <span className="text-xs text-muted-foreground">
                    {totals.msg_out} respuestas · {totals.handoff} derivaciones
                  </span>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Date Filter */}
            <div className="flex gap-2">
              {(["today", "7days", "30days"] as DateFilter[]).map((filter) => (
                <Button
                  key={filter}
                  variant={dateFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter(filter)}
                  className="text-xs px-2"
                >
                  {filter === "today" && "Hoy"}
                  {filter === "7days" && "7 días"}
                  {filter === "30days" && "30 días"}
                </Button>
              ))}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquareText className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Respuestas</span>
                </div>
                <p className="text-2xl font-bold">{totals.msg_out.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-warning" />
                  <span className="text-xs text-muted-foreground">Derivaciones</span>
                </div>
                <p className="text-2xl font-bold">{totals.handoff.toLocaleString()}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[200px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(215 15% 55%)"
                      fontSize={10}
                      tickMargin={8}
                    />
                    <YAxis stroke="hsl(215 15% 55%)" fontSize={10} width={30} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240 6% 7%)",
                        border: "1px solid hsl(240 5% 18%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Respuestas"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Derivaciones"
                      stroke="hsl(var(--warning))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <BarChart3 className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Sin datos en este rango</p>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

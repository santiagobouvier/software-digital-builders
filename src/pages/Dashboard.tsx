import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquareText,
  Users,
  Activity,
} from "lucide-react";
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

type DateFilter = "today" | "7days" | "30days";

interface DailyStats {
  date: string;
  msg_out: number;
  handoff: number;
}

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("7days");
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [totals, setTotals] = useState({
    msg_out: 0,
    handoff: 0,
  });
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const loadCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const savedCompanyId = localStorage.getItem("selectedCompanyId");
      
      const { data } = await supabase
        .from("company_users")
        .select("companies(id, name)")
        .eq("user_id", user.id);

      if (data && data.length > 0) {
        const companies = data.map((cu: any) => cu.companies);
        const company = savedCompanyId 
          ? companies.find((c: any) => c.id === savedCompanyId) || companies[0]
          : companies[0];
        
        setCompanyId(company.id);
        setCompanyName(company.name);
      }
    };

    loadCompany();
  }, []);

  useEffect(() => {
    if (!companyId) return;
    fetchStats();
    fetchLastActivity();
  }, [companyId, dateFilter]);

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

    const { data, error } = await supabase
      .from("events_daily")
      .select("*")
      .eq("company_id", companyId)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))
      .order("date", { ascending: true });

    if (data) {
      // Group by date
      const grouped: Record<string, DailyStats> = {};
      
      data.forEach((event: any) => {
        if (!grouped[event.date]) {
          grouped[event.date] = {
            date: event.date,
            msg_out: 0,
            handoff: 0,
          };
        }
        grouped[event.date].msg_out += event.msg_out_count || 0;
        grouped[event.date].handoff += event.handoff_count || 0;
      });

      const statsArray = Object.values(grouped);
      setStats(statsArray);

      // Calculate totals
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

  const fetchLastActivity = async () => {
    const { data } = await supabase
      .from("bots")
      .select("last_event_at")
      .eq("company_id", companyId)
      .not("last_event_at", "is", null)
      .order("last_event_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setLastActivity(new Date(data[0].last_event_at));
    }
  };

  const chartData = stats.map((s) => ({
    name: format(new Date(s.date), "dd MMM", { locale: es }),
    Respuestas: s.msg_out,
    Derivaciones: s.handoff,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{companyName}</h1>
            <p className="text-muted-foreground">
              Panel de métricas y control
            </p>
          </div>
          <div className="flex gap-2">
            {(["today", "7days", "30days"] as DateFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={dateFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter(filter)}
              >
                {filter === "today" && "Hoy"}
                {filter === "7days" && "7 días"}
                {filter === "30days" && "30 días"}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
          <KPICard
            title="Respuestas del bot"
            value={totals.msg_out}
            icon={MessageSquareText}
            color="cyan"
          />
          <KPICard
            title="Derivaciones"
            value={totals.handoff}
            icon={Users}
            color="yellow"
          />
        </div>

        {/* Chart & System Status */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Actividad de mensajes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(215 15% 55%)"
                        fontSize={12}
                      />
                      <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(240 6% 7%)",
                          border: "1px solid hsl(240 5% 18%)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Respuestas"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Derivaciones"
                        stroke="hsl(var(--warning))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--warning))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No hay datos para mostrar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Estado del sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                <span className="text-sm">Sistema operativo</span>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Última actividad</p>
                <p className="text-lg font-medium">
                  {lastActivity
                    ? format(lastActivity, "dd MMM yyyy, HH:mm", { locale: es })
                    : "Sin actividad"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/KPICard";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  MessageSquare,
  MessageSquareText,
  Users,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { format, subDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Bot {
  id: string;
  name: string;
  status: "active" | "paused";
  last_event_at: string | null;
  company_id: string;
}

interface EventDaily {
  date: string;
  msg_in_count: number;
  msg_out_count: number;
  handoff_count: number;
  lead_count: number;
  error_count: number;
}

type DateRange = "today" | "7days" | "30days";

const BotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bot, setBot] = useState<Bot | null>(null);
  const [events, setEvents] = useState<EventDaily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("7days");

  useEffect(() => {
    if (id) {
      loadBotAndEvents();
    }
  }, [id, dateRange]);

  const getDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateRange) {
      case "today":
        return { start: today, end: today };
      case "7days":
        return { start: subDays(today, 6), end: today };
      case "30days":
        return { start: subDays(today, 29), end: today };
      default:
        return { start: subDays(today, 6), end: today };
    }
  };

  const loadBotAndEvents = async () => {
    setIsLoading(true);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Load bot details
    const { data: botData, error: botError } = await supabase
      .from("bots")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (botError || !botData) {
      navigate("/bots");
      return;
    }

    setBot(botData as Bot);

    // Check if user is owner of this company
    if (user) {
      const { data: roleData } = await supabase
        .from("company_users")
        .select("role")
        .eq("user_id", user.id)
        .eq("company_id", botData.company_id)
        .maybeSingle();
      
      setIsOwner(roleData?.role === "owner");
    }

    // Load events for the date range
    const { start, end } = getDateRange();
    const startDate = format(start, "yyyy-MM-dd");
    const endDate = format(end, "yyyy-MM-dd");

    const { data: eventsData } = await supabase
      .from("events_daily")
      .select("*")
      .eq("bot_id", id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    setEvents((eventsData || []) as EventDaily[]);
    setIsLoading(false);
  };

  const totals = useMemo(() => {
    return events.reduce(
      (acc, event) => ({
        msg_out: acc.msg_out + event.msg_out_count,
        handoff: acc.handoff + event.handoff_count,
      }),
      { msg_out: 0, handoff: 0 }
    );
  }, [events]);

  const chartData = useMemo(() => {
    const { start, end } = getDateRange();
    const days: { date: string; label: string; msg_out: number; handoff: number }[] = [];
    
    const current = new Date(start);
    while (current <= end) {
      const dateStr = format(current, "yyyy-MM-dd");
      const event = events.find(e => e.date === dateStr);
      days.push({
        date: dateStr,
        label: format(current, "dd MMM", { locale: es }),
        msg_out: event?.msg_out_count || 0,
        handoff: event?.handoff_count || 0,
      });
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [events, dateRange]);

  const chartConfig = {
    msg_out: {
      label: "Respuestas del bot",
      color: "hsl(var(--primary))",
    },
    handoff: {
      label: "Derivaciones",
      color: "hsl(var(--warning))",
    },
  };

  const isConnected = bot?.last_event_at !== null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!bot) {
    return null;
  }

  const hasData = events.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit gap-2"
            onClick={() => navigate("/bots")}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a bots
          </Button>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">{bot.name}</h1>
                  <Badge
                    variant={isConnected ? "default" : "secondary"}
                    className={cn(
                      "flex-shrink-0",
                      isConnected
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isConnected ? (
                      <>
                        <Wifi className="h-3 w-3 mr-1" />
                        <span className="hidden xs:inline">Conectado</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 mr-1" />
                        <span className="hidden xs:inline">No conectado</span>
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {bot.last_event_at
                    ? `Última actividad: ${format(new Date(bot.last_event_at), "dd MMM yyyy, HH:mm", { locale: es })}`
                    : "Sin actividad registrada"}
                </p>
              </div>

              {/* Date range filter */}
              <ToggleGroup
                type="single"
                value={dateRange}
                onValueChange={(value) => value && setDateRange(value as DateRange)}
                className="bg-muted/50 p-1 rounded-lg flex-shrink-0"
              >
                <ToggleGroupItem value="today" className="px-2 sm:px-4 text-xs sm:text-sm">
                  Hoy
                </ToggleGroupItem>
                <ToggleGroupItem value="7days" className="px-2 sm:px-4 text-xs sm:text-sm">
                  7 días
                </ToggleGroupItem>
                <ToggleGroupItem value="30days" className="px-2 sm:px-4 text-xs sm:text-sm">
                  30 días
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        {!hasData ? (
          /* Empty state */
          <Card variant="elevated" className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sin datos aún</h3>
              <p className="text-muted-foreground max-w-md">
                Este bot no tiene métricas registradas en el período seleccionado.
                Enviá un mensaje de prueba al bot para generar actividad.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 max-w-md">
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

            {/* Chart */}
            <Card variant="elevated">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Actividad por día</CardTitle>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <ChartContainer config={chartConfig} className="h-[220px] sm:h-[280px] w-full">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="fillMsgOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fillHandoff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="msg_out"
                      name="Respuestas del bot"
                      stroke="hsl(var(--primary))"
                      fill="url(#fillMsgOut)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="handoff"
                      name="Derivaciones"
                      stroke="hsl(var(--warning))"
                      fill="url(#fillHandoff)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Subscription & Finances Section */}
            <SubscriptionManager botId={bot.id} companyId={bot.company_id} isOwner={isOwner} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BotDetail;

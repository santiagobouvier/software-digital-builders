import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { LogOut, ChevronDown, Bot, MessageSquare, PhoneForwarded, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface AssignedBot {
  id: string;
  name: string;
}

interface DailyData {
  date: string;
  msg_out_count: number;
  handoff_count: number;
}

const Stats = () => {
  const navigate = useNavigate();
  const { isClient, isLoading: roleLoading, userId } = useUserRole();
  const [user, setUser] = useState<any>(null);
  const [assignedBots, setAssignedBots] = useState<AssignedBot[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>("");
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d">("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [totals, setTotals] = useState({ responses: 0, handoffs: 0 });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
    };

    getUser();
  }, [navigate]);

  useEffect(() => {
    if (userId && isClient) {
      loadAssignedBots();
    }
  }, [userId, isClient]);

  useEffect(() => {
    if (selectedBotId) {
      loadStats();
    }
  }, [selectedBotId, dateRange]);

  const loadAssignedBots = async () => {
    const { data, error } = await supabase
      .from("user_bot_access")
      .select("bot_id, bots(id, name)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading assigned bots:", error);
      return;
    }

    const bots = data?.map((item: any) => ({
      id: item.bots.id,
      name: item.bots.name,
    })) || [];

    setAssignedBots(bots);
    if (bots.length > 0) {
      setSelectedBotId(bots[0].id);
    }
    setIsLoading(false);
  };

  const loadStats = async () => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case "today":
        startDate = startOfDay(now);
        break;
      case "7d":
        startDate = startOfDay(subDays(now, 6));
        break;
      case "30d":
        startDate = startOfDay(subDays(now, 29));
        break;
    }

    const { data, error } = await supabase
      .from("events_daily")
      .select("date, msg_out_count, handoff_count")
      .eq("bot_id", selectedBotId)
      .gte("date", format(startDate, "yyyy-MM-dd"))
      .lte("date", format(now, "yyyy-MM-dd"))
      .order("date", { ascending: true });

    if (error) {
      console.error("Error loading stats:", error);
      return;
    }

    setDailyData(data || []);

    // Calculate totals
    const totalResponses = data?.reduce((sum, d) => sum + d.msg_out_count, 0) || 0;
    const totalHandoffs = data?.reduce((sum, d) => sum + d.handoff_count, 0) || 0;
    setTotals({ responses: totalResponses, handoffs: totalHandoffs });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const selectedBot = assignedBots.find(b => b.id === selectedBotId);

  const chartConfig = {
    msg_out_count: {
      label: "Respuestas",
      color: "hsl(var(--primary))",
    },
    handoff_count: {
      label: "Derivaciones",
      color: "hsl(var(--warning))",
    },
  };

  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex-shrink-0 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <Logo size="sm" />
            
            {/* Bot Selector */}
            {assignedBots.length > 1 && (
              <Select value={selectedBotId} onValueChange={setSelectedBotId}>
                <SelectTrigger className="w-[180px] bg-secondary border-border text-sm">
                  <SelectValue placeholder="Selecciona bot" />
                </SelectTrigger>
                <SelectContent>
                  {assignedBots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user.email?.[0].toUpperCase()}
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.user_metadata?.name || "Usuario"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {assignedBots.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="py-12 text-center">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">Sin bots asignados</h2>
                <p className="text-muted-foreground">
                  No tienes ningún bot asignado. Contacta al administrador.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold">
                      {selectedBot?.name || "Estadísticas"}
                    </h1>
                    <p className="text-sm text-muted-foreground">Métricas de tu bot</p>
                  </div>
                </div>

                <ToggleGroup
                  type="single"
                  value={dateRange}
                  onValueChange={(v) => v && setDateRange(v as typeof dateRange)}
                  className="bg-muted/50 p-1 rounded-lg"
                >
                  <ToggleGroupItem value="today" className="text-xs sm:text-sm px-3">
                    Hoy
                  </ToggleGroupItem>
                  <ToggleGroupItem value="7d" className="text-xs sm:text-sm px-3">
                    7 días
                  </ToggleGroupItem>
                  <ToggleGroupItem value="30d" className="text-xs sm:text-sm px-3">
                    30 días
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card variant="elevated">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Respuestas del bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl sm:text-4xl font-bold text-primary">
                      {totals.responses.toLocaleString("es-UY")}
                    </p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <PhoneForwarded className="h-4 w-4" />
                      Derivaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl sm:text-4xl font-bold text-warning">
                      {totals.handoffs.toLocaleString("es-UY")}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-base">Evolución</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailyData.length === 0 ? (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      Sin datos en este rango
                    </div>
                  ) : (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: es })}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="msg_out_count"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                            name="Respuestas"
                          />
                          <Line
                            type="monotone"
                            dataKey="handoff_count"
                            stroke="hsl(var(--warning))"
                            strokeWidth={2}
                            dot={false}
                            name="Derivaciones"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Stats;

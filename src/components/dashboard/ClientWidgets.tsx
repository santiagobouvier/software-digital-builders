import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bot, MessageSquareText, Users as UsersIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

interface BotWithStats {
  id: string;
  name: string;
  status: string;
  lastActivity: string | null;
  totalMsgOut: number;
  totalHandoff: number;
}

interface ClientWidgetsProps {
  userId: string;
}

export const ClientWidgets = ({ userId }: ClientWidgetsProps) => {
  const navigate = useNavigate();
  const [bots, setBots] = useState<BotWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);

    // Get bot access for this user
    const { data: accessData } = await supabase
      .from("user_bot_access")
      .select("bot_id, bots(id, name, status, last_event_at)")
      .eq("user_id", userId);

    if (accessData && accessData.length > 0) {
      const botIds = accessData.map((a: any) => a.bot_id);
      
      // Get stats for last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      const { data: statsData } = await supabase
        .from("events_daily")
        .select("bot_id, msg_out_count, handoff_count")
        .in("bot_id", botIds)
        .gte("date", format(thirtyDaysAgo, "yyyy-MM-dd"));

      const botsWithStats: BotWithStats[] = accessData.map((access: any) => {
        const botStats = statsData?.filter((s) => s.bot_id === access.bot_id) || [];
        const totalMsgOut = botStats.reduce((sum, s) => sum + (s.msg_out_count || 0), 0);
        const totalHandoff = botStats.reduce((sum, s) => sum + (s.handoff_count || 0), 0);

        return {
          id: access.bots.id,
          name: access.bots.name,
          status: access.bots.status,
          lastActivity: access.bots.last_event_at,
          totalMsgOut,
          totalHandoff,
        };
      });

      setBots(botsWithStats);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (bots.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Tus bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              Aún no tenés bots asignados
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tu administrador te asignará acceso a los bots correspondientes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMsgOut = bots.reduce((sum, b) => sum + b.totalMsgOut, 0);
  const totalHandoff = bots.reduce((sum, b) => sum + b.totalHandoff, 0);

  return (
    <div className="space-y-4">
      {/* Global Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-3">
        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bots.length}</p>
                <p className="text-xs text-muted-foreground">
                  {bots.length === 1 ? "Bot" : "Bots"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <MessageSquareText className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMsgOut}</p>
                <p className="text-xs text-muted-foreground">Respuestas (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <UsersIcon className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHandoff}</p>
                <p className="text-xs text-muted-foreground">Derivaciones (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bots List */}
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Tus bots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bots.map((bot) => (
            <div
              key={bot.id}
              className="flex items-center justify-between p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => navigate(`/bots/${bot.id}`)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    bot.status === "active" ? "bg-success" : "bg-muted-foreground"
                  }`}
                />
                <div>
                  <p className="font-medium">{bot.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {bot.totalMsgOut} respuestas · {bot.totalHandoff} derivaciones
                  </p>
                </div>
              </div>
              <Badge
                variant={bot.lastActivity ? "secondary" : "outline"}
                className="text-xs"
              >
                {bot.lastActivity
                  ? format(new Date(bot.lastActivity), "dd MMM", { locale: es })
                  : "Sin actividad"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

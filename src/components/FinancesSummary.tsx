import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, Calendar, Loader2, Bot } from "lucide-react";
import { format, startOfMonth, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Subscription {
  id: string;
  bot_id: string;
  plan: "monthly" | "annual";
  monthly_price: number;
  annual_price: number;
  started_at: string;
  next_billing_at: string;
  plan_id: string | null;
}

interface Plan {
  id: string;
  name: string;
}

interface BotInfo {
  id: string;
  name: string;
}

interface FinancesSummaryProps {
  companyId: string;
}

export const FinancesSummary = ({ companyId }: FinancesSummaryProps) => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [bots, setBots] = useState<BotInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    loadData();
  }, [companyId]);

  const loadData = async () => {
    setIsLoading(true);
    
    const [subsResult, plansResult, botsResult] = await Promise.all([
      supabase
        .from("bot_subscriptions")
        .select("*")
        .eq("company_id", companyId)
        .eq("is_active", true),
      supabase
        .from("subscription_plans")
        .select("id, name")
        .eq("is_active", true),
      supabase
        .from("bots")
        .select("id, name")
        .eq("company_id", companyId),
    ]);

    if (subsResult.data) setSubscriptions(subsResult.data as Subscription[]);
    if (plansResult.data) setPlans(plansResult.data as Plan[]);
    if (botsResult.data) setBots(botsResult.data as BotInfo[]);
    
    setIsLoading(false);
  };

  const financialMetrics = useMemo(() => {
    if (subscriptions.length === 0) {
      return {
        mrr: 0,
        arr: 0,
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        activeSubs: 0,
        nextBilling: null as Date | null,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let mrr = 0;
    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;
    let nearestBilling: Date | null = null;

    subscriptions.forEach((sub) => {
      const monthlyRate = sub.plan === "monthly" 
        ? sub.monthly_price 
        : sub.annual_price / 12;
      
      mrr += monthlyRate;
      
      const dailyRate = monthlyRate / 30;
      const startDate = new Date(sub.started_at);
      const daysSinceStart = Math.max(0, differenceInDays(today, startDate));
      
      if (daysSinceStart >= 0) todayRevenue += dailyRate;
      
      const weekDays = Math.min(7, daysSinceStart + 1);
      weekRevenue += weekDays * dailyRate;
      
      const monthStart = startOfMonth(today);
      const effectiveStart = startDate > monthStart ? startDate : monthStart;
      const daysInMonth = Math.max(0, differenceInDays(today, effectiveStart) + 1);
      monthRevenue += daysInMonth * dailyRate;
      
      const nextBillingDate = new Date(sub.next_billing_at);
      if (!nearestBilling || nextBillingDate < nearestBilling) {
        nearestBilling = nextBillingDate;
      }
    });

    return {
      mrr,
      arr: mrr * 12,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      activeSubs: subscriptions.length,
      nextBilling: nearestBilling,
    };
  }, [subscriptions]);

  const getPlanName = (planId: string | null) => {
    if (!planId) return null;
    return plans.find(p => p.id === planId)?.name;
  };

  const getBotName = (botId: string) => {
    return bots.find(b => b.id === botId)?.name || "Bot";
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

  if (subscriptions.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Finanzas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No hay suscripciones activas
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Activá un plan desde el detalle de cada bot
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysUntilNextBilling = financialMetrics.nextBilling 
    ? differenceInDays(financialMetrics.nextBilling, new Date())
    : null;

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Finanzas
          </CardTitle>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            {financialMetrics.activeSubs} {financialMetrics.activeSubs === 1 ? "bot activo" : "bots activos"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MRR & ARR */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">MRR</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              ${financialMetrics.mrr.toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">/ mes</p>
          </div>
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              <span className="text-xs text-muted-foreground">ARR</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              ${financialMetrics.arr.toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">/ año</p>
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Hoy</span>
            <span className="text-sm font-medium">${financialMetrics.todayRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Últimos 7 días</span>
            <span className="text-sm font-medium">${financialMetrics.weekRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Este mes</span>
            <span className="text-sm font-medium text-primary">${financialMetrics.monthRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Active subscriptions list */}
        <div className="pt-3 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Suscripciones activas</p>
          {subscriptions.map((sub) => (
            <div 
              key={sub.id} 
              className="flex items-center justify-between p-2 bg-muted/10 rounded-lg cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => navigate(`/bots/${sub.bot_id}`)}
            >
              <div className="flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{getBotName(sub.bot_id)}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getPlanName(sub.plan_id) || "Plan"} - {sub.plan === "annual" ? "Anual" : "Mensual"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Next billing */}
        {financialMetrics.nextBilling && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Próximo cobro en {daysUntilNextBilling} días 
                ({format(financialMetrics.nextBilling, "dd MMM", { locale: es })})
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

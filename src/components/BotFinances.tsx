import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Loader2,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { format, subDays, differenceInDays, differenceInMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

interface BotSubscription {
  id: string;
  bot_id: string;
  plan: "monthly" | "annual";
  monthly_price: number;
  annual_price: number;
  started_at: string;
  next_billing_at: string;
  is_active: boolean;
}

interface BillingEvent {
  id: string;
  amount: number;
  event_type: string;
  event_date: string;
}

interface BotFinancesProps {
  botId: string;
  isOwner: boolean;
}

type BillingRange = "today" | "7days" | "month";

export const BotFinances = ({ botId, isOwner }: BotFinancesProps) => {
  const [subscription, setSubscription] = useState<BotSubscription | null>(null);
  const [billingEvents, setBillingEvents] = useState<BillingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [billingRange, setBillingRange] = useState<BillingRange>("7days");

  useEffect(() => {
    loadFinancesData();
  }, [botId]);

  const loadFinancesData = async () => {
    setIsLoading(true);

    // Fetch subscription
    const { data: subData } = await supabase
      .from("bot_subscriptions")
      .select("*")
      .eq("bot_id", botId)
      .eq("is_active", true)
      .maybeSingle();

    if (subData) {
      setSubscription(subData as BotSubscription);

      // Fetch billing events for last 30 days
      const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
      const { data: eventsData } = await supabase
        .from("bot_billing_events")
        .select("*")
        .eq("bot_id", botId)
        .gte("event_date", thirtyDaysAgo)
        .order("event_date", { ascending: false });

      if (eventsData) {
        setBillingEvents(eventsData as BillingEvent[]);
      }
    }

    setIsLoading(false);
  };

  // Calculate prorated daily/monthly amounts
  const proratedAmounts = useMemo(() => {
    if (!subscription) return { daily: 0, monthly: 0 };

    if (subscription.plan === "monthly") {
      // Monthly plan: prorate by day (assume 30 days)
      const dailyRate = subscription.monthly_price / 30;
      return {
        daily: dailyRate,
        monthly: subscription.monthly_price,
      };
    } else {
      // Annual plan: prorate by month
      const monthlyRate = subscription.annual_price / 12;
      const dailyRate = monthlyRate / 30;
      return {
        daily: dailyRate,
        monthly: monthlyRate,
      };
    }
  }, [subscription]);

  // Calculate billing totals based on range
  const billingTotals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If we have actual billing events, use them
    if (billingEvents.length > 0) {
      const todayStr = format(today, "yyyy-MM-dd");
      const sevenDaysAgo = format(subDays(today, 6), "yyyy-MM-dd");
      const monthStart = format(startOfMonth(today), "yyyy-MM-dd");

      const todayTotal = billingEvents
        .filter(e => e.event_date === todayStr && e.event_type === "charge")
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const weekTotal = billingEvents
        .filter(e => e.event_date >= sevenDaysAgo && e.event_type === "charge")
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const monthTotal = billingEvents
        .filter(e => e.event_date >= monthStart && e.event_type === "charge")
        .reduce((sum, e) => sum + Number(e.amount), 0);

      return { today: todayTotal, week: weekTotal, month: monthTotal };
    }

    // If no billing events, use prorated estimates
    if (!subscription) return { today: 0, week: 0, month: 0 };

    const startDate = new Date(subscription.started_at);
    const daysSinceStart = Math.max(0, differenceInDays(today, startDate));
    
    // Calculate prorated amounts based on days since subscription started
    const todayAmount = daysSinceStart >= 0 ? proratedAmounts.daily : 0;
    const weekDays = Math.min(7, daysSinceStart + 1);
    const weekAmount = weekDays * proratedAmounts.daily;
    
    // For month, calculate days in current month since start
    const monthStartDate = startOfMonth(today);
    const effectiveStartDate = startDate > monthStartDate ? startDate : monthStartDate;
    const daysInMonth = Math.max(0, differenceInDays(today, effectiveStartDate) + 1);
    const monthAmount = daysInMonth * proratedAmounts.daily;

    return {
      today: todayAmount,
      week: weekAmount,
      month: monthAmount,
    };
  }, [subscription, billingEvents, proratedAmounts]);

  const currentBillingAmount = useMemo(() => {
    switch (billingRange) {
      case "today":
        return billingTotals.today;
      case "7days":
        return billingTotals.week;
      case "month":
        return billingTotals.month;
    }
  }, [billingRange, billingTotals]);

  const daysUntilNextBilling = useMemo(() => {
    if (!subscription) return null;
    return differenceInDays(new Date(subscription.next_billing_at), new Date());
  }, [subscription]);

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card variant="elevated">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Finanzas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Este bot no tiene una suscripción activa.
            </p>
            {isOwner && (
              <Button className="mt-4" size="sm">
                Activar suscripción
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const annualSavings = subscription.plan === "monthly" 
    ? (subscription.monthly_price * 12) - subscription.annual_price 
    : 0;
  const annualSavingsPercent = subscription.plan === "monthly" 
    ? Math.round((annualSavings / (subscription.monthly_price * 12)) * 100) 
    : 0;

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Finanzas
          </CardTitle>
          <Badge 
            variant="outline" 
            className={
              subscription.plan === "annual" 
                ? "bg-success/10 text-success border-success/30" 
                : "bg-primary/10 text-primary border-primary/30"
            }
          >
            Plan {subscription.plan === "annual" ? "Anual" : "Mensual"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Billing Range Toggle */}
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={billingRange}
            onValueChange={(value) => value && setBillingRange(value as BillingRange)}
            className="bg-muted/50 p-1 rounded-lg"
          >
            <ToggleGroupItem value="today" className="px-3 sm:px-4 text-xs sm:text-sm">
              Hoy
            </ToggleGroupItem>
            <ToggleGroupItem value="7days" className="px-3 sm:px-4 text-xs sm:text-sm">
              7 días
            </ToggleGroupItem>
            <ToggleGroupItem value="month" className="px-3 sm:px-4 text-xs sm:text-sm">
              Mes
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Main Billing Amount */}
        <div className="text-center py-4 sm:py-6 bg-muted/30 rounded-xl">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
            Facturación {billingRange === "today" ? "de hoy" : billingRange === "7days" ? "últimos 7 días" : "del mes"}
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-foreground">
            ${currentBillingAmount.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">USD</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Precio base</span>
            </div>
            <p className="text-lg sm:text-xl font-semibold">
              ${subscription.plan === "monthly" 
                ? subscription.monthly_price.toFixed(2) 
                : (subscription.annual_price / 12).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">/mes</p>
          </div>
          <div className="p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs text-muted-foreground">Próximo cobro</span>
            </div>
            <p className="text-lg sm:text-xl font-semibold">
              {daysUntilNextBilling !== null ? `${daysUntilNextBilling} días` : "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {subscription.next_billing_at 
                ? format(new Date(subscription.next_billing_at), "dd MMM", { locale: es })
                : "-"}
            </p>
          </div>
        </div>

        {/* Upgrade CTA for monthly plans */}
        {subscription.plan === "monthly" && isOwner && annualSavings > 0 && (
          <div className="p-3 sm:p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Ahorrá ${annualSavings.toFixed(0)}/año
                </p>
                <p className="text-xs text-muted-foreground">
                  Cambiando al plan anual ({annualSavingsPercent}% de descuento)
                </p>
              </div>
              <Button size="sm" variant="outline" className="gap-1 border-success/30 text-success hover:bg-success/10">
                Cambiar a anual
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Subscription Details */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Suscripción iniciada el {format(new Date(subscription.started_at), "dd 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { formatCurrency } from "@/lib/money";
import { cn } from "@/lib/utils";
import { format, parseISO, isSameMonth, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  CalendarDays,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { Transaction, CalendarEvent } from "@/types/finance";
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "@/types/finance";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isProfessional, isClient, isLoading: roleLoading } = useUserRole();
  const { convert } = useExchangeRate();
  const [userName, setUserName] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", user.id)
      .single();
    setUserName(profileData?.name || user.user_metadata?.name || "Usuario");

    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    const [txRes, evRes, clientsRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("*, client:clients(company_name)")
        .order("due_date", { ascending: true }),
      supabase
        .from("calendar_events")
        .select("*, client:clients(company_name)")
        .eq("completed", false)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(5),
      supabase.from("clients").select("id", { count: "exact", head: true }),
    ]);

    if (txRes.data) setTransactions(txRes.data as unknown as Transaction[]);
    if (evRes.data) setEvents(evRes.data as unknown as CalendarEvent[]);
    setClientCount(clientsRes.count || 0);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isProfessional) {
      loadData();
    } else if (!roleLoading) {
      setIsLoading(false);
    }
  }, [isProfessional, roleLoading, loadData]);

  const summary = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    let incomeMonth = 0;
    let expenseMonth = 0;
    let pendingIncome = 0;
    let pendingExpense = 0;
    const upcomingIncomes: Transaction[] = [];
    const upcomingExpenses: Transaction[] = [];
    let overdue = 0;

    for (const tx of transactions) {
      const usd = convert(tx.amount, tx.currency, "USD");
      if (tx.status === "paid" && tx.paid_date && isSameMonth(parseISO(tx.paid_date), now)) {
        if (tx.type === "income") incomeMonth += usd;
        else expenseMonth += usd;
      }
      if (tx.status === "pending") {
        if (tx.type === "income") {
          pendingIncome += usd;
          if (upcomingIncomes.length < 5) upcomingIncomes.push(tx);
        } else {
          pendingExpense += usd;
          if (upcomingExpenses.length < 5) upcomingExpenses.push(tx);
        }
        if (isBefore(parseISO(tx.due_date), today)) overdue += 1;
      }
    }

    return {
      incomeMonth,
      expenseMonth,
      balance: incomeMonth - expenseMonth,
      pendingIncome,
      pendingExpense,
      upcomingIncomes,
      upcomingExpenses,
      overdue,
    };
  }, [transactions, convert]);

  if (roleLoading || (isProfessional && isLoading)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (isClient) {
    return (
      <DashboardLayout>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Bienvenido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                Tu administrador te dará acceso cuando esté todo listo
              </p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const TxRow = ({ tx }: { tx: Transaction }) => (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{tx.description}</p>
        <p className="text-xs text-muted-foreground truncate">
          {format(parseISO(tx.due_date), "dd MMM", { locale: es })}
          {tx.client?.company_name && ` · ${tx.client.company_name}`}
        </p>
      </div>
      <p
        className={cn(
          "font-mono text-sm font-semibold flex-shrink-0",
          tx.type === "income" ? "text-success" : "text-destructive"
        )}
      >
        {tx.type === "income" ? "+" : "-"}
        {formatCurrency(tx.amount, tx.currency)}
      </p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="min-w-0 space-y-4">
          <Logo size="lg" className="h-12 md:h-14 w-auto" />
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              {userName}, te damos la bienvenida.
            </h1>
            <p className="text-sm text-muted-foreground">
              Tu centro de operaciones personal
            </p>
          </div>
        </div>

        {/* KPIs financieros (en USD) */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold font-mono truncate">
                    {formatCurrency(summary.incomeMonth, "USD")}
                  </p>
                  <p className="text-xs text-muted-foreground">Cobrado este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold font-mono truncate">
                    {formatCurrency(summary.expenseMonth, "USD")}
                  </p>
                  <p className="text-xs text-muted-foreground">Gastado este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold font-mono truncate">
                    {formatCurrency(summary.balance, "USD")}
                  </p>
                  <p className="text-xs text-muted-foreground">Balance del mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Building2 className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{clientCount}</p>
                  <p className="text-xs text-muted-foreground">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximos cobros / pagos / eventos */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card variant="elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  Próximos cobros
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {formatCurrency(summary.pendingIncome, "USD")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {summary.upcomingIncomes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sin cobros pendientes
                </p>
              ) : (
                <div className="divide-y divide-border/50">
                  {summary.upcomingIncomes.map((tx) => (
                    <TxRow key={tx.id} tx={tx} />
                  ))}
                </div>
              )}
              <Button
                variant="link"
                size="sm"
                className="px-0 mt-1"
                onClick={() => navigate("/finanzas")}
              >
                Ver finanzas
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Próximos pagos
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {formatCurrency(summary.pendingExpense, "USD")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {summary.upcomingExpenses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sin pagos pendientes
                </p>
              ) : (
                <div className="divide-y divide-border/50">
                  {summary.upcomingExpenses.map((tx) => (
                    <TxRow key={tx.id} tx={tx} />
                  ))}
                </div>
              )}
              {summary.overdue > 0 && (
                <p className="text-xs text-destructive mt-2">
                  {summary.overdue} movimiento{summary.overdue > 1 ? "s" : ""} vencido
                  {summary.overdue > 1 ? "s" : ""}
                </p>
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Próximos eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nada agendado
                </p>
              ) : (
                <div className="divide-y divide-border/50">
                  {events.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{ev.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {format(parseISO(ev.event_date), "dd MMM", { locale: es })}
                          {ev.event_time && ` · ${ev.event_time.slice(0, 5)}`}
                          {ev.client?.company_name && ` · ${ev.client.company_name}`}
                        </p>
                      </div>
                      <Badge
                        className={cn("text-[10px] px-1.5 py-0 border", EVENT_TYPE_COLORS[ev.type])}
                      >
                        {EVENT_TYPE_LABELS[ev.type]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="link"
                size="sm"
                className="px-0 mt-1"
                onClick={() => navigate("/calendario")}
              >
                Ver calendario
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

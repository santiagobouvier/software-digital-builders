import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  CalendarClock,
  AlertTriangle,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { ExchangeRateEditor } from "@/components/ExchangeRateEditor";
import { TransactionFormDialog } from "@/components/finance/TransactionFormDialog";
import { TransactionList } from "@/components/finance/TransactionList";
import { formatCurrency } from "@/lib/money";
import { cn } from "@/lib/utils";
import { format, isSameMonth, parseISO, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Client } from "@/types/client";
import {
  Transaction,
  TransactionType,
  ClientPlan,
  planMonthlyAmount,
  planScheduleLabel,
  PAYMENT_METHOD_LABELS,
} from "@/types/finance";

/** Valor en USD mostrado grande, con su equivalente en pesos abajo */
const DualAmount = ({ usd, rate, className }: { usd: number; rate: number; className?: string }) => (
  <div className="min-w-0">
    <p className={cn("text-lg sm:text-xl font-bold font-mono truncate", className)}>
      {formatCurrency(usd, "USD")}
    </p>
    <p className="text-[11px] font-mono text-muted-foreground truncate">
      {formatCurrency(usd * rate, "UYU")}
    </p>
  </div>
);

const Finances = () => {
  const { isProfessional, isLoading: roleLoading } = useUserRole();
  const { rate, updateExchangeRate, convert } = useExchangeRate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<ClientPlan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [newType, setNewType] = useState<TransactionType>("income");

  const loadData = useCallback(async () => {
    const [txRes, plansRes, clientsRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("*, client:clients(company_name)")
        .order("due_date", { ascending: true }),
      supabase
        .from("client_plans")
        .select("*, client:clients(company_name)")
        .order("next_due_date", { ascending: true }),
      supabase
        .from("clients")
        .select("*")
        .order("company_name"),
    ]);

    if (txRes.data) setTransactions(txRes.data as unknown as Transaction[]);
    if (plansRes.data) setPlans(plansRes.data as unknown as ClientPlan[]);
    if (clientsRes.data) setClients(clientsRes.data as Client[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isProfessional) {
      loadData();
    }
  }, [isProfessional, loadData]);

  const toUSD = useCallback(
    (amount: number, currency: string) => convert(amount, currency, "USD"),
    [convert]
  );

  const {
    paidIncomeMonth,
    paidExpenseMonth,
    pendingIncome,
    pendingExpense,
    overdueCount,
    upcomingIncomes,
    upcomingExpenses,
    history,
  } = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    let paidIncomeMonth = 0;
    let paidExpenseMonth = 0;
    let pendingIncome = 0;
    let pendingExpense = 0;
    let overdueCount = 0;

    const upcomingIncomes: Transaction[] = [];
    const upcomingExpenses: Transaction[] = [];
    const history: Transaction[] = [];

    for (const tx of transactions) {
      const usd = toUSD(tx.amount, tx.currency);
      if (tx.status === "paid") {
        history.push(tx);
        if (tx.paid_date && isSameMonth(parseISO(tx.paid_date), now)) {
          if (tx.type === "income") paidIncomeMonth += usd;
          else paidExpenseMonth += usd;
        }
      } else if (tx.status === "pending") {
        if (tx.type === "income") {
          pendingIncome += usd;
          upcomingIncomes.push(tx);
        } else {
          pendingExpense += usd;
          upcomingExpenses.push(tx);
        }
        if (isBefore(parseISO(tx.due_date), today)) overdueCount += 1;
      } else {
        history.push(tx);
      }
    }

    history.sort((a, b) => (b.paid_date || b.due_date).localeCompare(a.paid_date || a.due_date));

    return {
      paidIncomeMonth,
      paidExpenseMonth,
      pendingIncome,
      pendingExpense,
      overdueCount,
      upcomingIncomes,
      upcomingExpenses,
      history,
    };
  }, [transactions, toUSD]);

  const { activePlans, mrrUSD } = useMemo(() => {
    const activePlans = plans.filter((p) => p.status === "active");
    const mrrUSD = activePlans.reduce(
      (sum, p) => sum + toUSD(planMonthlyAmount(p), p.currency),
      0
    );
    return { activePlans, mrrUSD };
  }, [plans, toUSD]);

  const balanceMonth = paidIncomeMonth - paidExpenseMonth;

  const openNew = (type: TransactionType) => {
    setEditingTx(null);
    setNewType(type);
    setIsFormOpen(true);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsFormOpen(true);
  };

  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isProfessional) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Finanzas</h1>
            <p className="text-muted-foreground">
              Cobros, gastos y planes recurrentes · todo en USD y pesos
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExchangeRateEditor rate={rate} onUpdate={updateExchangeRate} />
            <Button variant="outline" onClick={() => openNew("expense")} className="gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Nuevo gasto
            </Button>
            <Button onClick={() => openNew("income")} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo cobro
            </Button>
          </div>
        </div>

        {/* Recurrente: MRR / ARR de planes activos */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <DualAmount usd={mrrUSD} rate={rate} />
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ingreso mensual (planes activos)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <DualAmount usd={mrrUSD * 12} rate={rate} />
                  <p className="text-xs text-muted-foreground mt-0.5">Proyección anual</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="col-span-2 lg:col-span-1">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <CreditCard className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{activePlans.length}</p>
                  <p className="text-xs text-muted-foreground">Planes activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movimiento real del mes */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <DualAmount usd={paidIncomeMonth} rate={rate} />
                  <p className="text-xs text-muted-foreground mt-0.5">Cobrado este mes</p>
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
                <div className="min-w-0 flex-1">
                  <DualAmount usd={paidExpenseMonth} rate={rate} />
                  <p className="text-xs text-muted-foreground mt-0.5">Gastado este mes</p>
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
                <div className="min-w-0 flex-1">
                  <DualAmount usd={balanceMonth} rate={rate} />
                  <p className="text-xs text-muted-foreground mt-0.5">Balance del mes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <CalendarClock className="h-5 w-5 text-warning" />
                </div>
                <div className="min-w-0 flex-1">
                  <DualAmount usd={pendingIncome} rate={rate} />
                  <p className="text-xs text-muted-foreground mt-0.5">Por cobrar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <DualAmount usd={pendingExpense} rate={rate} />
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Por pagar{overdueCount > 0 ? ` · ${overdueCount} vencidos` : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card variant="elevated">
            <CardContent className="py-12 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Planes activos */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Planes de clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {plans.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sin planes. Se crean desde la ficha de cada cliente.
                  </p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {plans.map((plan) => (
                      <div key={plan.id} className="flex items-center gap-3 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {plan.client?.company_name || "Cliente"} · {plan.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {planScheduleLabel(plan)} ·{" "}
                            {PAYMENT_METHOD_LABELS[plan.payment_method]}
                            {plan.status === "active" &&
                              ` · próximo: ${format(parseISO(plan.next_due_date), "dd MMM yyyy", { locale: es })}`}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-mono font-semibold">
                            {formatCurrency(plan.amount, plan.currency)}
                            <span className="text-[10px] text-muted-foreground ml-1">
                              /{plan.billing_cycle === "monthly" ? "mes" : "año"}
                            </span>
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            ≈ {formatCurrency(toUSD(planMonthlyAmount(plan), plan.currency), "USD")}/mes
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "text-[10px] px-1.5 py-0 flex-shrink-0",
                            plan.status === "active"
                              ? "bg-success/20 text-success"
                              : plan.status === "paused"
                                ? "bg-warning/20 text-warning"
                                : "bg-destructive/20 text-destructive"
                          )}
                        >
                          {plan.status === "active"
                            ? "Activo"
                            : plan.status === "paused"
                              ? "Pausado"
                              : "Cancelado"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  Próximos cobros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={upcomingIncomes}
                  onEdit={handleEdit}
                  onChanged={loadData}
                  emptyMessage="No hay cobros pendientes"
                />
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Próximos pagos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={upcomingExpenses}
                  onEdit={handleEdit}
                  onChanged={loadData}
                  emptyMessage="No hay pagos pendientes"
                />
              </CardContent>
            </Card>

            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Historial</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="income">Cobros</TabsTrigger>
                    <TabsTrigger value="expense">Gastos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <TransactionList
                      transactions={history}
                      onEdit={handleEdit}
                      onChanged={loadData}
                      emptyMessage="Sin movimientos registrados"
                    />
                  </TabsContent>
                  <TabsContent value="income">
                    <TransactionList
                      transactions={history.filter((t) => t.type === "income")}
                      onEdit={handleEdit}
                      onChanged={loadData}
                      emptyMessage="Sin cobros registrados"
                    />
                  </TabsContent>
                  <TabsContent value="expense">
                    <TransactionList
                      transactions={history.filter((t) => t.type === "expense")}
                      onEdit={handleEdit}
                      onChanged={loadData}
                      emptyMessage="Sin gastos registrados"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <TransactionFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTx(null);
        }}
        transaction={editingTx}
        clients={clients}
        defaultType={newType}
        onSuccess={loadData}
      />
    </DashboardLayout>
  );
};

export default Finances;

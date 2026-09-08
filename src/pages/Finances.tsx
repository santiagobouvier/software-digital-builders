import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { ExchangeRateEditor } from "@/components/ExchangeRateEditor";
import { TransactionFormDialog } from "@/components/finance/TransactionFormDialog";
import { TransactionList } from "@/components/finance/TransactionList";
import { formatCurrency } from "@/lib/money";
import { isSameMonth, parseISO, isBefore, startOfDay } from "date-fns";
import type { Client } from "@/types/client";
import type { Transaction, TransactionType } from "@/types/finance";

type DisplayCurrency = "USD" | "UYU";

const Finances = () => {
  const { isProfessional, isLoading: roleLoading } = useUserRole();
  const { rate, updateExchangeRate, convert } = useExchangeRate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [newType, setNewType] = useState<TransactionType>("income");
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("USD");

  const loadData = useCallback(async () => {
    const [txRes, clientsRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("*, client:clients(company_name)")
        .order("due_date", { ascending: true }),
      supabase
        .from("clients")
        .select("*")
        .order("company_name"),
    ]);

    if (txRes.data) setTransactions(txRes.data as unknown as Transaction[]);
    if (clientsRes.data) setClients(clientsRes.data as Client[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isProfessional) {
      loadData();
    }
  }, [isProfessional, loadData]);

  const inDisplay = useCallback(
    (tx: Transaction) => convert(tx.amount, tx.currency, displayCurrency),
    [convert, displayCurrency]
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
      if (tx.status === "paid") {
        history.push(tx);
        if (tx.paid_date && isSameMonth(parseISO(tx.paid_date), now)) {
          if (tx.type === "income") paidIncomeMonth += inDisplay(tx);
          else paidExpenseMonth += inDisplay(tx);
        }
      } else if (tx.status === "pending") {
        if (tx.type === "income") {
          pendingIncome += inDisplay(tx);
          upcomingIncomes.push(tx);
        } else {
          pendingExpense += inDisplay(tx);
          upcomingExpenses.push(tx);
        }
        if (isBefore(parseISO(tx.due_date), today)) overdueCount += 1;
      } else {
        history.push(tx);
      }
    }

    // Historial: más recientes primero
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
  }, [transactions, inDisplay]);

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
            <p className="text-muted-foreground">Cobros, gastos y próximos vencimientos</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExchangeRateEditor rate={rate} onUpdate={updateExchangeRate} />
            <Select
              value={displayCurrency}
              onValueChange={(v) => setDisplayCurrency(v as DisplayCurrency)}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="UYU">UYU</SelectItem>
              </SelectContent>
            </Select>
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

        {/* KPIs */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
          <Card variant="elevated">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold font-mono truncate">
                    {formatCurrency(paidIncomeMonth, displayCurrency)}
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
                    {formatCurrency(paidExpenseMonth, displayCurrency)}
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
                    {formatCurrency(balanceMonth, displayCurrency)}
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
                  <CalendarClock className="h-5 w-5 text-warning" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold font-mono truncate">
                    {formatCurrency(pendingIncome, displayCurrency)}
                  </p>
                  <p className="text-xs text-muted-foreground">Por cobrar</p>
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
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold font-mono truncate">
                    {formatCurrency(pendingExpense, displayCurrency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Por pagar{overdueCount > 0 ? ` · ${overdueCount} vencidos` : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listas */}
        {isLoading ? (
          <Card variant="elevated">
            <CardContent className="py-12 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
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

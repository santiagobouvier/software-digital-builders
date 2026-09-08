import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/money";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Plus,
  MoreVertical,
  Pencil,
  Pause,
  Play,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { PlanFormDialog } from "./PlanFormDialog";
import {
  ClientPlan,
  PLAN_STATUS_LABELS,
  PLAN_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
  planScheduleLabel,
  computeNextDueDate,
} from "@/types/finance";

interface ClientPlansCardProps {
  clientId: string;
  clientName: string;
  onChanged?: () => void;
}

export const ClientPlansCard = ({ clientId, clientName, onChanged }: ClientPlansCardProps) => {
  const [plans, setPlans] = useState<ClientPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ClientPlan | null>(null);

  const loadPlans = useCallback(async () => {
    const { data } = await supabase
      .from("client_plans")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: true });
    if (data) setPlans(data as unknown as ClientPlan[]);
    setIsLoading(false);
  }, [clientId]);

  useEffect(() => {
    setIsLoading(true);
    loadPlans();
  }, [loadPlans]);

  const notifyChange = () => {
    loadPlans();
    onChanged?.();
  };

  const cancelPendingCharges = async (planId: string) => {
    await supabase
      .from("transactions")
      .update({ status: "cancelled" })
      .eq("plan_id", planId)
      .eq("status", "pending");
  };

  const handleSetStatus = async (plan: ClientPlan, status: "active" | "paused" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("client_plans")
        .update({ status })
        .eq("id", plan.id);
      if (error) throw error;

      if (status === "paused" || status === "cancelled") {
        await cancelPendingCharges(plan.id);
        toast({
          title: status === "paused" ? "Plan pausado" : "Plan cancelado",
          description: "Se cancelaron los cobros pendientes del plan.",
        });
      } else {
        // Reactivar: generar cobro pendiente si no hay ninguno
        const { data: pending } = await supabase
          .from("transactions")
          .select("id")
          .eq("plan_id", plan.id)
          .eq("status", "pending")
          .limit(1);

        if (!pending || pending.length === 0) {
          const nextDue = computeNextDueDate(
            plan.billing_cycle,
            plan.renewal_month,
            plan.renewal_day
          );
          const { error: txError } = await supabase.from("transactions").insert({
            type: "income",
            status: "pending",
            description: `${plan.name} (${clientName})`,
            category: "Mantenimiento",
            amount: plan.amount,
            currency: plan.currency,
            due_date: nextDue,
            recurrence: plan.billing_cycle,
            client_id: plan.client_id,
            plan_id: plan.id,
          });
          if (txError) throw txError;
          await supabase
            .from("client_plans")
            .update({ next_due_date: nextDue })
            .eq("id", plan.id);
        }
        toast({ title: "Plan reactivado", description: "Se generó el próximo cobro pendiente." });
      }
      notifyChange();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleDelete = async (plan: ClientPlan) => {
    if (!confirm(`¿Eliminar el plan "${plan.name}"? Los cobros ya registrados se conservan.`)) return;
    try {
      await cancelPendingCharges(plan.id);
      const { error } = await supabase.from("client_plans").delete().eq("id", plan.id);
      if (error) throw error;
      toast({ title: "Plan eliminado" });
      notifyChange();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Plan de pago
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => {
              setEditingPlan(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-3">
            Sin plan de pago. Creá uno para generar cobros recurrentes.
          </p>
        ) : (
          <div className="divide-y divide-border/50">
            {plans.map((plan) => (
              <div key={plan.id} className="py-3 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{plan.name}</p>
                      <Badge className={cn("text-[10px] px-1.5 py-0", PLAN_STATUS_COLORS[plan.status])}>
                        {PLAN_STATUS_LABELS[plan.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      <RefreshCw className="inline h-2.5 w-2.5 mr-1" />
                      {planScheduleLabel(plan)} · {PAYMENT_METHOD_LABELS[plan.payment_method]}
                      {plan.status === "active" &&
                        ` · próximo: ${format(parseISO(plan.next_due_date), "dd MMM yyyy", { locale: es })}`}
                    </p>
                  </div>
                  <p className="font-mono font-semibold text-success flex-shrink-0">
                    {formatCurrency(plan.amount, plan.currency)}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      /{plan.billing_cycle === "monthly" ? "mes" : "año"}
                    </span>
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingPlan(plan);
                          setIsFormOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      {plan.status === "active" ? (
                        <DropdownMenuItem onClick={() => handleSetStatus(plan, "paused")}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleSetStatus(plan, "active")}>
                          <Play className="h-4 w-4 mr-2" />
                          Activar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(plan)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {plan.payment_details && (
                  <p className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 whitespace-pre-wrap">
                    {plan.payment_details}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <PlanFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlan(null);
        }}
        plan={editingPlan}
        clientId={clientId}
        clientName={clientName}
        onSuccess={notifyChange}
      />
    </Card>
  );
};

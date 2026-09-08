import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { format, parseISO, addMonths, addYears, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Transaction } from "@/types/finance";
import { TRANSACTION_STATUS_LABELS, RECURRENCE_LABELS } from "@/types/finance";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onChanged: () => void;
  emptyMessage?: string;
  showClient?: boolean;
}

const statusColor = (tx: Transaction): string => {
  if (tx.status === "paid") return "bg-success/20 text-success";
  if (tx.status === "cancelled") return "bg-muted text-muted-foreground";
  const overdue = isBefore(parseISO(tx.due_date), startOfDay(new Date()));
  return overdue
    ? "bg-destructive/20 text-destructive"
    : "bg-warning/20 text-warning";
};

const statusLabel = (tx: Transaction): string => {
  if (tx.status === "pending" && isBefore(parseISO(tx.due_date), startOfDay(new Date()))) {
    return "Vencido";
  }
  return TRANSACTION_STATUS_LABELS[tx.status];
};

export const TransactionList = ({
  transactions,
  onEdit,
  onChanged,
  emptyMessage = "No hay movimientos",
  showClient = true,
}: TransactionListProps) => {
  const handleMarkPaid = async (tx: Transaction) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase
        .from("transactions")
        .update({ status: "paid", paid_date: today })
        .eq("id", tx.id);
      if (error) throw error;

      // Si es recurrente, generar la próxima ocurrencia pendiente
      if (tx.recurrence !== "none") {
        const base = parseISO(tx.due_date);
        const nextDue =
          tx.recurrence === "monthly" ? addMonths(base, 1) : addYears(base, 1);
        const nextDueStr = format(nextDue, "yyyy-MM-dd");
        const { error: nextError } = await supabase.from("transactions").insert({
          type: tx.type,
          status: "pending",
          description: tx.description,
          category: tx.category,
          amount: tx.amount,
          currency: tx.currency,
          due_date: nextDueStr,
          recurrence: tx.recurrence,
          client_id: tx.client_id,
          plan_id: tx.plan_id,
          notes: tx.notes,
        });
        if (nextError) throw nextError;

        // Mantener actualizado el próximo vencimiento del plan
        if (tx.plan_id) {
          await supabase
            .from("client_plans")
            .update({ next_due_date: nextDueStr })
            .eq("id", tx.plan_id);
        }
        toast({
          title: "Marcado como pagado",
          description: `Se generó la próxima cuota para el ${format(nextDue, "dd MMM yyyy", { locale: es })}.`,
        });
      } else {
        toast({ title: "Marcado como pagado" });
      }
      onChanged();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleDelete = async (tx: Transaction) => {
    if (!confirm(`¿Eliminar "${tx.description}"?`)) return;
    const { error } = await supabase.from("transactions").delete().eq("id", tx.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Movimiento eliminado" });
    onChanged();
  };

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">{emptyMessage}</p>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center gap-3 py-3">
          {tx.type === "income" ? (
            <ArrowUpCircle className="h-5 w-5 text-success flex-shrink-0" />
          ) : (
            <ArrowDownCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{tx.description}</p>
              {tx.recurrence !== "none" && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground border border-border/60 rounded px-1">
                  <RefreshCw className="h-2.5 w-2.5" />
                  {RECURRENCE_LABELS[tx.recurrence]}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {format(parseISO(tx.due_date), "dd MMM yyyy", { locale: es })}
              {showClient && tx.client?.company_name && ` · ${tx.client.company_name}`}
              {tx.category && ` · ${tx.category}`}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <p
              className={cn(
                "font-mono font-semibold",
                tx.type === "income" ? "text-success" : "text-destructive"
              )}
            >
              {tx.type === "income" ? "+" : "-"}
              {formatCurrency(tx.amount, tx.currency)}
            </p>
            <Badge className={cn("text-[10px] px-1.5 py-0", statusColor(tx))}>
              {statusLabel(tx)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tx.status === "pending" && (
                <DropdownMenuItem onClick={() => handleMarkPaid(tx)}>
                  <Check className="h-4 w-4 mr-2" />
                  Marcar pagado
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(tx)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(tx)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

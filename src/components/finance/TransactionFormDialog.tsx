import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Client } from "@/types/client";
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  TransactionRecurrence,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/types/finance";

const NO_CLIENT = "none";

interface TransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  clients: Client[];
  defaultClientId?: string;
  defaultType?: TransactionType;
  onSuccess: () => void;
}

export const TransactionFormDialog = ({
  open,
  onClose,
  transaction,
  clients,
  defaultClientId,
  defaultType,
  onSuccess,
}: TransactionFormDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [type, setType] = useState<TransactionType>("income");
  const [status, setStatus] = useState<TransactionStatus>("pending");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState<TransactionRecurrence>("none");
  const [clientId, setClientId] = useState<string>(NO_CLIENT);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (transaction) {
      setType(transaction.type);
      setStatus(transaction.status);
      setDescription(transaction.description);
      setCategory(transaction.category || "");
      setAmount(String(transaction.amount));
      setCurrency(transaction.currency);
      setDueDate(transaction.due_date);
      setRecurrence(transaction.recurrence);
      setClientId(transaction.client_id || NO_CLIENT);
      setNotes(transaction.notes || "");
    } else {
      setType(defaultType || "income");
      setStatus("pending");
      setDescription("");
      setCategory("");
      setAmount("");
      setCurrency("USD");
      setDueDate(new Date().toISOString().split("T")[0]);
      setRecurrence("none");
      setClientId(defaultClientId || NO_CLIENT);
      setNotes("");
    }
  }, [open, transaction, defaultClientId, defaultType]);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !dueDate) {
      toast({
        title: "Datos incompletos",
        description: "Completá descripción, monto (> 0) y fecha.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        type,
        status,
        description: description.trim(),
        category: category || null,
        amount: parsedAmount,
        currency,
        due_date: dueDate,
        paid_date: status === "paid" ? (transaction?.paid_date || new Date().toISOString().split("T")[0]) : null,
        recurrence,
        client_id: clientId === NO_CLIENT ? null : clientId,
        notes: notes.trim() || null,
      };

      if (transaction) {
        const { error } = await supabase
          .from("transactions")
          .update(data)
          .eq("id", transaction.id);
        if (error) throw error;
        toast({ title: "Movimiento actualizado" });
      } else {
        const { error } = await supabase.from("transactions").insert(data);
        if (error) throw error;
        toast({ title: type === "income" ? "Cobro registrado" : "Gasto registrado" });
      }

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar movimiento" : "Nuevo movimiento"}</DialogTitle>
          <DialogDescription>
            Registrá un cobro (ingreso) o un gasto, único o recurrente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Cobro (ingreso)</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado *</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TransactionStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-description">Descripción *</Label>
            <Input
              id="tx-description"
              placeholder={type === "income" ? "Ej: Mantenimiento web mensual" : "Ej: Hosting VPS"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Monto *</Label>
              <Input
                id="tx-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="UYU">UYU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tx-due-date">Fecha (vencimiento) *</Label>
              <Input
                id="tx-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Recurrencia</Label>
              <Select value={recurrence} onValueChange={(v) => setRecurrence(v as TransactionRecurrence)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Único</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={category || "none"} onValueChange={(v) => setCategory(v === "none" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sin categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoría</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cliente (opcional)</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Sin cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CLIENT}>Sin cliente</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-notes">Notas</Label>
            <Textarea
              id="tx-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

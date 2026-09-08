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
import {
  ClientPlan,
  PlanBillingCycle,
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
} from "@/types/finance";

interface PlanFormDialogProps {
  open: boolean;
  onClose: () => void;
  plan: ClientPlan | null;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
}

export const PlanFormDialog = ({
  open,
  onClose,
  plan,
  clientId,
  clientName,
  onSuccess,
}: PlanFormDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (plan) {
      setName(plan.name);
      setAmount(String(plan.amount));
      setCurrency(plan.currency);
      setBillingCycle(plan.billing_cycle);
      setPaymentMethod(plan.payment_method);
      setPaymentDetails(plan.payment_details || "");
      setStartDate(plan.start_date);
      setNotes(plan.notes || "");
    } else {
      setName("");
      setAmount("");
      setCurrency("USD");
      setBillingCycle("monthly");
      setPaymentMethod("transferencia");
      setPaymentDetails("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  }, [open, plan]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !startDate) {
      toast({
        title: "Datos incompletos",
        description: "Completá nombre, monto (> 0) y fecha de inicio.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        client_id: clientId,
        name: name.trim(),
        amount: parsedAmount,
        currency,
        billing_cycle: billingCycle,
        payment_method: paymentMethod,
        payment_details: paymentDetails.trim() || null,
        start_date: startDate,
        notes: notes.trim() || null,
      };

      if (plan) {
        const { error } = await supabase
          .from("client_plans")
          .update(data)
          .eq("id", plan.id);
        if (error) throw error;
        toast({ title: "Plan actualizado" });
      } else {
        // Crear plan + primer cobro pendiente vinculado
        const { data: newPlan, error } = await supabase
          .from("client_plans")
          .insert({ ...data, next_due_date: startDate, status: "active" })
          .select()
          .single();
        if (error) throw error;

        const { error: txError } = await supabase.from("transactions").insert({
          type: "income",
          status: "pending",
          description: `${name.trim()} (${clientName})`,
          category: "Mantenimiento",
          amount: parsedAmount,
          currency,
          due_date: startDate,
          recurrence: billingCycle,
          client_id: clientId,
          plan_id: newPlan.id,
        });
        if (txError) throw txError;

        toast({
          title: "Plan creado",
          description: "Se generó el primer cobro pendiente en Finanzas.",
        });
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
          <DialogTitle>{plan ? "Editar plan" : "Nuevo plan de pago"}</DialogTitle>
          <DialogDescription>
            Plan recurrente de {clientName}: monto, ciclo y método de pago.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Nombre del plan *</Label>
            <Input
              id="plan-name"
              placeholder="Ej: Mantenimiento web"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="plan-amount">Monto *</Label>
              <Input
                id="plan-amount"
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
              <Label>Ciclo *</Label>
              <Select
                value={billingCycle}
                onValueChange={(v) => setBillingCycle(v as PlanBillingCycle)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-start">Inicio / próximo cobro *</Label>
              <Input
                id="plan-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Método de pago</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-payment-details">Datos de pago</Label>
            <Textarea
              id="plan-payment-details"
              rows={2}
              placeholder="Ej: cuenta bancaria, alias, quién paga, día habitual de pago..."
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-notes">Notas</Label>
            <Textarea
              id="plan-notes"
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

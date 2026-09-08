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
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  ClientPlan,
  PlanBillingCycle,
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
  MONTH_LABELS,
  computeNextDueDate,
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
  const [renewalMonth, setRenewalMonth] = useState<string>("");
  const [renewalDay, setRenewalDay] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (plan) {
      setName(plan.name);
      setAmount(String(plan.amount));
      setCurrency(plan.currency);
      setBillingCycle(plan.billing_cycle);
      setRenewalMonth(plan.renewal_month ? String(plan.renewal_month) : "");
      setRenewalDay(plan.renewal_day ? String(plan.renewal_day) : "");
      setPaymentMethod(plan.payment_method);
      setPaymentDetails(plan.payment_details || "");
      setNotes(plan.notes || "");
    } else {
      const today = new Date();
      setName("");
      setAmount("");
      setCurrency("USD");
      setBillingCycle("monthly");
      setRenewalMonth(String(today.getMonth() + 1));
      setRenewalDay(String(Math.min(today.getDate(), 28)));
      setPaymentMethod("transferencia");
      setPaymentDetails("");
      setNotes("");
    }
  }, [open, plan]);

  const monthNum = renewalMonth ? parseInt(renewalMonth, 10) : null;
  const dayNum = renewalDay ? parseInt(renewalDay, 10) : null;
  const nextDue = computeNextDueDate(billingCycle, monthNum, dayNum);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Datos incompletos",
        description: "Completá nombre y monto (> 0).",
        variant: "destructive",
      });
      return;
    }
    if (billingCycle === "yearly" && !monthNum) {
      toast({
        title: "Falta el mes de renovación",
        description: "Elegí en qué mes se renueva el plan anual.",
        variant: "destructive",
      });
      return;
    }
    if (billingCycle === "monthly" && !dayNum) {
      toast({
        title: "Falta el día de cobro",
        description: "Elegí qué día del mes se cobra el plan mensual.",
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
        renewal_month: billingCycle === "yearly" ? monthNum : null,
        renewal_day: billingCycle === "monthly" ? dayNum : null,
        payment_method: paymentMethod,
        payment_details: paymentDetails.trim() || null,
        next_due_date: nextDue,
        notes: notes.trim() || null,
      };

      if (plan) {
        const { error } = await supabase
          .from("client_plans")
          .update(data)
          .eq("id", plan.id);
        if (error) throw error;

        // Sincronizar el cobro pendiente del plan con los nuevos datos
        await supabase
          .from("transactions")
          .update({
            description: `${name.trim()} (${clientName})`,
            amount: parsedAmount,
            currency,
            due_date: nextDue,
            recurrence: billingCycle,
          })
          .eq("plan_id", plan.id)
          .eq("status", "pending");

        toast({ title: "Plan actualizado" });
      } else {
        // Crear plan + primer cobro pendiente vinculado
        const { data: newPlan, error } = await supabase
          .from("client_plans")
          .insert({
            ...data,
            start_date: new Date().toISOString().split("T")[0],
            status: "active",
          })
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
          due_date: nextDue,
          recurrence: billingCycle,
          client_id: clientId,
          plan_id: newPlan.id,
        });
        if (txError) throw txError;

        toast({
          title: "Plan creado",
          description: `Primer cobro: ${format(parseISO(nextDue), "dd 'de' MMMM yyyy", { locale: es })}. Después se renueva solo.`,
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

            {billingCycle === "yearly" ? (
              <div className="space-y-2">
                <Label>Mes de renovación *</Label>
                <Select value={renewalMonth} onValueChange={setRenewalMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegir mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_LABELS.map((m, i) => (
                      <SelectItem key={m} value={String(i + 1)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Día de cobro *</Label>
                <Select value={renewalDay} onValueChange={setRenewalDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegir día" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1.5">
            {billingCycle === "yearly"
              ? `Se cobra todos los ${monthNum ? MONTH_LABELS[monthNum - 1].toLowerCase() : "…"} de cada año. `
              : `Se cobra todos los ${dayNum || "…"} de cada mes. `}
            Próximo cobro:{" "}
            <span className="text-foreground font-medium">
              {format(parseISO(nextDue), "dd 'de' MMMM yyyy", { locale: es })}
            </span>
            . Al marcarlo pagado, el siguiente se genera automáticamente.
          </p>

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

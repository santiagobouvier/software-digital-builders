import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanSelector } from "@/components/PlanSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DollarSign, CreditCard, Calendar, Loader2, ArrowRight, Pencil } from "lucide-react";
import { format, addMonths, addYears, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface Subscription {
  id: string;
  plan: "monthly" | "annual";
  plan_id: string | null;
  monthly_price: number;
  annual_price: number;
  started_at: string;
  next_billing_at: string;
  is_active: boolean;
  currency?: string;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  monthly_price: number;
  annual_price: number;
  currency?: string;
}

const getCurrencySymbol = (currency: string) => {
  return currency === "UYU" ? "$U" : "$";
};

interface SubscriptionManagerProps {
  botId: string;
  companyId: string;
  isOwner: boolean;
}

export const SubscriptionManager = ({ botId, companyId, isOwner }: SubscriptionManagerProps) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  const CUSTOM_PLAN_ID = "custom";

  useEffect(() => {
    loadData();
  }, [botId]);

  const loadData = async () => {
    setIsLoading(true);
    
    // Load subscription and plans in parallel
    const [subResult, plansResult] = await Promise.all([
      supabase
        .from("bot_subscriptions")
        .select("*")
        .eq("bot_id", botId)
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (plansResult.data) {
      setPlans(plansResult.data as Plan[]);
    }

    if (subResult.data) {
      const sub = subResult.data as Subscription;
      setSubscription(sub);
      setSelectedPlanId(sub.plan_id);
      setBillingCycle(sub.plan);
    } else if (plansResult.data && plansResult.data.length > 0) {
      // Pre-select Pro plan by default
      const proPlan = plansResult.data.find((p: any) => p.slug === "pro");
      setSelectedPlanId(proPlan?.id || plansResult.data[0].id);
    }
    
    setIsLoading(false);
  };

  const handleSaveSubscription = async () => {
    if (!selectedPlanId) return;
    
    const isCustom = selectedPlanId === CUSTOM_PLAN_ID;
    
    // Validate custom price
    if (isCustom && (!customPrice || customPrice <= 0)) {
      toast({
        title: "Error",
        description: "Ingresá un precio válido para el plan personalizado.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    const selectedPlan = isCustom ? null : plans.find(p => p.id === selectedPlanId);
    
    if (!isCustom && !selectedPlan) {
      setIsSaving(false);
      return;
    }

    const monthlyPrice = isCustom ? customPrice! : selectedPlan!.monthly_price;
    const annualPrice = isCustom ? Math.round(customPrice! * 12) : selectedPlan!.annual_price;

    const now = new Date();
    const nextBilling = billingCycle === "monthly" 
      ? addMonths(now, 1) 
      : addYears(now, 1);

    if (subscription) {
      // Update existing subscription
      const { error } = await supabase
        .from("bot_subscriptions")
        .update({
          plan_id: isCustom ? null : selectedPlanId,
          plan: billingCycle,
          monthly_price: monthlyPrice,
          annual_price: annualPrice,
          next_billing_at: nextBilling.toISOString(),
          currency: "UYU",
        })
        .eq("id", subscription.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Suscripción actualizada",
          description: isCustom 
            ? `Plan personalizado ($U ${monthlyPrice.toLocaleString("es-UY")}/mes) activado.`
            : `Plan cambiado a ${selectedPlan!.name} (${billingCycle === "annual" ? "anual" : "mensual"}).`,
        });
        loadData();
        setIsDialogOpen(false);
      }
    } else {
      // Create new subscription
      const { error } = await supabase
        .from("bot_subscriptions")
        .insert({
          bot_id: botId,
          company_id: companyId,
          plan_id: isCustom ? null : selectedPlanId,
          plan: billingCycle,
          monthly_price: monthlyPrice,
          annual_price: annualPrice,
          started_at: now.toISOString(),
          next_billing_at: nextBilling.toISOString(),
          is_active: true,
          currency: "UYU",
        });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Suscripción activada",
          description: isCustom 
            ? `Plan personalizado ($U ${monthlyPrice.toLocaleString("es-UY")}/mes) activado.`
            : `Plan ${selectedPlan!.name} activado correctamente.`,
        });
        loadData();
        setIsDialogOpen(false);
      }
    }
    
    setIsSaving(false);
  };

  const getCurrentPlanName = () => {
    if (!subscription) return null;
    if (!subscription.plan_id) return "Personalizado";
    return plans.find(p => p.id === subscription.plan_id)?.name || null;
  };

  const getMonthlyRate = () => {
    if (!subscription) return 0;
    return subscription.plan === "monthly" 
      ? subscription.monthly_price 
      : subscription.annual_price / 12;
  };

  const daysUntilNextBilling = subscription 
    ? differenceInDays(new Date(subscription.next_billing_at), new Date())
    : null;

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // No subscription - show activation CTA
  if (!subscription) {
    return (
      <>
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
              <p className="text-muted-foreground text-sm mb-4">
                Este bot no tiene una suscripción activa.
              </p>
              {isOwner && (
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Activar suscripción
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Activar suscripción</DialogTitle>
              <DialogDescription>
                Elegí un plan para este bot.
              </DialogDescription>
            </DialogHeader>
            <PlanSelector
              selectedPlanId={selectedPlanId}
              selectedBillingCycle={billingCycle}
              onPlanChange={setSelectedPlanId}
              onBillingCycleChange={setBillingCycle}
              customPrice={customPrice}
              onCustomPriceChange={setCustomPrice}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveSubscription} disabled={isSaving || !selectedPlanId}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  "Activar suscripción"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Has subscription - show details
  const planName = getCurrentPlanName();

  return (
    <>
      <Card variant="elevated">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Finanzas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={
                  subscription.plan === "annual" 
                    ? "bg-success/10 text-success border-success/30" 
                    : "bg-primary/10 text-primary border-primary/30"
                }
              >
                {planName} - {subscription.plan === "annual" ? "Anual" : "Mensual"}
              </Badge>
              {isOwner && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Main Price Display */}
          <div className="text-center py-4 sm:py-6 bg-muted/30 rounded-xl">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Ingreso mensual recurrente
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-foreground">
              {getCurrencySymbol(subscription.currency || "USD")}{getMonthlyRate().toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{subscription.currency || "USD"} / mes</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 sm:p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Inicio</span>
              </div>
              <p className="text-sm sm:text-base font-semibold">
                {format(new Date(subscription.started_at), "dd MMM yyyy", { locale: es })}
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3.5 w-3.5 text-warning" />
                <span className="text-xs text-muted-foreground">Próximo cobro</span>
              </div>
              <p className="text-sm sm:text-base font-semibold">
                {daysUntilNextBilling} días
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(subscription.next_billing_at), "dd MMM", { locale: es })}
              </p>
            </div>
          </div>

          {/* Upgrade CTA for monthly plans */}
          {subscription.plan === "monthly" && isOwner && (
            <div className="p-3 sm:p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Ahorrá cambiando a anual
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Obtené hasta 17% de descuento
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1 border-success/30 text-success hover:bg-success/10"
                  onClick={() => {
                    setBillingCycle("annual");
                    setIsDialogOpen(true);
                  }}
                >
                  Cambiar a anual
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar plan</DialogTitle>
            <DialogDescription>
              Elegí un nuevo plan o ciclo de facturación.
            </DialogDescription>
          </DialogHeader>
          <PlanSelector
            selectedPlanId={selectedPlanId}
            selectedBillingCycle={billingCycle}
            onPlanChange={setSelectedPlanId}
            onBillingCycleChange={setBillingCycle}
            customPrice={customPrice}
            onCustomPriceChange={setCustomPrice}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSubscription} disabled={isSaving || !selectedPlanId}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

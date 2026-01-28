import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  slug: string;
  monthly_price: number;
  annual_price: number;
  description: string | null;
  currency?: string;
}

const getCurrencySymbol = (currency?: string) => {
  return currency === "UYU" ? "$U" : "$";
};

interface PlanSelectorProps {
  selectedPlanId: string | null;
  selectedBillingCycle: "monthly" | "annual";
  onPlanChange: (planId: string) => void;
  onBillingCycleChange: (cycle: "monthly" | "annual") => void;
  disabled?: boolean;
}

export const PlanSelector = ({
  selectedPlanId,
  selectedBillingCycle,
  onPlanChange,
  onBillingCycleChange,
  disabled = false,
}: PlanSelectorProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (data) {
      setPlans(data as Plan[]);
      // Auto-select first plan if none selected
      if (!selectedPlanId && data.length > 0) {
        onPlanChange(data[0].id);
      }
    }
    setIsLoading(false);
  };

  const getPrice = (plan: Plan) => {
    return selectedBillingCycle === "monthly" ? plan.monthly_price : plan.annual_price;
  };

  const getMonthlyEquivalent = (plan: Plan) => {
    return selectedBillingCycle === "annual" ? plan.annual_price / 12 : plan.monthly_price;
  };

  const getSavingsPercent = (plan: Plan) => {
    const monthlyTotal = plan.monthly_price * 12;
    const savings = monthlyTotal - plan.annual_price;
    return Math.round((savings / monthlyTotal) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={selectedBillingCycle}
          onValueChange={(value) => value && onBillingCycleChange(value as "monthly" | "annual")}
          className="bg-muted/50 p-1 rounded-lg"
          disabled={disabled}
        >
          <ToggleGroupItem value="monthly" className="px-4 text-sm">
            Mensual
          </ToggleGroupItem>
          <ToggleGroupItem value="annual" className="px-4 text-sm gap-1.5">
            Anual
            <Badge variant="secondary" className="bg-success/20 text-success text-xs">
              -17%
            </Badge>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Plan Cards */}
      <RadioGroup
        value={selectedPlanId || ""}
        onValueChange={onPlanChange}
        className="grid gap-3"
        disabled={disabled}
      >
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isPro = plan.slug === "pro";
          
          return (
            <Label
              key={plan.id}
              htmlFor={plan.id}
              className={cn(
                "cursor-pointer",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <Card
                className={cn(
                  "relative transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground/50",
                  isPro && !isSelected && "border-primary/30"
                )}
              >
                {isPro && (
                  <div className="absolute -top-2.5 left-4">
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Sparkles className="h-3 w-3" />
                      Recomendado
                    </Badge>
                  </div>
                )}
                <CardContent className="p-4 flex items-center gap-4">
                  <RadioGroupItem
                    value={plan.id}
                    id={plan.id}
                    className="flex-shrink-0"
                    disabled={disabled}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{plan.name}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold">
                      {getCurrencySymbol(plan.currency)}{getMonthlyEquivalent(plan).toFixed(0)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </div>
                    {selectedBillingCycle === "annual" && (
                      <p className="text-xs text-success">
                        Ahorras {getSavingsPercent(plan)}%
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {plan.currency}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      {/* Total */}
      {selectedPlanId && plans.find(p => p.id === selectedPlanId) && (
        <div className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Total a pagar {selectedBillingCycle === "annual" ? "anualmente" : "mensualmente"}
          </span>
          <span className="font-semibold text-lg">
            {getCurrencySymbol(plans.find(p => p.id === selectedPlanId)!.currency)}
            {getPrice(plans.find(p => p.id === selectedPlanId)!).toFixed(0)} {plans.find(p => p.id === selectedPlanId)!.currency}
          </span>
        </div>
      )}
    </div>
  );
};

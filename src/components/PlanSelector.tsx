import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Loader2, Check, Sparkles, Edit3 } from "lucide-react";
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

interface PlanSelectorProps {
  selectedPlanId: string | null;
  selectedBillingCycle: "monthly" | "annual";
  onPlanChange: (planId: string) => void;
  onBillingCycleChange: (cycle: "monthly" | "annual") => void;
  customPrice?: number | null;
  onCustomPriceChange?: (price: number | null) => void;
  disabled?: boolean;
}

const CUSTOM_PLAN_ID = "custom";

export const PlanSelector = ({
  selectedPlanId,
  selectedBillingCycle,
  onPlanChange,
  onBillingCycleChange,
  customPrice,
  onCustomPriceChange,
  disabled = false,
}: PlanSelectorProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localCustomPrice, setLocalCustomPrice] = useState<string>(
    customPrice ? customPrice.toString() : ""
  );

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (customPrice) {
      setLocalCustomPrice(customPrice.toString());
    }
  }, [customPrice]);

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

  const handleCustomPriceChange = (value: string) => {
    setLocalCustomPrice(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onCustomPriceChange?.(numValue);
    } else {
      onCustomPriceChange?.(null);
    }
  };

  const getCustomAnnualPrice = () => {
    const monthly = parseFloat(localCustomPrice) || 0;
    // Plan personalizado: se ingresa el monto manualmente, sin descuento anual
    return Math.round(monthly * 12);
  };

  const isCustomSelected = selectedPlanId === CUSTOM_PLAN_ID;
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

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
            {!isCustomSelected && (
              <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                -17%
              </Badge>
            )}
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
          const isPro = plan.slug === "pro-uyu";
          
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
                      $U {getMonthlyEquivalent(plan).toLocaleString("es-UY")}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </div>
                    {selectedBillingCycle === "annual" && (
                      <p className="text-xs text-success">
                        Ahorras {getSavingsPercent(plan)}%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}

        {/* Custom Plan Option */}
        <Label
          htmlFor={CUSTOM_PLAN_ID}
          className={cn(
            "cursor-pointer",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <Card
            className={cn(
              "relative transition-all",
              isCustomSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-muted-foreground/50 border-dashed"
            )}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <RadioGroupItem
                value={CUSTOM_PLAN_ID}
                id={CUSTOM_PLAN_ID}
                className="flex-shrink-0"
                disabled={disabled}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Personalizado</span>
                  {isCustomSelected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Definí un precio a medida
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$U</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={localCustomPrice}
                  onChange={(e) => handleCustomPriceChange(e.target.value)}
                  onClick={() => onPlanChange(CUSTOM_PLAN_ID)}
                  className="w-24 text-right"
                  disabled={disabled}
                />
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
            </CardContent>
          </Card>
        </Label>
      </RadioGroup>

      {/* Total */}
      {selectedPlanId && (
        <div className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Total a pagar {selectedBillingCycle === "annual" ? "anualmente" : "mensualmente"}
          </span>
          <span className="font-semibold text-lg">
            {isCustomSelected ? (
              <>
                $U {selectedBillingCycle === "annual" 
                  ? getCustomAnnualPrice().toLocaleString("es-UY")
                  : (parseFloat(localCustomPrice) || 0).toLocaleString("es-UY")
                }
              </>
            ) : selectedPlan ? (
              <>$U {getPrice(selectedPlan).toLocaleString("es-UY")}</>
            ) : null}
          </span>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, convertCurrency, getSubscriptionPricing, calculatePackPricing } from "@/lib/pricing";
import { useExchangeRate } from "@/hooks/useExchangeRate";

interface ClientSubscription {
  id: string;
  client_id: string;
  item_type: "product" | "pack";
  pricing_mode: "catalog" | "custom";
  custom_one_time: number;
  custom_monthly: number;
  currency: string;
  is_active: boolean;
  product?: {
    name: string;
    price_one_time: number;
    price_monthly: number;
  } | null;
  pack?: {
    name: string;
    discount_type: "none" | "percent" | "fixed";
    discount_value: number;
    pack_items: Array<{
      quantity: number;
      product: {
        price_one_time: number;
        price_monthly: number;
      } | null;
    }>;
  } | null;
  client?: {
    company_name: string;
  } | null;
}

interface ClientStatus {
  status: string;
  count: number;
}

export const FinancialSummary = () => {
  const navigate = useNavigate();
  const { rate, convert } = useExchangeRate();
  const displayCurrency = "USD"; // Default display in USD
  const [subscriptions, setSubscriptions] = useState<ClientSubscription[]>([]);
  const [clientStats, setClientStats] = useState<ClientStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    const [subsResult, clientsResult] = await Promise.all([
      supabase
        .from("client_subscriptions")
        .select(`
          id,
          client_id,
          item_type,
          pricing_mode,
          custom_one_time,
          custom_monthly,
          currency,
          is_active,
          product:products(name, price_one_time, price_monthly),
          pack:packs(
            name, 
            discount_type, 
            discount_value,
            pack_items(quantity, product:products(price_one_time, price_monthly))
          ),
          client:clients(company_name)
        `)
        .eq("is_active", true),
      supabase
        .from("clients")
        .select("status"),
    ]);

    if (subsResult.data) {
      setSubscriptions(subsResult.data as unknown as ClientSubscription[]);
    }

    if (clientsResult.data) {
      // Group by status
      const statusMap: Record<string, number> = {};
      clientsResult.data.forEach((c) => {
        statusMap[c.status] = (statusMap[c.status] || 0) + 1;
      });
      setClientStats(
        Object.entries(statusMap).map(([status, count]) => ({ status, count }))
      );
    }
    
    setIsLoading(false);
  };

  const financialMetrics = useMemo(() => {
    let totalMRR = 0;
    let totalSetup = 0;

    subscriptions.forEach((sub) => {
      let pricing = { oneTime: 0, monthly: 0 };
      
      if (sub.item_type === "product" && sub.product) {
        pricing = getSubscriptionPricing(
          sub.pricing_mode,
          sub.product.price_one_time,
          sub.product.price_monthly,
          sub.custom_one_time,
          sub.custom_monthly
        );
      } else if (sub.item_type === "pack" && sub.pack) {
        const packItems = sub.pack.pack_items
          .filter((item) => item.product)
          .map((item) => ({
            quantity: item.quantity,
            product: {
              price_one_time: item.product!.price_one_time,
              price_monthly: item.product!.price_monthly,
            },
          }));
        
        const packPricing = calculatePackPricing(
          packItems,
          sub.pack.discount_type,
          sub.pack.discount_value
        );
        
        pricing = getSubscriptionPricing(
          sub.pricing_mode,
          packPricing.totalOneTime,
          packPricing.totalMonthly,
          sub.custom_one_time,
          sub.custom_monthly
        );
      }

      // Convert to display currency using hook's convert function
      const convertedMRR = convert(pricing.monthly, sub.currency, displayCurrency);
      const convertedSetup = convert(pricing.oneTime, sub.currency, displayCurrency);
      
      totalMRR += convertedMRR;
      totalSetup += convertedSetup;
    });

    return {
      mrr: totalMRR,
      arr: totalMRR * 12,
      setup: totalSetup,
      activeSubscriptions: subscriptions.length,
    };
  }, [subscriptions, displayCurrency, convert]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      lead: "Leads",
      active: "Activos",
      paused: "Pausados",
      cancelled: "Cancelados",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead: "bg-primary/20 text-primary",
      active: "bg-success/20 text-success",
      paused: "bg-warning/20 text-warning",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const totalClients = clientStats.reduce((sum, s) => sum + s.count, 0);
  const activeClients = clientStats.find((s) => s.status === "active")?.count || 0;

  return (
    <div className="space-y-4">
      {/* Financial KPIs */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {/* MRR */}
        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono">
                  {formatCurrency(financialMetrics.mrr, displayCurrency)}
                </p>
                <p className="text-xs text-muted-foreground">Ingreso mensual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ARR */}
        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono">
                  {formatCurrency(financialMetrics.arr, displayCurrency)}
                </p>
                <p className="text-xs text-muted-foreground">Proyección anual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Clients */}
        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{activeClients}</p>
                <p className="text-xs text-muted-foreground">Clientes activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{financialMetrics.activeSubscriptions}</p>
                <p className="text-xs text-muted-foreground">Suscripciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Pipeline */}
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Pipeline de clientes
            </CardTitle>
            <Badge variant="outline">{totalClients} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {totalClients === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No hay clientes registrados</p>
              <button 
                onClick={() => navigate("/clientes")}
                className="text-sm text-primary hover:underline mt-1"
              >
                Agregar primer cliente →
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {clientStats.map((stat) => (
                <Badge 
                  key={stat.status} 
                  className={`${getStatusColor(stat.status)} cursor-pointer`}
                  onClick={() => navigate("/clientes")}
                >
                  {stat.count} {getStatusLabel(stat.status)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

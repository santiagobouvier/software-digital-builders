import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ExchangeRateData {
  rate: number;
  description?: string;
}

export const useExchangeRate = () => {
  const [rate, setRate] = useState<number>(42);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExchangeRate();
  }, []);

  const loadExchangeRate = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "exchange_rate_usd_uyu")
        .single();

      if (error) throw error;
      
      const value = data?.value as unknown as ExchangeRateData;
      if (value?.rate) {
        setRate(value.rate);
      }
    } catch (error) {
      console.error("Error loading exchange rate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExchangeRate = useCallback(async (newRate: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("system_settings")
        .update({ 
          value: { rate: newRate, description: "Cotización USD a UYU" },
          updated_by: user?.id
        })
        .eq("key", "exchange_rate_usd_uyu");

      if (error) throw error;
      
      setRate(newRate);
      toast({ title: "Cotización actualizada", description: `1 USD = ${newRate} UYU` });
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
  }, []);

  // Conversion functions
  const toUSD = useCallback((amountUYU: number): number => {
    return rate > 0 ? amountUYU / rate : 0;
  }, [rate]);

  const toUYU = useCallback((amountUSD: number): number => {
    return amountUSD * rate;
  }, [rate]);

  const convert = useCallback((amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === "USD" && toCurrency === "UYU") return toUYU(amount);
    if (fromCurrency === "UYU" && toCurrency === "USD") return toUSD(amount);
    return amount;
  }, [toUSD, toUYU]);

  return {
    rate,
    isLoading,
    updateExchangeRate,
    toUSD,
    toUYU,
    convert,
    reload: loadExchangeRate,
  };
};

import { useState, useEffect, useMemo } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { formatCurrency, calculatePackPricing } from "@/lib/pricing";
import type { 
  ClientSubscription, 
  Product, 
  PackWithItems,
  SubscriptionItemType,
  PricingMode 
} from "@/types/catalog";

interface SubscriptionFormDialogProps {
  open: boolean;
  onClose: () => void;
  subscription: ClientSubscription | null;
  clientId: string;
  products: Product[];
  packs: PackWithItems[];
  onSuccess: () => void;
}

export const SubscriptionFormDialog = ({ 
  open, 
  onClose, 
  subscription, 
  clientId,
  products,
  packs,
  onSuccess 
}: SubscriptionFormDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [itemType, setItemType] = useState<SubscriptionItemType>("product");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedPackId, setSelectedPackId] = useState("");
  const [pricingMode, setPricingMode] = useState<PricingMode>("catalog");
  const [customOneTime, setCustomOneTime] = useState("");
  const [customMonthly, setCustomMonthly] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const activeProducts = products.filter((p) => p.is_active);
  const activePacks = packs.filter((p) => p.is_active);

  useEffect(() => {
    if (subscription) {
      setItemType(subscription.item_type);
      setSelectedProductId(subscription.product_id || "");
      setSelectedPackId(subscription.pack_id || "");
      setPricingMode(subscription.pricing_mode);
      setCustomOneTime(subscription.custom_one_time.toString());
      setCustomMonthly(subscription.custom_monthly.toString());
      setCustomNotes(subscription.custom_notes || "");
    } else {
      resetForm();
    }
  }, [subscription, open]);

  const resetForm = () => {
    setItemType("product");
    setSelectedProductId(activeProducts[0]?.id || "");
    setSelectedPackId(activePacks[0]?.id || "");
    setPricingMode("catalog");
    setCustomOneTime("0");
    setCustomMonthly("0");
    setCustomNotes("");
  };

  // Get catalog pricing for preview
  const catalogPricing = useMemo(() => {
    if (itemType === "product") {
      const product = products.find((p) => p.id === selectedProductId);
      return {
        oneTime: product?.price_one_time || 0,
        monthly: product?.price_monthly || 0,
      };
    } else {
      const pack = packs.find((p) => p.id === selectedPackId);
      if (!pack) return { oneTime: 0, monthly: 0 };
      
      const items = pack.pack_items.map((item) => ({
        quantity: item.quantity,
        product: {
          price_one_time: item.product?.price_one_time || 0,
          price_monthly: item.product?.price_monthly || 0,
        },
      }));
      const pricing = calculatePackPricing(items, pack.discount_type, pack.discount_value);
      return {
        oneTime: pricing.totalOneTime,
        monthly: pricing.totalMonthly,
      };
    }
  }, [itemType, selectedProductId, selectedPackId, products, packs]);

  const handleSubmit = async () => {
    const productId = itemType === "product" ? selectedProductId : null;
    const packId = itemType === "pack" ? selectedPackId : null;

    if (itemType === "product" && !productId) {
      toast({ title: "Error", description: "Selecciona un producto", variant: "destructive" });
      return;
    }
    if (itemType === "pack" && !packId) {
      toast({ title: "Error", description: "Selecciona un pack", variant: "destructive" });
      return;
    }

    const oneTime = parseFloat(customOneTime) || 0;
    const monthly = parseFloat(customMonthly) || 0;

    if (oneTime < 0 || monthly < 0) {
      toast({ title: "Error", description: "Los precios no pueden ser negativos", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        client_id: clientId,
        item_type: itemType,
        product_id: productId,
        pack_id: packId,
        pricing_mode: pricingMode,
        custom_one_time: pricingMode === "custom" ? oneTime : 0,
        custom_monthly: pricingMode === "custom" ? monthly : 0,
        custom_notes: customNotes.trim() || null,
      };

      if (subscription) {
        const { error } = await supabase
          .from("client_subscriptions")
          .update(data)
          .eq("id", subscription.id);

        if (error) throw error;
        toast({ title: "Suscripción actualizada" });
      } else {
        // Create subscription
        const { data: newSub, error } = await supabase
          .from("client_subscriptions")
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;

        // Auto-create instances for bot/web products
        if (itemType === "product" && productId) {
          const product = products.find((p) => p.id === productId);
          if (product?.category) {
            if (product.category === "bot_whatsapp" || product.category === "bot_interno") {
              await supabase.from("bot_instances").insert({
                client_id: clientId,
                subscription_id: newSub.id,
                product_id: productId,
                bot_type: product.category,
                status: "setup",
              });
            } else if (product.category === "web_rapida" || product.category === "web_autogestionable") {
              await supabase.from("web_instances").insert({
                client_id: clientId,
                subscription_id: newSub.id,
                product_id: productId,
                web_type: product.category,
                status: "development",
              });
            }
          }
        }

        toast({ title: "Suscripción añadida" });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {subscription ? "Editar suscripción" : "Añadir suscripción"}
          </DialogTitle>
          <DialogDescription>
            {subscription 
              ? "Modifica la suscripción del cliente" 
              : "Asigna un producto o pack al cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item type selector */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <RadioGroup 
              value={itemType} 
              onValueChange={(v) => setItemType(v as SubscriptionItemType)}
              className="flex gap-4"
              disabled={!!subscription}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="product" id="product" />
                <Label htmlFor="product" className="cursor-pointer">Producto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pack" id="pack" />
                <Label htmlFor="pack" className="cursor-pointer">Pack</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Product/Pack selector */}
          {itemType === "product" ? (
            <div className="space-y-2">
              <Label>Producto</Label>
              <Select 
                value={selectedProductId} 
                onValueChange={setSelectedProductId}
                disabled={!!subscription}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {activeProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price_monthly)}/mes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Pack</Label>
              <Select 
                value={selectedPackId} 
                onValueChange={setSelectedPackId}
                disabled={!!subscription}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un pack" />
                </SelectTrigger>
                <SelectContent>
                  {activePacks.map((pack) => {
                    const items = pack.pack_items.map((item) => ({
                      quantity: item.quantity,
                      product: {
                        price_one_time: item.product?.price_one_time || 0,
                        price_monthly: item.product?.price_monthly || 0,
                      },
                    }));
                    const pricing = calculatePackPricing(items, pack.discount_type, pack.discount_value);
                    return (
                      <SelectItem key={pack.id} value={pack.id}>
                        {pack.name} - {formatCurrency(pricing.totalMonthly)}/mes
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Catalog price preview */}
          <div className="p-3 bg-secondary/50 rounded-lg text-sm">
            <p className="text-muted-foreground mb-1">Precio de catálogo:</p>
            <div className="flex gap-4">
              <span>Setup: <strong className="font-mono">{formatCurrency(catalogPricing.oneTime)}</strong></span>
              <span>Mensual: <strong className="font-mono">{formatCurrency(catalogPricing.monthly)}</strong></span>
            </div>
          </div>

          {/* Pricing mode */}
          <div className="space-y-2">
            <Label>Modo de precio</Label>
            <RadioGroup 
              value={pricingMode} 
              onValueChange={(v) => setPricingMode(v as PricingMode)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="catalog" id="catalog" />
                <Label htmlFor="catalog" className="cursor-pointer">Catálogo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">Personalizado</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Custom pricing inputs */}
          {pricingMode === "custom" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customOneTime">Setup (USD)</Label>
                  <Input
                    id="customOneTime"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={customOneTime}
                    onChange={(e) => setCustomOneTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customMonthly">Mensual (USD)</Label>
                  <Input
                    id="customMonthly"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={customMonthly}
                    onChange={(e) => setCustomMonthly(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customNotes">Nota (razón del precio custom)</Label>
                <Textarea
                  id="customNotes"
                  placeholder="Ej: Descuento por volumen, acuerdo especial..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : subscription ? (
              "Guardar cambios"
            ) : (
              "Añadir"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

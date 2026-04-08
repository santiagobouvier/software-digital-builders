import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Pencil, 
  Package, 
  Layers, 
  Trash2,
  Power,
  Building2
} from "lucide-react";
import { formatCurrency, calculatePackPricing, getSubscriptionPricing, convertCurrency } from "@/lib/pricing";
import type { 
  ClientWithSubscriptions, 
  ClientSubscription,
  Product, 
  PackWithItems 
} from "@/types/catalog";
import { SubscriptionFormDialog } from "./SubscriptionFormDialog";
import { ClientAvatar } from "./ClientAvatar";

interface ClientDetailProps {
  client: ClientWithSubscriptions | null;
  products: Product[];
  packs: PackWithItems[];
  onSubscriptionChange: () => void;
  onEdit: () => void;
  exchangeRate?: number;
  displayCurrency?: "USD" | "UYU";
}

const STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  active: 'Activo',
  paused: 'Pausado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  lead: 'bg-blue-500/20 text-blue-400',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export const ClientDetail = ({ 
  client, 
  products, 
  packs, 
  onSubscriptionChange,
  onEdit,
  exchangeRate = 42,
  displayCurrency = "USD"
}: ClientDetailProps) => {
  const [isSubFormOpen, setIsSubFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<ClientSubscription | null>(null);
  const [deleteSub, setDeleteSub] = useState<ClientSubscription | null>(null);

  if (!client) {
    return (
      <Card variant="elevated" className="h-fit">
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Building2 className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-center">Selecciona un cliente para ver sus detalles</p>
        </CardContent>
      </Card>
    );
  }

  const getSubscriptionPricingData = (sub: ClientSubscription) => {
    const subCurrency = (sub as any).currency || "USD";
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
      const packItems = sub.pack.pack_items.map((item) => ({
        quantity: item.quantity,
        product: {
          price_one_time: item.product?.price_one_time || 0,
          price_monthly: item.product?.price_monthly || 0,
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

    // Convert to display currency
    return {
      oneTime: convertCurrency(pricing.oneTime, subCurrency, displayCurrency, exchangeRate),
      monthly: convertCurrency(pricing.monthly, subCurrency, displayCurrency, exchangeRate),
      originalCurrency: subCurrency,
    };
  };

  // Calculate totals in display currency
  const activeSubscriptions = client.client_subscriptions?.filter((s) => s.is_active) || [];
  const totals = activeSubscriptions.reduce(
    (acc, sub) => {
      const pricing = getSubscriptionPricingData(sub);
      return {
        setup: acc.setup + pricing.oneTime,
        mrr: acc.mrr + pricing.monthly,
      };
    },
    { setup: 0, mrr: 0 }
  );

  const handleToggleActive = async (sub: ClientSubscription) => {
    try {
      const { error } = await supabase
        .from("client_subscriptions")
        .update({ is_active: !sub.is_active })
        .eq("id", sub.id);

      if (error) throw error;

      toast({ 
        title: sub.is_active ? "Suscripción pausada" : "Suscripción activada" 
      });
      onSubscriptionChange();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteSub = async () => {
    if (!deleteSub) return;

    try {
      const { error } = await supabase
        .from("client_subscriptions")
        .delete()
        .eq("id", deleteSub.id);

      if (error) throw error;

      toast({ title: "Suscripción eliminada" });
      setDeleteSub(null);
      onSubscriptionChange();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEditSub = (sub: ClientSubscription) => {
    setEditingSub(sub);
    setIsSubFormOpen(true);
  };

  const handleSubFormClose = () => {
    setIsSubFormOpen(false);
    setEditingSub(null);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Client info */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <ClientAvatar
                  logoUrl={client.logo_url}
                  companyName={client.company_name}
                  bgColor={client.logo_bg_color}
                  size="lg"
                />
                <div>
                  <CardTitle className="text-lg">{client.company_name}</CardTitle>
                  <Badge className={STATUS_COLORS[client.status]}>
                    {STATUS_LABELS[client.status]}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {client.contact_name && (
              <p><span className="text-muted-foreground">Contacto:</span> {client.contact_name}</p>
            )}
            {client.email && (
              <p><span className="text-muted-foreground">Email:</span> {client.email}</p>
            )}
            {client.phone && (
              <p><span className="text-muted-foreground">Tel:</span> {client.phone}</p>
            )}
            {client.country && (
              <p><span className="text-muted-foreground">País:</span> {client.country}</p>
            )}
            {client.notes && (
              <p className="text-muted-foreground text-xs mt-2">{client.notes}</p>
            )}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Setup Total</p>
                <p className="text-lg font-bold font-mono text-primary">
                  {formatCurrency(totals.setup, displayCurrency)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{displayCurrency}</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Mensual</p>
                <p className="text-lg font-bold font-mono text-green-500">
                  {formatCurrency(totals.mrr, displayCurrency)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{displayCurrency}</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Anual</p>
                <p className="text-lg font-bold font-mono text-emerald-400">
                  {formatCurrency(totals.mrr * 12, displayCurrency)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{displayCurrency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Suscripciones</CardTitle>
              <Button size="sm" onClick={() => setIsSubFormOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                Añadir
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {client.client_subscriptions?.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                Sin suscripciones asignadas
              </div>
            ) : (
              <div className="space-y-3">
                {client.client_subscriptions?.map((sub) => {
                  const pricing = getSubscriptionPricingData(sub);
                  const name = sub.item_type === "product" 
                    ? sub.product?.name 
                    : sub.pack?.name;
                  
                  return (
                    <div
                      key={sub.id}
                      className={`p-3 border rounded-lg ${
                        sub.is_active ? "bg-secondary/30" : "opacity-50 bg-secondary/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {sub.item_type === "product" ? (
                              <Package className="h-4 w-4 text-primary" />
                            ) : (
                              <Layers className="h-4 w-4 text-primary" />
                            )}
                            <span className="font-medium truncate">{name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {sub.pricing_mode === "custom" ? "Personalizado" : "Catálogo"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {pricing.originalCurrency}
                            </Badge>
                            {sub.custom_notes && (
                              <span className="truncate">{sub.custom_notes}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm flex-shrink-0">
                          {pricing.oneTime > 0 && (
                            <p className="font-mono">{formatCurrency(pricing.oneTime, displayCurrency)} setup</p>
                          )}
                          <p className="font-mono text-green-500">
                            {formatCurrency(pricing.monthly, displayCurrency)}/mes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditSub(sub)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleToggleActive(sub)}
                        >
                          <Power className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => setDeleteSub(sub)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription form */}
      <SubscriptionFormDialog
        open={isSubFormOpen}
        onClose={handleSubFormClose}
        subscription={editingSub}
        clientId={client.id}
        products={products}
        packs={packs}
        onSuccess={onSubscriptionChange}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteSub} onOpenChange={() => setDeleteSub(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar suscripción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la suscripción del cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSub} 
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

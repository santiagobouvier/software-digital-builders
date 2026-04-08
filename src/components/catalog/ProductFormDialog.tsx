import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Info } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Product, BillingType, ProductCategory, Client } from "@/types/catalog";

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export const ProductFormDialog = ({ 
  open, 
  onClose, 
  product, 
  onSuccess 
}: ProductFormDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [billingType, setBillingType] = useState<BillingType>("recurring");
  const [category, setCategory] = useState<ProductCategory>("otro");
  const [priceOneTime, setPriceOneTime] = useState("");
  const [priceMonthly, setPriceMonthly] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isActive, setIsActive] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    if (open && !product) {
      loadClients();
    }
  }, [open, product]);

  const loadClients = async () => {
    setLoadingClients(true);
    const { data } = await supabase
      .from("clients")
      .select("*")
      .in("status", ["lead", "active"])
      .order("company_name");
    if (data) setClients(data as Client[]);
    setLoadingClients(false);
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setBillingType(product.billing_type);
      setCategory(product.category || "otro");
      setPriceOneTime(product.price_one_time.toString());
      setPriceMonthly(product.price_monthly.toString());
      setCurrency(product.currency || "USD");
      setIsActive(product.is_active);
    } else {
      resetForm();
    }
  }, [product, open]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setBillingType("recurring");
    setCategory("otro");
    setPriceOneTime("0");
    setPriceMonthly("0");
    setCurrency("USD");
    setIsActive(true);
    setSelectedClientId("");
  };

  // Calculate equivalents
  const oneTimeValue = parseFloat(priceOneTime) || 0;
  const monthlyValue = parseFloat(priceMonthly) || 0;
  const monthlyEquivalent = oneTimeValue / 12; // For one-time payments
  const annualTotal = monthlyValue * 12; // For monthly payments

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" });
      return;
    }

    if (!product && !selectedClientId) {
      toast({ title: "Error", description: "Seleccioná un cliente", variant: "destructive" });
      return;
    }

    const oneTime = parseFloat(priceOneTime) || 0;
    const monthly = parseFloat(priceMonthly) || 0;

    if (oneTime < 0 || monthly < 0) {
      toast({ title: "Error", description: "Los precios no pueden ser negativos", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        name: name.trim(),
        description: description.trim() || null,
        billing_type: billingType,
        category,
        price_one_time: oneTime,
        price_monthly: monthly,
        currency,
        is_active: isActive,
      };

      if (product) {
        const { error } = await supabase
          .from("products")
          .update(data)
          .eq("id", product.id);

        if (error) throw error;
        toast({ title: "Producto actualizado" });
      } else {
        const { data: newProduct, error } = await supabase
          .from("products")
          .insert(data)
          .select("id")
          .single();
        if (error) throw error;

        // Auto-create subscription
        const { error: subError } = await supabase
          .from("client_subscriptions")
          .insert({
            client_id: selectedClientId,
            item_type: "product" as const,
            product_id: newProduct.id,
            pricing_mode: "catalog" as const,
            currency,
          });
        if (subError) throw subError;

        toast({ title: "Producto creado y asignado al cliente" });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const isMobile = useIsMobile();

  const formContent = (
    <div className="space-y-4">
      {/* Client selector - only for new products */}
      {!product && (
        <div className="space-y-2">
          <Label>Cliente *</Label>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder={loadingClients ? "Cargando..." : "Seleccioná un cliente"} />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          placeholder="Ej: Bot de WhatsApp"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Descripción del producto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo de facturación</Label>
        <Select value={billingType} onValueChange={(v) => setBillingType(v as BillingType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">Recurrente (mensual)</SelectItem>
            <SelectItem value="one_time">Pago único</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Categoría</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bot_whatsapp">Bot WhatsApp</SelectItem>
            <SelectItem value="bot_interno">Bot Interno</SelectItem>
            <SelectItem value="web_rapida">Web Rápida</SelectItem>
            <SelectItem value="web_autogestionable">Web Autogestionable</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Currency selector */}
      <div className="space-y-2">
        <Label>Moneda</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD (Dólares)</SelectItem>
            <SelectItem value="UYU">UYU (Pesos)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceOneTime">Setup ({currency})</Label>
          <Input
            id="priceOneTime"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={priceOneTime}
            onChange={(e) => setPriceOneTime(e.target.value)}
          />
          {oneTimeValue > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              ≈ {formatCurrency(monthlyEquivalent, currency)}/mes
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceMonthly">Mensual ({currency})</Label>
          <Input
            id="priceMonthly"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={priceMonthly}
            onChange={(e) => setPriceMonthly(e.target.value)}
          />
          {monthlyValue > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              = {formatCurrency(annualTotal, currency)}/año
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Activo</Label>
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
      </div>
    </div>
  );

  const footerButtons = (
    <>
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button onClick={handleSubmit} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Guardando...
          </>
        ) : product ? (
          "Guardar cambios"
        ) : (
          "Crear producto"
        )}
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{product ? "Editar producto" : "Nuevo producto"}</DrawerTitle>
            <DrawerDescription>
              {product ? "Modifica los datos del producto" : "Crea un nuevo producto para el catálogo"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto flex-1">
            {formContent}
          </div>
          <DrawerFooter className="pt-4">
            {footerButtons}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{product ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifica los datos del producto" : "Crea un nuevo producto para el catálogo"}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          {formContent}
        </div>
        <DialogFooter>
          {footerButtons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

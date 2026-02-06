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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Product, BillingType } from "@/types/catalog";

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
  const [priceOneTime, setPriceOneTime] = useState("");
  const [priceMonthly, setPriceMonthly] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setBillingType(product.billing_type);
      setPriceOneTime(product.price_one_time.toString());
      setPriceMonthly(product.price_monthly.toString());
      setIsActive(product.is_active);
    } else {
      resetForm();
    }
  }, [product, open]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setBillingType("recurring");
    setPriceOneTime("0");
    setPriceMonthly("0");
    setIsActive(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" });
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
        price_one_time: oneTime,
        price_monthly: monthly,
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
        const { error } = await supabase.from("products").insert(data);
        if (error) throw error;
        toast({ title: "Producto creado" });
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
          <DialogTitle>{product ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifica los datos del producto" : "Crea un nuevo producto para el catálogo"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceOneTime">Setup (USD)</Label>
              <Input
                id="priceOneTime"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={priceOneTime}
                onChange={(e) => setPriceOneTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceMonthly">Mensual (USD)</Label>
              <Input
                id="priceMonthly"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={priceMonthly}
                onChange={(e) => setPriceMonthly(e.target.value)}
              />
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
            ) : product ? (
              "Guardar cambios"
            ) : (
              "Crear producto"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

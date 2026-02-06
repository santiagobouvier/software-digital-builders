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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { formatCurrency, calculatePackPricing } from "@/lib/pricing";
import type { Product, PackWithItems, DiscountType } from "@/types/catalog";

interface PackItem {
  product_id: string;
  quantity: number;
}

interface PackFormDialogProps {
  open: boolean;
  onClose: () => void;
  pack: PackWithItems | null;
  products: Product[];
  onSuccess: () => void;
}

export const PackFormDialog = ({ 
  open, 
  onClose, 
  pack, 
  products,
  onSuccess 
}: PackFormDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [items, setItems] = useState<PackItem[]>([]);

  useEffect(() => {
    if (pack) {
      setName(pack.name);
      setDescription(pack.description || "");
      setDiscountType(pack.discount_type);
      setDiscountValue(pack.discount_value.toString());
      setIsActive(pack.is_active);
      setItems(pack.pack_items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })));
    } else {
      resetForm();
    }
  }, [pack, open]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setDiscountType("none");
    setDiscountValue("0");
    setIsActive(true);
    setItems([]);
  };

  const handleAddItem = () => {
    const activeProducts = products.filter((p) => p.is_active);
    const availableProducts = activeProducts.filter(
      (p) => !items.some((item) => item.product_id === p.id)
    );
    
    if (availableProducts.length === 0) {
      toast({ title: "No hay más productos disponibles", variant: "destructive" });
      return;
    }

    setItems([...items, { product_id: availableProducts[0].id, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PackItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const getItemsForPricing = () => {
    return items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        quantity: item.quantity,
        product: {
          price_one_time: product?.price_one_time || 0,
          price_monthly: product?.price_monthly || 0,
        },
      };
    });
  };

  const pricing = calculatePackPricing(
    getItemsForPricing(),
    discountType,
    parseFloat(discountValue) || 0
  );

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Error", description: "El pack debe tener al menos un producto", variant: "destructive" });
      return;
    }

    const discount = parseFloat(discountValue) || 0;
    if (discount < 0) {
      toast({ title: "Error", description: "El descuento no puede ser negativo", variant: "destructive" });
      return;
    }

    if (discountType === "percent" && discount > 100) {
      toast({ title: "Error", description: "El descuento porcentual no puede ser mayor a 100%", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const packData = {
        name: name.trim(),
        description: description.trim() || null,
        discount_type: discountType,
        discount_value: discount,
        is_active: isActive,
      };

      if (pack) {
        // Update pack
        const { error: updateError } = await supabase
          .from("packs")
          .update(packData)
          .eq("id", pack.id);

        if (updateError) throw updateError;

        // Delete old items and insert new
        await supabase.from("pack_items").delete().eq("pack_id", pack.id);
        
        if (items.length > 0) {
          const { error: itemsError } = await supabase.from("pack_items").insert(
            items.map((item) => ({
              pack_id: pack.id,
              product_id: item.product_id,
              quantity: item.quantity,
            }))
          );
          if (itemsError) throw itemsError;
        }

        toast({ title: "Pack actualizado" });
      } else {
        // Create pack
        const { data: newPack, error: insertError } = await supabase
          .from("packs")
          .insert(packData)
          .select("id")
          .single();

        if (insertError) throw insertError;

        // Insert items
        if (items.length > 0) {
          const { error: itemsError } = await supabase.from("pack_items").insert(
            items.map((item) => ({
              pack_id: newPack.id,
              product_id: item.product_id,
              quantity: item.quantity,
            }))
          );
          if (itemsError) throw itemsError;
        }

        toast({ title: "Pack creado" });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const activeProducts = products.filter((p) => p.is_active);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pack ? "Editar pack" : "Nuevo pack"}</DialogTitle>
          <DialogDescription>
            {pack ? "Modifica los datos del pack" : "Crea un nuevo pack de productos"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                placeholder="Ej: Pack Starter"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-6">
              <Label htmlFor="isActive">Activo</Label>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del pack..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de descuento</Label>
              <Select value={discountType} onValueChange={(v) => setDiscountType(v as DiscountType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin descuento</SelectItem>
                  <SelectItem value="percent">Porcentaje (%)</SelectItem>
                  <SelectItem value="fixed">Monto fijo (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {discountType !== "none" && (
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Valor del descuento {discountType === "percent" ? "(%)" : "(USD)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step={discountType === "percent" ? "1" : "0.01"}
                  max={discountType === "percent" ? "100" : undefined}
                  placeholder="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Products in pack */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Productos del pack</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Añadir
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                No hay productos en el pack
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-secondary/30"
                    >
                      <Select
                        value={item.product_id}
                        onValueChange={(v) => handleItemChange(index, "product_id", v)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activeProducts.map((p) => (
                            <SelectItem 
                              key={p.id} 
                              value={p.id}
                              disabled={items.some((i, idx) => idx !== index && i.product_id === p.id)}
                            >
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">
                          Cant:
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          className="w-20"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="text-sm text-muted-foreground min-w-[100px] text-right">
                        {product && (
                          <span className="font-mono">
                            {formatCurrency(product.price_monthly * item.quantity)}/mes
                          </span>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pricing summary */}
          {items.length > 0 && (
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal Setup:</span>
                <span className="font-mono">{formatCurrency(pricing.subtotalOneTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal Mensual:</span>
                <span className="font-mono">{formatCurrency(pricing.subtotalMonthly)}</span>
              </div>
              {discountType !== "none" && (
                <>
                  <div className="flex justify-between text-sm text-yellow-500">
                    <span>Descuento:</span>
                    <span className="font-mono">
                      -{formatCurrency(pricing.discountOneTime + pricing.discountMonthly)}
                    </span>
                  </div>
                  <hr className="border-border" />
                </>
              )}
              <div className="flex justify-between font-medium">
                <span>Total Setup:</span>
                <span className="font-mono text-primary">{formatCurrency(pricing.totalOneTime)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Mensual:</span>
                <span className="font-mono text-primary">{formatCurrency(pricing.totalMonthly)}</span>
              </div>
            </div>
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
            ) : pack ? (
              "Guardar cambios"
            ) : (
              "Crear pack"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

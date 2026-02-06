import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveTable,
  ResponsiveTableBody,
  ResponsiveTableCell,
  ResponsiveTableHead,
  ResponsiveTableHeader,
  ResponsiveTableRow,
  MobileCardHeader,
  MobileCardRow,
} from "@/components/ui/responsive-table";
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
import { Loader2, Plus, Pencil, Copy, Trash2, Power } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";
import type { Product } from "@/types/catalog";
import { ProductFormDialog } from "./ProductFormDialog";

interface ProductsTabProps {
  products: Product[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ProductsTab = ({ products, isLoading, onRefresh }: ProductsTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDuplicate = async (product: Product) => {
    try {
      const { error } = await supabase.from("products").insert({
        name: `${product.name} (copia)`,
        description: product.description,
        billing_type: product.billing_type,
        price_one_time: product.price_one_time,
        price_monthly: product.price_monthly,
        currency: product.currency,
        is_active: false,
        sort_order: product.sort_order + 1,
      });

      if (error) throw error;

      toast({ title: "Producto duplicado" });
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id);

      if (error) throw error;

      toast({ 
        title: product.is_active ? "Producto desactivado" : "Producto activado" 
      });
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProduct.id);

      if (error) throw error;

      toast({ title: "Producto eliminado" });
      setDeleteProduct(null);
      onRefresh();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "No se puede eliminar el producto. Puede estar siendo usado en packs o suscripciones.", 
        variant: "destructive" 
      });
      setDeleteProduct(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <Card variant="elevated">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay productos registrados
            </div>
          ) : (
            <ResponsiveTable>
              <ResponsiveTableHeader>
                <ResponsiveTableRow>
                  <ResponsiveTableHead>Nombre</ResponsiveTableHead>
                  <ResponsiveTableHead>Tipo</ResponsiveTableHead>
                  <ResponsiveTableHead>Moneda</ResponsiveTableHead>
                  <ResponsiveTableHead className="text-right">Setup</ResponsiveTableHead>
                  <ResponsiveTableHead className="text-right">Mensual</ResponsiveTableHead>
                  <ResponsiveTableHead className="text-right">Anual</ResponsiveTableHead>
                  <ResponsiveTableHead>Estado</ResponsiveTableHead>
                  <ResponsiveTableHead className="w-[140px]"></ResponsiveTableHead>
                </ResponsiveTableRow>
              </ResponsiveTableHeader>
              <ResponsiveTableBody>
                {products.map((product) => {
                  const monthlyEquivalent = product.price_one_time / 12;
                  const annualTotal = product.price_monthly * 12;
                  
                  return (
                    <ResponsiveTableRow 
                      key={product.id} 
                      className={!product.is_active ? "opacity-50" : ""}
                      mobileCard={
                        <>
                          <MobileCardHeader
                            title={product.name}
                            badge={
                              <div className="flex items-center gap-1.5">
                                <Badge 
                                  variant="secondary"
                                  className={product.currency === 'USD' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0' 
                                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5 py-0'
                                  }
                                >
                                  {product.currency}
                                </Badge>
                                <Badge 
                                  variant={product.is_active ? "default" : "secondary"}
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {product.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                              </div>
                            }
                            actions={
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(product)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleActive(product)}
                                  className="h-8 w-8"
                                >
                                  <Power className="h-4 w-4" />
                                </Button>
                              </div>
                            }
                          />
                          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                            <div className="p-2 rounded bg-secondary/50">
                              <p className="text-[10px] text-muted-foreground mb-0.5">Setup</p>
                              <p className="text-sm font-mono font-medium">{formatCurrency(product.price_one_time, product.currency)}</p>
                            </div>
                            <div className="p-2 rounded bg-secondary/50">
                              <p className="text-[10px] text-muted-foreground mb-0.5">Mensual</p>
                              <p className="text-sm font-mono font-medium">{formatCurrency(product.price_monthly, product.currency)}</p>
                            </div>
                            <div className="p-2 rounded bg-secondary/50">
                              <p className="text-[10px] text-muted-foreground mb-0.5">Anual</p>
                              <p className="text-sm font-mono font-medium">{formatCurrency(annualTotal, product.currency)}</p>
                            </div>
                          </div>
                        </>
                      }
                    >
                      <ResponsiveTableCell className="font-medium">{product.name}</ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <Badge variant="outline">
                          {product.billing_type === "recurring" ? "Recurrente" : "Único"}
                        </Badge>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <Badge 
                          variant="secondary"
                          className={product.currency === 'USD' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }
                        >
                          {product.currency}
                        </Badge>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-right font-mono">
                        <div>{formatCurrency(product.price_one_time, product.currency)}</div>
                        {product.price_one_time > 0 && (
                          <div className="text-xs text-muted-foreground">
                            ≈ {formatCurrency(monthlyEquivalent, product.currency)}/mes
                          </div>
                        )}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-right font-mono">
                        {formatCurrency(product.price_monthly, product.currency)}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-right font-mono">
                        {product.price_monthly > 0 && (
                          <span>{formatCurrency(annualTotal, product.currency)}</span>
                        )}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicate(product)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(product)}
                            className="h-8 w-8"
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteProduct(product)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  );
                })}
              </ResponsiveTableBody>
            </ResponsiveTable>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        product={editingProduct}
        onSuccess={onRefresh}
      />

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente "{deleteProduct?.name}". 
              No se puede eliminar si está siendo usado en packs o suscripciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

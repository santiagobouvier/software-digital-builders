import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Loader2, Plus, Pencil, Trash2, Power } from "lucide-react";
import { formatCurrency, calculatePackPricing } from "@/lib/pricing";
import type { Product, PackWithItems } from "@/types/catalog";
import { PackFormDialog } from "./PackFormDialog";

interface PacksTabProps {
  packs: PackWithItems[];
  products: Product[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const PacksTab = ({ packs, products, isLoading, onRefresh }: PacksTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<PackWithItems | null>(null);
  const [deletePack, setDeletePack] = useState<PackWithItems | null>(null);

  const handleEdit = (pack: PackWithItems) => {
    setEditingPack(pack);
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (pack: PackWithItems) => {
    try {
      const { error } = await supabase
        .from("packs")
        .update({ is_active: !pack.is_active })
        .eq("id", pack.id);

      if (error) throw error;

      toast({ 
        title: pack.is_active ? "Pack desactivado" : "Pack activado" 
      });
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deletePack) return;

    try {
      const { error } = await supabase
        .from("packs")
        .delete()
        .eq("id", deletePack.id);

      if (error) throw error;

      toast({ title: "Pack eliminado" });
      setDeletePack(null);
      onRefresh();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "No se puede eliminar el pack. Puede estar siendo usado en suscripciones.", 
        variant: "destructive" 
      });
      setDeletePack(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPack(null);
  };

  const getPackPricing = (pack: PackWithItems) => {
    const items = pack.pack_items.map((item) => ({
      quantity: item.quantity,
      product: {
        price_one_time: item.product?.price_one_time || 0,
        price_monthly: item.product?.price_monthly || 0,
      },
    }));

    return calculatePackPricing(items, pack.discount_type, pack.discount_value);
  };

  const getDiscountLabel = (pack: PackWithItems) => {
    if (pack.discount_type === "none") return "-";
    if (pack.discount_type === "percent") return `${pack.discount_value}%`;
    return formatCurrency(pack.discount_value, pack.currency);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo pack
        </Button>
      </div>

      <Card variant="elevated">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : packs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay packs registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead className="text-right">Setup</TableHead>
                  <TableHead className="text-right">Mensual</TableHead>
                  <TableHead className="text-right">Anual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packs.map((pack) => {
                  const pricing = getPackPricing(pack);
                  const annualTotal = pricing.totalMonthly * 12;
                  const monthlyEquivalent = pricing.totalOneTime / 12;
                  
                  return (
                    <TableRow key={pack.id} className={!pack.is_active ? "opacity-50" : ""}>
                      <TableCell className="font-medium">{pack.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {pack.pack_items.length} producto{pack.pack_items.length !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pack.currency}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={pack.discount_type !== "none" ? "default" : "secondary"}>
                          {getDiscountLabel(pack)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <div>{formatCurrency(pricing.totalOneTime, pack.currency)}</div>
                        {pricing.totalOneTime > 0 && (
                          <div className="text-xs text-muted-foreground">
                            ≈ {formatCurrency(monthlyEquivalent, pack.currency)}/mes
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(pricing.totalMonthly, pack.currency)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pricing.totalMonthly > 0 && (
                          <span>{formatCurrency(annualTotal, pack.currency)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pack.is_active ? "default" : "secondary"}>
                          {pack.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(pack)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(pack)}
                            className="h-8 w-8"
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletePack(pack)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PackFormDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        pack={editingPack}
        products={products}
        onSuccess={onRefresh}
      />

      <AlertDialog open={!!deletePack} onOpenChange={() => setDeletePack(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar pack?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente "{deletePack?.name}" y todos sus items. 
              No se puede eliminar si está siendo usado en suscripciones.
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

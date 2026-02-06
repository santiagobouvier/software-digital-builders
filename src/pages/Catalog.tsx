import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Package, Layers } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { ProductsTab } from "@/components/catalog/ProductsTab";
import { PacksTab } from "@/components/catalog/PacksTab";
import type { Product, Pack, PackWithItems } from "@/types/catalog";

const Catalog = () => {
  const { isProfessional, isLoading: roleLoading } = useUserRole();
  const [products, setProducts] = useState<Product[]>([]);
  const [packs, setPacks] = useState<PackWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isProfessional) {
      loadData();
    }
  }, [isProfessional]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadProducts(), loadPacks()]);
    setIsLoading(false);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (data) {
      setProducts(data as Product[]);
    }
  };

  const loadPacks = async () => {
    const { data, error } = await supabase
      .from("packs")
      .select(`
        *,
        pack_items (
          *,
          product:products (*)
        )
      `)
      .order("sort_order", { ascending: true });

    if (data) {
      setPacks(data as PackWithItems[]);
    }
  };

  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isProfessional) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Catálogo</h1>
          <p className="text-muted-foreground">Gestiona productos y packs de servicios</p>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="packs" className="gap-2">
              <Layers className="h-4 w-4" />
              Packs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab 
              products={products} 
              isLoading={isLoading} 
              onRefresh={loadProducts} 
            />
          </TabsContent>

          <TabsContent value="packs">
            <PacksTab 
              packs={packs} 
              products={products}
              isLoading={isLoading} 
              onRefresh={loadPacks} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Catalog;

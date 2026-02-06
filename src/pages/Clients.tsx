import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Search, Users, TrendingUp } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { Navigate } from "react-router-dom";
import { formatCurrency } from "@/lib/pricing";
import { ClientList } from "@/components/clients/ClientList";
import { ClientDetail } from "@/components/clients/ClientDetail";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import { ExchangeRateEditor } from "@/components/ExchangeRateEditor";
import type { 
  Client, 
  ClientWithSubscriptions, 
  Product, 
  PackWithItems,
  ClientStatus,
} from "@/types/catalog";

type DisplayCurrency = "USD" | "UYU";

const Clients = () => {
  const { isProfessional, isLoading: roleLoading } = useUserRole();
  const { rate, updateExchangeRate, isLoading: rateLoading } = useExchangeRate();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packs, setPacks] = useState<PackWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientWithSubscriptions | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("USD");
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");

  useEffect(() => {
    if (isProfessional) {
      loadData();
    }
  }, [isProfessional]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadClients(), loadProducts(), loadPacks()]);
    setIsLoading(false);
  };

  const loadClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("company_name", { ascending: true });

    if (data) {
      setClients(data as Client[]);
    }
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (data) {
      setProducts(data as Product[]);
    }
  };

  const loadPacks = async () => {
    const { data } = await supabase
      .from("packs")
      .select(`
        *,
        pack_items (
          *,
          product:products (*)
        )
      `)
      .order("name");

    if (data) {
      setPacks(data as PackWithItems[]);
    }
  };

  const loadClientDetail = async (clientId: string) => {
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        client_subscriptions (
          *,
          product:products (*),
          pack:packs (
            *,
            pack_items (
              *,
              product:products (*)
            )
          )
        )
      `)
      .eq("id", clientId)
      .single();

    if (data) {
      setSelectedClient(data as ClientWithSubscriptions);
    }
  };

  const handleSelectClient = (client: Client) => {
    loadClientDetail(client.id);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleFormSuccess = () => {
    loadClients();
    if (selectedClient && editingClient?.id === selectedClient.id) {
      loadClientDetail(selectedClient.id);
    }
  };

  const handleSubscriptionChange = () => {
    if (selectedClient) {
      loadClientDetail(selectedClient.id);
    }
  };

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchQuery === "" ||
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "active").length;

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Gestiona clientes y sus suscripciones
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExchangeRateEditor rate={rate} onUpdate={updateExchangeRate} />
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo cliente
            </Button>
          </div>
        </div>

        {/* Stats + Currency toggle */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2">
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalClients}</p>
                    <p className="text-xs text-muted-foreground">Total clientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeClients}</p>
                    <p className="text-xs text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Display currency toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Mostrar en:</span>
            <Select value={displayCurrency} onValueChange={(v) => setDisplayCurrency(v as DisplayCurrency)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="UYU">UYU</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ClientStatus | "all")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
          {/* Client list */}
          <div className="order-2 lg:order-1">
            <ClientList
              clients={filteredClients}
              isLoading={isLoading}
              selectedId={selectedClient?.id}
              onSelect={handleSelectClient}
              onEdit={handleEditClient}
            />
          </div>

          {/* Client detail */}
          <div className="order-1 lg:order-2">
            <ClientDetail
              client={selectedClient}
              products={products}
              packs={packs}
              onSubscriptionChange={handleSubscriptionChange}
              onEdit={() => selectedClient && handleEditClient(selectedClient)}
              exchangeRate={rate}
              displayCurrency={displayCurrency}
            />
          </div>
        </div>

        {/* Client form dialog */}
        <ClientFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          client={editingClient}
          onSuccess={handleFormSuccess}
        />
      </div>
    </DashboardLayout>
  );
};

export default Clients;

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Search, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigate } from "react-router-dom";
import { ClientList } from "@/components/clients/ClientList";
import { ClientDetail } from "@/components/clients/ClientDetail";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import type { Client, ClientStatus } from "@/types/client";

type DisplayCurrency = "USD" | "UYU";

const Clients = () => {
  const { isProfessional, isLoading: roleLoading } = useUserRole();
  const { convert } = useExchangeRate();
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("USD");

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");

  const loadClients = useCallback(async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("company_name", { ascending: true });

    if (data) {
      setClients(data as Client[]);
      // Refrescar el cliente seleccionado con datos nuevos
      setSelectedClient((prev) =>
        prev ? (data as Client[]).find((c) => c.id === prev.id) || null : null
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isProfessional) {
      loadClients();
    }
  }, [isProfessional, loadClients]);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingClient(null);
  };

  // Filtrado
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchQuery === "" ||
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Fichas de empresas: contacto, finanzas y eventos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={displayCurrency}
              onValueChange={(v) => setDisplayCurrency(v as DisplayCurrency)}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="UYU">UYU</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo cliente
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 max-w-md">
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

        {/* Filtros */}
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
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ClientStatus | "all")}
          >
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

        {/* Contenido principal: en móvil, lista → ficha con "volver"; en desktop, dos columnas */}
        {isMobile ? (
          selectedClient ? (
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 -ml-2"
                onClick={() => setSelectedClient(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la lista
              </Button>
              <ClientDetail
                client={selectedClient}
                onEdit={() => handleEditClient(selectedClient)}
                convert={convert}
                displayCurrency={displayCurrency}
              />
            </div>
          ) : (
            <ClientList
              clients={filteredClients}
              isLoading={isLoading}
              selectedId={undefined}
              onSelect={(client) => setSelectedClient(client)}
              onEdit={handleEditClient}
            />
          )
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr,420px]">
            <ClientList
              clients={filteredClients}
              isLoading={isLoading}
              selectedId={selectedClient?.id}
              onSelect={(client) => setSelectedClient(client)}
              onEdit={handleEditClient}
            />
            <ClientDetail
              client={selectedClient}
              onEdit={() => selectedClient && handleEditClient(selectedClient)}
              convert={convert}
              displayCurrency={displayCurrency}
            />
          </div>
        )}

        <ClientFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          client={editingClient}
          onSuccess={loadClients}
        />
      </div>
    </DashboardLayout>
  );
};

export default Clients;

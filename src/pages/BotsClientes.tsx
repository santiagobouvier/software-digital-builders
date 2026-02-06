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
import { Loader2, Bot, Search, ExternalLink, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BotInstanceDialog } from "@/components/bots-clientes/BotInstanceDialog";

interface Client {
  id: string;
  company_name: string;
  status: string;
}

interface BotInstance {
  id: string;
  client_id: string;
  subscription_id: string;
  product_id: string;
  bot_type: string;
  status: string;
  notes: string | null;
  product: {
    name: string;
  };
  client: {
    company_name: string;
  };
}

const BotsClientes = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [botInstances, setBotInstances] = useState<BotInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInstance, setEditingInstance] = useState<BotInstance | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadBotInstances();
  }, [selectedClientId]);

  const loadClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("id, company_name, status")
      .order("company_name");
    
    if (data) setClients(data);
  };

  const loadBotInstances = async () => {
    setIsLoading(true);
    
    let query = supabase
      .from("bot_instances")
      .select(`
        *,
        product:products(name),
        client:clients(company_name)
      `)
      .order("created_at", { ascending: false });
    
    if (selectedClientId !== "all") {
      query = query.eq("client_id", selectedClientId);
    }
    
    const { data, error } = await query;
    
    if (data) {
      setBotInstances(data as unknown as BotInstance[]);
    }
    setIsLoading(false);
  };

  const filteredInstances = botInstances.filter(instance => 
    instance.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instance.client.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Activo</Badge>;
      case "setup":
        return <Badge className="bg-warning/20 text-warning border-warning/30">En setup</Badge>;
      case "paused":
        return <Badge className="bg-muted text-muted-foreground">Pausado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBotTypeLabel = (type: string) => {
    switch (type) {
      case "bot_whatsapp":
        return "WhatsApp";
      case "bot_interno":
        return "Interno";
      default:
        return type;
    }
  };

  const handleEditInstance = (instance: BotInstance) => {
    setEditingInstance(instance);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingInstance(null);
  };

  const hasNoInstances = !isLoading && botInstances.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              Bots de clientes
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestión operativa de instancias de bots asignados
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por producto o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Filtrar por cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <Card variant="elevated">
            <CardContent className="py-12 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : hasNoInstances ? (
          <Card variant="elevated">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedClientId !== "all" 
                      ? "Este cliente no tiene bots asignados" 
                      : "No hay bots asignados"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Los bots se asignan desde el módulo de Finanzas
                  </p>
                </div>
                <Button onClick={() => navigate("/catalogo")} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Ir a Finanzas
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">
                {filteredInstances.length} {filteredInstances.length === 1 ? "instancia" : "instancias"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveTable>
                <ResponsiveTableHeader>
                  <ResponsiveTableRow>
                    <ResponsiveTableHead>Producto</ResponsiveTableHead>
                    <ResponsiveTableHead>Cliente</ResponsiveTableHead>
                    <ResponsiveTableHead>Tipo</ResponsiveTableHead>
                    <ResponsiveTableHead>Estado</ResponsiveTableHead>
                    <ResponsiveTableHead className="text-right">Acciones</ResponsiveTableHead>
                  </ResponsiveTableRow>
                </ResponsiveTableHeader>
                <ResponsiveTableBody>
                  {filteredInstances.map((instance) => (
                    <ResponsiveTableRow 
                      key={instance.id}
                      mobileCard={
                        <>
                          <MobileCardHeader
                            title={instance.product.name}
                            subtitle={instance.client.company_name}
                            badge={getStatusBadge(instance.status)}
                            actions={
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditInstance(instance)}
                              >
                                Gestionar
                              </Button>
                            }
                          />
                          <MobileCardRow label="Tipo">
                            <span className="font-medium">{getBotTypeLabel(instance.bot_type)}</span>
                          </MobileCardRow>
                        </>
                      }
                    >
                      <ResponsiveTableCell className="font-medium">
                        {instance.product.name}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>{instance.client.company_name}</ResponsiveTableCell>
                      <ResponsiveTableCell>{getBotTypeLabel(instance.bot_type)}</ResponsiveTableCell>
                      <ResponsiveTableCell>{getStatusBadge(instance.status)}</ResponsiveTableCell>
                      <ResponsiveTableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditInstance(instance)}
                        >
                          Gestionar
                        </Button>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ))}
                </ResponsiveTableBody>
              </ResponsiveTable>
            </CardContent>
          </Card>
        )}
      </div>

      <BotInstanceDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        instance={editingInstance}
        onSuccess={loadBotInstances}
      />
    </DashboardLayout>
  );
};

export default BotsClientes;

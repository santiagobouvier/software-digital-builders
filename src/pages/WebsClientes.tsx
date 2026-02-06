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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Globe, Search, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WebInstanceDialog } from "@/components/webs-clientes/WebInstanceDialog";

interface Client {
  id: string;
  company_name: string;
  status: string;
}

interface WebInstance {
  id: string;
  client_id: string;
  subscription_id: string;
  product_id: string;
  web_type: string;
  domain: string | null;
  status: string;
  notes: string | null;
  product: {
    name: string;
  };
  client: {
    company_name: string;
  };
}

const WebsClientes = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [webInstances, setWebInstances] = useState<WebInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInstance, setEditingInstance] = useState<WebInstance | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadWebInstances();
  }, [selectedClientId]);

  const loadClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("id, company_name, status")
      .order("company_name");
    
    if (data) setClients(data);
  };

  const loadWebInstances = async () => {
    setIsLoading(true);
    
    let query = supabase
      .from("web_instances")
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
      setWebInstances(data as unknown as WebInstance[]);
    }
    setIsLoading(false);
  };

  const filteredInstances = webInstances.filter(instance => 
    instance.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instance.client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (instance.domain && instance.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Activa</Badge>;
      case "development":
        return <Badge className="bg-warning/20 text-warning border-warning/30">En desarrollo</Badge>;
      case "paused":
        return <Badge className="bg-muted text-muted-foreground">Pausada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getWebTypeLabel = (type: string) => {
    switch (type) {
      case "web_rapida":
        return "Web rápida";
      case "web_autogestionable":
        return "Autogestionable";
      default:
        return type;
    }
  };

  const handleEditInstance = (instance: WebInstance) => {
    setEditingInstance(instance);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingInstance(null);
  };

  const hasNoInstances = !isLoading && webInstances.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Webs de clientes
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestión operativa de instancias web asignadas
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
                  placeholder="Buscar por producto, cliente o dominio..."
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
                  <Globe className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedClientId !== "all" 
                      ? "Este cliente no tiene webs asignadas" 
                      : "No hay webs asignadas"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Las webs se asignan desde el módulo de Finanzas
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Dominio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstances.map((instance) => (
                    <TableRow key={instance.id}>
                      <TableCell className="font-medium">
                        {instance.product.name}
                      </TableCell>
                      <TableCell>{instance.client.company_name}</TableCell>
                      <TableCell>{getWebTypeLabel(instance.web_type)}</TableCell>
                      <TableCell>
                        {instance.domain ? (
                          <a 
                            href={`https://${instance.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {instance.domain}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Sin dominio</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(instance.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditInstance(instance)}
                        >
                          Gestionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <WebInstanceDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        instance={editingInstance}
        onSuccess={loadWebInstances}
      />
    </DashboardLayout>
  );
};

export default WebsClientes;

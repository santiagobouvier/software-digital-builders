import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  MoreHorizontal,
  Bot as BotIcon,
  Loader2,
  Play,
  Pause,
  Eye,
  EyeOff,
  Code,
  BarChart3,
  Wifi,
  WifiOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Bot {
  id: string;
  name: string;
  token: string;
  status: "active" | "paused";
  last_event_at: string | null;
  created_at: string;
}

const Bots = () => {
  const navigate = useNavigate();
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string>("");
  const [deletingBot, setDeletingBot] = useState<Bot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const [showPayloadModal, setShowPayloadModal] = useState<string | null>(null);

  const projectUrl = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    loadCompanyAndBots();
  }, []);

  const loadCompanyAndBots = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const savedCompanyId = localStorage.getItem("selectedCompanyId");

    const { data: companyData } = await supabase
      .from("company_users")
      .select("company_id, role, companies(id)")
      .eq("user_id", user.id);

    if (companyData && companyData.length > 0) {
      const company = savedCompanyId
        ? companyData.find((c: any) => c.company_id === savedCompanyId) || companyData[0]
        : companyData[0];

      setCompanyId(company.company_id);
      setIsOwner(company.role === "owner");
      fetchBots(company.company_id);
    } else {
      setIsLoading(false);
    }
  };

  const fetchBots = async (cId: string) => {
    const { data, error } = await supabase
      .from("bots")
      .select("*")
      .eq("company_id", cId)
      .order("created_at", { ascending: false });

    if (data) {
      setBots(data as Bot[]);
    }
    setIsLoading(false);
  };

  const toggleBotStatus = async (bot: Bot) => {
    const newStatus = bot.status === "active" ? "paused" : "active";
    const { error } = await supabase
      .from("bots")
      .update({ status: newStatus })
      .eq("id", bot.id);

    if (!error) {
      setBots(bots.map(b => b.id === bot.id ? { ...b, status: newStatus } : b));
      toast({
        title: `Bot ${newStatus === "active" ? "activado" : "pausado"}`,
        description: `El bot "${bot.name}" ahora está ${newStatus === "active" ? "activo" : "pausado"}.`,
      });
    }
  };

  const handleDeleteBot = async () => {
    if (!deletingBot) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("bots")
        .delete()
        .eq("id", deletingBot.id);

      if (error) throw error;

      setBots(bots.filter(b => b.id !== deletingBot.id));
      toast({
        title: "Bot eliminado",
        description: `El bot "${deletingBot.name}" ha sido eliminado permanentemente.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingBot(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles.`,
    });
  };

  const toggleTokenVisibility = (botId: string) => {
    const newVisible = new Set(visibleTokens);
    if (newVisible.has(botId)) {
      newVisible.delete(botId);
    } else {
      newVisible.add(botId);
    }
    setVisibleTokens(newVisible);
  };

  const getPayloadExample = (bot: Bot) => {
    return `curl -X POST ${projectUrl}/functions/v1/track \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_id": "${bot.id}",
    "token": "${bot.token}",
    "type": "msg_in"
  }'`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Bots</h1>
            <p className="text-sm text-muted-foreground">
              Los bots se crean automáticamente al asignar un producto de tipo bot a un cliente.
            </p>
          </div>
        </div>

        {/* Bots Table */}
        <Card variant="elevated">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : bots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <BotIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hay bots</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Los bots se crean automáticamente cuando asignas un producto de tipo bot a un cliente desde su ficha.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/clientes")}
                >
                  Ir a Clientes
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Conexión</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última actividad</TableHead>
                    <TableHead>Métricas</TableHead>
                    {isOwner && <TableHead>Acciones</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bots.map((bot) => {
                    const isConnected = bot.last_event_at !== null;
                    return (
                      <TableRow key={bot.id}>
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={isConnected ? "default" : "secondary"}
                            className={
                              isConnected
                                ? "bg-success/20 text-success border-success/30"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {isConnected ? (
                              <>
                                <Wifi className="h-3 w-3 mr-1" />
                                Conectado
                              </>
                            ) : (
                              <>
                                <WifiOff className="h-3 w-3 mr-1" />
                                No conectado
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={bot.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {bot.last_event_at
                            ? format(new Date(bot.last_event_at), "dd MMM yyyy, HH:mm", { locale: es })
                            : "Sin actividad"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/bots/${bot.id}`)}
                            className="gap-2"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Ver métricas
                          </Button>
                        </TableCell>
                        {isOwner && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => copyToClipboard(bot.id, "BOT_ID")}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar BOT_ID
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => copyToClipboard(bot.token, "TOKEN")}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar TOKEN
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setShowPayloadModal(bot.id)}
                                >
                                  <Code className="h-4 w-4 mr-2" />
                                  Ver ejemplo de payload
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleBotStatus(bot)}
                                >
                                  {bot.status === "active" ? (
                                    <>
                                      <Pause className="h-4 w-4 mr-2" />
                                      Pausar bot
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-4 w-4 mr-2" />
                                      Activar bot
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeletingBot(bot)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar bot
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Token visibility for owners */}
        {isOwner && bots.length > 0 && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Credenciales de bots</CardTitle>
              <CardDescription>
                Usa estas credenciales para enviar eventos desde BuilderBot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bots.map((bot) => (
                <div key={bot.id} className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{bot.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTokenVisibility(bot.id)}
                    >
                      {visibleTokens.has(bot.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-16">BOT_ID:</span>
                      <code className="flex-1 px-2 py-1 rounded bg-background font-mono text-xs">
                        {bot.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(bot.id, "BOT_ID")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-16">TOKEN:</span>
                      <code className="flex-1 px-2 py-1 rounded bg-background font-mono text-xs">
                        {visibleTokens.has(bot.id) ? bot.token : "••••••••••••••••"}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(bot.token, "TOKEN")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingBot} onOpenChange={() => setDeletingBot(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <AlertDialogTitle>¿Eliminar bot permanentemente?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="pt-2">
                Esta acción <strong>no se puede deshacer</strong>. Se eliminarán permanentemente:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>El bot <strong>"{deletingBot?.name}"</strong></li>
                  <li>Todas las métricas e historial de eventos</li>
                  <li>Las credenciales (BOT_ID y TOKEN)</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBot}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sí, eliminar bot
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Payload Modal */}
        <Dialog open={!!showPayloadModal} onOpenChange={() => setShowPayloadModal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ejemplo de payload</DialogTitle>
              <DialogDescription>
                Usa este ejemplo para enviar eventos desde tu bot.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto text-sm font-mono">
                {showPayloadModal && getPayloadExample(bots.find(b => b.id === showPayloadModal)!)}
              </pre>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  const bot = bots.find(b => b.id === showPayloadModal);
                  if (bot) copyToClipboard(getPayloadExample(bot), "Ejemplo");
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Bots;

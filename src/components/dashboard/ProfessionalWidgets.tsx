import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Bot, 
  Users, 
  ArrowRight,
  Loader2,
  UserPlus,
  DollarSign,
  MessageCircle,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfessionalWidgetsProps {
  userId: string;
}

export const ProfessionalWidgets = ({ userId }: ProfessionalWidgetsProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [clientCount, setClientCount] = useState(0);
  const [botInstanceCount, setBotInstanceCount] = useState(0);
  const [webInstanceCount, setWebInstanceCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);

    const [clientsRes, botInstancesRes, webInstancesRes] = await Promise.all([
      supabase.from("clients").select("id"),
      supabase.from("bot_instances").select("id"),
      supabase.from("web_instances").select("id"),
    ]);

    setClientCount(clientsRes.data?.length || 0);
    setBotInstanceCount(botInstancesRes.data?.length || 0);
    setWebInstanceCount(webInstancesRes.data?.length || 0);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Module Shortcuts */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card 
          variant="elevated" 
          className="cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => navigate("/clientes")}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col gap-3">
              <div className="p-2 rounded-lg bg-primary/10 w-fit">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Clientes</p>
                <p className="text-xs text-muted-foreground">Alta y gestión</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{clientCount} registrados</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          variant="elevated" 
          className="cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => navigate("/catalogo")}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col gap-3">
              <div className="p-2 rounded-lg bg-success/10 w-fit">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-semibold">Catálogo</p>
                <p className="text-xs text-muted-foreground">Productos y packs</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Gestionar</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          variant="elevated" 
          className="cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => navigate("/bots-clientes")}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col gap-3">
              <div className="p-2 rounded-lg bg-warning/10 w-fit">
                <MessageCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold">Bots</p>
                <p className="text-xs text-muted-foreground">Instancias operativas</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{botInstanceCount} instancias</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          variant="elevated" 
          className="cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => navigate("/webs-clientes")}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 w-fit">
                <Globe className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="font-semibold">Webs</p>
                <p className="text-xs text-muted-foreground">Instancias operativas</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{webInstanceCount} instancias</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Acciones rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/clientes")} size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Nuevo cliente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/bots")}
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              Bots técnicos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/users")}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Gestionar usuarios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

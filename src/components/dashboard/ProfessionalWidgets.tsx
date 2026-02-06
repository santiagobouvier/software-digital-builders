import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Bot, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Loader2,
  Package,
  UserPlus,
  DollarSign,
  MessageCircle,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompanySummary {
  id: string;
  name: string;
  botCount: number;
  activeSubscriptions: number;
}

interface ProfessionalWidgetsProps {
  userId: string;
}

export const ProfessionalWidgets = ({ userId }: ProfessionalWidgetsProps) => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [totalBots, setTotalBots] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [clientCount, setClientCount] = useState(0);
  const [botInstanceCount, setBotInstanceCount] = useState(0);
  const [webInstanceCount, setWebInstanceCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);

    // Get companies the user belongs to
    const { data: companyData } = await supabase
      .from("company_users")
      .select("company_id, companies(id, name)")
      .eq("user_id", userId);

    if (companyData) {
      const companyIds = companyData.map((cu: any) => cu.companies.id);
      
      // Get bots per company
      const { data: botsData } = await supabase
        .from("bots")
        .select("id, company_id")
        .in("company_id", companyIds);

      // Get active subscriptions
      const { data: subsData } = await supabase
        .from("bot_subscriptions")
        .select("company_id")
        .in("company_id", companyIds)
        .eq("is_active", true);

      const companySummaries: CompanySummary[] = companyData.map((cu: any) => ({
        id: cu.companies.id,
        name: cu.companies.name,
        botCount: botsData?.filter((b) => b.company_id === cu.companies.id).length || 0,
        activeSubscriptions: subsData?.filter((s) => s.company_id === cu.companies.id).length || 0,
      }));

      setCompanies(companySummaries);
      setTotalBots(botsData?.length || 0);
    }

    // Get total users (clients)
    const { data: usersData } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "client");
    
    setUserCount(usersData?.length || 0);

    // Get clients count
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id");
    setClientCount(clientsData?.length || 0);

    // Get bot instances count
    const { data: botInstancesData } = await supabase
      .from("bot_instances")
      .select("id");
    setBotInstanceCount(botInstancesData?.length || 0);

    // Get web instances count
    const { data: webInstancesData } = await supabase
      .from("web_instances")
      .select("id");
    setWebInstanceCount(webInstancesData?.length || 0);

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
      {/* Module Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Clientes */}
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
                <Badge variant="secondary">{clientCount} activos</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finanzas */}
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
                <p className="font-semibold">Finanzas</p>
                <p className="text-xs text-muted-foreground">Productos y packs</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">MRR & Setup</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bots Clientes */}
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

        {/* Webs Clientes */}
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

      {/* Global Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{companies.length}</p>
                <p className="text-xs text-muted-foreground">
                  {companies.length === 1 ? "Empresa" : "Empresas"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Bot className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalBots}</p>
                <p className="text-xs text-muted-foreground">
                  {totalBots === 1 ? "Bot" : "Bots"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userCount}</p>
                <p className="text-xs text-muted-foreground">
                  {userCount === 1 ? "Usuario cliente" : "Usuarios clientes"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <TrendingUp className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {companies.reduce((sum, c) => sum + c.activeSubscriptions, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Suscripciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Overview */}
      {companies.length > 1 && (
        <Card variant="elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Resumen por empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => {
                  localStorage.setItem("selectedCompanyId", company.id);
                  window.location.reload();
                }}
              >
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {company.botCount} {company.botCount === 1 ? "bot" : "bots"} · {" "}
                    {company.activeSubscriptions} {company.activeSubscriptions === 1 ? "suscripción" : "suscripciones"}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useUserRole } from "@/hooks/useUserRole";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { ProfessionalWidgets } from "@/components/dashboard/ProfessionalWidgets";
import { ClientWidgets } from "@/components/dashboard/ClientWidgets";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { BotMetricsSummary } from "@/components/dashboard/BotMetricsSummary";
import { Logo } from "@/components/Logo";

const Dashboard = () => {
  const { isProfessional, isClient, userId, isLoading: roleLoading } = useUserRole();
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [hasBots, setHasBots] = useState(false);
  const [hasUsers, setHasUsers] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const savedCompanyId = localStorage.getItem("selectedCompanyId");
      
      const { data } = await supabase
        .from("company_users")
        .select("companies(id, name)")
        .eq("user_id", user.id);

      if (data && data.length > 0) {
        const companies = data.map((cu: any) => cu.companies);
        const company = savedCompanyId 
          ? companies.find((c: any) => c.id === savedCompanyId) || companies[0]
          : companies[0];
        
        setCompanyId(company.id);
        setCompanyName(company.name);

        // Check if there are bots
        const { data: botsData } = await supabase
          .from("bots")
          .select("id")
          .eq("company_id", company.id)
          .limit(1);
        setHasBots(botsData && botsData.length > 0);

        // Check if there are client users
        const { data: usersData } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "client")
          .limit(1);
        setHasUsers(usersData && usersData.length > 0);
      }
    };

    loadCompany();
  }, []);

  useEffect(() => {
    if (!companyId) return;
    fetchLastActivity();
  }, [companyId]);

  const fetchLastActivity = async () => {
    const { data } = await supabase
      .from("bots")
      .select("last_event_at")
      .eq("company_id", companyId)
      .not("last_event_at", "is", null)
      .order("last_event_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setLastActivity(new Date(data[0].last_event_at));
    }
  };

  // Show onboarding/empty state if no company
  const showEmptyState = !companyId;

  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Cargando...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (showEmptyState) {
    return (
      <DashboardLayout>
        <EmptyDashboard
          isProfessional={isProfessional}
          hasCompany={!!companyId}
          hasBots={hasBots}
          hasUsers={hasUsers}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Large transparent logo as title - desktop only */}
        <div className="hidden md:flex justify-center">
          <Logo size="lg" className="opacity-10 h-24 lg:h-32 w-auto" />
        </div>

        {/* Header */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">{companyName}</h1>
          <p className="text-sm text-muted-foreground">
            Panel de gestión
          </p>
        </div>

        {/* Financial Summary - Primary content */}
        {isProfessional && <FinancialSummary />}

        {/* Bot Metrics - Collapsible secondary */}
        {isProfessional && companyId && (
          <BotMetricsSummary companyId={companyId} />
        )}

        {/* Role-specific Widgets */}
        {isProfessional && userId && (
          <ProfessionalWidgets userId={userId} />
        )}
        {isClient && userId && (
          <ClientWidgets userId={userId} />
        )}

        {/* System Status */}
        <Card variant="elevated">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Estado del sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-success animate-pulse" />
              <span className="text-sm">Sistema operativo</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Última actividad: </span>
              <span className="font-medium">
                {lastActivity
                  ? format(lastActivity, "dd MMM yyyy, HH:mm", { locale: es })
                  : "Sin actividad"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

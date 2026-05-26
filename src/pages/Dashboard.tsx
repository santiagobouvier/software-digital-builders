import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { ProfessionalWidgets } from "@/components/dashboard/ProfessionalWidgets";
import { ClientWidgets } from "@/components/dashboard/ClientWidgets";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { Logo } from "@/components/Logo";


const Dashboard = () => {
  const { isProfessional, isClient, userId, isLoading: roleLoading } = useUserRole();
  const [companyId, setCompanyId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [hasUsers, setHasUsers] = useState(false);

  useEffect(() => {
    const loadCompanyAndUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .single();
      
      if (profileData?.name) {
        setUserName(profileData.name);
      } else {
        setUserName(user.user_metadata?.name || "Usuario");
      }

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

        const { data: usersData } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "client")
          .limit(1);
        setHasUsers(usersData && usersData.length > 0);
      }
    };

    loadCompanyAndUser();
  }, []);

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
          hasBots={false}
          hasUsers={hasUsers}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="min-w-0 space-y-4">
          <Logo size="lg" className="h-12 md:h-14 w-auto" />
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              {userName}, Te damos la bienvenida a Digital Builders Software.
            </h1>
            <p className="text-sm text-muted-foreground">
              Panel de gestión
            </p>
          </div>
        </div>

        {isProfessional && <FinancialSummary />}

        {isProfessional && userId && (
          <ProfessionalWidgets userId={userId} />
        )}
        {isClient && userId && (
          <ClientWidgets userId={userId} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useUserRole } from "@/hooks/useUserRole";

interface Company {
  id: string;
  name: string;
  role: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { isProfessional } = useUserRole();
  const [user, setUser] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
      fetchCompanies(user.id);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCompanies = async (userId: string) => {
    const { data, error } = await supabase
      .from("company_users")
      .select(`
        role,
        companies (
          id,
          name
        )
      `)
      .eq("user_id", userId);

    if (data && data.length > 0) {
      const companiesList = data.map((cu: any) => ({
        id: cu.companies.id,
        name: cu.companies.name,
        role: cu.role,
      }));
      setCompanies(companiesList);
      
      // Get from localStorage or use first company
      const savedCompanyId = localStorage.getItem("selectedCompanyId");
      const validCompany = companiesList.find(c => c.id === savedCompanyId);
      setSelectedCompanyId(validCompany ? savedCompanyId! : companiesList[0].id);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    localStorage.setItem("selectedCompanyId", companyId);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const currentCompany = companies.find(c => c.id === selectedCompanyId);
  const isOwner = currentCompany?.role === "owner";

  if (!user) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        user={user}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={handleCompanyChange}
        onLogout={handleLogout}
        isProfessional={isProfessional}
        isOwner={isOwner}
      />
      <SidebarInset>
        {/* Minimal header with sidebar trigger */}
        <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

// Context for selected company
interface CompanyContextType {
  companyId: string;
  isOwner: boolean;
}

export const CompanyContext = createContext<CompanyContextType>({
  companyId: "",
  isOwner: false,
});

export const useCompany = () => useContext(CompanyContext);

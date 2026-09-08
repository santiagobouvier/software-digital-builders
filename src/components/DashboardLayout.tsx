import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatedSidebarTrigger } from "@/components/AnimatedSidebarTrigger";
import { useUserRole } from "@/hooks/useUserRole";
import { GlobalSearch } from "@/components/GlobalSearch";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { isProfessional } = useUserRole();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        user={user}
        onLogout={handleLogout}
        isProfessional={isProfessional}
      />
      <SidebarInset>
        {/* Minimal header with animated sidebar trigger */}
        <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <AnimatedSidebarTrigger className="-ml-1" />
          <div className="flex-1 flex justify-center px-2">
            {isProfessional && <GlobalSearch />}
          </div>
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

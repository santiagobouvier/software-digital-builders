import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Bot,
  Users,
  UserCog,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

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
  const location = useLocation();
  const { isProfessional } = useUserRole();
  const [user, setUser] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/bots", label: "Bots", icon: Bot },
    ...(isOwner ? [{ path: "/team", label: "Equipo", icon: Users }] : []),
    ...(isProfessional ? [{ path: "/users", label: "Usuarios", icon: UserCog }] : []),
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen max-h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link to="/dashboard" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>

            {/* Company Selector */}
            {companies.length > 1 && (
              <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-[140px] sm:w-[200px] bg-secondary border-border text-sm">
                  <SelectValue placeholder="Empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path || location.pathname.startsWith(item.path + "/") ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      (location.pathname === item.path || location.pathname.startsWith(item.path + "/")) && "bg-secondary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.user_metadata?.name || "Usuario"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-border p-3 space-y-1 bg-background">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant={location.pathname === item.path || location.pathname.startsWith(item.path + "/") ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-3 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Context for selected company
import { createContext, useContext } from "react";

interface CompanyContextType {
  companyId: string;
  isOwner: boolean;
}

export const CompanyContext = createContext<CompanyContextType>({
  companyId: "",
  isOwner: false,
});

export const useCompany = () => useContext(CompanyContext);

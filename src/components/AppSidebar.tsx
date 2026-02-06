import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Users,
  UserCog,
  Package,
  Building2,
  MessageCircle,
  Globe,
  Download,
  Check,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
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
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  role: string;
}

interface AppSidebarProps {
  user: any;
  companies: Company[];
  selectedCompanyId: string;
  onCompanyChange: (companyId: string) => void;
  onLogout: () => void;
  isProfessional: boolean;
  isOwner: boolean;
}

export function AppSidebar({
  user,
  companies,
  selectedCompanyId,
  onCompanyChange,
  onLogout,
  isProfessional,
  isOwner,
}: AppSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isCollapsed = state === "collapsed";

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/bots", label: "Bots", icon: Bot },
    ...(isOwner ? [{ path: "/team", label: "Equipo", icon: Users }] : []),
    ...(isProfessional
      ? [
          { path: "/users", label: "Usuarios", icon: UserCog },
          { path: "/catalogo", label: "Catálogo", icon: Package },
          { path: "/clientes", label: "Clientes", icon: Building2 },
          { path: "/bots-clientes", label: "Bots Clientes", icon: MessageCircle },
          { path: "/webs-clientes", label: "Webs Clientes", icon: Globe },
        ]
      : []),
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <Logo size="sm" iconOnly={isCollapsed} />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Company Selector */}
        {companies.length > 1 && !isCollapsed && (
          <SidebarGroup>
            <Select value={selectedCompanyId} onValueChange={onCompanyChange}>
              <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border text-sm">
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
          </SidebarGroup>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PWA Install */}
        {isInstallable && !isInstalled && !isCollapsed && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-primary/50 text-primary hover:bg-primary/10"
                onClick={install}
              >
                <Download className="h-4 w-4" />
                Descargar App
              </Button>
            </SidebarGroup>
          </>
        )}

        {isInstalled && !isCollapsed && (
          <SidebarGroup>
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
              <Check className="h-4 w-4 text-success" />
              App instalada
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer with User Menu */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={cn(
                    "w-full",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm flex-shrink-0">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {user?.user_metadata?.name || "Usuario"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user?.user_metadata?.name || "Usuario"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

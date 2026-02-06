import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
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
  Settings,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  role: string;
}

interface Profile {
  name: string | null;
  last_name: string | null;
  avatar_url: string | null;
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
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("name, last_name, avatar_url")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  };

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

  const getDisplayName = () => {
    if (profile?.name) {
      return profile.last_name
        ? `${profile.name} ${profile.last_name}`
        : profile.name;
    }
    return user?.user_metadata?.name || "Usuario";
  };

  const getInitials = () => {
    const first = profile?.name?.[0] || user?.email?.[0] || "U";
    const last = profile?.last_name?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          {/* Large Logo - shown when sidebar is open (mobile and desktop) */}
          {!isCollapsed && (
            <SidebarGroup className="flex items-center justify-center pt-6 pb-8 border-b border-sidebar-border mb-2">
              <Link to="/dashboard">
                <Logo size="lg" className="h-14 w-auto" />
              </Link>
            </SidebarGroup>
          )}

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
                    className={cn("w-full", isCollapsed && "justify-center")}
                  >
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {getDisplayName()}
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
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">
                          {getDisplayName()}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Editar perfil
                  </DropdownMenuItem>
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

      <ProfileEditDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        user={user}
        onProfileUpdate={loadProfile}
      />
    </>
  );
}

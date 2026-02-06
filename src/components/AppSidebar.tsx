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

  // On mobile, sidebar is never "collapsed" in the icon sense - it's either open or closed via sheet
  const showFullContent = isMobile || !isCollapsed;

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent className="bg-sidebar">
          {/* Large Logo - shown when sidebar content is visible */}
          {showFullContent && (
            <SidebarGroup className="flex items-center justify-center pt-8 pb-6">
              <Link to="/dashboard" className="block">
                <Logo size="lg" className="h-16 w-auto" />
              </Link>
            </SidebarGroup>
          )}

          {/* Company Selector */}
          {companies.length > 1 && showFullContent && (
            <SidebarGroup className="px-3">
              <Select value={selectedCompanyId} onValueChange={onCompanyChange}>
                <SelectTrigger className="w-full bg-sidebar-accent/30 border-sidebar-border/50 text-sm h-10">
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
          <SidebarGroup className="px-2 mt-2">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.path)}
                      tooltip={item.label}
                      size="lg"
                      className="h-11"
                    >
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Spacer */}
          <div className="flex-1" />

          {/* PWA Install */}
          {isInstallable && !isInstalled && showFullContent && (
            <SidebarGroup className="px-3">
              <Button
                variant="outline"
                size="default"
                className="w-full justify-start gap-3 border-primary/50 text-primary hover:bg-primary/10 h-11"
                onClick={install}
              >
                <Download className="h-5 w-5" />
                Descargar App
              </Button>
            </SidebarGroup>
          )}

          {isInstalled && showFullContent && (
            <SidebarGroup className="px-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Check className="h-5 w-5 text-success" />
                App instalada
              </div>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer with User Menu */}
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <SidebarMenu>
          <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={cn("w-full h-14", (isMobile || !isCollapsed) ? "" : "justify-center")}
                  >
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {showFullContent && (
                      <>
                        <div className="flex flex-col flex-1 min-w-0 ml-1">
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
                <DropdownMenuContent side="top" align="start" className="w-64">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary text-lg">
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
                  <DropdownMenuItem onClick={() => setProfileDialogOpen(true)} className="py-3">
                    <Settings className="h-4 w-4 mr-3" />
                    Editar perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="text-destructive py-3"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
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

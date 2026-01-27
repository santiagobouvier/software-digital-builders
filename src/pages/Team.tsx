import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Users,
  Loader2,
  Trash2,
  Crown,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TeamMember {
  id: string;
  user_id: string;
  role: "owner" | "viewer";
  created_at: string;
  profiles: {
    name: string | null;
    email: string | null;
  };
}

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "owner">("viewer");
  const [companyId, setCompanyId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    loadCompanyAndMembers();
  }, []);

  const loadCompanyAndMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserId(user.id);
    const savedCompanyId = localStorage.getItem("selectedCompanyId");

    const { data: companyData } = await supabase
      .from("company_users")
      .select("company_id, role")
      .eq("user_id", user.id);

    if (companyData && companyData.length > 0) {
      const company = savedCompanyId
        ? companyData.find((c: any) => c.company_id === savedCompanyId) || companyData[0]
        : companyData[0];

      if (company.role !== "owner") {
        // Redirect if not owner
        window.location.href = "/dashboard";
        return;
      }

      setCompanyId(company.company_id);
      fetchMembers(company.company_id);
    } else {
      setIsLoading(false);
    }
  };

  const fetchMembers = async (cId: string) => {
    const { data, error } = await supabase
      .from("company_users")
      .select(`
        id,
        user_id,
        role,
        created_at,
        profiles:user_id (
          name,
          email
        )
      `)
      .eq("company_id", cId)
      .order("created_at", { ascending: true });

    if (data) {
      setMembers(data as any);
    }
    setIsLoading(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);

    // First, check if user exists by email in profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", inviteEmail.trim().toLowerCase())
      .maybeSingle();

    if (!profileData) {
      toast({
        title: "Usuario no encontrado",
        description: "El usuario debe registrarse primero en la plataforma.",
        variant: "destructive",
      });
      setIsInviting(false);
      return;
    }

    // Check if already a member
    const existingMember = members.find(m => m.user_id === profileData.user_id);
    if (existingMember) {
      toast({
        title: "Ya es miembro",
        description: "Este usuario ya pertenece a la empresa.",
        variant: "destructive",
      });
      setIsInviting(false);
      return;
    }

    // Add to company
    const { error } = await supabase
      .from("company_users")
      .insert({
        company_id: companyId,
        user_id: profileData.user_id,
        role: inviteRole,
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Miembro agregado",
        description: `${inviteEmail} ha sido agregado como ${inviteRole === "owner" ? "propietario" : "visualizador"}.`,
      });
      setInviteEmail("");
      setIsInviteOpen(false);
      fetchMembers(companyId);
    }
    setIsInviting(false);
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (memberUserId === currentUserId) {
      toast({
        title: "Error",
        description: "No puedes eliminarte a ti mismo.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("company_users")
      .delete()
      .eq("id", memberId);

    if (!error) {
      setMembers(members.filter(m => m.id !== memberId));
      toast({
        title: "Miembro eliminado",
        description: "El usuario ha sido eliminado de la empresa.",
      });
    }
  };

  const handleRoleChange = async (memberId: string, memberUserId: string, newRole: "owner" | "viewer") => {
    if (memberUserId === currentUserId) {
      toast({
        title: "Error",
        description: "No puedes cambiar tu propio rol.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("company_users")
      .update({ role: newRole })
      .eq("id", memberId);

    if (!error) {
      setMembers(members.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      ));
      toast({
        title: "Rol actualizado",
        description: `El rol ha sido cambiado a ${newRole === "owner" ? "propietario" : "visualizador"}.`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Equipo</h1>
            <p className="text-muted-foreground">
              Gestiona los miembros de tu empresa.
            </p>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invitar miembro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invitar miembro</DialogTitle>
                <DialogDescription>
                  Invita a un usuario existente a tu empresa. El usuario debe estar registrado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email del usuario</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select value={inviteRole} onValueChange={(v: "viewer" | "owner") => setInviteRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                      <SelectItem value="owner">Propietario</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Los visualizadores solo pueden ver estadísticas. Los propietarios pueden gestionar bots y miembros.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleInvite} disabled={isInviting || !inviteEmail.trim()}>
                  {isInviting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Invitando...
                    </>
                  ) : (
                    "Invitar"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Members Table */}
        <Card variant="elevated">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hay miembros</h3>
                <p className="text-muted-foreground text-sm">
                  Invita a tu primer miembro del equipo.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Desde</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                            {(member.profiles?.email || member.profiles?.name || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.profiles?.name || "Sin nombre"}
                              {member.user_id === currentUserId && (
                                <span className="text-muted-foreground text-xs ml-2">(Tú)</span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.profiles?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.user_id === currentUserId ? (
                          <Badge variant="outline" className="gap-1">
                            <Crown className="h-3 w-3" />
                            Propietario
                          </Badge>
                        ) : (
                          <Select
                            value={member.role}
                            onValueChange={(v: "owner" | "viewer") => handleRoleChange(member.id, member.user_id, v)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Visualizador</SelectItem>
                              <SelectItem value="owner">Propietario</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(member.created_at), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        {member.user_id !== currentUserId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.id, member.user_id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Team;

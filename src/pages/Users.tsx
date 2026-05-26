import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ResponsiveTable,
  ResponsiveTableBody,
  ResponsiveTableCell,
  ResponsiveTableHead,
  ResponsiveTableHeader,
  ResponsiveTableRow,
  MobileCardHeader,
  MobileCardRow,
} from "@/components/ui/responsive-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, UserPlus, Trash2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "professional" | "client";
}

const Users = () => {
  const { isProfessional, isLoading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"professional" | "client">("client");


  useEffect(() => {
    if (isProfessional) {
      loadData();
    }
  }, [isProfessional]);

  const loadData = async () => {
    setIsLoading(true);
    await loadUsers();
    setIsLoading(false);
  };

  const loadUsers = async () => {
    // Get all users with roles
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      console.error("Error loading roles:", rolesError);
      return;
    }

    // Get profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, email, name");

    if (profilesError) {
      console.error("Error loading profiles:", profilesError);
      return;
    }

    // Combine data
    const usersList: User[] = rolesData.map((roleEntry: any) => {
      const profile = profilesData.find((p: any) => p.user_id === roleEntry.user_id);
      return {
        id: roleEntry.user_id,
        email: profile?.email || "Sin email",
        name: profile?.name || null,
        role: roleEntry.role,
      };
    });

    setUsers(usersList);
  };


  const handleCreateUser = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email y contraseña son requeridos",
        variant: "destructive",
      });
      return;
    }

    if (selectedRole === "client" && !selectedBotId) {
      toast({
        title: "Error",
        description: "Selecciona un bot para el cliente",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Create user via edge function (we need admin privileges)
      const { data: userData, error: userError } = await supabase.functions.invoke("create-user", {
        body: {
          email,
          password,
          name,
          role: selectedRole,
          botId: selectedRole === "client" ? selectedBotId : null,
        },
      });

      if (userError) throw userError;
      if (userData?.error) throw new Error(userData.error);

      toast({
        title: "Usuario creado",
        description: `${email} fue creado como ${selectedRole === "professional" ? "profesional" : "cliente"}.`,
      });

      // Reset form
      setEmail("");
      setPassword("");
      setName("");
      setSelectedRole("client");
      setSelectedBotId("");
      setIsDialogOpen(false);

      // Reload users
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Eliminar al usuario ${userEmail}?`)) return;

    try {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userId },
      });

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: `${userEmail} fue eliminado correctamente.`,
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isProfessional) {
    return <Navigate to="/stats" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <p className="text-muted-foreground">Gestiona los usuarios del sistema</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        </div>

        <Card variant="elevated">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay usuarios registrados
              </div>
            ) : (
              <ResponsiveTable>
                <ResponsiveTableHeader>
                  <ResponsiveTableRow>
                    <ResponsiveTableHead>Email</ResponsiveTableHead>
                    <ResponsiveTableHead>Nombre</ResponsiveTableHead>
                    <ResponsiveTableHead>Rol</ResponsiveTableHead>
                    <ResponsiveTableHead>Bot asignado</ResponsiveTableHead>
                    <ResponsiveTableHead className="w-[80px]"></ResponsiveTableHead>
                  </ResponsiveTableRow>
                </ResponsiveTableHeader>
                <ResponsiveTableBody>
                  {users.map((user) => (
                    <ResponsiveTableRow 
                      key={user.id}
                      mobileCard={
                        <>
                          <MobileCardHeader
                            title={user.email}
                            subtitle={user.name}
                            badge={
                              <Badge
                                variant={user.role === "professional" ? "default" : "secondary"}
                                className="text-[10px] px-1.5 py-0"
                              >
                                {user.role === "professional" ? "Pro" : "Cliente"}
                              </Badge>
                            }
                            actions={
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                          {user.assigned_bot_name && (
                            <MobileCardRow label="Bot asignado">
                              <span className="font-medium">{user.assigned_bot_name}</span>
                            </MobileCardRow>
                          )}
                        </>
                      }
                    >
                      <ResponsiveTableCell className="font-medium">{user.email}</ResponsiveTableCell>
                      <ResponsiveTableCell>{user.name || "-"}</ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <Badge
                          variant={user.role === "professional" ? "default" : "secondary"}
                        >
                          {user.role === "professional" ? "Profesional" : "Cliente"}
                        </Badge>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        {user.assigned_bot_name || "-"}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ))}
                </ResponsiveTableBody>
              </ResponsiveTable>
            )}
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo usuario</DialogTitle>
              <DialogDescription>
                Crea un nuevo usuario con acceso al sistema
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Rol *</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(v) => setSelectedRole(v as "professional" | "client")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profesional</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRole === "client" && (
                <div className="space-y-2">
                  <Label>Bot asignado *</Label>
                  <Select value={selectedBotId} onValueChange={setSelectedBotId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un bot" />
                    </SelectTrigger>
                    <SelectContent>
                      {bots.map((bot) => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {bot.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear usuario"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Users;

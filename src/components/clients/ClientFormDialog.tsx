import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import { ClientAvatar } from "./ClientAvatar";
import type { Client, ClientStatus, ClientFormData } from "@/types/catalog";

interface ClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
  onSuccess: () => void;
}

export const ClientFormDialog = ({ 
  open, 
  onClose, 
  client, 
  onSuccess 
}: ClientFormDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    country: "",
    status: "lead",
    notes: "",
  });

  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name,
        contact_name: client.contact_name || "",
        email: client.email || "",
        phone: client.phone || "",
        country: client.country || "",
        status: client.status,
        notes: client.notes || "",
      });
      setLogoPreview(client.logo_url || null);
    } else {
      resetForm();
    }
    setLogoFile(null);
    setRemoveLogo(false);
  }, [client, open]);

  const resetForm = () => {
    setFormData({
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      country: "",
      status: "lead",
      notes: "",
    });
    setLogoPreview(null);
    setLogoFile(null);
    setRemoveLogo(false);
  };

  const handleChange = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "La imagen no puede superar 2MB", variant: "destructive" });
      return;
    }
    setLogoFile(file);
    setRemoveLogo(false);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadLogo = async (clientId: string): Promise<string | null> => {
    if (!logoFile) return null;
    const ext = logoFile.name.split(".").pop();
    const path = `${clientId}.${ext}`;

    const { error } = await supabase.storage
      .from("client-logos")
      .upload(path, logoFile, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from("client-logos").getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  const handleSubmit = async () => {
    if (!formData.company_name.trim()) {
      toast({ title: "Error", description: "El nombre de empresa es requerido", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const data: Record<string, any> = {
        company_name: formData.company_name.trim(),
        contact_name: formData.contact_name.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        country: formData.country.trim() || null,
        status: formData.status as ClientStatus,
        notes: formData.notes.trim() || null,
      };

      if (client) {
        // Upload logo if new file selected
        if (logoFile) {
          data.logo_url = await uploadLogo(client.id);
        } else if (removeLogo) {
          data.logo_url = null;
        }

        const { error } = await supabase
          .from("clients")
          .update(data)
          .eq("id", client.id);

        if (error) throw error;
        toast({ title: "Cliente actualizado" });
      } else {
        const { data: newClient, error } = await supabase
          .from("clients")
          .insert({
            company_name: data.company_name as string,
            contact_name: data.contact_name as string | null,
            email: data.email as string | null,
            phone: data.phone as string | null,
            country: data.country as string | null,
            status: data.status as ClientStatus,
            notes: data.notes as string | null,
          })
          .select("id")
          .single();
        if (error) throw error;

        // Upload logo for newly created client
        if (logoFile && newClient) {
          const logoUrl = await uploadLogo(newClient.id);
          await supabase.from("clients").update({ logo_url: logoUrl }).eq("id", newClient.id);
        }
        toast({ title: "Cliente creado" });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{client ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
          <DialogDescription>
            {client ? "Modifica los datos del cliente" : "Crea un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Logo upload */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <ClientAvatar
                logoUrl={logoPreview}
                companyName={formData.company_name || "?"}
                size="lg"
              />
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Subir
                </Button>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Nombre de empresa *</Label>
            <Input
              id="company_name"
              placeholder="Ej: Acme Corp"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contacto</Label>
              <Input
                id="contact_name"
                placeholder="Nombre del contacto"
                value={formData.contact_name}
                onChange={(e) => handleChange("contact_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="+598 99 123 456"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                placeholder="Uruguay"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v) => handleChange("status", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Notas adicionales..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : client ? (
              "Guardar cambios"
            ) : (
              "Crear cliente"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

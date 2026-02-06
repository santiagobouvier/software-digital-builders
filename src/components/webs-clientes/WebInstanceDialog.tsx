import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";

interface WebInstance {
  id: string;
  client_id: string;
  subscription_id: string;
  product_id: string;
  web_type: string;
  domain: string | null;
  status: string;
  notes: string | null;
  product: {
    name: string;
  };
  client: {
    company_name: string;
  };
}

interface WebInstanceDialogProps {
  open: boolean;
  onClose: () => void;
  instance: WebInstance | null;
  onSuccess: () => void;
}

export const WebInstanceDialog = ({
  open,
  onClose,
  instance,
  onSuccess,
}: WebInstanceDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState("development");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (instance) {
      setDomain(instance.domain || "");
      setStatus(instance.status);
      setNotes(instance.notes || "");
    }
  }, [instance]);

  const handleSubmit = async () => {
    if (!instance) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("web_instances")
        .update({
          domain: domain.trim() || null,
          status,
          notes: notes.trim() || null,
        })
        .eq("id", instance.id);

      if (error) throw error;

      toast({ title: "Instancia actualizada" });
      onSuccess();
      onClose();
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

  if (!instance) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar instancia web</DialogTitle>
          <DialogDescription>
            {instance.product.name} - {instance.client.company_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de web</Label>
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
              {instance.web_type === "web_rapida" ? "Web rápida" : "Web autogestionable"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Dominio</Label>
            <Input
              id="domain"
              placeholder="ejemplo.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">En desarrollo</SelectItem>
                <SelectItem value="active">Activa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas internas</Label>
            <Textarea
              id="notes"
              placeholder="Notas sobre esta instancia..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
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
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

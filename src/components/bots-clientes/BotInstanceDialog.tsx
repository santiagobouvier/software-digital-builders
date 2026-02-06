import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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

interface BotInstance {
  id: string;
  client_id: string;
  subscription_id: string;
  product_id: string;
  bot_type: string;
  status: string;
  notes: string | null;
  product: {
    name: string;
  };
  client: {
    company_name: string;
  };
}

interface BotInstanceDialogProps {
  open: boolean;
  onClose: () => void;
  instance: BotInstance | null;
  onSuccess: () => void;
}

export const BotInstanceDialog = ({
  open,
  onClose,
  instance,
  onSuccess,
}: BotInstanceDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("setup");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (instance) {
      setStatus(instance.status);
      setNotes(instance.notes || "");
    }
  }, [instance]);

  const handleSubmit = async () => {
    if (!instance) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("bot_instances")
        .update({
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
          <DialogTitle>Gestionar instancia de bot</DialogTitle>
          <DialogDescription>
            {instance.product.name} - {instance.client.company_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de bot</Label>
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
              {instance.bot_type === "bot_whatsapp" ? "Bot WhatsApp" : "Bot Interno"}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="setup">En setup</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
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

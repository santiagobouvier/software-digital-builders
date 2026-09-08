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
import type { Client } from "@/types/client";
import {
  CalendarEvent,
  CalendarEventType,
  EVENT_TYPE_LABELS,
} from "@/types/finance";

const NO_CLIENT = "none";

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  clients: Client[];
  defaultDate?: string;
  defaultClientId?: string;
  onSuccess: () => void;
}

export const EventFormDialog = ({
  open,
  onClose,
  event,
  clients,
  defaultDate,
  defaultClientId,
  onSuccess,
}: EventFormDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [type, setType] = useState<CalendarEventType>("meeting");
  const [clientId, setClientId] = useState<string>(NO_CLIENT);

  useEffect(() => {
    if (!open) return;
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setEventDate(event.event_date);
      setEventTime(event.event_time ? event.event_time.slice(0, 5) : "");
      setType(event.type);
      setClientId(event.client_id || NO_CLIENT);
    } else {
      setTitle("");
      setDescription("");
      setEventDate(defaultDate || new Date().toISOString().split("T")[0]);
      setEventTime("");
      setType("meeting");
      setClientId(defaultClientId || NO_CLIENT);
    }
  }, [open, event, defaultDate, defaultClientId]);

  const handleSave = async () => {
    if (!title.trim() || !eventDate) {
      toast({
        title: "Datos incompletos",
        description: "Completá título y fecha.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim() || null,
        event_date: eventDate,
        event_time: eventTime || null,
        type,
        client_id: clientId === NO_CLIENT ? null : clientId,
      };

      if (event) {
        const { error } = await supabase
          .from("calendar_events")
          .update(data)
          .eq("id", event.id);
        if (error) throw error;
        toast({ title: "Evento actualizado" });
      } else {
        const { error } = await supabase.from("calendar_events").insert(data);
        if (error) throw error;
        toast({ title: "Evento creado" });
      }

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Editar evento" : "Nuevo evento"}</DialogTitle>
          <DialogDescription>Agendá reuniones, entregas y recordatorios.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ev-title">Título *</Label>
            <Input
              id="ev-title"
              placeholder="Ej: Reunión con cliente"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ev-date">Fecha *</Label>
              <Input
                id="ev-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-time">Hora</Label>
              <Input
                id="ev-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as CalendarEventType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(EVENT_TYPE_LABELS) as CalendarEventType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {EVENT_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cliente (opcional)</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Sin cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CLIENT}>Sin cliente</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-description">Descripción</Label>
            <Textarea
              id="ev-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

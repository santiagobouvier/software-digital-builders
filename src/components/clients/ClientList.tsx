import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Building2 } from "lucide-react";
import type { Client, CLIENT_STATUS_LABELS, CLIENT_STATUS_COLORS } from "@/types/catalog";
import { cn } from "@/lib/utils";

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  selectedId?: string;
  onSelect: (client: Client) => void;
  onEdit: (client: Client) => void;
}

const STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  active: 'Activo',
  paused: 'Pausado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  lead: 'bg-blue-500/20 text-blue-400',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export const ClientList = ({ 
  clients, 
  isLoading, 
  selectedId, 
  onSelect, 
  onEdit 
}: ClientListProps) => {
  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card variant="elevated">
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mb-4 opacity-50" />
          <p>No hay clientes que mostrar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardContent className="p-2">
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {clients.map((client) => (
            <div
              key={client.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                selectedId === client.id
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-secondary/50"
              )}
              onClick={() => onSelect(client)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{client.company_name}</h3>
                  <Badge className={cn("text-xs", STATUS_COLORS[client.status])}>
                    {STATUS_LABELS[client.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {client.contact_name && <span>{client.contact_name}</span>}
                  {client.contact_name && client.email && <span>•</span>}
                  {client.email && <span className="truncate">{client.email}</span>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(client);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

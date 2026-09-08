import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Pencil,
  Plus,
  Loader2,
  CalendarDays,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/money";
import { format, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { ClientAvatar } from "./ClientAvatar";
import { TransactionList } from "@/components/finance/TransactionList";
import { TransactionFormDialog } from "@/components/finance/TransactionFormDialog";
import { EventFormDialog } from "@/components/calendar/EventFormDialog";
import type { Client } from "@/types/client";
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_COLORS } from "@/types/client";
import type { Transaction, CalendarEvent } from "@/types/finance";
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "@/types/finance";

interface ClientDetailProps {
  client: Client | null;
  onEdit: () => void;
  convert: (amount: number, from: string, to: string) => number;
  displayCurrency: string;
}

export const ClientDetail = ({
  client,
  onEdit,
  convert,
  displayCurrency,
}: ClientDetailProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTxFormOpen, setIsTxFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  const loadClientData = useCallback(async () => {
    if (!client) return;
    setIsLoading(true);
    const [txRes, evRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("*")
        .eq("client_id", client.id)
        .order("due_date", { ascending: false }),
      supabase
        .from("calendar_events")
        .select("*")
        .eq("client_id", client.id)
        .gte("event_date", format(startOfDay(new Date()), "yyyy-MM-dd"))
        .order("event_date", { ascending: true })
        .limit(5),
    ]);
    if (txRes.data) setTransactions(txRes.data as unknown as Transaction[]);
    if (evRes.data) setEvents(evRes.data as unknown as CalendarEvent[]);
    setIsLoading(false);
  }, [client]);

  useEffect(() => {
    loadClientData();
  }, [loadClientData]);

  const totals = useMemo(() => {
    let collected = 0;
    let pending = 0;
    for (const tx of transactions) {
      if (tx.type !== "income") continue;
      const value = convert(tx.amount, tx.currency, displayCurrency);
      if (tx.status === "paid") collected += value;
      if (tx.status === "pending") pending += value;
    }
    return { collected, pending };
  }, [transactions, convert, displayCurrency]);

  const pendingTx = transactions.filter((t) => t.status === "pending");
  const recentTx = transactions.filter((t) => t.status !== "pending").slice(0, 5);

  if (!client) {
    return (
      <Card variant="elevated" className="h-full">
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Building2 className="h-12 w-12 mb-4 opacity-50" />
          <p>Seleccioná un cliente para ver su ficha</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Ficha */}
      <Card variant="elevated">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <ClientAvatar
                logoUrl={client.logo_url}
                companyName={client.company_name}
                bgColor={client.logo_bg_color}
                size="lg"
              />
              <div className="min-w-0">
                <CardTitle className="text-lg truncate">{client.company_name}</CardTitle>
                <Badge className={cn("mt-1 text-xs", CLIENT_STATUS_COLORS[client.status])}>
                  {CLIENT_STATUS_LABELS[client.status]}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-1 flex-shrink-0">
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {client.contact_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{client.contact_name}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <a href={`mailto:${client.email}`} className="truncate hover:text-foreground">
                {client.email}
              </a>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{client.phone}</span>
            </div>
          )}
          {client.country && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{client.country}</span>
            </div>
          )}
          {client.notes && (
            <>
              <Separator className="my-2" />
              <div className="flex items-start gap-2 text-muted-foreground">
                <StickyNote className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="whitespace-pre-wrap">{client.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Resumen financiero del cliente */}
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Finanzas</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => {
                setEditingTx(null);
                setIsTxFormOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Movimiento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-success/10 p-3">
              <p className="text-xs text-muted-foreground">Cobrado</p>
              <p className="text-lg font-bold font-mono text-success">
                {formatCurrency(totals.collected, displayCurrency)}
              </p>
            </div>
            <div className="rounded-lg bg-warning/10 p-3">
              <p className="text-xs text-muted-foreground">Por cobrar</p>
              <p className="text-lg font-bold font-mono text-warning">
                {formatCurrency(totals.pending, displayCurrency)}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-4 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {pendingTx.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Pendientes</p>
                  <TransactionList
                    transactions={pendingTx}
                    onEdit={(tx) => {
                      setEditingTx(tx);
                      setIsTxFormOpen(true);
                    }}
                    onChanged={loadClientData}
                    showClient={false}
                  />
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Últimos movimientos</p>
                <TransactionList
                  transactions={recentTx}
                  onEdit={(tx) => {
                    setEditingTx(tx);
                    setIsTxFormOpen(true);
                  }}
                  onChanged={loadClientData}
                  emptyMessage="Sin movimientos registrados"
                  showClient={false}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Próximos eventos del cliente */}
      <Card variant="elevated">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Próximos eventos
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => setIsEventFormOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Evento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              Sin eventos agendados
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(ev.event_date), "dd MMM yyyy", { locale: es })}
                      {ev.event_time && ` · ${ev.event_time.slice(0, 5)}`}
                    </p>
                  </div>
                  <Badge className={cn("text-[10px] px-1.5 py-0 border", EVENT_TYPE_COLORS[ev.type])}>
                    {EVENT_TYPE_LABELS[ev.type]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={isTxFormOpen}
        onClose={() => {
          setIsTxFormOpen(false);
          setEditingTx(null);
        }}
        transaction={editingTx}
        clients={[client]}
        defaultClientId={client.id}
        onSuccess={loadClientData}
      />

      <EventFormDialog
        open={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        event={null}
        clients={[client]}
        defaultClientId={client.id}
        onSuccess={loadClientData}
      />
    </div>
  );
};

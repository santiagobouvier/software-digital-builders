import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Pencil,
  Trash2,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { EventFormDialog } from "@/components/calendar/EventFormDialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import type { Client } from "@/types/client";
import type { CalendarEvent } from "@/types/finance";
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "@/types/finance";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const CalendarPage = () => {
  const { isProfessional, isLoading: roleLoading } = useUserRole();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const loadData = useCallback(async () => {
    const [eventsRes, clientsRes] = await Promise.all([
      supabase
        .from("calendar_events")
        .select("*, client:clients(company_name)")
        .order("event_date", { ascending: true })
        .order("event_time", { ascending: true, nullsFirst: true }),
      supabase.from("clients").select("*").order("company_name"),
    ]);

    if (eventsRes.data) setEvents(eventsRes.data as unknown as CalendarEvent[]);
    if (clientsRes.data) setClients(clientsRes.data as Client[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isProfessional) {
      loadData();
    }
  }, [isProfessional, loadData]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = ev.event_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  const selectedDayEvents = eventsByDay.get(format(selectedDate, "yyyy-MM-dd")) || [];

  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return events
      .filter((ev) => !ev.completed && parseISO(ev.event_date) >= today)
      .slice(0, 8);
  }, [events]);

  const handleToggleCompleted = async (ev: CalendarEvent) => {
    const { error } = await supabase
      .from("calendar_events")
      .update({ completed: !ev.completed })
      .eq("id", ev.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    loadData();
  };

  const handleDelete = async (ev: CalendarEvent) => {
    if (!confirm(`¿Eliminar el evento "${ev.title}"?`)) return;
    const { error } = await supabase.from("calendar_events").delete().eq("id", ev.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Evento eliminado" });
    loadData();
  };

  const openNew = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const EventRow = ({ ev, showDate = false }: { ev: CalendarEvent; showDate?: boolean }) => (
    <div className="flex items-start gap-3 py-2.5">
      <Checkbox
        checked={ev.completed}
        onCheckedChange={() => handleToggleCompleted(ev)}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", ev.completed && "line-through text-muted-foreground")}>
          {ev.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {showDate && `${format(parseISO(ev.event_date), "dd MMM", { locale: es })} · `}
          {ev.event_time ? ev.event_time.slice(0, 5) : "Todo el día"}
          {ev.client?.company_name && ` · ${ev.client.company_name}`}
        </p>
      </div>
      <Badge className={cn("text-[10px] px-1.5 py-0 border", EVENT_TYPE_COLORS[ev.type])}>
        {EVENT_TYPE_LABELS[ev.type]}
      </Badge>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            setEditingEvent(ev);
            setIsFormOpen(true);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => handleDelete(ev)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

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
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              Calendario
            </h1>
            <p className="text-muted-foreground">Reuniones, entregas y recordatorios</p>
          </div>
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo evento
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr,380px]">
          {/* Calendario mensual */}
          <Card variant="elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setCurrentMonth(startOfMonth(new Date()));
                      setSelectedDate(startOfDay(new Date()));
                    }}
                  >
                    Hoy
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 mb-1">
                    {WEEKDAYS.map((d) => (
                      <div
                        key={d}
                        className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground py-1"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                      const dayEvents = eventsByDay.get(format(day, "yyyy-MM-dd")) || [];
                      const inMonth = isSameMonth(day, currentMonth);
                      const selected = isSameDay(day, selectedDate);
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "min-h-[48px] p-1 sm:min-h-[80px] sm:p-1.5 rounded-lg border text-left transition-colors flex flex-col",
                            inMonth ? "border-border/50" : "border-transparent opacity-40",
                            selected
                              ? "bg-primary/10 border-primary/50"
                              : "hover:bg-secondary/50",
                            isToday(day) && !selected && "border-primary/40"
                          )}
                        >
                          <span
                            className={cn(
                              "text-xs font-medium",
                              isToday(day) ? "text-primary" : "text-foreground"
                            )}
                          >
                            {format(day, "d")}
                          </span>
                          {/* Móvil: puntos por evento; desktop: chips con título */}
                          <div className="mt-auto flex flex-wrap gap-0.5 sm:hidden">
                            {dayEvents.slice(0, 4).map((ev) => (
                              <span
                                key={ev.id}
                                className={cn(
                                  "inline-block h-1.5 w-1.5 rounded-full",
                                  ev.completed ? "bg-muted-foreground/40" : "bg-primary"
                                )}
                              />
                            ))}
                            {dayEvents.length > 4 && (
                              <span className="text-[8px] leading-none text-muted-foreground">
                                +{dayEvents.length - 4}
                              </span>
                            )}
                          </div>
                          <div className="mt-auto space-y-0.5 hidden sm:block">
                            {dayEvents.slice(0, 2).map((ev) => (
                              <div
                                key={ev.id}
                                className={cn(
                                  "text-[9px] leading-tight truncate rounded px-1 border",
                                  EVENT_TYPE_COLORS[ev.type],
                                  ev.completed && "line-through opacity-50"
                                )}
                              >
                                {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-[9px] text-muted-foreground px-1">
                                +{dayEvents.length - 2} más
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Panel lateral */}
          <div className="space-y-4">
            <Card variant="elevated">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">
                    {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                      setEditingEvent(null);
                      setIsFormOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sin eventos este día
                  </p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {selectedDayEvents.map((ev) => (
                      <EventRow key={ev.id} ev={ev} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Próximos eventos</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nada agendado próximamente
                  </p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {upcomingEvents.map((ev) => (
                      <EventRow key={ev.id} ev={ev} showDate />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EventFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        clients={clients}
        defaultDate={format(selectedDate, "yyyy-MM-dd")}
        onSuccess={loadData}
      />
    </DashboardLayout>
  );
};

export default CalendarPage;

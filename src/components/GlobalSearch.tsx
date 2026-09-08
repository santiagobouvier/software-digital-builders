import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Building2,
  Wallet,
  CalendarDays,
  Search,
} from "lucide-react";

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  path: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<SearchResult[]>([]);
  const [transactions, setTransactions] = useState<SearchResult[]>([]);
  const [events, setEvents] = useState<SearchResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Load data when opened
  useEffect(() => {
    if (open && !isLoaded) {
      loadAllData();
    }
  }, [open]);

  const loadAllData = async () => {
    const [clientsRes, txRes, eventsRes] = await Promise.all([
      supabase.from("clients").select("id, company_name, contact_name, status"),
      supabase
        .from("transactions")
        .select("id, description, type, status, due_date, client:clients(company_name)")
        .order("due_date", { ascending: false })
        .limit(100),
      supabase
        .from("calendar_events")
        .select("id, title, event_date, client:clients(company_name)")
        .order("event_date", { ascending: false })
        .limit(100),
    ]);

    if (clientsRes.data) {
      setClients(
        clientsRes.data.map((c) => ({
          id: c.id,
          label: c.company_name,
          sublabel: c.contact_name || c.status,
          icon: <Building2 className="h-4 w-4 text-primary" />,
          path: `/clientes`,
        }))
      );
    }

    if (txRes.data) {
      type TxRow = {
        id: string;
        description: string;
        type: string;
        status: string;
        due_date: string;
        client: { company_name: string } | null;
      };
      setTransactions(
        (txRes.data as unknown as TxRow[]).map((tx) => ({
          id: tx.id,
          label: tx.description,
          sublabel: `${tx.type === "income" ? "Cobro" : "Gasto"} · ${tx.due_date}${
            tx.client?.company_name ? ` · ${tx.client.company_name}` : ""
          }`,
          icon: <Wallet className="h-4 w-4 text-success" />,
          path: `/finanzas`,
        }))
      );
    }

    if (eventsRes.data) {
      type EventRow = {
        id: string;
        title: string;
        event_date: string;
        client: { company_name: string } | null;
      };
      setEvents(
        (eventsRes.data as unknown as EventRow[]).map((ev) => ({
          id: ev.id,
          label: ev.title,
          sublabel: `${ev.event_date}${
            ev.client?.company_name ? ` · ${ev.client.company_name}` : ""
          }`,
          icon: <CalendarDays className="h-4 w-4 text-muted-foreground" />,
          path: `/calendario`,
        }))
      );
    }

    setIsLoaded(true);
  };

  const handleSelect = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery("");
      navigate(path);
    },
    [navigate]
  );

  const filterResults = (items: SearchResult[]) => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel?.toLowerCase().includes(q)
    );
  };

  const filteredClients = filterResults(clients);
  const filteredTransactions = filterResults(transactions);
  const filteredEvents = filterResults(events);

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground w-full max-w-xs"
      >
        <Search className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left truncate">Buscar...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar clientes, movimientos, eventos..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>

          {filteredClients.length > 0 && (
            <CommandGroup heading="Clientes">
              {filteredClients.slice(0, 5).map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSelect(item.path)}
                  className="gap-3"
                >
                  {item.icon}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.sublabel && (
                      <span className="text-xs text-muted-foreground truncate">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredTransactions.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Movimientos">
                {filteredTransactions.slice(0, 5).map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.label} ${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-3"
                  >
                    {item.icon}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.sublabel && (
                        <span className="text-xs text-muted-foreground truncate">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {filteredEvents.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Eventos">
                {filteredEvents.slice(0, 5).map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.label} ${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-3"
                  >
                    {item.icon}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.sublabel && (
                        <span className="text-xs text-muted-foreground truncate">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

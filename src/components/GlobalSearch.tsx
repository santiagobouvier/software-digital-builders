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
  Bot,
  Package,
  Globe,
  MessageCircle,
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
  const [bots, setBots] = useState<SearchResult[]>([]);
  const [botInstances, setBotInstances] = useState<SearchResult[]>([]);
  const [webInstances, setWebInstances] = useState<SearchResult[]>([]);
  const [products, setProducts] = useState<SearchResult[]>([]);
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
    const [clientsRes, botsRes, botInstancesRes, webInstancesRes, productsRes] =
      await Promise.all([
        supabase.from("clients").select("id, company_name, contact_name, status"),
        supabase.from("bots").select("id, name, status"),
        supabase
          .from("bot_instances")
          .select("id, status, notes, client:clients(company_name), product:products(name)"),
        supabase
          .from("web_instances")
          .select("id, domain, status, client:clients(company_name), product:products(name)"),
        supabase.from("products").select("id, name, category, is_active"),
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

    if (botsRes.data) {
      setBots(
        botsRes.data.map((b) => ({
          id: b.id,
          label: b.name,
          sublabel: b.status === "active" ? "Activo" : "Pausado",
          icon: <Bot className="h-4 w-4 text-success" />,
          path: `/bots/${b.id}`,
        }))
      );
    }

    if (botInstancesRes.data) {
      setBotInstances(
        (botInstancesRes.data as any[]).map((bi) => ({
          id: bi.id,
          label: `${bi.product?.name || "Bot"} → ${bi.client?.company_name || "Cliente"}`,
          sublabel: bi.status,
          icon: <MessageCircle className="h-4 w-4 text-warning" />,
          path: `/bots-clientes`,
        }))
      );
    }

    if (webInstancesRes.data) {
      setWebInstances(
        (webInstancesRes.data as any[]).map((wi) => ({
          id: wi.id,
          label: `${wi.product?.name || "Web"} → ${wi.client?.company_name || "Cliente"}`,
          sublabel: wi.domain || wi.status,
          icon: <Globe className="h-4 w-4 text-cyan-500" />,
          path: `/webs-clientes`,
        }))
      );
    }

    if (productsRes.data) {
      setProducts(
        productsRes.data.map((p) => ({
          id: p.id,
          label: p.name,
          sublabel: p.is_active ? "Activo" : "Inactivo",
          icon: <Package className="h-4 w-4 text-muted-foreground" />,
          path: `/catalogo`,
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
  const filteredBots = filterResults(bots);
  const filteredBotInstances = filterResults(botInstances);
  const filteredWebInstances = filterResults(webInstances);
  const filteredProducts = filterResults(products);

  const hasResults =
    filteredClients.length +
      filteredBots.length +
      filteredBotInstances.length +
      filteredWebInstances.length +
      filteredProducts.length >
    0;

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
          placeholder="Buscar clientes, bots, productos..."
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

          {filteredBots.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Bots técnicos">
                {filteredBots.slice(0, 5).map((item) => (
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
            </>
          )}

          {filteredBotInstances.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Instancias de bots">
                {filteredBotInstances.slice(0, 5).map((item) => (
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
            </>
          )}

          {filteredWebInstances.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Instancias de webs">
                {filteredWebInstances.slice(0, 5).map((item) => (
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
            </>
          )}

          {filteredProducts.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Productos">
                {filteredProducts.slice(0, 5).map((item) => (
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
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

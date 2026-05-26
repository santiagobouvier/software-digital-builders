import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import consteelLogo from "@/assets/clients/consteel.png";
import shinrinyokuLogo from "@/assets/clients/shinrinyoku.png";
import theEnglishRoomLogo from "@/assets/clients/the-english-room.svg";
import rdaLogo from "@/assets/clients/rda-logo.png";
import tabeiraLogo from "@/assets/clients/tabeira-de-leon.svg";

type Client = {
  name: string;
  url: string;
} & (
  | { type: "logo"; src: string; invert?: boolean; size?: "md" | "lg" | "xl" | "2xl" | "3xl" }
  | { type: "wordmark" }
);

const clients: Client[] = [
  {
    name: "Consteel Construcciones",
    type: "logo",
    src: consteelLogo,
    invert: true,
    size: "xl",
    url: "https://www.consteelconstrucciones.com/",
  },
  {
    name: "Shinrinyoku Uruguay",
    type: "logo",
    src: shinrinyokuLogo,
    size: "xl",
    url: "https://shinrinyoku.uy",
  },
  {
    name: "Quevedo Arte",
    type: "wordmark",
    url: "https://quevedoarte.com",
  },
  {
    name: "The English Room",
    type: "logo",
    src: theEnglishRoomLogo,
    size: "xl",
    url: "https://theenglishroom.edu.uy/",
  },
  {
    name: "RDA y Asociados",
    type: "logo",
    src: rdaLogo,
    invert: true,
    url: "https://rdayasociados.com/",
  },
  {
    name: "Tabeira de León & Asoc.",
    type: "logo",
    src: tabeiraLogo,
    size: "3xl",
    invert: true,
    url: "https://tabeiradeleon.com/",
  },
];

export const ClientsSection = () => {
  const [active, setActive] = useState<Client | null>(null);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (active) setView(isMobile ? "mobile" : "desktop");
  }, [active, isMobile]);





  return (
    <section id="clientes" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground/90 mb-16"
        >
          Empresas que <span className="gradient-text">confían en nosotros</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 sm:gap-x-24 max-w-5xl mx-auto"
        >
          {clients.map((client) => (
            <button
              key={client.name}
              onClick={() => setActive(client)}
              aria-label={`Ver sitio de ${client.name}`}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-2"
            >
              {client.type === "logo" ? (
                <img
                  src={client.src}
                  alt={`Logo ${client.name}`}
                  loading="lazy"
                  className={`${
                  client.size === "3xl"
                      ? "h-56 sm:h-80"
                      : client.size === "2xl"
                        ? "h-48 sm:h-64"
                        : client.size === "xl"
                          ? "h-24 sm:h-32"
                          : client.size === "lg"
                            ? "h-20 sm:h-24"
                            : "h-16 sm:h-20"
                  } object-contain opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ${
                    client.invert ? "[filter:brightness(0)_invert(1)]" : ""
                  }`}
                />
              ) : (
                <span
                  className="block text-4xl sm:text-5xl text-foreground/50 group-hover:text-foreground group-hover:scale-105 transition-all duration-300"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    fontStyle: "italic",
                  }}
                >
                  Quevedo
                </span>
              )}
            </button>
          ))}
        </motion.div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-[98vw] w-[98vw] h-[92vh] md:max-w-[90vw] md:w-[90vw] md:h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-3 border-b border-border/50 flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-base font-medium">
              {active?.name}
            </DialogTitle>
            {!isMobile && (
              <div className="hidden md:inline-flex items-center rounded-md border border-border/60 bg-background/50 p-1 mr-8">
                <button
                  onClick={() => setView("desktop")}
                  aria-label="Vista desktop"
                  aria-pressed={view === "desktop"}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    view === "desktop"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setView("mobile")}
                  aria-label="Vista mobile"
                  aria-pressed={view === "mobile"}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    view === "mobile"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Mobile
                </button>
              </div>
            )}
          </DialogHeader>
          <div className="flex-1 bg-background overflow-auto flex items-center justify-center p-4">
            {active && (
              view === "mobile" && !isMobile ? (
                <div className="w-[390px] h-[95%] max-h-[844px] rounded-[2rem] border-4 border-border/60 shadow-2xl overflow-hidden bg-background">
                  <iframe
                    key={`${active.url}-mobile`}
                    src={active.url}
                    title={active.name}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              ) : (
                <iframe
                  key={`${active.url}-desktop`}
                  src={active.url}
                  title={active.name}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
};

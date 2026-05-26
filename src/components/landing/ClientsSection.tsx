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

type Client = {
  name: string;
  url: string;
} & (
  | { type: "logo"; src: string; invert?: boolean }
  | { type: "wordmark" }
);

const clients: Client[] = [
  {
    name: "Consteel Construcciones",
    type: "logo",
    src: consteelLogo,
    invert: true,
    url: "https://consteel.com.uy",
  },
  {
    name: "Shinrinyoku Uruguay",
    type: "logo",
    src: shinrinyokuLogo,
    url: "https://shinrinyoku.uy",
  },
  {
    name: "Quevedo Arte",
    type: "wordmark",
    url: "https://quevedoarte.com",
  },
];

export const ClientsSection = () => {
  const [active, setActive] = useState<Client | null>(null);

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
                  className={`h-16 sm:h-20 object-contain opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ${
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
        <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border/50 flex-row items-center space-y-0">
            <DialogTitle className="text-base font-medium">
              {active?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-background overflow-hidden">
            {active && (
              <iframe
                key={active.url}
                src={active.url}
                title={active.name}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

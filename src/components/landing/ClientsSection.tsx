import { motion } from "framer-motion";
import consteelLogo from "@/assets/clients/consteel.png";
import shinrinyokuLogo from "@/assets/clients/shinrinyoku.png";

type Client =
  | { name: string; type: "logo"; src: string; invert?: boolean }
  | { name: string; type: "wordmark" };

const clients: Client[] = [
  { name: "Consteel Construcciones", type: "logo", src: consteelLogo, invert: true },
  { name: "Shinrinyoku Uruguay", type: "logo", src: shinrinyokuLogo },
  { name: "Quevedo Arte", type: "wordmark" },
];

export const ClientsSection = () => {
  return (
    <section id="clientes" className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-10"
        >
          Empresas que confían en nosotros
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 max-w-4xl mx-auto"
        >
          {clients.map((client) =>
            client.type === "logo" ? (
              <img
                key={client.name}
                src={client.src}
                alt={`Logo ${client.name}`}
                loading="lazy"
                className={`h-8 sm:h-10 object-contain opacity-40 hover:opacity-80 transition-opacity duration-300 ${
                  client.invert ? "[filter:brightness(0)_invert(1)]" : ""
                }`}
              />
            ) : (
              <span
                key={client.name}
                className="text-2xl sm:text-3xl text-foreground/40 hover:text-foreground/80 transition-colors duration-300"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  fontStyle: "italic",
                }}
              >
                Quevedo
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

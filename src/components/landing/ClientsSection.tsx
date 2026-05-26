import { motion } from "framer-motion";
import consteelLogo from "@/assets/clients/consteel.png";
import shinrinyokuLogo from "@/assets/clients/shinrinyoku.png";

type Client =
  | { name: string; type: "logo"; src: string; invert?: boolean; sector: string }
  | { name: string; type: "wordmark"; sector: string; tagline: string };

const clients: Client[] = [
  {
    name: "Consteel Construcciones",
    type: "logo",
    src: consteelLogo,
    invert: true,
    sector: "Construcción",
  },
  {
    name: "Shinrinyoku Uruguay",
    type: "logo",
    src: shinrinyokuLogo,
    sector: "Bienestar & Naturaleza",
  },
  {
    name: "Quevedo Arte",
    type: "wordmark",
    sector: "Arte Visual",
    tagline: "Galería digital",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const ClientsSection = () => {
  return (
    <section id="clientes" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Top line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,hsl(var(--primary)/0.04),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-block text-[10px] tracking-[0.25em] uppercase text-primary/80 font-medium mb-4 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            Casos de éxito
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Empresas que ya{" "}
            <span className="gradient-text">confían en nosotros</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Construimos soluciones digitales para negocios reales en distintos sectores.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {clients.map((client) => (
            <motion.div
              key={client.name}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative h-44 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-card/60 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Logo container */}
                <div className="relative h-full flex flex-col items-center justify-center p-6">
                  <div className="flex-1 flex items-center justify-center w-full">
                    {client.type === "logo" ? (
                      <img
                        src={client.src}
                        alt={`Logo ${client.name}`}
                        loading="lazy"
                        className={`max-h-20 max-w-[80%] object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 ${
                          client.invert
                            ? "[filter:brightness(0)_invert(1)] group-hover:[filter:none]"
                            : ""
                        }`}
                      />
                    ) : (
                      <div className="text-center">
                        <div
                          className="text-3xl text-foreground/70 group-hover:text-foreground transition-colors duration-500"
                          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 500, letterSpacing: "0.02em", fontStyle: "italic" }}
                        >
                          Quevedo
                        </div>
                        <div className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground/70 mt-1">
                          {client.tagline}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sector label */}
                  <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 group-hover:text-primary/80 transition-colors duration-500 mt-2">
                    {client.sector}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-xs text-muted-foreground/60 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Y más empresas sumándose cada mes
        </motion.p>
      </div>
    </section>
  );
};

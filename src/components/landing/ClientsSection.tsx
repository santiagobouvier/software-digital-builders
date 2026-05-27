import { motion } from "framer-motion";
import consteelLogo from "@/assets/clients/consteel.png";
import shinrinyokuLogo from "@/assets/clients/shinrinyoku.png";
import theEnglishRoomLogo from "@/assets/clients/the-english-room.svg";
import rdaLogo from "@/assets/clients/rda-logo.png";
import tabeiraLogo from "@/assets/clients/tabeira-de-leon.svg";

type Client = {
  name: string;
  url: string;
} & (
  | { type: "logo"; src: string; invert?: boolean; size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" }
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
    size: "sm",
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
  const logoEl = (client: Client) => {
    if (client.type === "wordmark") {
      return (
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
      );
    }
    return (
      <img
        src={client.src}
        alt={`Logo ${client.name}`}
        loading="lazy"
        className={`${
          client.size === "3xl"
            ? "h-40 sm:h-48"
            : client.size === "2xl"
              ? "h-28 sm:h-36"
              : client.size === "xl"
                ? "h-24 sm:h-32"
                : client.size === "lg"
                  ? "h-20 sm:h-24"
                  : client.size === "sm"
                    ? "h-12 sm:h-16"
                    : "h-16 sm:h-20"
        } object-contain opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ${
          client.invert ? "[filter:brightness(0)_invert(1)]" : ""
        }`}
      />
    );
  };

  return (
    <section id="clientes" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3 }}
          className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground/90 mb-16"
        >
          Empresas que <span className="gradient-text">confían en nosotros</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 sm:gap-x-24 max-w-5xl mx-auto"
        >
          {clients.map((client) => {
            const link = (
              <a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar sitio de ${client.name}`}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-2"
              >
                {logoEl(client)}
              </a>
            );

            if (client.name === "RDA y Asociados") return null;
            if (client.name === "Tabeira de León & Asoc.") {
              const rda = clients.find((c) => c.name === "RDA y Asociados")!;
              return (
                <div
                  key="rda-tabeira-pair"
                  className="flex basis-full sm:basis-auto items-center justify-center gap-x-8 sm:gap-x-24 sm:contents"
                >
                  <a
                    href={rda.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar sitio de ${rda.name}`}
                    className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-2"
                  >
                    {logoEl(rda)}
                  </a>
                  {link}
                </div>
              );
            }
            return link;
          })}
        </motion.div>
      </div>
    </section>
  );
};

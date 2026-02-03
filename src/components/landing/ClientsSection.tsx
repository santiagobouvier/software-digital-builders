import { motion } from "framer-motion";

// Placeholder logos - en producción se reemplazarían por logos reales de clientes
const clients = [
  { name: "Empresa 1", initials: "E1" },
  { name: "Empresa 2", initials: "E2" },
  { name: "Empresa 3", initials: "E3" },
  { name: "Empresa 4", initials: "E4" },
  { name: "Empresa 5", initials: "E5" },
  { name: "Empresa 6", initials: "E6" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 15,
    },
  },
};

export const ClientsSection = () => {
  return (
    <section id="clientes" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold mb-3"
          >
            Empresas que confían en nosotros
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-sm"
          >
            Trabajamos con negocios que buscan soluciones tecnológicas reales.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 max-w-4xl mx-auto"
        >
          {clients.map((client) => (
            <motion.div
              key={client.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
              className="group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-card/50 border border-border/40 flex items-center justify-center transition-all duration-300 group-hover:border-primary/40 group-hover:bg-card/80">
                <span className="text-xl sm:text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {client.initials}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground/60 mt-8"
        >
          Y más empresas sumándose cada mes
        </motion.p>
      </div>
    </section>
  );
};

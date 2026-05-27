import { Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Actualizá contenido de tu web sin ayuda técnica",
  "Visualizá métricas y reportes de actividad",
  "Gestioná accesos y usuarios de tu cuenta",
  "Revisá historial de cambios y actualizaciones",
  "Solicitá soporte directamente desde el panel",
  "Gestioná clientes, productos y suscripciones",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, type: "tween" as const },
  },
};

export const SelfServiceSection = () => {
  return (
    <section id="autogestion" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Lines */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      />
      
      {/* Corner element */}
      <motion.div 
        className="absolute bottom-12 left-8 hidden sm:block"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
      >
        <div className="w-12 h-12 border-l border-b border-border/30 rounded-bl-xl" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Autogestión
              </h2>
              <p className="text-muted-foreground mb-8">
                Independencia total para gestionar tus proyectos. 
                Controlá todo desde tu panel, cuando quieras.
              </p>

              <motion.div 
                className="grid sm:grid-cols-2 gap-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors duration-200 group cursor-default"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div 
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 group-hover:bg-primary/30 transition-colors duration-200"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Check className="h-3 w-3 text-primary" />
                    </motion.div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Visual */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              {/* Glow behind */}
              <motion.div 
                className="absolute -inset-8 opacity-30"
                style={{
                  background: 'radial-gradient(circle at center, hsl(187 100% 50% / 0.2) 0%, transparent 60%)',
                }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div 
                className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Mock interface elements */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <div className="h-2 w-28 bg-muted rounded" />
                    </div>
                    <div className="h-8 w-24 bg-primary/20 rounded-lg border border-primary/30" />
                  </div>

                  {/* List items */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg border border-border/30 hover:border-primary/30 transition-colors duration-200 cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20" />
                        <div className="space-y-1.5">
                          <div className="h-2 w-24 bg-muted rounded" />
                          <div className="h-1.5 w-16 bg-muted/50 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-6 bg-muted/60 rounded" />
                        <div className="h-6 w-6 bg-muted/60 rounded" />
                      </div>
                    </motion.div>
                  ))}

                  {/* Action bar */}
                  <div className="flex gap-2 pt-2">
                    <motion.div 
                      className="h-9 flex-1 bg-primary/30 rounded-lg border border-primary/40"
                      whileHover={{ scale: 1.02 }}
                    />
                    <div className="h-9 w-9 bg-muted/50 rounded-lg border border-border/50" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
